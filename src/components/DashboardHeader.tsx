import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Mic, 
  ShoppingBag, 
  Sparkles,
  Utensils, 
  X
} from 'lucide-react';
import { Currency, Dish } from '../types';

interface DashboardHeaderProps {
  currentScreen: 'menu' | 'dashboard' | 'tracking' | 'club' | 'checkout';
  onNavigate: (screen: 'menu' | 'dashboard' | 'tracking' | 'club' | 'checkout') => void;
  currency: Currency;
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  onOpenVoiceAssistant?: () => void;
  onOpenVoiceModal?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenNotifications?: () => void;
  hasActiveOrder?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentScreen,
  onNavigate,
  currency,
  cartCount,
  cartSubtotal,
  onOpenCart,
  onOpenVoiceAssistant,
  onOpenVoiceModal,
  searchQuery = '',
  onSearchChange = () => {},
  onOpenNotifications,
  hasActiveOrder = true,
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const handleOpenVoice = onOpenVoiceModal || onOpenVoiceAssistant || (() => {});

  const navItems: Array<{
    id: 'dashboard' | 'menu' | 'club' | 'tracking';
    label: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'menu', label: 'Dining' },
    { id: 'club', label: 'My Orders' },
    { id: 'tracking', label: 'Services' },
  ];

  return (
    <header 
      id="dashboard-top-header"
      className="h-16 px-4 sm:px-6 border-b border-[#2a2520] flex items-center justify-between shrink-0 bg-[#191714]/95 backdrop-blur-md z-20 transition-all select-none"
    >
      {/* Far Left: Suite / Room Location Marker */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-[#221d18] border border-[#383026] flex items-center justify-center text-[#dfc285] shrink-0">
          <Utensils className="w-4 h-4 text-[#c5a059]" />
        </div>
        <div className="hidden sm:block min-w-0">
          <div className="text-xs font-bold text-white tracking-wide truncate font-sans">
            Caffè Bellissimo
          </div>
          <div className="text-[10px] text-[#a89b8c] flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Suite 402 • In-Room Gastronomia</span>
          </div>
        </div>
      </div>

      {/* Top Center: Primary Horizontal Navigation Pill Menu */}
      <nav 
        id="top-nav-pill-menu"
        className="flex items-center p-1 bg-[#12100e] border border-[#2a2520] rounded-full shadow-inner gap-1"
      >
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              id={`top-nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`rounded-full px-4 sm:px-5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#c5a059] to-[#dfc285] text-[#171513] font-bold shadow-md shadow-[#c5a059]/25 scale-102'
                  : 'text-[#a89b8c] hover:text-white hover:bg-[#241f1a]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Far Top-Right Corner: Secondary Actions (Search, Mic, Notifications, Profile) */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Search trigger or expanded input */}
        <div className="relative">
          {isSearchExpanded ? (
            <div className="flex items-center bg-[#12100e] border border-[#c5a059]/50 rounded-full px-3 py-1 text-xs w-48 sm:w-60 shadow-lg animate-in fade-in zoom-in-95 duration-150">
              <Search className="w-3.5 h-3.5 text-[#a89b8c] shrink-0 mr-2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search menu items..."
                className="bg-transparent text-white placeholder-[#7d7367] text-xs focus:outline-none w-full font-sans"
              />
              <button
                onClick={() => {
                  onSearchChange('');
                  setIsSearchExpanded(false);
                }}
                className="text-[#a89b8c] hover:text-white ml-1 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchExpanded(true)}
              title="Search menu items"
              className="w-9 h-9 rounded-full bg-[#221d18] hover:bg-[#2a241f] border border-[#383026] flex items-center justify-center text-[#a89b8c] hover:text-white transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Microphone Voice Assistant Trigger */}
        <button
          id="header-mic-btn"
          onClick={handleOpenVoice}
          title="Alta Voce - Voice Search & Ordering"
          className="w-9 h-9 rounded-full bg-[#221d18] hover:bg-[#2a241f] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] transition-all cursor-pointer relative group"
        >
          <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
        </button>

        {/* Notifications Icon (Live tracking indicator) */}
        <button
          onClick={() => {
            if (onOpenNotifications) {
              onOpenNotifications();
            } else {
              onNavigate('tracking');
            }
          }}
          title="Active Order Notifications & Chauffeur Status"
          className="relative w-9 h-9 rounded-full bg-[#221d18] hover:bg-[#2a241f] border border-[#383026] flex items-center justify-center text-[#a89b8c] hover:text-white transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {hasActiveOrder && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#781d18] border border-[#221d18] animate-ping" />
          )}
          {hasActiveOrder && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c5a059]" />
          )}
        </button>

        {/* Bag / Cart Button */}
        <button
          id="top-cart-btn"
          onClick={onOpenCart}
          title="View In-Room Dining Bag"
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#781d18] to-[#992620] hover:from-[#88211b] text-white text-xs font-bold flex items-center gap-1.5 shadow-md border border-[#c5a059]/40 transition-all hover:scale-102 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#dfc285]" />
          <span className="hidden md:inline text-[11px] font-sans">Bag</span>
          <span className="bg-[#dfc285] text-[#171513] px-1.5 py-0.2 rounded-full text-[10px] font-extrabold">
            {cartCount}
          </span>
          {cartCount > 0 && (
            <span className="hidden lg:inline text-[11px] font-sans border-l border-white/20 pl-1.5 text-[#dfc285]">
              {currency === 'INR' ? `₹${Math.round(cartSubtotal * 38.5)}` : `$${cartSubtotal.toFixed(0)}`}
            </span>
          )}
        </button>

        {/* User Profile Avatar */}
        <div 
          onClick={() => onNavigate('club')}
          title="Guest Profile: Elena Vance - Privé Resident"
          className="flex items-center gap-2 pl-1 cursor-pointer group"
        >
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
              alt="Guest profile"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border-2 border-[#c5a059] group-hover:ring-2 group-hover:ring-[#c5a059]/40 transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#191714]" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-white group-hover:text-[#dfc285] transition-colors leading-tight font-sans">
              Guest Elena
            </div>
            <div className="text-[10px] text-[#a89b8c] font-mono leading-tight">
              VIP Privé
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
