import React, { useState, useEffect, useRef } from 'react';
import { Dish, Currency } from '../types';
import { 
  Mic, 
  MicOff, 
  X, 
  Search, 
  ShoppingBag, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Utensils
} from 'lucide-react';
import { parseVoiceIntent, VoiceActionType } from '../utils/voiceIntentParser';
import { audioFeedback } from '../utils/audioFeedback';

// Type definitions for Web Speech API
interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal?: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
}

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: Dish[];
  currency: Currency;
  onQuickAdd: (dish: Dish) => void;
  onSearchChange: (query: string) => void;
  onNavigate: (screen: 'menu' | 'dashboard' | 'tracking' | 'club' | 'checkout') => void;
  onOpenCart: () => void;
  onShowToast: (message: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  dishes,
  currency,
  onQuickAdd,
  onSearchChange,
  onNavigate,
  onOpenCart,
  onShowToast,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const [manualCommandInput, setManualCommandInput] = useState('');
  
  const [lastAction, setLastAction] = useState<{
    type: 'added' | 'searched' | 'navigated' | 'opened_cart' | 'cleared';
    message: string;
    dish?: Dish;
    query?: string;
  } | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check speech recognition capability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const windowWithSpeech = window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionLike;
        webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      };

      const SpeechRecognitionCtor = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
      if (!SpeechRecognitionCtor) {
        setHasSpeechSupport(false);
      }
    }
  }, []);

  // Initialize and start recognition when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setLiveTranscript('');
      setLastAction(null);
      setMicErrorMessage(null);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
      return;
    }

    // Auto-start listening on open
    startListening();

    return () => {
      stopListening();
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [isOpen]);

  const startListening = () => {
    setMicErrorMessage(null);
    setLiveTranscript('');
    setLastAction(null);

    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };

    const SpeechRecognitionCtor = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setHasSpeechSupport(false);
      setMicErrorMessage('Web Speech API is not supported in this browser. You can still use the voice simulation buttons or type commands below!');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        if (soundEnabled) {
          audioFeedback.playMicStart();
        }
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let currentTranscript = '';
        let isFinal = false;

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res && res[0]) {
            currentTranscript += res[0].transcript;
            if (res.isFinal) {
              isFinal = true;
            }
          }
        }

        setLiveTranscript(currentTranscript);

        if (isFinal && currentTranscript.trim()) {
          executeVoiceCommand(currentTranscript);
        }
      };

      recognition.onerror = (event: { error: string }) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMicErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser or use the quick buttons below.');
        } else if (event.error === 'no-speech') {
          setMicErrorMessage('No speech was detected. Tap the microphone and try saying "Add Truffle Pizza to cart".');
        } else {
          setMicErrorMessage(`Voice input error (${event.error}). Try again or use quick commands.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      setMicErrorMessage('Failed to start microphone. You can use the quick voice buttons below.');
      console.warn('Speech recognition start failed:', err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop error
      }
      setIsListening(false);
    }
  };

  const executeVoiceCommand = (commandText: string) => {
    stopListening();
    const action: VoiceActionType = parseVoiceIntent(commandText, dishes);

    if (action.type === 'ADD_TO_CART') {
      if (soundEnabled) audioFeedback.playCartSuccess();
      onQuickAdd(action.dish);
      setLastAction({
        type: 'added',
        message: `Added "${action.dish.name}" to your bag!`,
        dish: action.dish,
      });
      onShowToast(`🎙️ Voice Concierge: Added "${action.dish.name}" to your bag!`);

      // Auto close after 2.2s so user can see what was added
      closeTimerRef.current = setTimeout(() => {
        onClose();
      }, 2200);

    } else if (action.type === 'SEARCH') {
      if (soundEnabled) audioFeedback.playSearchSuccess();
      onSearchChange(action.query);
      onNavigate('menu');
      setLastAction({
        type: 'searched',
        message: `Searching menu for "${action.query}"`,
        query: action.query,
      });
      onShowToast(`🎙️ Voice Concierge: Filtered menu by "${action.query}"`);

      closeTimerRef.current = setTimeout(() => {
        onClose();
      }, 1600);

    } else if (action.type === 'OPEN_CART') {
      if (soundEnabled) audioFeedback.playSearchSuccess();
      setLastAction({
        type: 'opened_cart',
        message: 'Opening your gastronomic bag...',
      });
      closeTimerRef.current = setTimeout(() => {
        onClose();
        onOpenCart();
      }, 600);

    } else if (action.type === 'CLEAR_SEARCH') {
      if (soundEnabled) audioFeedback.playSearchSuccess();
      onSearchChange('');
      onNavigate('menu');
      setLastAction({
        type: 'cleared',
        message: 'Cleared menu search filters',
      });
      closeTimerRef.current = setTimeout(() => {
        onClose();
      }, 1200);

    } else if (action.type === 'NAVIGATE') {
      if (soundEnabled) audioFeedback.playSearchSuccess();
      setLastAction({
        type: 'navigated',
        message: `Navigating to ${action.screen}...`,
      });
      closeTimerRef.current = setTimeout(() => {
        onClose();
        onNavigate(action.screen);
      }, 700);

    } else {
      // Fallback to search
      if (soundEnabled) audioFeedback.playSearchSuccess();
      onSearchChange(commandText.trim());
      onNavigate('menu');
      setLastAction({
        type: 'searched',
        message: `Searching menu for "${commandText.trim()}"`,
        query: commandText.trim(),
      });
      closeTimerRef.current = setTimeout(() => {
        onClose();
      }, 1600);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCommandInput.trim()) {
      setLiveTranscript(manualCommandInput.trim());
      executeVoiceCommand(manualCommandInput.trim());
      setManualCommandInput('');
    }
  };

  const samplePrompts = [
    { label: 'Add Truffle Pizza to cart', text: 'Add Truffle and Wild Mushroom Pizza to cart', type: 'add' },
    { label: 'Add Hot Honey Wings to bag', text: 'Add Hot Honey Wings to cart', type: 'add' },
    { label: 'Add Pistachio Mortadella Pizza', text: 'Add Pistachio Mortadella Pizza to cart', type: 'add' },
    { label: 'Search Burrata', text: 'Search Burrata', type: 'search' },
    { label: 'Search Artisan Pastas', text: 'Search Artisan Pastas', type: 'search' },
    { label: 'Search Vegetarian dishes', text: 'Search Vegetarian', type: 'search' },
    { label: 'Open my Bag', text: 'Open cart', type: 'cart' },
    { label: 'Go to Chauffeur tracking', text: 'Go to tracking', type: 'nav' },
  ];

  if (!isOpen) return null;

  return (
    <div 
      id="voice-assistant-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="voice-assistant-dialog"
        className="w-full max-w-lg bg-[#181614] border-2 border-[#c5a059]/60 rounded-3xl shadow-2xl overflow-hidden text-[#f4efe6] transition-all flex flex-col max-h-[90vh]"
      >
        {/* Top Header Bar */}
        <div className="bg-[#1f1b17] px-6 py-4 border-b border-[#c5a059]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#781d18] to-[#992620] text-[#dfc285] flex items-center justify-center border border-[#c5a059]/40 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#dfc285]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#dfc285] font-serif font-bold">Alta Voce</span>
                <span className="text-[10px] bg-[#c5a059]/20 text-[#dfc285] px-1.5 py-0.5 rounded border border-[#c5a059]/30 font-mono">
                  Voice-to-Text Concierge
                </span>
              </div>
              <h2 className="text-base font-serif font-bold text-white">Gastronomic Voice Ordering & Search</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute audio cues' : 'Enable audio cues'}
              className="p-2 rounded-xl text-[#baa997] hover:text-[#dfc285] hover:bg-[#2a241e] transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-[#8c7e6f]" />}
            </button>
            <button
              id="voice-assistant-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-[#baa997] hover:text-white hover:bg-[#2a241e] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Main Visualizer & Microphone Core */}
          <div className="flex flex-col items-center justify-center py-4 text-center">
            
            {/* Glowing Concentric Animated Mic Ring */}
            <div className="relative mb-5 flex items-center justify-center">
              {isListening && (
                <>
                  <div className="absolute w-28 h-28 rounded-full bg-[#c5a059]/20 animate-ping duration-1000"></div>
                  <div className="absolute w-36 h-36 rounded-full bg-[#781d18]/25 animate-pulse duration-700"></div>
                </>
              )}

              <button
                id="voice-mic-main-btn"
                onClick={() => {
                  if (isListening) {
                    stopListening();
                  } else {
                    startListening();
                  }
                }}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                  isListening
                    ? 'bg-gradient-to-tr from-[#781d18] to-[#ab2821] text-white ring-4 ring-[#dfc285] scale-105 shadow-[#781d18]/50'
                    : 'bg-[#26211b] hover:bg-[#322b23] text-[#dfc285] border-2 border-[#c5a059]/50 hover:border-[#dfc285]'
                }`}
                title={isListening ? 'Click to stop listening' : 'Click to start speaking'}
              >
                {isListening ? (
                  <Mic className="w-9 h-9 animate-pulse text-[#dfc285]" />
                ) : (
                  <Mic className="w-8 h-8 text-[#dfc285]" />
                )}
              </button>
            </div>

            {/* Audio Waveform Equalizer (Animated Bars) */}
            <div className="flex items-center justify-center gap-1.5 h-6 mb-3">
              {[40, 75, 100, 60, 85, 45, 90, 50, 70].map((height, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isListening
                      ? 'bg-gradient-to-t from-[#c5a059] to-[#dfc285] animate-pulse'
                      : 'bg-[#3b342c] h-1.5'
                  }`}
                  style={{
                    height: isListening ? `${Math.max(6, (height * Math.random()) % 24 + 6)}px` : '4px',
                    animationDelay: `${i * 90}ms`,
                  }}
                />
              ))}
            </div>

            {/* Status Label */}
            <p className="text-sm font-serif font-medium text-[#baa997]">
              {isListening ? (
                <span className="text-[#dfc285] font-semibold flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#dfc285] animate-ping"></span>
                  Listening... Say <em className="text-white not-italic font-bold">"Add Truffle Pizza to cart"</em> or <em className="text-white not-italic font-bold">"Search Burrata"</em>
                </span>
              ) : (
                <span>Tap the microphone to speak, or select a command below</span>
              )}
            </p>

            {/* Live Transcript Display Box */}
            <div className="w-full mt-4 min-h-[56px] px-4 py-3 rounded-2xl bg-[#12100e] border border-[#c5a059]/30 flex items-center justify-center text-center">
              {liveTranscript ? (
                <p className="text-sm font-serif text-white italic">
                  "{liveTranscript}"
                </p>
              ) : (
                <p className="text-xs text-[#8c7e6f] font-mono">
                  {isListening ? 'Awaiting your spoken command...' : 'Microphone ready. Tap above to trigger voice recognition.'}
                </p>
              )}
            </div>

            {/* Error state if permission denied or unsupported */}
            {micErrorMessage && (
              <div className="w-full mt-3 p-3 rounded-xl bg-[#2e1715] border border-[#781d18]/80 text-[#f7b6b0] text-xs flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#e57373]" />
                <div className="flex-1">
                  <span>{micErrorMessage}</span>
                </div>
              </div>
            )}

            {/* Matched Action Confirmation Card */}
            {lastAction && (
              <div className="w-full mt-4 p-4 rounded-2xl bg-[#211b15] border-2 border-[#dfc285] shadow-lg animate-in zoom-in-95 duration-200 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#dfc285]" />
                  <span className="text-xs uppercase tracking-wider text-[#dfc285] font-bold font-serif">
                    Command Executed
                  </span>
                </div>
                
                {lastAction.type === 'added' && lastAction.dish && (
                  <div className="flex items-center gap-3">
                    <img 
                      src={lastAction.dish.image} 
                      alt={lastAction.dish.name} 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-[#c5a059]/40"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate font-serif">
                        {lastAction.dish.name}
                      </div>
                      <div className="text-xs text-[#dfc285] font-serif">
                        {currency === 'INR' ? `₹${lastAction.dish.priceInr}` : `$${lastAction.dish.priceUsd.toFixed(2)}`} • Added to bag!
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCart();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#781d18] hover:bg-[#601410] text-white text-xs font-bold font-serif transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#dfc285]" />
                      <span>View Bag</span>
                    </button>
                  </div>
                )}

                {lastAction.type === 'searched' && (
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[#dfc285] font-serif">
                      Showing results for <strong className="text-white">"{lastAction.query}"</strong> in menu
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate('menu');
                      }}
                      className="px-2.5 py-1 text-xs bg-[#c5a059]/20 hover:bg-[#c5a059]/30 text-[#dfc285] rounded-lg border border-[#c5a059]/40 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Show Menu</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {lastAction.type !== 'added' && lastAction.type !== 'searched' && (
                  <div className="text-xs text-[#dfc285] font-serif">
                    {lastAction.message}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Voice Command Chips (Instant Click-to-Try or Speak) */}
          <div className="space-y-2.5 pt-2 border-t border-[#c5a059]/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[#dfc285] tracking-wide flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" />
                <span>Or Tap to Execute Voice Command</span>
              </span>
              <span className="text-[10px] text-[#8c7e6f] font-mono">One-touch test</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setLiveTranscript(p.text);
                    executeVoiceCommand(p.text);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-[#211d19] hover:bg-[#2d2721] border border-[#ded5c4]/15 hover:border-[#c5a059]/50 text-left transition-all group cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-[#dfc285]">
                      {p.type === 'add' ? '🛍️' : p.type === 'search' ? '🔍' : '🧭'}
                    </span>
                    <span className="text-xs font-serif text-[#f4efe6] group-hover:text-[#dfc285] truncate">
                      "{p.label}"
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-[#8c7e6f] group-hover:text-[#dfc285] shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Manual input fallback for testing or silent environments */}
          <div className="pt-2 border-t border-[#c5a059]/20">
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={manualCommandInput}
                  onChange={(e) => setManualCommandInput(e.target.value)}
                  placeholder="Type a voice command (e.g. 'Add burrata to cart' or 'Search wings')..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#12100e] border border-[#c5a059]/30 focus:border-[#dfc285] focus:outline-none text-xs text-[#f5ebd7] placeholder-[#8c7e6f] font-serif"
                />
              </div>
              <button
                type="submit"
                disabled={!manualCommandInput.trim()}
                className="px-4 py-2 rounded-xl bg-[#781d18] hover:bg-[#601410] disabled:opacity-40 disabled:hover:bg-[#781d18] text-white text-xs font-bold font-serif transition-colors cursor-pointer shrink-0"
              >
                Execute
              </button>
            </form>
          </div>

        </div>

        {/* Modal Footer Note */}
        <div className="bg-[#151311] px-6 py-3 border-t border-[#c5a059]/20 flex items-center justify-between text-[11px] text-[#8c7e6f] font-serif">
          <span>Supported: "Add [dish] to cart", "Search [item]", "Open bag", "Clear search"</span>
          <button 
            onClick={onClose}
            className="text-[#baa997] hover:text-white underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
