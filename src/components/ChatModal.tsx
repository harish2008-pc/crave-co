import React, { useState } from 'react';
import { CourierDriver } from '../types';
import { 
  X, 
  Send, 
  Phone, 
  MapPin, 
  Sparkles, 
  Clock, 
  Check, 
  CheckCheck,
  User,
  ShieldCheck,
  Flame
} from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  courier: CourierDriver;
  initialTab?: 'courier' | 'concierge';
}

interface Message {
  id: string;
  sender: 'courier' | 'user' | 'concierge' | 'system';
  text: string;
  time: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  courier,
  initialTab = 'courier',
}) => {
  const [activeTab, setActiveTab] = useState<'courier' | 'concierge'>(initialTab);
  const [inputText, setInputText] = useState('');
  const [courierMessages, setCourierMessages] = useState<Message[]>([
    {
      id: 'm-sys-1',
      sender: 'system',
      text: 'Order #CC-84920 secured in active thermal pod #12. Dev is en route.',
      time: '9:02 PM',
    },
    {
      id: 'm-dev-1',
      sender: 'courier',
      text: "Namaste Elena! I just picked up your wood-fired pizzas from the Indiranagar kitchen. ETA is around 9:15 PM.",
      time: '9:04 PM',
    },
    {
      id: 'm-user-1',
      sender: 'user',
      text: "Great, thanks Dev! Please ring buzzer 4B when you arrive at the gate.",
      time: '9:06 PM',
    },
    {
      id: 'm-dev-2',
      sender: 'courier',
      text: "Understood! I'll buzz 4B. Have the 4-digit PIN ready for the thermal unsealing. See you shortly!",
      time: '9:08 PM',
    },
  ]);

  const [conciergeMessages, setConciergeMessages] = useState<Message[]>([
    {
      id: 'c-sys-1',
      sender: 'system',
      text: 'Connected with Caffè Bellissimo Concierge & Sommelier team.',
      time: '8:43 PM',
    },
    {
      id: 'c-marco-1',
      sender: 'concierge',
      text: "Buonasera Elena! Executive Chef Marco here. We just put your 72-hour sourdough in our 815°F oak hearth. If you need any wine pairing notes or reheating guidance later, I'm at your service.",
      time: '8:45 PM',
    },
  ]);

  const quickPrompts = [
    '🚪 Leave at door',
    '🔔 Ring buzzer 4B',
    '📞 Call upon arrival',
    '🍴 Extra napkins & cutlery',
  ];

  if (!isOpen) return null;

  const currentMessages = activeTab === 'courier' ? courierMessages : conciergeMessages;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: Message = {
      id: `m-user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (activeTab === 'courier') {
      setCourierMessages((prev) => [...prev, newMsg]);
      // simulate auto-reply after 1.5s
      setTimeout(() => {
        setCourierMessages((prev) => [
          ...prev,
          {
            id: `m-dev-auto-${Date.now()}`,
            sender: 'courier',
            text: "Got it! Noted on the delivery log. I'm approaching 100ft road now.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 1400);
    } else {
      setConciergeMessages((prev) => [...prev, newMsg]);
      setTimeout(() => {
        setConciergeMessages((prev) => [
          ...prev,
          {
            id: `c-marco-auto-${Date.now()}`,
            sender: 'concierge',
            text: "Splendid choice! The truffle aromatics are resting perfectly in the thermal pod.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 1400);
    }

    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 font-serif">
      <div 
        id="chat-dialog"
        className="w-full max-w-lg bg-[#faf7f2] dark:bg-[#141210] rounded-3xl shadow-2xl border-2 border-[#c5a059]/40 flex flex-col h-[620px] max-h-[92vh] overflow-hidden transition-colors"
      >
        {/* Chat Header */}
        <div className="bg-white dark:bg-[#191714] border-b border-[#ded5c4] dark:border-[#2d2720] p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {activeTab === 'courier' ? (
                <img
                  src={courier.avatar}
                  alt={courier.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#c5a059]"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#171513] to-[#2b2724] text-[#dfc285] flex items-center justify-center font-display text-base font-bold border-2 border-[#c5a059]">
                  MR
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white dark:border-[#191714]"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#171513] dark:text-[#f5ebd7] font-display">
                  {activeTab === 'courier' ? courier.name : 'Maestro Marco Rossi'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f5ebd7] dark:bg-[#2e2017] text-[#781d18] dark:text-[#dfc285] font-bold border border-[#c5a059]/40 font-serif">
                  {activeTab === 'courier' ? 'Chauffeur Privé' : 'Executive Pizzaiolo'}
                </span>
              </div>
              <p className="text-[11px] text-[#5a524a] dark:text-[#a89b8c]">
                {activeTab === 'courier' ? 'En route • 1.8 km distance' : 'Hearth Concierge Active'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="close-chat-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full text-[#8c7e6f] dark:text-[#baa997] hover:bg-[#f5f0e6] dark:hover:bg-[#28221b] hover:text-[#171513] dark:hover:text-[#f5ebd7] flex items-center justify-center transition-colors cursor-pointer border border-[#ded5c4] dark:border-[#2d2720]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="bg-[#f5f0e6] dark:bg-[#1a1714] border-b border-[#ded5c4] dark:border-[#2d2720] px-4 py-2 flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('courier')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-display ${
              activeTab === 'courier'
                ? 'bg-white dark:bg-[#28221b] text-[#781d18] dark:text-[#dfc285] shadow-xs border border-[#c5a059]/50'
                : 'text-[#5a524a] dark:text-[#a89b8c] hover:text-[#171513] dark:hover:text-[#f5ebd7]'
            }`}
          >
            🛵 Chauffeur Privé (Dev)
          </button>
          <button
            onClick={() => setActiveTab('concierge')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-display ${
              activeTab === 'concierge'
                ? 'bg-white dark:bg-[#28221b] text-[#781d18] dark:text-[#dfc285] shadow-xs border border-[#c5a059]/50'
                : 'text-[#5a524a] dark:text-[#a89b8c] hover:text-[#171513] dark:hover:text-[#f5ebd7]'
            }`}
          >
            👨‍🍳 Sommelier & Kitchen
          </button>
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#faf7f2] dark:bg-[#141210]">
          {currentMessages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-[#f5f0e6] dark:bg-[#231f1a] text-[#5a524a] dark:text-[#a89b8c] text-[10px] font-medium border border-[#ded5c4] dark:border-[#2d2720]">
                    {msg.text} &bull; {msg.time}
                  </span>
                </div>
              );
            }

            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs shadow-xs leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-[#781d18] to-[#5c1511] text-white rounded-br-xs border border-[#c5a059]/30'
                      : 'bg-white dark:bg-[#1f1b17] border border-[#ded5c4] dark:border-[#2d2720] text-[#171513] dark:text-[#f5ebd7] rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-[#8c7e6f] dark:text-[#8d7f72] mt-1 px-1 flex items-center gap-1 font-mono">
                  {msg.time} {isUser && <CheckCheck className="w-3 h-3 text-[#c5a059]" />}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick prompt suggestions */}
        <div className="bg-[#f5f0e6] dark:bg-[#1a1714] px-3.5 py-2 border-t border-[#ded5c4] dark:border-[#2d2720] flex items-center gap-2 overflow-x-auto shrink-0">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium px-3 py-1 rounded-full bg-white dark:bg-[#231f1a] hover:bg-[#f5ebd7] dark:hover:bg-[#2e261f] border border-[#ded5c4] dark:border-[#2d2720] text-[#5a524a] dark:text-[#baa997] hover:text-[#171513] dark:hover:text-[#f5ebd7] whitespace-nowrap transition-colors cursor-pointer font-serif"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3.5 bg-white dark:bg-[#191714] border-t border-[#ded5c4] dark:border-[#2d2720] flex items-center gap-2.5 shrink-0">
          <input
            id="chat-message-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={activeTab === 'courier' ? 'Communicate with Chauffeur Dev...' : 'Inquire with Maestro Marco...'}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#f5f0e6] dark:bg-[#231f1a] border border-[#ded5c4] dark:border-[#2d2720] text-xs text-[#171513] dark:text-[#f5ebd7] placeholder-[#8c7e6f] dark:placeholder-[#8d7f72] focus:outline-none focus:border-[#c5a059] focus:bg-white dark:focus:bg-[#1a1714]"
          />
          <button
            id="send-chat-btn"
            onClick={() => handleSend()}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#781d18] to-[#5c1511] hover:from-[#601410] hover:to-[#450e0a] text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer border border-[#c5a059]/40"
          >
            <Send className="w-4 h-4 text-[#dfc285]" />
          </button>
        </div>
      </div>
    </div>
  );
};
