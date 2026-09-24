import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, Currency } from '../types';
import { 
  Navigation, 
  Bike,
  Phone, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  Flame, 
  Thermometer, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Plus, 
  Minus, 
  Crosshair, 
  FileText, 
  ChevronRight,
  Info,
  Check,
  KeyRound,
  X,
  Copy,
  Activity,
  Zap
} from 'lucide-react';

interface LiveTrackingScreenProps {
  order: Order;
  currency: Currency;
  onOpenChat: (initialTab?: 'courier' | 'concierge') => void;
  onNavigateMenu: () => void;
}

export const LiveTrackingScreen: React.FC<LiveTrackingScreenProps> = ({
  order,
  currency,
  onOpenChat,
  onNavigateMenu,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBannerPin, setCopiedBannerPin] = useState(false);
  const [showPlacedAlert, setShowPlacedAlert] = useState(true);
  const [chamberTemp, setChamberTemp] = useState(order.chamberTempCelsius);
  const [mapZoom, setMapZoom] = useState(1);
  const [showCallModal, setShowCallModal] = useState(false);
  
  // Real-time In-Transit Telemetry State
  const [transitProgress, setTransitProgress] = useState(68); // percentage along route (0 - 100)
  const [distanceKm, setDistanceKm] = useState(1.8);
  const [minutesAway, setMinutesAway] = useState(6);
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);

  // Subtle live fluctuation for the thermal sensor & courier progress simulation
  useEffect(() => {
    const tempTimer = setInterval(() => {
      // micro fluctuation between 62.8 and 64.1
      setChamberTemp((prev) => +(63.0 + Math.sin(Date.now() / 3000) * 0.7).toFixed(1));
    }, 2500);
    return () => clearInterval(tempTimer);
  }, []);

  // Smooth live progression of in-transit status
  useEffect(() => {
    if (!isLiveSimulating) return;

    const progressTimer = setInterval(() => {
      setTransitProgress((prev) => {
        // When approaching destination, loop smoothly between 65% and 93% for active demo feel
        const next = prev >= 93 ? 65 : prev + 1;
        const remainingFraction = Math.max(0.08, 1 - (next / 100));
        setDistanceKm(+(2.5 * remainingFraction).toFixed(1));
        setMinutesAway(Math.max(2, Math.round(8 * remainingFraction)));
        return next;
      });
    }, 3800);

    return () => clearInterval(progressTimer);
  }, [isLiveSimulating]);

  // Compute exact position along the route Bezier curve for SVG map
  // P0 = (120, 95), P1 = (280, 180), P2 = (420, 280)
  const t = Math.min(1, Math.max(0, transitProgress / 100));
  const courierX = Math.round((1 - t) * (1 - t) * 120 + 2 * (1 - t) * t * 280 + t * t * 420);
  const courierY = Math.round((1 - t) * (1 - t) * 95 + 2 * (1 - t) * t * 180 + t * t * 280);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const steps = [
    { title: 'Order Placed', time: '8:42 PM', detail: 'Received & sent to wood-hearth', done: true },
    { title: 'Hearth-Fired at 800°F', time: '8:54 PM', detail: '72h fermented dough blistered', done: true },
    { title: 'Thermal Sealed', time: '9:02 PM', detail: 'Secured in 60°C insulated pod #12', done: true },
    { 
      title: 'Courier En Route', 
      time: `${minutesAway}m away`, 
      detail: `Dev is ${distanceKm} km away • ${transitProgress}% completed`, 
      done: false, 
      active: true 
    },
    { title: 'Safe Hand-off', time: 'Est. 9:15 PM', detail: 'Provide 4-digit PIN to unseal', done: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300 font-serif">
      {/* High-Impact Order Placed Announcement Banner */}
      {showPlacedAlert && (
        <div 
          id="order-placed-noticeable-banner"
          className="relative overflow-hidden bg-gradient-to-r from-[#171513] via-[#241f1c] to-[#171513] text-white rounded-3xl p-5 sm:p-6 border-2 border-[#c5a059]/60 shadow-2xl animate-in slide-in-from-top-4 duration-300"
        >
          {/* Subtle background glow element */}
          <div className="absolute -top-12 -right-12 w-52 h-52 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              {/* Pulsing Hearth Flame Icon */}
              <div className="relative shrink-0">
                <div className="absolute -inset-1.5 bg-[#c5a059]/30 rounded-2xl animate-pulse" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#781d18] to-[#9a2822] text-[#dfc285] flex items-center justify-center shadow-lg shadow-[#781d18]/50 border border-[#c5a059]/50">
                  <Flame className="w-6 h-6 fill-[#dfc285] text-[#dfc285]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black uppercase tracking-wider font-display">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Order Confirmed • Alta Cucina
                  </span>
                  <span className="text-xs font-mono font-bold text-[#dfc285]">
                    Ref #{order.orderNumber}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-white tracking-tight">
                  Dispatched from 815°F Oak Hearth • Sealed in Thermal Pod #{order.orderNumber.slice(-2)}
                </h2>
                <p className="text-xs text-[#dddad4] max-w-xl leading-relaxed">
                  Your artisanal order was secured in the kitchen queue. Core temperature locked at{' '}
                  <span className="text-[#dfc285] font-bold">{order.chamberTempCelsius.toFixed(1)}°C</span>. Present your 4-digit PIN upon Chauffeur arrival.
                </p>
              </div>
            </div>

            {/* Hand-off PIN & Dismiss button */}
            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
              <div className="bg-[#ffffff]/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#c5a059]/40 flex items-center gap-3 shadow-sm">
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#dfc285] block flex items-center gap-1 font-display tracking-wider">
                    <KeyRound className="w-3 h-3 text-[#c5a059]" /> Unseal PIN
                  </span>
                  <span className="text-lg font-black font-mono tracking-widest text-[#dfc285]">
                    {order.handOffPin || '4829'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText?.(order.handOffPin || '4829');
                    setCopiedBannerPin(true);
                    setTimeout(() => setCopiedBannerPin(false), 2000);
                  }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
                  title="Copy PIN"
                >
                  {copiedBannerPin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#dfc285]" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowPlacedAlert(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#dddad4] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner with status and quick actions */}
      <div className="bg-white dark:bg-[#191714] rounded-3xl border-2 border-[#c5a059]/30 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-0.5 rounded-full bg-[#f5ebd7] dark:bg-[#282218] text-[#781d18] dark:text-[#dfc285] text-xs font-bold font-mono border border-[#c5a059]/40">
              COMMANDE #{order.orderNumber}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#781d18] dark:text-[#dfc285] bg-[#f5ebd7] dark:bg-[#282218] px-3 py-0.5 rounded-full border border-[#c5a059]/40 font-display">
              <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-ping"></span>
              On Schedule • Chauffeur Privé • {transitProgress}% In-Transit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#171513] dark:text-[#f5ebd7] mt-2 tracking-tight">
            Arriving in {minutesAway}-{minutesAway + 3} mins <span className="text-[#8c7e6f] dark:text-[#a89b8d] font-normal text-lg sm:text-xl font-serif">(Est. 9:15 PM)</span>
          </h1>
          <p className="text-xs text-[#5a524a] dark:text-[#baa997] mt-1 font-serif">
            Dispatched in active 60°C sealed thermal pod from Caffè Bellissimo Indiranagar Hearth &bull; Chauffeur beacon active
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Quick Simulation Nudge for In-Transit Animation */}
          <button
            id="nudge-transit-progress-btn"
            onClick={() => setTransitProgress((prev) => (prev >= 92 ? 65 : prev + 4))}
            className="px-3.5 py-2.5 rounded-xl border border-[#c5a059]/50 bg-[#f5ebd7]/60 dark:bg-[#282218] hover:bg-[#f5ebd7] dark:hover:bg-[#342b1e] text-xs font-bold text-[#781d18] dark:text-[#dfc285] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs font-display"
            title="Click to simulate in-transit telemetry update"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="w-3.5 h-3.5 text-[#c5a059]" />
            </motion.div>
            <span>Telemetry Advance (+4%)</span>
          </button>

          <button
            id="share-tracking-btn"
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl border border-[#ded5c4] dark:border-[#322c24] bg-[#faf7f2] dark:bg-[#1f1b17] hover:bg-[#f5f0e6] dark:hover:bg-[#28221c] text-xs font-bold text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-[#c5a059]" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Tracking'}</span>
          </button>

          <button
            id="open-concierge-chat-btn"
            onClick={() => onOpenChat('concierge')}
            className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#781d18] to-[#5c1511] hover:from-[#601410] hover:to-[#450e0a] text-white text-xs font-bold flex items-center gap-2 shadow-md border border-[#c5a059]/40 transition-all cursor-pointer font-serif"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#dfc285]" />
            <span>Concierge Privé</span>
          </button>
        </div>
      </div>

      {/* 5-Stage Dispatch Timeline Bar */}
      <div className="bg-[#faf7f2] dark:bg-[#141210] rounded-3xl border border-[#ded5c4] dark:border-[#2d2720] p-5 sm:p-6 overflow-x-auto shadow-xs transition-colors">
        <div className="min-w-[650px] flex items-start justify-between relative">
          {/* Connector line background */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#ded5c4] dark:bg-[#2d2720] -z-0" />
          {/* Dynamic Active Progress Connector Line */}
          <div 
            className="absolute top-4 left-6 h-1 bg-gradient-to-r from-[#781d18] via-[#c5a059] to-[#781d18] -z-0 transition-all duration-700 ease-out rounded-full" 
            style={{ width: `${Math.min(94, Math.max(12, transitProgress))}%` }}
          />

          {steps.map((step, idx) => (
            <div key={step.title} className="relative z-10 flex flex-col items-center text-center max-w-[120px]">
              {step.done ? (
                <div className="w-8 h-8 rounded-full bg-[#781d18] text-[#dfc285] flex items-center justify-center font-bold text-xs shadow-md border border-[#c5a059]/50">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              ) : step.active ? (
                /* Framer Motion Animated Delivery Status Icon for In-Transit Step */
                <div className="relative flex items-center justify-center">
                  {/* Outer Concentric Radar Expansion Rings */}
                  <motion.div
                    className="absolute -inset-3 rounded-full bg-[#c5a059]"
                    initial={{ scale: 0.8, opacity: 0.7 }}
                    animate={{ scale: [0.8, 1.8, 2.4], opacity: [0.7, 0.25, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="absolute -inset-1.5 rounded-full bg-[#dfc285]"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.85, 0.35, 0.85] }}
                    transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Main Bubble with Framer Motion hover and bounce */}
                  <motion.div
                    id="in-transit-status-icon"
                    className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-tr from-[#171513] via-[#3a1c1a] to-[#781d18] text-[#dfc285] shadow-xl shadow-[#781d18]/40 flex items-center justify-center border-2 border-[#c5a059] cursor-pointer"
                    animate={{
                      y: [0, -3, 0],
                      boxShadow: [
                        '0 4px 14px rgba(120, 29, 24, 0.45)',
                        '0 6px 22px rgba(197, 160, 89, 0.65)',
                        '0 4px 14px rgba(120, 29, 24, 0.45)'
                      ]
                    }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setTransitProgress((prev) => (prev >= 92 ? 65 : prev + 3));
                    }}
                    title="Click to advance live transit progress"
                  >
                    {/* Vehicle In-Transit Glide & Suspension Animation */}
                    <motion.div
                      animate={{
                        x: [0, 3, 0, -1.5, 0],
                        rotate: [0, 6, 0, -4, 0],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="flex items-center justify-center"
                    >
                      <Bike className="w-5 h-5 text-[#dfc285] fill-[#dfc285]/30 stroke-[2.2]" />
                    </motion.div>
                  </motion.div>

                  {/* In-Transit Progress Live Indicator Tooltip */}
                  <motion.div
                    key={transitProgress}
                    initial={{ opacity: 0.6, scale: 0.88, y: -2 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="absolute -top-8 px-2.5 py-0.5 rounded-full bg-[#171513] text-[#dfc285] text-[9px] font-mono font-bold tracking-tight shadow-lg whitespace-nowrap flex items-center gap-1.5 border border-[#c5a059]/60"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{transitProgress}% In-Transit</span>
                  </motion.div>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1a1815] border-2 border-[#ded5c4] dark:border-[#322c24] text-[#8c7e6f] dark:text-[#a89b8d] flex items-center justify-center font-bold text-xs">
                  <span>{idx + 1}</span>
                </div>
              )}
              <div className="font-bold text-xs text-[#171513] dark:text-[#f5ebd7] mt-2.5 leading-tight font-display">{step.title}</div>
              <div className="text-[10px] font-mono text-[#781d18] dark:text-[#dfc285] font-semibold mt-0.5">{step.time}</div>
              <div className="text-[10px] text-[#5a524a] dark:text-[#baa997] mt-0.5 hidden sm:block font-serif">{step.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Left GPS Map & Courier Card, Right Order Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map + Driver Card + PIN (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Map Container */}
          <div className="bg-white dark:bg-[#191714] rounded-2xl border border-[#ded5c4] dark:border-[#2d2720] overflow-hidden shadow-sm relative transition-colors">
            <div className="p-3 border-b border-[#ded5c4] dark:border-[#2d2720] bg-[#f7f3ed] dark:bg-[#1f1b17] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">Live GPS Fleet Beacon</span>
                <span className="text-[10px] px-2 py-0.5 bg-white dark:bg-[#141210] border border-[#ded5c4] dark:border-[#322c24] rounded-full text-[#5a524a] dark:text-[#baa997]">
                  Updated 3s ago
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMapZoom(Math.min(1.4, mapZoom + 0.15))}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-[#1a1815] border border-[#ded5c4] dark:border-[#322c24] text-xs font-bold text-[#171513] dark:text-[#f5ebd7] hover:bg-[#ebe8e2] dark:hover:bg-[#25201a] flex items-center justify-center cursor-pointer"
                  title="Zoom in"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMapZoom(Math.max(0.85, mapZoom - 0.15))}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-[#1a1815] border border-[#ded5c4] dark:border-[#322c24] text-xs font-bold text-[#171513] dark:text-[#f5ebd7] hover:bg-[#ebe8e2] dark:hover:bg-[#25201a] flex items-center justify-center cursor-pointer"
                  title="Zoom out"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMapZoom(1)}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-[#1a1815] border border-[#ded5c4] dark:border-[#322c24] text-xs font-bold text-[#781d18] dark:text-[#dfc285] hover:bg-[#ebe8e2] dark:hover:bg-[#25201a] flex items-center justify-center cursor-pointer"
                  title="Recenter"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Stylized Vector SVG Map */}
            <div className="relative h-80 sm:h-96 w-full bg-[#f1ede7] dark:bg-[#110f0d] overflow-hidden select-none">
              <svg
                viewBox="0 0 600 400"
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ transform: `scale(${mapZoom})` }}
              >
                {/* Background City Blocks */}
                <rect x="0" y="0" width="600" height="400" className="fill-[#ebe8e2] dark:fill-[#161412]" />
                
                {/* Parks & Greenery */}
                <path d="M 40,30 L 140,20 L 160,110 L 60,120 Z" className="fill-[#d9e3d0] dark:fill-[#1b2518]" rx="8" />
                <path d="M 420,240 L 560,220 L 580,350 L 440,360 Z" className="fill-[#d9e3d0] dark:fill-[#1b2518]" rx="10" />
                <path d="M 220,180 L 320,170 L 340,230 L 230,240 Z" className="fill-[#d9e3d0] dark:fill-[#1b2518]" rx="6" />

                {/* Main Arterial Roads */}
                <path d="M 0,90 Q 250,85 600,110" className="stroke-[#ffffff] dark:stroke-[#26221d]" strokeWidth="18" fill="none" strokeLinecap="round" />
                <path d="M 0,260 Q 300,280 600,240" className="stroke-[#ffffff] dark:stroke-[#26221d]" strokeWidth="20" fill="none" strokeLinecap="round" />
                <path d="M 170,0 L 200,400" className="stroke-[#ffffff] dark:stroke-[#26221d]" strokeWidth="16" fill="none" />
                <path d="M 410,0 L 390,400" className="stroke-[#ffffff] dark:stroke-[#26221d]" strokeWidth="18" fill="none" />
                <path d="M 80,0 L 480,400" className="stroke-[#ffffff] dark:stroke-[#26221d]" strokeWidth="14" fill="none" />

                {/* Secondary streets */}
                <path d="M 50,180 L 550,170" className="stroke-[#dfdbd4] dark:stroke-[#1d1a16]" strokeWidth="8" fill="none" />
                <path d="M 280,0 L 300,400" className="stroke-[#dfdbd4] dark:stroke-[#1d1a16]" strokeWidth="8" fill="none" />
                <path d="M 500,60 L 520,380" className="stroke-[#dfdbd4] dark:stroke-[#1d1a16]" strokeWidth="6" fill="none" />

                {/* Active Courier Route Path (Indiranagar Kitchen -> Residence) */}
                <path
                  id="delivery-route-path"
                  d="M 120,95 Q 200,120 280,180 T 420,280"
                  stroke="#c5a059"
                  strokeWidth="5"
                  strokeDasharray="6,4"
                  fill="none"
                />

                {/* Origin Marker: Caffè Bellissimo Hearth Kitchen */}
                <g transform="translate(120, 95)">
                  <circle r="14" fill="#171513" stroke="#c5a059" strokeWidth="2" />
                  <circle r="6" fill="#dfc285" />
                </g>

                {/* Destination Marker: Residence */}
                <g transform="translate(420, 280)">
                  <circle r="16" fill="#c5a059" opacity="0.4" className="animate-ping" />
                  <circle r="14" fill="#781d18" stroke="#c5a059" strokeWidth="2" />
                  <circle r="5" fill="#ffffff" />
                </g>

                {/* Courier Scooter Position dynamically following route path via Framer Motion & state */}
                <g 
                  transform={`translate(${courierX}, ${courierY})`}
                  className="transition-all duration-700 ease-out"
                >
                  <circle r="24" fill="#c5a059" opacity="0.3" className="animate-ping" />
                  <circle r="17" fill="#ffffff" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.35))" stroke="#c5a059" strokeWidth="1.5" />
                  <circle r="13" fill="#781d18" />
                  {/* Scooter icon */}
                  <path
                    d="M -6,1 L -3,3 L 3,3 L 5,-2 L 7,-2"
                    stroke="#dfc285"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx="-3" cy="4" r="2.2" fill="#dfc285" />
                  <circle cx="4" cy="4" r="2.2" fill="#dfc285" />
                </g>
              </svg>

              {/* Floating Route Badge with Framer Motion Delivery Status Icon */}
              <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#1a1815]/95 backdrop-blur-md rounded-2xl p-3 border-2 border-[#c5a059]/40 shadow-xl flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="absolute -inset-1 rounded-xl bg-[#c5a059]/30"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.2, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#781d18] to-[#9a2822] text-[#dfc285] flex items-center justify-center font-bold text-xs relative z-10 shadow-md border border-[#c5a059]/50"
                    animate={{ x: [0, 2, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <motion.div
                      animate={{
                        rotate: [-5, 5, -5],
                        y: [0, -1, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Bike className="w-5 h-5 text-[#dfc285] stroke-[2.2]" />
                    </motion.div>
                  </motion.div>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1.5 font-display">
                    <span>Dev is {minutesAway} mins away</span>
                    <span className="text-[10px] text-[#781d18] dark:text-[#dfc285] bg-[#f5ebd7] dark:bg-[#282218] border border-[#c5a059]/40 font-bold px-2 py-0.2 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-ping" />
                      Live
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5a524a] dark:text-[#baa997] font-serif">
                    {distanceKm} km distance &bull; Ather 450X &bull; <span className="text-[#781d18] dark:text-[#dfc285] font-mono font-bold">{transitProgress}% en route</span>
                  </div>
                </div>
              </div>

              {/* Origin / Destination labels */}
              <div className="absolute top-4 right-4 bg-white/95 dark:bg-[#1a1815]/95 backdrop-blur-md px-3 py-1 rounded-xl border border-[#c5a059]/30 text-[10px] text-[#5a524a] dark:text-[#baa997] font-display hidden sm:block shadow-xs">
                Caffè Bellissimo Indiranagar Hearth
              </div>
            </div>

            {/* Courier Driver Details Card */}
            <div className="p-4 sm:p-5 bg-white dark:bg-[#191714] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#ded5c4] dark:border-[#2d2720] transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={order.courier.avatar}
                    alt={order.courier.name}
                    referrerPolicy="no-referrer"
                    className="w-13 h-13 rounded-full object-cover border-2 border-[#c5a059]"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 border-2 border-white dark:border-[#191714]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[#171513] dark:text-[#f5ebd7] font-display">{order.courier.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#f5ebd7] dark:bg-[#282218] text-[#781d18] dark:text-[#dfc285] text-[10px] font-bold border border-[#c5a059]/40">
                      Chauffeur Privé
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5a524a] dark:text-[#baa997] mt-0.5 font-serif">
                    <span className="font-bold text-[#171513] dark:text-[#f5ebd7]">★ {order.courier.rating}</span>
                    <span>•</span>
                    <span>{order.courier.deliveriesCount}+ deliveries</span>
                    <span>•</span>
                    <span className="font-mono">{order.courier.plate}</span>
                  </div>
                  <div className="text-[11px] text-[#8c7e6f] dark:text-[#a89b8d] mt-0.5 font-serif">
                    {order.courier.vehicle}
                  </div>
                </div>
              </div>

              {/* Quick contact buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="call-driver-btn"
                  onClick={() => setShowCallModal(true)}
                  className="px-3.5 py-2.5 rounded-xl border border-[#ded5c4] dark:border-[#322c24] bg-[#faf7f2] dark:bg-[#1f1b17] hover:bg-[#f5f0e6] dark:hover:bg-[#28221c] text-xs font-bold text-[#171513] dark:text-[#f5ebd7] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Call Dev</span>
                </button>

                <button
                  id="message-driver-btn"
                  onClick={() => onOpenChat('courier')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#781d18] to-[#5c1511] hover:from-[#601410] hover:to-[#450e0a] text-white text-xs font-bold flex items-center gap-2 shadow-sm border border-[#c5a059]/40 transition-all cursor-pointer font-serif"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#dfc285]" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          </div>

          {/* Safe Hand-off PIN & Delivery Address in 2 subcards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Safe Hand-off PIN Card */}
            <div className="bg-[#f5ebd7]/50 dark:bg-[#1a1714] rounded-3xl border border-[#c5a059]/50 p-5 space-y-2.5 shadow-xs transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#781d18] dark:text-[#dfc285] font-display">
                  <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                  <span>Safe Hand-off PIN</span>
                </div>
                <span className="text-[10px] text-[#781d18] dark:text-[#dfc285] font-bold bg-[#f5ebd7] dark:bg-[#282218] border border-[#c5a059]/40 px-2 py-0.5 rounded-full font-display">
                  Pod Unseal Code
                </span>
              </div>
              <p className="text-xs text-[#5a524a] dark:text-[#baa997] leading-relaxed">
                Provide this secure 4-digit code to Chauffeur Dev upon delivery to authorize thermal pod unsealing:
              </p>
              <div className="flex items-center justify-center gap-2.5 py-2">
                {order.handOffPin.split('').map((char, i) => (
                  <span
                    key={i}
                    className="w-12 h-13 rounded-2xl bg-white dark:bg-[#141210] border-2 border-[#c5a059] text-[#171513] dark:text-[#dfc285] font-mono font-black text-2xl flex items-center justify-center shadow-md"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {/* Destination Address Card */}
            <div className="bg-white dark:bg-[#191714] rounded-3xl border border-[#ded5c4] dark:border-[#2d2720] p-5 space-y-2.5 shadow-xs transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">
                  <MapPin className="w-4 h-4 text-[#c5a059]" />
                  <span>Delivery Residence</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#781d18] dark:text-[#dfc285] bg-[#f5ebd7] dark:bg-[#282218] border border-[#c5a059]/40 px-2.5 py-0.5 rounded-full font-display">
                  {order.address.label}
                </span>
              </div>
              <div className="text-xs font-serif">
                <div className="font-bold text-[#171513] dark:text-[#f5ebd7] text-sm">{order.address.street}</div>
                <div className="text-[#5a524a] dark:text-[#baa997]">{order.address.apartment}</div>
                <div className="text-[#5a524a] dark:text-[#baa997]">{order.address.city}</div>
              </div>
              <div className="text-[11px] text-[#8c7e6f] dark:text-[#a89b8d] bg-[#faf7f2] dark:bg-[#141210] p-2.5 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] font-serif">
                <strong className="text-[#171513] dark:text-[#f5ebd7]">Instructions:</strong> {order.address.instructions}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary, Thermal Guarantee, Chef Marco Note (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white dark:bg-[#191714] rounded-3xl border border-[#ded5c4] dark:border-[#2d2720] p-5 sm:p-6 shadow-sm space-y-5 transition-colors">
            <div className="flex items-center justify-between border-b border-[#ded5c4] dark:border-[#2d2720] pb-3.5">
              <div>
                <h3 className="font-bold text-sm text-[#171513] dark:text-[#f5ebd7] font-display">Artisanal Order Summary</h3>
                <span className="text-xs text-[#8c7e6f] dark:text-[#a89b8d] font-serif">{order.items.length} dishes • Fired at 8:54 PM</span>
              </div>
              <button 
                onClick={onNavigateMenu}
                className="text-xs font-bold text-[#781d18] dark:text-[#dfc285] hover:text-[#5c1511] dark:hover:text-[#f0d8a8] font-display"
              >
                + Add More Dishes
              </button>
            </div>

            {/* Itemized list */}
            <div className="space-y-3.5">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-[#faf7f2] dark:bg-[#141210] border border-[#ded5c4] dark:border-[#322c24] text-[#171513] dark:text-[#f5ebd7] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      {item.quantity}×
                    </span>
                    <div>
                      <div className="font-bold text-[#171513] dark:text-[#f5ebd7] font-serif text-sm">{item.dishName}</div>
                      <div className="space-y-0.5 mt-1">
                        {item.customizations.map((c, ci) => (
                          <div key={ci} className="text-[10px] text-[#5a524a] dark:text-[#baa997] flex items-center gap-1 font-serif">
                            <span className="w-1 h-1 rounded-full bg-[#c5a059]" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-[#171513] dark:text-[#f5ebd7] shrink-0 font-serif text-sm">
                    {currency === 'INR' ? `₹${item.priceInr}` : `$${item.priceUsd.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="border-t border-[#ded5c4] dark:border-[#2d2720] pt-3.5 space-y-2 text-xs font-serif">
              <div className="flex justify-between text-[#5a524a] dark:text-[#baa997]">
                <span>Artisan Subtotal</span>
                <span>{currency === 'INR' ? `₹${order.subtotalInr}` : `$${order.subtotalUsd.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-[#5a524a] dark:text-[#baa997]">
                <span>Thermal Delivery Chauffeur</span>
                <span className="text-[#781d18] dark:text-[#dfc285] font-semibold font-display">Complimentary (Silver VIP)</span>
              </div>
              <div className="flex justify-between text-[#5a524a] dark:text-[#baa997]">
                <span>Taxes & Artisan Packaging</span>
                <span>{currency === 'INR' ? `₹${order.taxInr}` : `$${order.taxUsd.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-[#781d18] dark:text-[#dfc285] font-semibold">
                <span>Privilege Courtesy (BELLISSIMO25)</span>
                <span>-{currency === 'INR' ? `₹${order.discountInr}` : `$${order.discountUsd.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#171513] dark:text-[#f5ebd7] pt-2 border-t border-[#ded5c4] dark:border-[#2d2720] font-display">
                <span>Total Paid</span>
                <span className="text-base text-[#781d18] dark:text-[#dfc285] font-mono font-bold">
                  {currency === 'INR' ? `₹${order.totalInr}` : `$${order.totalUsd.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Loyalty points banner */}
            <div className="bg-[#f5ebd7]/50 dark:bg-[#201c18] rounded-2xl p-3.5 border border-[#c5a059]/40 flex items-center justify-between text-xs font-serif transition-colors">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c5a059]" />
                <span className="font-semibold text-[#781d18] dark:text-[#dfc285]">
                  Earned +{order.pointsEarned} Bellissimo Club Points
                </span>
              </div>
              <span className="text-[11px] text-[#781d18] dark:text-[#dfc285] font-bold font-display">Credited on Hand-off</span>
            </div>
          </div>

          {/* 60°C Thermal Guarantee Sensor Box */}
          <div className="bg-gradient-to-br from-[#171513] via-[#211d1a] to-[#171513] text-white rounded-3xl p-5 border border-[#c5a059]/40 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#c5a059]/20 text-[#dfc285] flex items-center justify-center font-bold border border-[#c5a059]/40">
                  <Thermometer className="w-4 h-4 text-[#dfc285]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white font-display">60°C Thermal Guarantee</h4>
                  <p className="text-[10px] text-[#dddad4] font-serif">IoT Chamber Sensor Telemetry</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#781d18] text-[#dfc285] text-[10px] font-bold border border-[#c5a059]/50 font-display">
                ACTIVE &bull; 100% WARM
              </span>
            </div>

            {/* Gauge Display */}
            <div className="bg-white/5 rounded-2xl p-3.5 border border-[#c5a059]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#dfc285] uppercase tracking-wider block font-display">Live Pod Core Temperature</span>
                <div className="text-3xl font-black font-mono text-[#dfc285] tracking-tight mt-0.5">
                  {chamberTemp}°C
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> +3.4°C above target
                </div>
                <span className="text-[10px] text-[#dddad4] font-serif">Crust crispness & cornicione preserved</span>
              </div>
            </div>

            <p className="text-[11px] text-[#dddad4]/85 italic font-serif leading-relaxed">
              "If your pizza arrives below 60°C, your entire meal is backed by our instant Hearth Guarantee credit."
            </p>
          </div>

          {/* Executive Chef Marco Rossi Note */}
          <div className="bg-[#faf7f2] dark:bg-[#191714] rounded-3xl border border-[#ded5c4] dark:border-[#2d2720] p-5 text-xs text-[#5a524a] dark:text-[#baa997] space-y-2 shadow-xs transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#171513] dark:text-[#f5ebd7] uppercase tracking-wider text-[10px] font-display">
                Master Pizzaiolo Note
              </span>
              <span className="font-serif italic text-xs text-[#781d18] dark:text-[#dfc285]">Marco Rossi</span>
            </div>
            <p className="text-[11px] leading-relaxed font-serif">
              "We fired your sourdough pizza at 815°F for exactly 92 seconds over seasoned oak wood. Enjoy immediately upon Chauffeur Dev's arrival for optimal cornicione airiness."
            </p>
          </div>
        </div>
      </div>

      {/* Simulated Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#191714] rounded-3xl p-6 max-w-sm w-full text-center border-2 border-[#c5a059] shadow-2xl space-y-4">
            <img
              src={order.courier.avatar}
              alt={order.courier.name}
              referrerPolicy="no-referrer"
              className="w-18 h-18 rounded-full mx-auto object-cover border-2 border-[#c5a059]"
            />
            <div>
              <h3 className="font-bold text-base text-[#171513] dark:text-[#f5ebd7] font-display">Calling Dev Patel</h3>
              <p className="text-xs text-[#5a524a] dark:text-[#baa997] mt-0.5 font-serif">{order.courier.phone} • Ather 450X</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#f5ebd7] dark:bg-[#282218] border border-[#c5a059]/50 text-[#781d18] dark:text-[#dfc285] text-xs font-serif">
              Connecting via Caffè Bellissimo Masked Secure Telephony...
            </div>
            <button
              onClick={() => setShowCallModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#781d18] hover:bg-[#5c1511] text-white font-bold text-xs cursor-pointer font-display tracking-wide shadow-sm"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
