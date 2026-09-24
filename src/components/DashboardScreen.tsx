import React, { useState } from 'react';
import { Currency, Dish, Order } from '../types';
import { DISHES } from '../data/mockData';
import {
  Flame,
  Thermometer,
  Activity,
  TrendingUp,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Compass,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Utensils,
  Layers,
  ArrowUpRight,
  ShoppingBag,
  ChefHat,
  Sliders,
  Calendar,
  Heart,
  Star,
  Zap,
} from 'lucide-react';

interface DashboardScreenProps {
  currency: Currency;
  activeOrder: Order;
  userPoints: number;
  onNavigate: (screen: 'menu' | 'dashboard' | 'tracking' | 'club' | 'checkout') => void;
  onQuickAdd: (dish: Dish) => void;
  onOpenPreferences: () => void;
  onOpenAddressModal: () => void;
}

type TimeframeOption = 'today' | 'week' | 'month' | 'all';

interface HearthData {
  id: string;
  name: string;
  neighborhood: string;
  temperature: number;
  targetTemp: number;
  woodType: string;
  activeTickets: number;
  avgBakeMins: number;
  headPizzaiolo: string;
  thermalVaultsActive: number;
  status: 'optimal' | 'heating' | 'surging';
}

export function DashboardScreen({
  currency,
  activeOrder,
  userPoints,
  onNavigate,
  onQuickAdd,
  onOpenPreferences,
  onOpenAddressModal,
}: DashboardScreenProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('week');
  const [selectedHearthId, setSelectedHearthId] = useState<string>('hearth-indiranagar');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshPulseCount, setRefreshPulseCount] = useState(0);

  // Live Hearths State
  const [hearths, setHearths] = useState<HearthData[]>([
    {
      id: 'hearth-indiranagar',
      name: 'Hearth 01',
      neighborhood: 'Indiranagar 100ft Rd',
      temperature: 816,
      targetTemp: 815,
      woodType: 'Campanian Oak & Olivewood',
      activeTickets: 14,
      avgBakeMins: 14.2,
      headPizzaiolo: 'Maestro Marco D’Angelo',
      thermalVaultsActive: 16,
      status: 'optimal',
    },
    {
      id: 'hearth-lavelle',
      name: 'Hearth 02',
      neighborhood: 'Lavelle Road, Central',
      temperature: 824,
      targetTemp: 820,
      woodType: 'Tuscan Beech & Aged Oak',
      activeTickets: 8,
      avgBakeMins: 12.8,
      headPizzaiolo: 'Maestro Giuliano Conti',
      thermalVaultsActive: 11,
      status: 'optimal',
    },
    {
      id: 'hearth-koramangala',
      name: 'Hearth 03',
      neighborhood: 'Koramangala 4th Block',
      temperature: 811,
      targetTemp: 815,
      woodType: 'Sardinian Oak & Chestnut',
      activeTickets: 12,
      avgBakeMins: 15.0,
      headPizzaiolo: 'Maestro Stefano Rossi',
      thermalVaultsActive: 11,
      status: 'optimal',
    },
  ]);

  // Handle live temperature sensor refresh
  const handleRefreshSensors = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setHearths((prev) =>
        prev.map((h) => {
          const delta = Math.floor(Math.random() * 5) - 2;
          return {
            ...h,
            temperature: h.temperature + delta,
            activeTickets: Math.max(4, h.activeTickets + (Math.random() > 0.5 ? 1 : -1)),
          };
        })
      );
      setRefreshPulseCount((c) => c + 1);
      setIsRefreshing(false);
    }, 600);
  };

  const currentHearth = hearths.find((h) => h.id === selectedHearthId) || hearths[0];

  // Dynamic stats based on timeframe
  const timeframeStats = {
    today: {
      ordersCount: 2,
      spendInr: 1848,
      spendUsd: 23.5,
      pointsEarned: 180,
      avgDeliveryTemp: '64.1°C',
      topDish: 'Truffle & Wild Mushroom Pizza',
    },
    week: {
      ordersCount: 7,
      spendInr: 6420,
      spendUsd: 81.5,
      pointsEarned: 640,
      avgDeliveryTemp: '63.8°C',
      topDish: 'Hand-Rolled Truffle Tagliolini',
    },
    month: {
      ordersCount: 19,
      spendInr: 18450,
      spendUsd: 232.0,
      pointsEarned: 1840,
      avgDeliveryTemp: '63.6°C',
      topDish: 'Truffle & Wild Mushroom Pizza',
    },
    all: {
      ordersCount: 38,
      spendInr: 34290,
      spendUsd: 435.0,
      pointsEarned: 3420,
      avgDeliveryTemp: '63.7°C',
      topDish: 'Bronte Pistachio & Mortadella',
    },
  }[timeframe];

  // Favorite patron dishes with quick reorder
  const favoriteDishes = [
    { dish: DISHES[0], orderCount: 9, note: 'Extra black truffle shavings' }, // Truffle mushroom pizza
    { dish: DISHES[5], orderCount: 7, note: 'Cooked perfectly al dente' }, // Hand-rolled tagliolini
    { dish: DISHES[14], orderCount: 5, note: 'Whole cold burrata center' }, // Bronte pistachio & mortadella
    { dish: DISHES[23], orderCount: 4, note: 'Fiery Calabrian hot honey glaze' }, // Calabrian hot honey wings
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Executive Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1714] via-[#241e19] to-[#120f0d] text-[#f4efe6] p-6 sm:p-8 lg:p-10 border-2 border-[#c5a059]/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#c5a059]/15 via-transparent to-transparent rounded-full pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#781d18]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#dfc285] font-sans tracking-widest uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#dfc285]" />
              <span>Pannello Esecutivo &bull; Kitchen &amp; Patron Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              Bentornata, <span className="text-[#dfc285]">Elena Vance</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#baa997] max-w-2xl leading-relaxed">
              Real-time hearth refractory telemetry, 72-hour sourdough fermentation tracking, and personalized Milanese gastronomy analytics.
            </p>
          </div>

          {/* Timeframe Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center bg-[#12100e]/80 p-1.5 rounded-2xl border border-[#c5a059]/30">
            {(['today', 'week', 'month', 'all'] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer font-sans ${
                  timeframe === tf
                    ? 'bg-[#781d18] text-[#dfc285] shadow-md border border-[#c5a059]/60 font-bold'
                    : 'text-[#c7bcae] hover:text-white hover:bg-white/5'
                }`}
              >
                {tf === 'today' && 'Oggi (Today)'}
                {tf === 'week' && 'Settimana (Week)'}
                {tf === 'month' && 'Mese (Month)'}
                {tf === 'all' && 'Tutte le Visite (All Time)'}
              </button>
            ))}
          </div>
        </div>

        {/* Live Status Kicker Strip */}
        <div className="mt-8 pt-6 border-t border-[#c5a059]/20 flex flex-wrap items-center justify-between gap-4 text-xs text-[#c7bcae]">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[#f4efe6] font-semibold">3 Active Hearths at 815°F+</span>
            </div>
            <span className="hidden sm:inline text-white/30">&bull;</span>
            <div className="flex items-center gap-1.5 text-[#dfc285]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Thermal Capsule Lock (&gt;60°C Verified)</span>
            </div>
            <span className="hidden sm:inline text-white/30">&bull;</span>
            <div className="flex items-center gap-1.5 text-[#f4efe6]">
              <Award className="w-4 h-4 text-[#c5a059]" />
              <span>Silver Privé Member ({userPoints.toLocaleString()} Points)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshSensors}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#dfc285] border border-[#c5a059]/40 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Polling Sensors...' : 'Pulse Telemetry'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Artisanal Orders & Volume */}
        <div className="bg-white dark:bg-[#191714] rounded-2xl p-5 border border-[#ded5c4] dark:border-[#322c24] shadow-xs hover:border-[#c5a059]/60 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8c7e6f] dark:text-[#a89b8c]">
            <span className="uppercase tracking-wider font-sans font-semibold">Artisanal Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#f5ebd7] dark:bg-[#2b2219] text-[#781d18] dark:text-[#dfc285] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171513] dark:text-[#f5ebd7] font-display">
              {timeframeStats.ordersCount} <span className="text-xs font-normal text-[#8c7e6f] dark:text-[#a89b8c]">dispatches</span>
            </div>
            <div className="mt-1 text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>100% on-time Chauffeur delivery</span>
            </div>
          </div>
        </div>

        {/* Card 2: Cumulative Spend in active currency */}
        <div className="bg-white dark:bg-[#191714] rounded-2xl p-5 border border-[#ded5c4] dark:border-[#322c24] shadow-xs hover:border-[#c5a059]/60 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8c7e6f] dark:text-[#a89b8c]">
            <span className="uppercase tracking-wider font-sans font-semibold">Gastronomic Spend</span>
            <div className="w-8 h-8 rounded-lg bg-[#f5ebd7] dark:bg-[#2b2219] text-[#781d18] dark:text-[#dfc285] flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171513] dark:text-[#f5ebd7] font-display">
              {currency === 'INR' ? `₹${timeframeStats.spendInr.toLocaleString()}` : `$${timeframeStats.spendUsd.toFixed(2)}`}
            </div>
            <div className="mt-1 text-xs text-[#8c7e6f] dark:text-[#baa997]">
              +{timeframeStats.pointsEarned} Privé points accrued
            </div>
          </div>
        </div>

        {/* Card 3: Thermal Integrity Index */}
        <div className="bg-white dark:bg-[#191714] rounded-2xl p-5 border border-[#ded5c4] dark:border-[#322c24] shadow-xs hover:border-[#c5a059]/60 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8c7e6f] dark:text-[#a89b8c]">
            <span className="uppercase tracking-wider font-sans font-semibold">Doorstep Temperature</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 dark:text-emerald-400 font-display">
              {timeframeStats.avgDeliveryTemp}
            </div>
            <div className="mt-1 text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complies with &gt;60°C Hearth Charter</span>
            </div>
          </div>
        </div>

        {/* Card 4: Fermentation Maturity */}
        <div className="bg-white dark:bg-[#191714] rounded-2xl p-5 border border-[#ded5c4] dark:border-[#322c24] shadow-xs hover:border-[#c5a059]/60 transition-all">
          <div className="flex items-center justify-between text-xs text-[#8c7e6f] dark:text-[#a89b8c]">
            <span className="uppercase tracking-wider font-sans font-semibold">72h Sourdough Vault</span>
            <div className="w-8 h-8 rounded-lg bg-[#f5ebd7] dark:bg-[#2b2219] text-[#781d18] dark:text-[#dfc285] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#781d18] dark:text-[#dfc285] font-display">
              68h / 72h
            </div>
            <div className="mt-1 text-xs text-[#8c7e6f] dark:text-[#baa997]">
              Batch #F-72-B &bull; 78% Hydration Poolish
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Operational Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Hearth Telemetry & Active Kitchen Operations */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-[#191714] rounded-3xl border border-[#ded5c4] dark:border-[#322c24] p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#171513] dark:text-[#f5ebd7] font-display flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#781d18] dark:text-[#dfc285]" />
                  <span>Oak Hearth Live Telemetry</span>
                </h2>
                <p className="text-xs text-[#8c7e6f] dark:text-[#a89b8c] mt-0.5">
                  Laser pyrometer readings from our 800°F+ refractory brick dome ovens.
                </p>
              </div>

              {/* Hearth Selector Tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#f5f0e6] dark:bg-[#231f1b] rounded-xl border border-[#ded5c4] dark:border-[#38322a]">
                {hearths.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHearthId(h.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer font-sans ${
                      selectedHearthId === h.id
                        ? 'bg-[#171513] dark:bg-[#11100e] text-[#dfc285] shadow-xs'
                        : 'text-[#5a524a] dark:text-[#a89b8c] hover:text-[#171513] dark:hover:text-white'
                    }`}
                  >
                    {h.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Hearth Showcase Box */}
            <div className="rounded-2xl bg-gradient-to-br from-[#faf7f2] to-[#f4eee4] dark:from-[#211d19] dark:to-[#171513] border border-[#c5a059]/40 p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ded5c4] dark:border-[#322c24] pb-4">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#781d18] dark:text-[#dfc285] block">
                    {currentHearth.neighborhood}
                  </span>
                  <div className="text-lg font-bold text-[#171513] dark:text-[#f5ebd7] font-display">
                    {currentHearth.name} &bull; {currentHearth.headPizzaiolo}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[#8c7e6f] dark:text-[#a89b8c] block font-sans">Dome Temp</span>
                    <span className="text-2xl font-black text-[#781d18] dark:text-[#dfc285] font-mono">
                      {currentHearth.temperature}°F
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#781d18] to-[#9e2720] text-[#dfc285] flex items-center justify-center shadow-md">
                    <Flame className="w-5 h-5 fill-[#dfc285]" />
                  </div>
                </div>
              </div>

              {/* Hearth Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-[#1a1714] border border-[#ded5c4] dark:border-[#2d2720]">
                  <span className="text-[10px] text-[#8c7e6f] dark:text-[#a89b8c] block uppercase font-sans">Wood Blend</span>
                  <span className="font-semibold text-[#171513] dark:text-[#f5ebd7] mt-0.5 block truncate">
                    {currentHearth.woodType}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#1a1714] border border-[#ded5c4] dark:border-[#2d2720]">
                  <span className="text-[10px] text-[#8c7e6f] dark:text-[#a89b8c] block uppercase font-sans">Active Tickets</span>
                  <span className="font-semibold text-[#171513] dark:text-[#f5ebd7] mt-0.5 block">
                    {currentHearth.activeTickets} orders in queue
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#1a1714] border border-[#ded5c4] dark:border-[#2d2720]">
                  <span className="text-[10px] text-[#8c7e6f] dark:text-[#a89b8c] block uppercase font-sans">Bake Velocity</span>
                  <span className="font-semibold text-[#171513] dark:text-[#f5ebd7] mt-0.5 block">
                    {currentHearth.avgBakeMins} min avg
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#1a1714] border border-[#ded5c4] dark:border-[#2d2720]">
                  <span className="text-[10px] text-[#8c7e6f] dark:text-[#a89b8c] block uppercase font-sans">Thermal Fleet</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                    {currentHearth.thermalVaultsActive} dispatched
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Bar for Kitchen Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => onNavigate('menu')}
                className="p-3.5 rounded-xl bg-[#f5f0e6] dark:bg-[#231f1b] hover:bg-[#ece4d6] dark:hover:bg-[#2a2520] border border-[#ded5c4] dark:border-[#38322a] text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">Browse Menu</span>
                  <ArrowUpRight className="w-4 h-4 text-[#8c7e6f] group-hover:text-[#781d18] dark:group-hover:text-[#dfc285] transition-colors" />
                </div>
                <span className="text-[11px] text-[#8c7e6f] dark:text-[#a89b8c] block mt-0.5">Explore 34 hearth dishes</span>
              </button>

              <button
                onClick={() => onNavigate('tracking')}
                className="p-3.5 rounded-xl bg-[#f5f0e6] dark:bg-[#231f1b] hover:bg-[#ece4d6] dark:hover:bg-[#2a2520] border border-[#ded5c4] dark:border-[#38322a] text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">Live Chauffeur</span>
                  <ArrowUpRight className="w-4 h-4 text-[#8c7e6f] group-hover:text-[#781d18] dark:group-hover:text-[#dfc285] transition-colors" />
                </div>
                <span className="text-[11px] text-[#8c7e6f] dark:text-[#a89b8c] block mt-0.5">Track Order #{activeOrder.orderNumber}</span>
              </button>

              <button
                onClick={() => onNavigate('club')}
                className="p-3.5 rounded-xl bg-[#f5f0e6] dark:bg-[#231f1b] hover:bg-[#ece4d6] dark:hover:bg-[#2a2520] border border-[#ded5c4] dark:border-[#38322a] text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">Bellissimo Privé</span>
                  <ArrowUpRight className="w-4 h-4 text-[#8c7e6f] group-hover:text-[#781d18] dark:group-hover:text-[#dfc285] transition-colors" />
                </div>
                <span className="text-[11px] text-[#8c7e6f] dark:text-[#a89b8c] block mt-0.5">Redeem {userPoints} points</span>
              </button>
            </div>
          </div>

          {/* Chef Matteo Rossi's Daily Kitchen Log */}
          <div className="bg-white dark:bg-[#191714] rounded-3xl border border-[#ded5c4] dark:border-[#322c24] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#781d18] text-[#dfc285] flex items-center justify-center font-bold text-sm border border-[#c5a059]">
                MR
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#171513] dark:text-[#f5ebd7] font-display">
                  Diario dello Chef &bull; Executive Pizzaiolo Matteo Rossi
                </h3>
                <span className="text-[11px] text-[#8c7e6f] dark:text-[#a89b8c]">
                  Morning Harvest Log &bull; Indiranagar Hearth
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf7f2] dark:bg-[#201d19] border border-[#ded5c4] dark:border-[#2d2720] text-xs leading-relaxed text-[#5a524a] dark:text-[#baa997]">
              &ldquo;This morning’s air shipment of whole wild porcini mushrooms arrived from Piedmont in pristine condition. Our 72-hour biga sourdough is demonstrating a robust, open honeycomb crumb with gentle lacto-fermentation notes. All three refractory brick ovens have reached stable oak hearth combustion at 815°F+.&rdquo;
            </div>
          </div>
        </div>

        {/* Right Column: Elena's Favorite Masterpieces & Quick Reorder */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#191714] rounded-3xl border border-[#ded5c4] dark:border-[#322c24] p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#171513] dark:text-[#f5ebd7] font-display flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#c5a059] fill-[#c5a059]" />
                  <span>Elena’s Frequent Masterpieces</span>
                </h2>
                <p className="text-xs text-[#8c7e6f] dark:text-[#a89b8c] mt-0.5">
                  One-click re-staging into your culinary bag.
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {favoriteDishes.map(({ dish, orderCount, note }) => (
                <div
                  key={dish.id}
                  className="p-3.5 rounded-2xl bg-[#faf7f2] dark:bg-[#201c18] border border-[#ded5c4] dark:border-[#2f2922] flex items-center justify-between gap-3 hover:border-[#c5a059]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-[#ded5c4] dark:border-[#38322a] shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">
                        {dish.name}
                      </div>
                      <div className="text-[11px] text-[#781d18] dark:text-[#dfc285] font-semibold mt-0.5">
                        {currency === 'INR' ? `₹${dish.priceInr}` : `$${dish.priceUsd.toFixed(2)}`}
                        <span className="text-[#8c7e6f] dark:text-[#a89b8c] font-normal"> &bull; Ordered {orderCount}×</span>
                      </div>
                      <span className="text-[10px] text-[#8c7e6f] dark:text-[#a89b8c] block mt-0.5 italic">
                        {note}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onQuickAdd(dish)}
                    className="p-2.5 rounded-xl bg-[#781d18] hover:bg-[#601511] text-[#dfc285] text-xs font-bold shadow-xs border border-[#c5a059]/40 flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer"
                    title={`Add ${dish.name} to bag`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Flavor Terroir & Dietary Preference Matrix */}
          <div className="bg-white dark:bg-[#191714] rounded-3xl border border-[#ded5c4] dark:border-[#322c24] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#171513] dark:text-[#f5ebd7] font-display flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#781d18] dark:text-[#dfc285]" />
                <span>Terroir &amp; Ingredient Matrix</span>
              </h3>
              <button
                onClick={onOpenPreferences}
                className="text-xs text-[#781d18] dark:text-[#dfc285] font-semibold hover:underline cursor-pointer"
              >
                Edit Preferences
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-[#8c7e6f] dark:text-[#a89b8c] text-[11px] mb-1">
                  <span>Norcia Black Summer Truffle</span>
                  <span className="font-semibold text-[#171513] dark:text-[#f5ebd7]">42% frequency</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#ded5c4] dark:bg-[#2d2720] overflow-hidden">
                  <div className="h-full bg-[#781d18] dark:bg-[#c5a059] rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#8c7e6f] dark:text-[#a89b8c] text-[11px] mb-1">
                  <span>72h Sourdough Hearth Fermentation</span>
                  <span className="font-semibold text-[#171513] dark:text-[#f5ebd7]">30% frequency</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#ded5c4] dark:bg-[#2d2720] overflow-hidden">
                  <div className="h-full bg-[#c5a059] rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#8c7e6f] dark:text-[#a89b8c] text-[11px] mb-1">
                  <span>Campania Buffalo Burrata D.O.P.</span>
                  <span className="font-semibold text-[#171513] dark:text-[#f5ebd7]">18% frequency</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#ded5c4] dark:bg-[#2d2720] overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#ded5c4] dark:border-[#2d2720] flex items-center justify-between text-[11px] text-[#8c7e6f] dark:text-[#a89b8c]">
              <span>Primary Residence Drop Point</span>
              <button
                onClick={onOpenAddressModal}
                className="font-bold text-[#171513] dark:text-[#f5ebd7] hover:text-[#781d18] dark:hover:text-[#dfc285] cursor-pointer"
              >
                Pentas Penthouse, 100ft Rd &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
