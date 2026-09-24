import React, { useState } from 'react';
import { Currency, ThemeMode } from '../types';
import {
  Flame,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Compass,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  Heart,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
  Send,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (screen: 'menu' | 'dashboard' | 'tracking' | 'club' | 'checkout') => void;
  onOpenPreferences: () => void;
  onOpenAddressModal: () => void;
  currency: Currency;
  onToggleCurrency: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function Footer({
  onNavigate,
  onOpenPreferences,
  onOpenAddressModal,
  currency,
  onToggleCurrency,
  theme,
  onToggleTheme,
}: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => {
      setNewsletterSubscribed(false);
    }, 5000);
  };

  return (
    <footer className="bg-white dark:bg-[#141210] border-t border-[#ded5c4] dark:border-[#2d2720] pt-14 pb-16 text-xs text-[#5a524a] dark:text-[#baa997] transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Section: Brand Statement & VIP Cellar Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-[#ded5c4] dark:border-[#2d2720]">
          {/* Brand Presentation */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#781d18] via-[#5c1511] to-[#3a0b08] text-[#dfc285] flex items-center justify-center font-bold text-xl border-2 border-[#c5a059]/60 shadow-md">
                B
              </div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#171513] dark:text-[#f5ebd7] font-display">
                  CAFFÈ <span className="text-[#781d18] dark:text-[#dfc285]">BELLISSIMO</span>
                </span>
                <span className="block text-[10px] tracking-widest uppercase text-[#8c7e6f] dark:text-[#a89b8c] font-sans">
                  Haute Gastronomia &bull; Milano 1988 &bull; Bengaluru
                </span>
              </div>
            </div>

            <p className="max-w-lg text-xs leading-relaxed text-[#5a524a] dark:text-[#baa997]">
              Artisanal Italian wood-fired culinary concierge. Crafted with stone-milled Italian flours, 72-hour naturally fermented biga sourdough, and delivered in patent-pending thermal capsules maintaining a guaranteed minimum temperature of 60°C.
            </p>

            {/* Core Commitments List */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] text-[#781d18] dark:text-[#dfc285] font-semibold pt-1">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> 815°F Oak Wood Hearth
              </span>
              <span className="text-[#ded5c4] dark:text-[#38322a]">&bull;</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> &gt;60°C Thermal Guarantee
              </span>
              <span className="text-[#ded5c4] dark:text-[#38322a]">&bull;</span>
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#c5a059]" /> D.O.P. Certified Italian Sourcing
              </span>
            </div>
          </div>

          {/* Cellar Newsletter Subscription Form */}
          <div className="lg:col-span-6 flex flex-col justify-center rounded-2xl bg-[#faf7f2] dark:bg-[#1b1815] border border-[#ded5c4] dark:border-[#322c24] p-5 sm:p-6 space-y-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>The Sommelier &amp; Hearth Cellar Dispatch</span>
              </div>
              <p className="text-[11px] text-[#8c7e6f] dark:text-[#a89b8c] mt-0.5">
                Receive private cellar releases, White Alba Truffle seasonal arrivals, and invitations to private chef tastings.
              </p>
            </div>

            {newsletterSubscribed ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Benvenuto! You are now registered for private cellar release previews.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your private email..."
                  required
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-[#25211c] border border-[#ded5c4] dark:border-[#38322a] focus:border-[#c5a059] focus:outline-none text-xs text-[#171513] dark:text-[#f5ebd7] placeholder-[#8c7e6f] dark:placeholder-[#7a6f63]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#781d18] hover:bg-[#601511] text-[#dfc285] text-xs font-bold shadow-xs border border-[#c5a059]/40 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 font-sans"
                >
                  <span>Subscribe</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Organized 4-Column Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: La Carte & Specialties */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#171513] dark:text-[#f5ebd7] font-display border-b border-[#ded5c4] dark:border-[#322c24] pb-2">
              La Carte &amp; Hearth
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#781d18] dark:hover:text-[#dfc285] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>Wood-Fired Sourdough Pizzas</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#781d18] dark:hover:text-[#dfc285] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>Hand-Crafted Tagliolini &amp; Pastas</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#781d18] dark:hover:text-[#dfc285] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>Wagyu &amp; Gorgonzola Smash Burgers</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#781d18] dark:hover:text-[#dfc285] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>Crispy Calabrian Wings &amp; Polenta</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#781d18] dark:hover:text-[#dfc285] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>Artisanal Dolci &amp; Cannoli Trio</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#781d18] dark:hover:text-[#dfc285] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>Cellar Wines &amp; San Pellegrino</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Artisanal Kitchens & Hearths */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#171513] dark:text-[#f5ebd7] font-display border-b border-[#ded5c4] dark:border-[#322c24] pb-2">
              Artisanal Kitchens
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <div className="font-semibold text-[#171513] dark:text-[#f5ebd7]">
                  Hearth 01 &bull; Indiranagar
                </div>
                <div className="text-[11px] text-[#8c7e6f] dark:text-[#a89b8c]">
                  100ft Rd &bull; 12:00 PM – 11:30 PM
                </div>
                <div className="text-[11px] text-[#781d18] dark:text-[#dfc285] font-mono mt-0.5">
                  +91 80 4920 8801
                </div>
              </div>

              <div>
                <div className="font-semibold text-[#171513] dark:text-[#f5ebd7]">
                  Hearth 02 &bull; Central
                </div>
                <div className="text-[11px] text-[#8c7e6f] dark:text-[#a89b8c]">
                  Lavelle Road &bull; 12:00 PM – 11:00 PM
                </div>
                <div className="text-[11px] text-[#781d18] dark:text-[#dfc285] font-mono mt-0.5">
                  +91 80 4920 8802
                </div>
              </div>

              <div>
                <div className="font-semibold text-[#171513] dark:text-[#f5ebd7]">
                  Hearth 03 &bull; Koramangala
                </div>
                <div className="text-[11px] text-[#8c7e6f] dark:text-[#a89b8c]">
                  4th Block &bull; 1:00 PM – 12:00 AM
                </div>
                <div className="text-[11px] text-[#781d18] dark:text-[#dfc285] font-mono mt-0.5">
                  +91 80 4920 8803
                </div>
              </div>

              <div className="pt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>All 3 Refractory Domes: 815°F+</span>
              </div>
            </div>
          </div>

          {/* Column 3: Concierge & Guest Services */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#171513] dark:text-[#f5ebd7] font-display border-b border-[#ded5c4] dark:border-[#322c24] pb-2">
              Concierge &amp; Privé
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-[#781d18] dark:hover:text-[#dfc285] transition-colors cursor-pointer text-left flex items-center gap-1.5 font-semibold text-[#781d18] dark:text-[#dfc285]"
                >
                  <Activity className="w-3 h-3 text-[#c5a059]" />
                  <span>Kitchen &amp; Patron Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tracking')}
                  className="hover:text-[#781d18] dark:hover:text-[#dfc285] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>Chauffeur Thermal Tracking</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('club')}
                  className="hover:text-[#781d18] dark:hover:text-[#dfc285] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>Bellissimo Privé VIP Club</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPreferences}
                  className="hover:text-[#781d18] dark:hover:text-[#dfc285] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>Dietary Profiling &amp; Allergens</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAddressModal}
                  className="hover:text-[#781d18] dark:hover:text-[#dfc285] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>Saved Residences &amp; Drop Points</span>
                </button>
              </li>
              <li className="pt-2">
                <span className="text-[11px] text-[#8c7e6f] dark:text-[#a89b8c] block font-sans uppercase">
                  Private Sommelier &bull; VIP Hotline
                </span>
                <span className="font-mono text-xs font-bold text-[#781d18] dark:text-[#dfc285]">
                  +91 80 4920 8800
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Standards, Certifications & Trust */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#171513] dark:text-[#f5ebd7] font-display border-b border-[#ded5c4] dark:border-[#322c24] pb-2">
              Standards &amp; Charters
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#faf7f2] dark:bg-[#1c1815] border border-[#ded5c4] dark:border-[#2f2922] space-y-1">
                <div className="font-bold text-[11px] text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Hearth Capsule Charter</span>
                </div>
                <p className="text-[10px] text-[#8c7e6f] dark:text-[#a89b8c] leading-relaxed">
                  Every order leaves our 815°F oven and is locked in a heated thermal capsule guaranteed at &gt;60°C.
                </p>
              </div>

              <div className="text-[11px] space-y-1.5 text-[#5a524a] dark:text-[#baa997]">
                <div>
                  <strong className="text-[#171513] dark:text-[#f5ebd7]">FSSAI License:</strong> #11224334000198
                </div>
                <div>
                  <strong className="text-[#171513] dark:text-[#f5ebd7]">D.O.P. Certificate:</strong> IT-AGRI-103
                </div>
                <div>
                  <strong className="text-[#171513] dark:text-[#f5ebd7]">Packaging:</strong> 100% Biodegradable
                </div>
                <div>
                  <strong className="text-[#171513] dark:text-[#f5ebd7]">Concierge Email:</strong>{' '}
                  <span className="font-mono text-[10px]">concierge@caffebellissimo.dining</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation & Interactive Controls Bar */}
        <div className="pt-8 border-t border-[#ded5c4] dark:border-[#2d2720] flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Main App Screen Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#8c7e6f] dark:text-[#a89b8c] font-sans font-semibold mr-1">
              Direct Access:
            </span>
            <button
              onClick={() => {
                onNavigate('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-2.5 py-1 rounded-lg bg-[#faf7f2] dark:bg-[#1f1b17] hover:bg-[#ede7dc] dark:hover:bg-[#28231e] text-[#171513] dark:text-[#f5ebd7] border border-[#ded5c4] dark:border-[#38322a] transition-colors cursor-pointer"
            >
              La Carte
            </button>
            <button
              onClick={() => {
                onNavigate('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-2.5 py-1 rounded-lg bg-[#781d18]/10 dark:bg-[#781d18]/25 hover:bg-[#781d18]/20 text-[#781d18] dark:text-[#dfc285] border border-[#c5a059]/40 font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Activity className="w-3 h-3 text-[#c5a059]" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => {
                onNavigate('tracking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-2.5 py-1 rounded-lg bg-[#faf7f2] dark:bg-[#1f1b17] hover:bg-[#ede7dc] dark:hover:bg-[#28231e] text-[#171513] dark:text-[#f5ebd7] border border-[#ded5c4] dark:border-[#38322a] transition-colors cursor-pointer"
            >
              Chauffeur Tracking
            </button>
            <button
              onClick={() => {
                onNavigate('club');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-2.5 py-1 rounded-lg bg-[#faf7f2] dark:bg-[#1f1b17] hover:bg-[#ede7dc] dark:hover:bg-[#28231e] text-[#171513] dark:text-[#f5ebd7] border border-[#ded5c4] dark:border-[#38322a] transition-colors cursor-pointer"
            >
              Bellissimo Privé
            </button>
            <button
              onClick={() => {
                onNavigate('checkout');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-2.5 py-1 rounded-lg bg-[#faf7f2] dark:bg-[#1f1b17] hover:bg-[#ede7dc] dark:hover:bg-[#28231e] text-[#171513] dark:text-[#f5ebd7] border border-[#ded5c4] dark:border-[#38322a] transition-colors cursor-pointer"
            >
              Checkout &amp; Bag
            </button>
          </div>

          {/* Quick Currency and Theme Modifiers */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleCurrency}
              className="px-2.5 py-1 rounded-lg bg-[#faf7f2] dark:bg-[#1f1b17] hover:bg-[#ede7dc] dark:hover:bg-[#28231e] border border-[#ded5c4] dark:border-[#38322a] font-mono text-[11px] font-bold text-[#781d18] dark:text-[#dfc285] transition-colors cursor-pointer"
              title="Toggle Currency"
            >
              {currency === 'INR' ? 'Currency: ₹ INR' : 'Currency: $ USD'}
            </button>

            <button
              onClick={onToggleTheme}
              className="px-2.5 py-1 rounded-lg bg-[#faf7f2] dark:bg-[#1f1b17] hover:bg-[#ede7dc] dark:hover:bg-[#28231e] border border-[#ded5c4] dark:border-[#38322a] text-[11px] font-semibold text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle Color Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#dfc285]" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#781d18]" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-6 border-t border-[#ded5c4] dark:border-[#2d2720] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8c7e6f] dark:text-[#baa997]">
          <div>
            &copy; 2026 Caffè Bellissimo Artisanal Dining Ltd. All rights reserved. Milano &bull; Bengaluru.
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => setActivePolicyModal('terms')}
              className="hover:text-[#171513] dark:hover:text-[#f5ebd7] transition-colors cursor-pointer"
            >
              Terms of Gastronomy
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActivePolicyModal('privacy')}
              className="hover:text-[#171513] dark:hover:text-[#f5ebd7] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActivePolicyModal('thermal')}
              className="hover:text-[#171513] dark:hover:text-[#f5ebd7] transition-colors cursor-pointer"
            >
              Thermal Vault Charter
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActivePolicyModal('haccp')}
              className="hover:text-[#171513] dark:hover:text-[#f5ebd7] transition-colors cursor-pointer"
            >
              Food Safety &amp; HACCP
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Policy Modal */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1714] rounded-3xl p-6 max-w-lg w-full border-2 border-[#c5a059] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#ded5c4] dark:border-[#322c24] pb-3">
              <h3 className="font-bold text-base text-[#171513] dark:text-[#f5ebd7] font-display">
                {activePolicyModal === 'terms' && 'Terms of Gastronomic Service'}
                {activePolicyModal === 'privacy' && 'Privacy & Patron Data Protection'}
                {activePolicyModal === 'thermal' && '60°C Thermal Guarantee Charter'}
                {activePolicyModal === 'haccp' && 'HACCP & Clean Kitchen Standards'}
              </h3>
              <button
                onClick={() => setActivePolicyModal(null)}
                className="w-8 h-8 rounded-full bg-[#f5ebd7] dark:bg-[#28221b] text-[#171513] dark:text-[#f5ebd7] flex items-center justify-center font-bold hover:bg-[#ebdcc5] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs leading-relaxed text-[#5a524a] dark:text-[#baa997] space-y-2 max-h-72 overflow-y-auto pr-1">
              {activePolicyModal === 'terms' && (
                <>
                  <p>
                    All dishes are baked to order in our 800°F+ refractory oak hearths. Orders enter preparation immediately upon dispatch from the patron interface.
                  </p>
                  <p>
                    Artisanal ingredients are sourced under genuine D.O.P. protocols from Caserta, Norcia, and Bologna. In accordance with haute dining integrity, refunds are processed immediately if thermal capsule criteria are breached.
                  </p>
                </>
              )}
              {activePolicyModal === 'privacy' && (
                <>
                  <p>
                    Caffè Bellissimo treats patron dietary profiles, allergy exclusions, and private residence coordinates with confidential military-grade encryption.
                  </p>
                  <p>
                    We never sell or distribute patron dining habits, transaction records, or address histories to 3rd-party advertisers.
                  </p>
                </>
              )}
              {activePolicyModal === 'thermal' && (
                <>
                  <p>
                    Our patent-pending heated thermal capsules employ ceramic phase-change cores preheated to 75°C.
                  </p>
                  <p>
                    Every order is accompanied by an electronic infrared temperature confirmation at your doorstep. If your pizza or pasta arrives below 60°C, the order is complimentary on the house.
                  </p>
                </>
              )}
              {activePolicyModal === 'haccp' && (
                <>
                  <p>
                    Our kitchen operates under strict FSSAI and European HACCP sanitation benchmarks.
                  </p>
                  <p>
                    All pizzaiolos and culinary brigade members undergo daily temperature and hygiene screenings. Our refractory stone domes undergo continuous 800°F sterilization.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-4 py-2 rounded-xl bg-[#781d18] text-[#dfc285] font-bold text-xs shadow-xs border border-[#c5a059]/40 cursor-pointer"
              >
                Close Charter
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
