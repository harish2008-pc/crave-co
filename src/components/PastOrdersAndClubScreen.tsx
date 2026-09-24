import React, { useState } from 'react';
import { Currency, RewardItem } from '../types';
import { REWARD_ITEMS, PAST_ORDERS_HISTORY, DISHES } from '../data/mockData';
import { 
  Award, 
  Sparkles, 
  Flame, 
  RotateCcw, 
  FileText, 
  Star, 
  ChevronRight, 
  Check, 
  Gift, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  SlidersHorizontal,
  Share2
} from 'lucide-react';
import { LoyaltyTierProgressBar } from './LoyaltyTierProgressBar';

interface PastOrdersAndClubScreenProps {
  userPoints: number;
  onDeductPoints: (pts: number) => void;
  currency: Currency;
  onTrackOrder: (orderId: string) => void;
  onReorder: (itemsText: string) => void;
  onOpenPreferences: () => void;
}

export const PastOrdersAndClubScreen: React.FC<PastOrdersAndClubScreenProps> = ({
  userPoints,
  onDeductPoints,
  currency,
  onTrackOrder,
  onReorder,
  onOpenPreferences,
}) => {
  const [rewards, setRewards] = useState<RewardItem[]>(REWARD_ITEMS);
  const [redeemedNotice, setRedeemedNotice] = useState<string | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const handleRedeem = (item: RewardItem) => {
    if (userPoints < item.pointsCost) {
      alert(`You need ${item.pointsCost - userPoints} more points to unlock this reward! Keep dining with Caffè Bellissimo.`);
      return;
    }
    onDeductPoints(item.pointsCost);
    setRewards(rewards.map((r) => r.id === item.id ? { ...r, unlocked: true } : r));
    setRedeemedNotice(`Unlocked "${item.title}"! Voucher applied to your bag.`);
    setTimeout(() => setRedeemedNotice(null), 4000);
  };

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText?.('https://caffebellissimo.dining/invite?code=ELENA500');
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Redeemed Toast Notice */}
      {redeemedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{redeemedNotice}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">Saved to Wallet</span>
        </div>
      )}

      {/* Elena Vance Profile Header Banner */}
      <div className="bg-white dark:bg-[#1a1714] rounded-3xl border border-[#ded5c4] dark:border-[#2d2720] p-6 sm:p-8 shadow-xs relative overflow-hidden font-serif transition-colors">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#c5a059]/15 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Profile Details */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                alt="Elena Vance"
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#c5a059] shadow-md"
              />
              <span className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#781d18] to-[#450e0a] text-[#dfc285] text-[10px] font-bold border border-[#c5a059]/40 flex items-center gap-1 shadow-sm font-display">
                <Star className="w-3 h-3 text-[#dfc285] fill-[#dfc285]" /> PRIVÉ
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#171513] dark:text-[#f5ebd7] tracking-tight">
                  Elena Vance
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-[#f5f0e6] dark:bg-[#2b1f1a] text-[#781d18] dark:text-[#dfc285] text-xs font-bold border border-[#c5a059]/40 flex items-center gap-1.5 font-serif">
                  <Award className="w-3.5 h-3.5 text-[#c5a059]" /> Connoisseur d'Argent
                </span>
              </div>
              <p className="text-xs text-[#5a524a] dark:text-[#a89b8c] mt-1">
                Top 5% Haute Gastronomie Patron &bull; Member since 2023 &bull; 24 Degustations Hosted
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] bg-[#f5f0e6] dark:bg-[#25201a] text-[#5a524a] dark:text-[#baa997] px-2.5 py-0.5 rounded-md border border-[#ded5c4] dark:border-[#383127]">
                  Vegetarian Lean &bull; Périgord Truffle & Burrata Aficionado
                </span>
                <button
                  onClick={onOpenPreferences}
                  className="text-[11px] font-bold text-[#781d18] dark:text-[#dfc285] hover:text-[#5c1511] dark:hover:text-[#f5d799] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <SlidersHorizontal className="w-3 h-3 text-[#c5a059]" /> Bespoke Dining Palette
                </button>
              </div>
            </div>
          </div>

          {/* Points Balance Card */}
          <div className="bg-gradient-to-br from-[#171513] via-[#211e1c] to-[#12100f] text-white p-6 rounded-2xl sm:min-w-[300px] shadow-xl border border-[#c5a059]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#dfc285] uppercase tracking-widest font-semibold font-display">
                Privé Dining Credits
              </span>
              <Sparkles className="w-4 h-4 text-[#c5a059]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                {userPoints.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-[#c5a059] font-display">PTS</span>
            </div>
            <div className="text-[11px] text-[#8c7e6f] mt-1">
              Privilege value: {currency === 'INR' ? `₹${Math.round(userPoints * 0.25)}` : `$${(userPoints * 0.0065).toFixed(2)}`} in cellar & table credits
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={handleCopyInvite}
                className="w-full py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#dfc285] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#c5a059]/30"
              >
                <Share2 className="w-3 h-3 text-[#c5a059]" />
                <span>{copiedInvite ? 'Privé Invitation Copied!' : 'Invite Gastronome (+500 pts)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar Component toward Next Loyalty Tier with Gold-Gradient */}
        <div className="mt-8 pt-6 border-t border-[#ded5c4] dark:border-[#2d2720]">
          <LoyaltyTierProgressBar userPoints={userPoints} />
        </div>
      </div>

      {/* Redeem Bellissimo Club Rewards Catalog */}
      <div className="space-y-4 font-serif">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#171513] dark:text-[#f5ebd7] tracking-tight">
              Collezione Privé • Cellar & Table Privileges
            </h2>
            <p className="text-xs text-[#5a524a] dark:text-[#a89b8c]">
              Spend your collected connoisseur points on rare Reserve labels, black truffle degustations, and kitchen privileges
            </p>
          </div>
          <span className="text-xs font-bold text-[#781d18] dark:text-[#dfc285] bg-[#f5ebd7] dark:bg-[#2e2119] border border-[#c5a059]/50 px-3.5 py-1 rounded-full font-display">
            Balance: {userPoints} PTS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map((item) => {
            const canAfford = userPoints >= item.pointsCost;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#1a1714] rounded-2xl border border-[#ded5c4] dark:border-[#2d2720] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#c5a059]/60 transition-all flex flex-col justify-between group"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#dfc285] text-[10px] font-bold border border-[#c5a059]/40 font-display">
                    {item.category}
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#781d18] to-[#50130f] text-[#dfc285] text-xs font-bold shadow-md border border-[#c5a059]/40 font-mono">
                    {item.pointsCost} PTS
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-[#171513] dark:text-[#f5ebd7] font-display">{item.title}</h3>
                    <p className="text-xs text-[#5a524a] dark:text-[#a89b8c] mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>

                  <button
                    id={`redeem-reward-${item.id}`}
                    onClick={() => handleRedeem(item)}
                    disabled={item.unlocked || !canAfford}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 font-serif tracking-wide ${
                      item.unlocked
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60'
                        : canAfford
                        ? 'bg-gradient-to-r from-[#781d18] to-[#5c1511] hover:from-[#601410] hover:to-[#450e0a] text-white shadow-md border border-[#c5a059]/40'
                        : 'bg-[#f5f0e6] dark:bg-[#231f1a] text-[#8c7e6f] dark:text-[#6a5e52] border border-[#ded5c4] dark:border-[#332b22] cursor-not-allowed'
                    }`}
                  >
                    {item.unlocked ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-700 dark:text-emerald-400" /> Unlocked in Carte
                      </>
                    ) : canAfford ? (
                      <>
                        <Gift className="w-3.5 h-3.5 text-[#dfc285]" /> Claim for {item.pointsCost} PTS
                      </>
                    ) : (
                      `Requires ${item.pointsCost - userPoints} more PTS`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past Orders & 1-Click Reorder */}
      <div className="space-y-4 font-serif">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#171513] dark:text-[#f5ebd7] tracking-tight">
              Historic Degustations & Instant Reorder
            </h2>
            <p className="text-xs text-[#5a524a] dark:text-[#a89b8c]">
              Re-fire your signature sourdough feasts with original culinary modifications in a single tap
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          {PAST_ORDERS_HISTORY.map((order) => {
            const isLive = order.isCurrent;
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-[#1a1714] rounded-2xl border border-[#ded5c4] dark:border-[#2d2720] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#c5a059]/60 hover:shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-bold text-xs text-[#171513] dark:text-[#f5ebd7]">
                      #{order.id.replace('CC-', 'CB-')}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isLive
                          ? 'bg-[#f5ebd7] dark:bg-[#34241a] text-[#781d18] dark:text-[#dfc285] border border-[#c5a059] animate-pulse font-display'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-sans'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs text-[#8c7e6f] dark:text-[#8d7f72]">• {order.date}</span>
                  </div>

                  <p className="text-xs text-[#171513] dark:text-[#e8dec8] font-medium mt-0.5 font-display">
                    {order.itemsText}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-[#5a524a] dark:text-[#a89b8c]">
                    <span>
                      Total: <strong className="font-sans text-[#171513] dark:text-[#f5ebd7]">{currency === 'INR' ? `₹${order.totalInr}` : `$${order.totalUsd.toFixed(2)}`}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-[#781d18] dark:text-[#dfc285] font-bold">+{order.pointsEarned} PTS Accrued</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {isLive ? (
                    <button
                      id={`track-order-${order.id}`}
                      onClick={() => onTrackOrder(order.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#781d18] to-[#5c1511] hover:from-[#601410] hover:to-[#450e0a] text-white text-xs font-bold flex items-center gap-2 shadow-md border border-[#c5a059]/40 transition-all cursor-pointer tracking-wide"
                    >
                      <span>Track VIP Dispatch</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#dfc285]" />
                    </button>
                  ) : (
                    <button
                      id={`reorder-btn-${order.id}`}
                      onClick={() => onReorder(order.itemsText)}
                      className="px-4 py-2 rounded-xl border border-[#c5a059]/70 bg-[#f5f0e6] dark:bg-[#25201a] hover:bg-[#781d18] hover:text-white dark:hover:bg-[#781d18] text-[#781d18] dark:text-[#dfc285] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs tracking-wide"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-fire Degustation</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
