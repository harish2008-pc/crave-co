import React from 'react';
import { 
  Compass, 
  LayoutDashboard, 
  ShoppingBag, 
  Truck, 
  Flame, 
  Mic, 
  Bell, 
  DollarSign
} from 'lucide-react';
import { Currency } from '../types';

interface DashboardSidebarProps {
  currentScreen: 'menu' | 'dashboard' | 'tracking' | 'club' | 'checkout';
  onNavigate: (screen: 'menu' | 'dashboard' | 'tracking' | 'club' | 'checkout') => void;
  currency: Currency;
  onToggleCurrency: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenVoiceAssistant?: () => void;
  onOpenVoiceModal?: () => void;
  onOpenPreferences?: () => void;
  onOpenChat?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentScreen,
  onNavigate,
  currency,
  onToggleCurrency,
  cartCount,
  onOpenCart,
  onOpenVoiceAssistant,
  onOpenVoiceModal,
  onOpenPreferences,
  onOpenChat,
}) => {
  const handleOpenVoice = onOpenVoiceModal || onOpenVoiceAssistant || (() => {});
  return (
    <aside 
      id="dashboard-sidebar"
      className="w-16 sm:w-18 shrink-0 h-full rounded-3xl bg-[#161412] border border-[#2a2520] flex flex-col justify-between items-center py-4 px-2 shadow-2xl z-30 transition-all select-none"
    >
      {/* Top: Emblem Logo */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => onNavigate('menu')}
          title="Caffè Bellissimo - In-Room Gastronomia"
          className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#781d18] to-[#ab2821] text-[#dfc285] flex items-center justify-center shadow-lg border border-[#c5a059]/40 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <Flame className="w-6 h-6 fill-[#dfc285] text-[#dfc285]" />
        </button>
      </div>

      {/* Center: Vertically Centered Navigation Icon Buttons */}
      <nav className="flex flex-col items-center gap-3.5 my-auto">
        {/* Dining / Menu */}
        <button
          id="sidebar-nav-dining"
          onClick={() => onNavigate('menu')}
          title="In-Room Dining"
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative group ${
            currentScreen === 'menu'
              ? 'bg-gradient-to-br from-[#c5a059] to-[#dfc285] text-[#171513] shadow-lg shadow-[#c5a059]/20 font-bold'
              : 'text-[#a89b8c] hover:text-white hover:bg-[#241f1a]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="sr-only">Dining</span>
          {/* Tooltip */}
          <span className="absolute left-14 px-2.5 py-1 bg-[#221d18] text-[#f5ebd7] text-xs font-semibold rounded-lg shadow-xl border border-[#383026] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            In-Room Dining
          </span>
        </button>

        {/* Dashboard */}
        <button
          id="sidebar-nav-dashboard"
          onClick={() => onNavigate('dashboard')}
          title="Kitchen & Hearth Dashboard"
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative group ${
            currentScreen === 'dashboard'
              ? 'bg-gradient-to-br from-[#c5a059] to-[#dfc285] text-[#171513] shadow-lg shadow-[#c5a059]/20 font-bold'
              : 'text-[#a89b8c] hover:text-white hover:bg-[#241f1a]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="sr-only">Dashboard</span>
          <span className="absolute left-14 px-2.5 py-1 bg-[#221d18] text-[#f5ebd7] text-xs font-semibold rounded-lg shadow-xl border border-[#383026] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            Hearth Dashboard
          </span>
        </button>

        {/* My Orders / Club */}
        <button
          id="sidebar-nav-orders"
          onClick={() => onNavigate('club')}
          title="My Orders & Privé"
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative group ${
            currentScreen === 'club'
              ? 'bg-gradient-to-br from-[#c5a059] to-[#dfc285] text-[#171513] shadow-lg shadow-[#c5a059]/20 font-bold'
              : 'text-[#a89b8c] hover:text-white hover:bg-[#241f1a]'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="sr-only">My Orders</span>
          <span className="absolute left-14 px-2.5 py-1 bg-[#221d18] text-[#f5ebd7] text-xs font-semibold rounded-lg shadow-xl border border-[#383026] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            My Orders & Privé
          </span>
        </button>

        {/* Services / Live Chauffeur */}
        <button
          id="sidebar-nav-services"
          onClick={() => onNavigate('tracking')}
          title="In-Room Delivery Services & Chauffeur"
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative group ${
            currentScreen === 'tracking'
              ? 'bg-gradient-to-br from-[#c5a059] to-[#dfc285] text-[#171513] shadow-lg shadow-[#c5a059]/20 font-bold'
              : 'text-[#a89b8c] hover:text-white hover:bg-[#241f1a]'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="sr-only">Services</span>
          <span className="absolute left-14 px-2.5 py-1 bg-[#221d18] text-[#f5ebd7] text-xs font-semibold rounded-lg shadow-xl border border-[#383026] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            Chauffeur Services
          </span>
        </button>
      </nav>

      {/* Bottom Actions: Voice, Currency, Bag */}
      <div className="flex flex-col items-center gap-2.5">
        {/* Voice Assistant Mic */}
        <button
          onClick={handleOpenVoice}
          title="Voice Search & Ordering"
          className="w-10 h-10 rounded-2xl bg-[#221d18] hover:bg-[#2a241f] text-[#c5a059] flex items-center justify-center transition-all border border-[#383026] cursor-pointer group relative"
        >
          <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
        </button>

        {/* Currency Toggle */}
        <button
          onClick={onToggleCurrency}
          title={`Switch Currency (${currency === 'INR' ? 'to USD' : 'to INR'})`}
          className="w-10 h-10 rounded-2xl bg-[#221d18] hover:bg-[#2a241f] text-[#dfc285] font-bold text-xs flex items-center justify-center transition-all border border-[#383026] cursor-pointer"
        >
          {currency === 'INR' ? '₹' : '$'}
        </button>

        {/* Bag / Cart shortcut */}
        <button
          onClick={onOpenCart}
          title="Open Cart Bag"
          className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#781d18] to-[#992620] hover:from-[#88211b] text-white flex items-center justify-center shadow-md border border-[#c5a059]/40 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-[#dfc285]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#dfc285] text-[#171513] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
