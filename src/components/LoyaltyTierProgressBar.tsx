import React from 'react';
import { 
  Sparkles, 
  Award, 
  Crown, 
  Check, 
  Lock, 
  TrendingUp,
  Star,
  Zap,
  ArrowRight
} from 'lucide-react';

interface LoyaltyTierProgressBarProps {
  userPoints: number;
  className?: string;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  badge: string;
  minPoints: number;
  maxPoints: number;
  multiplier: string;
  keyPerk: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: 'Artigiano Bronze',
    badge: 'Bronze',
    minPoints: 0,
    maxPoints: 1000,
    multiplier: '1.0x',
    keyPerk: 'In-Room Gastronomia Access',
    icon: Award,
  },
  {
    id: 'silver',
    name: "Connoisseur d'Argent",
    badge: 'Silver',
    minPoints: 1000,
    maxPoints: 3000,
    multiplier: '1.15x',
    keyPerk: 'Périgord Truffle Priority & 1.15x Points',
    icon: Award,
  },
  {
    id: 'gold',
    name: "Épicurien d'Or",
    badge: 'Gold',
    minPoints: 3000,
    maxPoints: 5000,
    multiplier: '1.30x',
    keyPerk: 'Private Sommelier Tastings & Tableside Shaving',
    icon: Crown,
  },
  {
    id: 'diamond',
    name: 'Riserva Nera',
    badge: 'Apex',
    minPoints: 5000,
    maxPoints: 10000,
    multiplier: '1.50x',
    keyPerk: 'Executive Chef Degustations & Cellar Lockers',
    icon: Star,
  },
];

export const LoyaltyTierProgressBar: React.FC<LoyaltyTierProgressBarProps> = ({
  userPoints,
  className = '',
}) => {
  // Current tier is Silver (Connoisseur d'Argent) with range 1000 - 3000 PTS
  const currentTier = LOYALTY_TIERS[1]; // Connoisseur d'Argent
  const nextTier = LOYALTY_TIERS[2]; // Épicurien d'Or

  const tierMin = currentTier.minPoints; // 1000
  const tierMax = nextTier.minPoints; // 3000

  const pointsInCurrentTier = Math.max(0, userPoints - tierMin);
  const tierTotalSpan = tierMax - tierMin; // 2000
  const rawProgressPercent = (pointsInCurrentTier / tierTotalSpan) * 100;
  const progressPercent = Math.min(100, Math.max(0, Math.round(rawProgressPercent * 10) / 10));
  const pointsToNext = Math.max(0, tierMax - userPoints);

  const isNextTierUnlocked = userPoints >= tierMax;

  return (
    <div 
      id="loyalty-tier-progress-card"
      className={`rounded-2xl bg-gradient-to-br from-[#1c1815] via-[#221c17] to-[#171412] border border-[#3d3328] p-5 sm:p-6 shadow-xl relative overflow-hidden font-sans ${className}`}
    >
      {/* Background gold glow accent */}
      <div 
        className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-[#c5a059]/20 via-[#dfc285]/10 to-transparent rounded-full blur-3xl pointer-events-none" 
      />

      {/* Top Header Row: Current Level & Next Target */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        {/* Left: Current Tier Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a2219] to-[#3a2e20] border border-[#c5a059]/60 flex items-center justify-center text-[#dfc285] shadow-md shadow-black/40 shrink-0">
            <Award className="w-5 h-5 text-[#dfc285]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#a89b8c] font-semibold">
                Current Odyssey Tier
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#352719] text-[#dfc285] text-[10px] font-bold border border-[#c5a059]/40 font-mono">
                {currentTier.multiplier} Multiplier
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{currentTier.name}</span>
              <span className="text-xs text-[#dfc285] font-normal font-serif italic">
                (Silver Connoisseur)
              </span>
            </h3>
          </div>
        </div>

        {/* Right: Target & Points needed */}
        <div className="sm:text-right flex sm:flex-col items-baseline sm:items-end justify-between gap-1 bg-[#141210]/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border border-[#2e261e] sm:border-0">
          <div className="flex items-center gap-1.5 text-xs text-[#dfc285] font-semibold">
            <Crown className="w-3.5 h-3.5 text-[#dfc285]" />
            <span>Next: <strong>{nextTier.name}</strong></span>
          </div>
          <div className="text-xs text-[#a89b8c]">
            {isNextTierUnlocked ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Épicurien d'Or Attained!
              </span>
            ) : (
              <span>
                <strong className="text-white font-mono font-bold">{pointsToNext.toLocaleString()} PTS</strong> away
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative z-10 space-y-2 pt-1">
        {/* Progress Numbers & Percentage */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#a89b8c] font-medium flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Tier Progress: <strong className="text-[#dfc285] font-mono">{userPoints.toLocaleString()}</strong> / {tierMax.toLocaleString()} PTS</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#2a2218] border border-[#4a3c2b] text-[#dfc285] font-mono font-bold text-xs shadow-xs">
            {progressPercent}% Complete
          </span>
        </div>

        {/* The Visual Gold-Gradient Progress Bar Track */}
        <div 
          id="gold-progress-track"
          className="relative w-full h-4 rounded-full bg-[#12100e] border border-[#3d3328] p-0.5 shadow-inner overflow-visible"
        >
          {/* Subtle background striped guide marks for visual cadence */}
          <div className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(90deg,transparent,transparent_24px,rgba(255,255,255,0.03)_25px)] pointer-events-none" />

          {/* Filled Bar with Multi-Stop Gold Gradient & Luminous Glow */}
          <div
            id="gold-gradient-fill-bar"
            className="h-full rounded-full bg-gradient-to-r from-[#99732e] via-[#c5a059] via-[#e8cb8c] via-[#f7e4a8] to-[#dfb76c] shadow-[0_0_16px_rgba(223,194,133,0.4)] transition-all duration-1000 ease-out relative flex items-center justify-end"
            style={{ width: `${Math.max(4, progressPercent)}%` }}
          >
            {/* Glossy top highlight line on the gold bar */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full pointer-events-none" />

            {/* Glowing gold pointer diamond/pip at the head of progress */}
            <div className="w-3 h-3 rounded-full bg-[#fff4cc] border-2 border-[#b88c3a] shadow-[0_0_8px_#ffd573] translate-x-1.5 shrink-0 animate-pulse" />
          </div>
        </div>

        {/* Bottom Track Scale Labels */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#7d7164] pt-0.5 px-0.5">
          <span>{tierMin.toLocaleString()} PTS (Silver Entry)</span>
          <span className="text-[#c5a059] font-bold">2,000 PTS to advance</span>
          <span>{tierMax.toLocaleString()} PTS (Gold Gate)</span>
        </div>
      </div>

      {/* Tier Road-Map Milestones Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-[#2d251d]">
        {/* Tier 1: Artigiano Bronze (Completed) */}
        <div className="rounded-xl bg-[#171412]/80 border border-[#2b241c] p-3 text-left opacity-75">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c7e6f]">Tier 1</span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 font-sans">
              <Check className="w-3 h-3 stroke-[3]" /> Unlocked
            </span>
          </div>
          <div className="text-xs font-bold text-white mt-1">Artigiano Bronze</div>
          <div className="text-[10px] text-[#8c7e6f] font-mono mt-0.5">0 – 1,000 PTS</div>
          <div className="text-[10px] text-[#a89b8c] mt-2 line-clamp-1">
            Standard Hearth Carte & Digital Concierge
          </div>
        </div>

        {/* Tier 2: Connoisseur d'Argent (Active Status) */}
        <div className="rounded-xl bg-gradient-to-b from-[#2e2318] to-[#221a12] border-2 border-[#c5a059] p-3 text-left shadow-md relative">
          <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#781d18] to-[#992620] text-[#dfc285] text-[9px] font-extrabold uppercase tracking-wider border border-[#c5a059]/40 shadow-xs">
            Current Tier
          </span>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#dfc285]">Tier 2</span>
            <span className="text-[10px] text-[#dfc285] font-mono font-bold">1.15x Multiplier</span>
          </div>
          <div className="text-xs font-bold text-white mt-1 flex items-center gap-1">
            <span>Connoisseur d'Argent</span>
          </div>
          <div className="text-[10px] text-[#dfc285] font-mono mt-0.5 font-bold">
            1,000 – 3,000 PTS ({userPoints.toLocaleString()} PTS)
          </div>
          <div className="text-[10px] text-[#f5ebd7] mt-2 line-clamp-1 font-medium">
            Périgord Truffle Upgrades & Chauffeur Priority
          </div>
        </div>

        {/* Tier 3: Épicurien d'Or (Upcoming Target) */}
        <div className="rounded-xl bg-[#1a1613] border border-[#3d3328] hover:border-[#c5a059]/60 p-3 text-left transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1">
              <Crown className="w-3 h-3 text-[#c5a059]" /> Next Tier
            </span>
            <span className="text-[10px] text-[#c5a059] font-mono font-bold">1.30x Multiplier</span>
          </div>
          <div className="text-xs font-bold text-white mt-1 flex items-center gap-1">
            <span>Épicurien d'Or</span>
          </div>
          <div className="text-[10px] text-[#8c7e6f] font-mono mt-0.5">3,000+ PTS Gate</div>
          <div className="text-[10px] text-[#dfc285] mt-2 line-clamp-1 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>Sommelier Tastings & Tableside Shaving</span>
          </div>
        </div>
      </div>
    </div>
  );
};
