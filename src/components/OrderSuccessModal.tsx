import React, { useState } from 'react';
import { Order, Currency } from '../types';
import { 
  CheckCircle2, 
  Flame, 
  Clock, 
  MapPin, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  Award,
  Navigation,
  FileText
} from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  order: Order | null;
  currency: Currency;
  onClose: () => void;
  onTrackOrder: () => void;
  onViewMenu: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  order,
  currency,
  onClose,
  onTrackOrder,
  onViewMenu,
}) => {
  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopyPin = () => {
    if (order.handOffPin) {
      navigator.clipboard?.writeText?.(order.handOffPin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  const handleCopyOrderNumber = () => {
    navigator.clipboard?.writeText?.(order.orderNumber);
    setCopiedOrderNumber(true);
    setTimeout(() => setCopiedOrderNumber(false), 2000);
  };

  return (
    <div 
      id="order-success-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300 font-serif"
    >
      <div 
        id="order-success-modal"
        className="w-full max-w-xl bg-white dark:bg-[#191714] rounded-3xl shadow-2xl border-2 border-[#c5a059]/40 overflow-hidden my-6 relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 transition-colors"
      >
        {/* Top Gold & Burgundy Decorative Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-[#781d18] via-[#c5a059] to-[#450e0a]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f5f0e6] dark:bg-[#231f1a] hover:bg-[#ede7dc] dark:hover:bg-[#2e261f] text-[#5a524a] dark:text-[#dfc285] flex items-center justify-center transition-colors cursor-pointer z-10 border border-[#ded5c4] dark:border-[#2d2720]"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header with Hearth Animation */}
          <div className="text-center space-y-3">
            {/* Animated Emblems */}
            <div className="relative inline-flex items-center justify-center mb-1">
              <div className="absolute -inset-3 bg-[#c5a059]/20 rounded-full animate-ping opacity-30 duration-1000" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#781d18] via-[#5c1511] to-[#2b0805] text-white flex items-center justify-center shadow-xl shadow-[#781d18]/40 border-2 border-[#c5a059]/50">
                <Flame className="w-10 h-10 text-[#dfc285] animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#c5a059] text-[#171513] flex items-center justify-center border-2 border-white dark:border-[#191714] shadow-md">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f5ebd7] dark:bg-[#2e2017] text-[#781d18] dark:text-[#dfc285] border border-[#c5a059]/40 text-xs font-bold uppercase tracking-widest font-display">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Degustazione Iniziata • Oak Hearth Fired</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#171513] dark:text-[#f5ebd7] tracking-wide">
                Caffè Bellissimo Feasting Begins
              </h2>
              <p className="text-xs sm:text-sm text-[#5a524a] dark:text-[#a89b8c] max-w-md mx-auto leading-relaxed">
                The Master Pizzaiolo has slid your artisanal selection into the 815°F oak hearth. Your climate-controlled thermal cell is initialized.
              </p>
            </div>
          </div>

          {/* Key Reference Information Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Order Reference Number */}
            <div className="p-4 rounded-2xl bg-[#f5f0e6] dark:bg-[#231f1a] border border-[#ded5c4] dark:border-[#2d2720] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8c7e6f] dark:text-[#8d7f72] uppercase font-bold tracking-widest block font-display">
                  Order Dossier
                </span>
                <span className="text-base font-bold font-mono text-[#171513] dark:text-[#f5ebd7]">
                  #{order.orderNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyOrderNumber}
                className="p-2 rounded-xl bg-white dark:bg-[#191714] border border-[#ded5c4] dark:border-[#383127] hover:bg-[#171513] hover:text-white dark:hover:bg-[#dfc285] dark:hover:text-[#171513] transition-colors cursor-pointer shadow-2xs"
                title="Copy order number"
              >
                {copiedOrderNumber ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-[#5a524a] dark:text-[#baa997]" />}
              </button>
            </div>

            {/* Hand-off PIN */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#171513] via-[#211e1c] to-[#12100f] text-white border border-[#c5a059]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#dfc285] uppercase font-bold tracking-widest block flex items-center gap-1 font-display">
                  <KeyRound className="w-3 h-3 text-[#c5a059]" /> VIP Hand-Off PIN
                </span>
                <span className="text-xl font-bold font-mono tracking-widest text-[#dfc285]">
                  {order.handOffPin || '4829'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyPin}
                className="p-2 rounded-xl bg-white/10 border border-[#c5a059]/30 hover:bg-white/20 text-white transition-colors cursor-pointer shadow-2xs"
                title="Copy PIN"
              >
                {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#dfc285]" />}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="p-4 rounded-2xl bg-[#faf7f2] dark:bg-[#231f1a] border border-[#ded5c4] dark:border-[#2d2720] grid grid-cols-3 gap-3 text-center">
            <div className="space-y-0.5 border-r border-[#ded5c4] dark:border-[#2d2720]">
              <span className="text-[10px] text-[#8c7e6f] dark:text-[#8d7f72] uppercase font-bold block flex items-center justify-center gap-1 font-display">
                <Clock className="w-3 h-3 text-[#781d18] dark:text-[#dfc285]" /> ETA
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#171513] dark:text-[#f5ebd7] block font-sans">
                {order.estimatedDelivery}
              </span>
            </div>

            <div className="space-y-0.5 border-r border-[#ded5c4] dark:border-[#2d2720]">
              <span className="text-[10px] text-[#8c7e6f] dark:text-[#8d7f72] uppercase font-bold block flex items-center justify-center gap-1 font-display">
                <MapPin className="w-3 h-3 text-[#c5a059]" /> Residence
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#171513] dark:text-[#f5ebd7] truncate block px-1">
                {order.address.label}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-[#8c7e6f] dark:text-[#8d7f72] uppercase font-bold block flex items-center justify-center gap-1 font-display">
                <Award className="w-3 h-3 text-[#c5a059]" /> Privé Accrual
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#781d18] dark:text-[#dfc285] block font-sans">
                +{order.pointsEarned} PTS
              </span>
            </div>
          </div>

          {/* Dispatched Courier Mini-Card */}
          {order.courier && (
            <div className="p-3.5 rounded-2xl bg-[#f5f0e6] dark:bg-[#231f1a] border border-[#ded5c4] dark:border-[#2d2720] flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <img
                  src={order.courier.avatar}
                  alt={order.courier.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#c5a059]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">{order.courier.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#f5ebd7] dark:bg-[#2e2017] text-[#781d18] dark:text-[#dfc285] font-bold border border-[#c5a059]/40">
                      ★ {order.courier.rating}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5a524a] dark:text-[#a89b8c]">
                    Chauffeur Privé &bull; {order.courier.vehicle}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#8c7e6f] dark:text-[#8d7f72] block font-display">Pod Chamber</span>
                <span className="text-xs font-mono font-bold text-[#781d18] dark:text-[#dfc285] flex items-center justify-end gap-0.5">
                  <Flame className="w-3 h-3 text-[#c5a059]" />
                  {order.chamberTempCelsius.toFixed(1)}°C
                </span>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2">
            <button
              id="success-track-radar-btn"
              type="button"
              onClick={() => {
                onClose();
                onTrackOrder();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#781d18] to-[#5c1511] hover:from-[#601410] hover:to-[#450e0a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#781d18]/25 border border-[#c5a059]/40 transition-all hover:scale-101 cursor-pointer tracking-wide"
            >
              <Navigation className="w-4 h-4 text-[#dfc285]" />
              <span>Track Live Dispatch Radar</span>
              <ArrowRight className="w-4 h-4 text-[#dfc285]" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onTrackOrder();
                }}
                className="py-2.5 px-3 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] bg-[#f5f0e6] dark:bg-[#231f1a] hover:bg-[#ede7dc] dark:hover:bg-[#2a241e] text-xs font-bold text-[#171513] dark:text-[#f5ebd7] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#5a524a] dark:text-[#a89b8c]" />
                <span>View Degustation Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewMenu();
                }}
                className="py-2.5 px-3 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] bg-white dark:bg-[#1a1714] hover:bg-[#f5f0e6] dark:hover:bg-[#231f1a] text-xs font-bold text-[#5a524a] dark:text-[#a89b8c] hover:text-[#171513] dark:hover:text-[#f5ebd7] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span>Return to Carte</span>
              </button>
            </div>
          </div>

          {/* Thermal Guarantee Footnote */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#781d18] dark:text-[#dfc285] font-medium pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Guaranteed &gt;60°C core temperature upon presentation or cellar credit granted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
