import React, { useState } from 'react';
import { Currency, ThemeMode, Dish } from '../types';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  Sparkles, 
  ChevronDown, 
  Compass, 
  Award, 
  Check, 
  Radio,
  Sun,
  Moon,
  Activity,
  Mic
} from 'lucide-react';
import { VoiceAssistantModal } from './VoiceAssistantModal';

interface HeaderProps {
  currentScreen: 'menu' | 'dashboard' | 'tracking' | 'club' | 'checkout';
  onNavigate: (screen: 'menu' | 'dashboard' | 'tracking' | 'club' | 'checkout') => void;
  currency: Currency;
  onToggleCurrency: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  cartCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  userPoints: number;
  onOpenAddressModal?: () => void;
  dishes?: Dish[];
  onQuickAdd?: (dish: Dish) => void;
  onShowToast?: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  currency,
  onToggleCurrency,
  theme,
  onToggleTheme,
  cartCount,
  cartSubtotal,
  onOpenCart,
  searchQuery,
  onSearchChange,
  userPoints,
  onOpenAddressModal,
  dishes = [],
  onQuickAdd,
  onShowToast,
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Indiranagar, Bengaluru');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const locations = [
    { name: 'Indiranagar, Bengaluru', detail: '742 Evergreen Terrace, Apt 4B', active: true },
    { name: 'Koramangala 4th Block', detail: '108 Palm Avenue, Suite 12', active: false },
    { name: 'Lavelle Road, Central', detail: 'The Glasshouse Tower, 7th Fl', active: false },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2]/95 dark:bg-[#121110]/95 backdrop-blur-md border-b border-[#e5decfa] dark:border-[#2d2720] transition-colors">
      {/* Top micro announcement bar */}
      <div className="bg-[#151413] text-[#f4efe6] px-4 py-1.5 text-xs flex items-center justify-between font-medium border-b border-[#c5a059]/20">
        <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
          <span className="bg-[#c5a059]/20 text-[#dfc285] border border-[#c5a059]/40 text-[9px] px-2 py-0.5 rounded tracking-widest uppercase font-semibold font-serif">
            ALTA GASTRONOMIA
          </span>
          <span className="text-[11px] tracking-wide text-[#e8dfd3]">
            Complimentary Tartufo Nero di Norcia on orders over {currency === 'INR' ? '₹999' : '$35'} with code <strong className="text-[#dfc285] underline underline-offset-2 tracking-wider">BELLISSIMO25</strong>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#c7bcae] font-serif">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c5a059] shadow-[0_0_8px_#c5a059]"></span>
            Refractory Oak Hearth: 815°F
          </span>
          <span>&bull;</span>
          <span>Chauffeur Dispatch Active</span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            id="brand-logo-btn"
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            {/* Medallion crest */}
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#781d18] via-[#5c1511] to-[#3a0b08] text-[#f3e5ab] flex items-center justify-center shadow-lg shadow-[#781d18]/25 border-2 border-[#c5a059]/60 group-hover:scale-105 transition-all">
              <span className="font-serif italic font-normal text-2xl leading-none select-none text-[#dfc285]">
                B
              </span>
              <div className="absolute inset-0 rounded-full border border-white/20"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-[0.08em] text-[#171513] dark:text-[#f5ebd7] font-display">
                  CAFFÈ <span className="text-[#781d18] dark:text-[#dfc285] font-black">BELLISSIMO</span>
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[8px] font-semibold tracking-[0.2em] uppercase bg-[#f5ebd7] dark:bg-[#282218] text-[#781d18] dark:text-[#dfc285] border border-[#c5a059]/40 rounded">
                  MILANO &bull; EST. 1988
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8c7e6f] dark:text-[#baa997] hidden sm:block font-serif">
                Haute Gastronomia &bull; Forno a Legna
              </p>
            </div>
          </button>

          {/* Location selector dropdown */}
          <div className="relative hidden lg:block">
            <button
              id="location-selector-btn"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5f0e6] dark:bg-[#1e1b18] hover:bg-[#ede7dc] dark:hover:bg-[#282420] border border-[#ded5c4] dark:border-[#38322a] text-xs font-medium text-[#171513] dark:text-[#f5ebd7] transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#781d18] dark:text-[#dfc285]" />
              <span className="max-w-[140px] truncate font-serif">{selectedLocation}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#8c7e6f] dark:text-[#baa997] transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showLocationDropdown && (
              <div className="absolute left-0 mt-1.5 w-72 bg-white dark:bg-[#1a1815] rounded-xl shadow-2xl border border-[#ded5c4] dark:border-[#38322a] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold text-[#8c7e6f] dark:text-[#baa997] uppercase tracking-widest font-serif">
                  Concierge Delivery Destination
                </div>
                {locations.map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => {
                      setSelectedLocation(loc.name);
                      setShowLocationDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#faf7f2] dark:hover:bg-[#231f1c] flex items-start gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="mt-0.5 text-[#781d18] dark:text-[#dfc285]">
                      {selectedLocation === loc.name ? (
                        <Check className="w-4 h-4 text-[#c5a059]" />
                      ) : (
                        <MapPin className="w-4 h-4 text-[#8c7e6f] dark:text-[#baa997]" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-[#171513] dark:text-[#f5ebd7] font-serif">{loc.name}</div>
                      <div className="text-[11px] text-[#5a524a] dark:text-[#baa997]">{loc.detail}</div>
                    </div>
                  </button>
                ))}
                {onOpenAddressModal && (
                  <div className="px-2 pt-1 border-t border-[#ede7dc] dark:border-[#2e2820] mt-1">
                    <button
                      onClick={() => {
                        setShowLocationDropdown(false);
                        onOpenAddressModal();
                      }}
                      className="w-full py-1.5 px-2 text-xs font-bold text-[#781d18] dark:text-[#dfc285] hover:bg-[#fae0dc]/40 dark:hover:bg-[#2b1f14] rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Manage Private Residences</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-sm mx-2">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-[#8c7e6f] dark:text-[#baa997] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="header-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Perigord truffle, tagliolini, Barolo pairings..."
              className="w-full pl-9 pr-16 py-2 rounded-xl bg-[#f5f0e6] dark:bg-[#1e1b18] border border-[#ded5c4] dark:border-[#38322a] focus:border-[#c5a059] focus:bg-white dark:focus:bg-[#25211c] focus:outline-none text-xs text-[#171513] dark:text-[#f5ebd7] placeholder-[#8c7e6f] dark:placeholder-[#9e8f7f] transition-all font-serif"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  title="Clear search"
                  className="p-1 text-xs text-[#8c7e6f] dark:text-[#baa997] hover:text-[#171513] dark:hover:text-[#f5ebd7] cursor-pointer"
                >
                  ✕
                </button>
              )}
              {/* Microphone Voice-to-Text Button */}
              <button
                id="header-mic-btn"
                onClick={() => setIsVoiceModalOpen(true)}
                title="Voice Search & Voice Add-to-Cart (Alta Voce Concierge)"
                aria-label="Voice search or add to bag"
                className="p-1.5 rounded-lg text-[#781d18] dark:text-[#dfc285] hover:bg-[#c5a059]/20 transition-all cursor-pointer group relative flex items-center justify-center"
              >
                <Mic className="w-3.5 h-3.5 text-[#c5a059] group-hover:scale-115 group-hover:text-[#dfc285] transition-all" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-menu-btn"
            onClick={() => onNavigate('menu')}
            title="La Carte & Wood-Fired Hearth Menu"
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentScreen === 'menu'
                ? 'bg-[#171513] dark:bg-[#231f1c] text-[#dfc285] shadow-sm border border-[#c5a059]/40'
                : 'text-[#5a524a] dark:text-[#c7bcae] hover:bg-[#ede7dc] dark:hover:bg-[#231f1c] hover:text-[#171513] dark:hover:text-[#f5ebd7]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-serif tracking-wide">La Carte & Hearth</span>
          </button>

          <button
            id="nav-dashboard-btn"
            onClick={() => onNavigate('dashboard')}
            title="Kitchen Telemetry & Patron Dashboard"
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentScreen === 'dashboard'
                ? 'bg-[#171513] dark:bg-[#231f1c] text-[#dfc285] shadow-sm border border-[#c5a059]/40'
                : 'text-[#5a524a] dark:text-[#c7bcae] hover:bg-[#ede7dc] dark:hover:bg-[#231f1c] hover:text-[#171513] dark:hover:text-[#f5ebd7]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="hidden sm:inline font-serif tracking-wide">Dashboard</span>
          </button>

          <button
            id="nav-tracking-btn"
            onClick={() => onNavigate('tracking')}
            title="Live Chauffeur & Thermal Capsule Tracking"
            className={`relative px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentScreen === 'tracking'
                ? 'bg-[#171513] dark:bg-[#231f1c] text-[#dfc285] shadow-sm border border-[#c5a059]/40'
                : 'text-[#5a524a] dark:text-[#c7bcae] hover:bg-[#ede7dc] dark:hover:bg-[#231f1c] hover:text-[#171513] dark:hover:text-[#f5ebd7]'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5a059] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#781d18]"></span>
            </span>
            <span className="font-serif tracking-wide">Chauffeur</span>
            <span className="hidden xl:inline text-[9px] px-1.5 py-0.2 bg-[#f5ebd7] dark:bg-[#282218] text-[#781d18] dark:text-[#dfc285] border border-[#c5a059]/30 rounded font-mono font-bold">
              #CB-84920
            </span>
          </button>

          <button
            id="nav-club-btn"
            onClick={() => onNavigate('club')}
            title="Bellissimo Privé VIP Club & Past Orders"
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentScreen === 'club'
                ? 'bg-[#171513] dark:bg-[#231f1c] text-[#dfc285] shadow-sm border border-[#c5a059]/40'
                : 'text-[#5a524a] dark:text-[#c7bcae] hover:bg-[#ede7dc] dark:hover:bg-[#231f1c] hover:text-[#171513] dark:hover:text-[#f5ebd7]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="hidden sm:inline font-serif tracking-wide">Bellissimo Privé</span>
            <span className="text-[10px] font-bold text-[#c5a059] bg-[#231e17] px-1.5 py-0.5 rounded border border-[#c5a059]/30">
              {userPoints.toLocaleString()}p
            </span>
          </button>
        </nav>

        {/* Currency Switcher, Theme Toggle & Cart Action */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Option Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Giorno (Light Mode)' : 'Switch to Notte (Dark Mode)'}
            aria-label="Toggle light and dark theme"
            className="px-2.5 py-1.5 rounded-lg border border-[#ded5c4] dark:border-[#38322a] bg-[#f5f0e6] dark:bg-[#1e1b18] hover:bg-[#ede7dc] dark:hover:bg-[#282420] text-xs font-bold text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#dfc285] transition-transform group-hover:rotate-45" />
                <span className="hidden sm:inline font-serif text-[11px] text-[#dfc285]">Giorno</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#781d18] transition-transform group-hover:-rotate-12" />
                <span className="hidden sm:inline font-serif text-[11px] text-[#781d18]">Notte</span>
              </>
            )}
          </button>

          {/* Currency Toggle */}
          <button
            id="currency-toggle-btn"
            onClick={onToggleCurrency}
            title="Toggle currency display"
            className="px-2.5 py-1.5 rounded-lg border border-[#ded5c4] dark:border-[#38322a] bg-[#f5f0e6] dark:bg-[#1e1b18] hover:bg-[#ede7dc] dark:hover:bg-[#282420] text-xs font-bold text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="text-[#8c7e6f] dark:text-[#baa997] text-[9px] uppercase tracking-wider">Valuta</span>
            <span className="text-[#781d18] dark:text-[#dfc285] font-serif">{currency === 'INR' ? '₹ INR' : '$ USD'}</span>
          </button>

          {/* Mobile Microphone Voice-to-Text Button */}
          <button
            id="mobile-header-mic-btn"
            onClick={() => setIsVoiceModalOpen(true)}
            title="Voice Search & Add to Cart (Alta Voce)"
            aria-label="Voice search or add to bag"
            className="md:hidden px-2.5 py-1.5 rounded-lg border border-[#c5a059]/50 bg-[#f5f0e6] dark:bg-[#1e1b18] hover:bg-[#ede7dc] dark:hover:bg-[#282420] text-[#781d18] dark:text-[#dfc285] flex items-center justify-center transition-colors cursor-pointer relative"
          >
            <Mic className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
          </button>

          {/* Cart / Bag Button */}
          <button
            id="cart-drawer-toggle-btn"
            onClick={onOpenCart}
            className="relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#781d18] to-[#5c1511] hover:from-[#601410] hover:to-[#450e0a] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#781d18]/25 border border-[#c5a059]/40 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#dfc285]" />
            <span className="hidden sm:inline font-serif tracking-wide">Bag</span>
            <span className="bg-[#dfc285] text-[#171513] px-1.5 py-0.2 rounded-full text-[10px] font-extrabold min-w-[20px] text-center">
              {cartCount}
            </span>
            {cartCount > 0 && (
              <span className="hidden md:inline pl-1 border-l border-white/20 text-[11px] text-[#f5ebd7] font-serif">
                {currency === 'INR' ? `₹${Math.round(cartSubtotal * 38.5)}` : `$${cartSubtotal.toFixed(2)}`}
              </span>
            )}
          </button>

          {/* User profile avatar trigger */}
          <button
            id="profile-avatar-btn"
            onClick={() => onNavigate('club')}
            title="Elena Vance - Privé Connoisseur"
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#c5a059] p-0.5 hover:ring-2 hover:ring-[#c5a059]/50 transition-all cursor-pointer shrink-0 hidden sm:block shadow-xs"
          >
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
              alt="Elena Vance profile"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </button>
        </div>
      </div>

      {/* Gastronomic Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        dishes={dishes}
        currency={currency}
        onQuickAdd={(dish) => {
          if (onQuickAdd) onQuickAdd(dish);
        }}
        onSearchChange={onSearchChange}
        onNavigate={onNavigate}
        onOpenCart={onOpenCart}
        onShowToast={(msg) => {
          if (onShowToast) onShowToast(msg);
        }}
      />
    </header>
  );
};
