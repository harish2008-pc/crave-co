import React, { useState } from 'react';
import { CartItem, Currency } from '../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  Tag, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  Check 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('BELLISSIMO25');
  const [isPromoApplied, setIsPromoApplied] = useState(true);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Pricing calculations
  const calculateItemPrice = (item: CartItem) => {
    const base = currency === 'INR' ? item.dish.priceInr : item.dish.priceUsd;
    const crust = item.selectedCrust ? (currency === 'INR' ? item.selectedCrust.priceInr : item.selectedCrust.priceUsd) : 0;
    const addOns = item.selectedAddOns.reduce((s, a) => s + (currency === 'INR' ? a.priceInr : a.priceUsd), 0);
    const pairings = item.selectedPairings.reduce((s, p) => s + (currency === 'INR' ? p.priceInr : p.priceUsd), 0);
    return (base + crust + addOns + pairings) * item.quantity;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  
  // Free delivery threshold: ₹999 or $30
  const freeThreshold = currency === 'INR' ? 999 : 30;
  const isFreeDelivery = subtotal >= freeThreshold;
  const deliveryFee = isFreeDelivery || subtotal === 0 ? 0 : (currency === 'INR' ? 60 : 3.5);
  
  const discountAmount = isPromoApplied ? subtotal * 0.25 : 0;
  const taxAmount = (subtotal - discountAmount) * 0.05;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee + taxAmount);
  const pointsEarned = Math.round(grandTotal * (currency === 'INR' ? 0.1 : 3.5));

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'BELLISSIMO25' || code === 'CRAVE25') {
      setIsPromoApplied(true);
      setPromoError('');
    } else {
      setIsPromoApplied(false);
      setPromoError('Invalid promo code. Try BELLISSIMO25');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#faf7f2] dark:bg-[#141210] h-full shadow-2xl flex flex-col justify-between border-l-2 border-[#c5a059]/40 animate-in slide-in-from-right duration-250 font-serif transition-colors"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#191714] border-b border-[#ded5c4] dark:border-[#2d2720] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#781d18] to-[#4a100c] text-[#dfc285] flex items-center justify-center font-bold border border-[#c5a059]/40 shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#171513] dark:text-[#f5ebd7] font-display">La Tua Degustazione</h2>
              <span className="text-xs text-[#8c7e6f] dark:text-[#baa997]">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} artisanal selections
              </span>
            </div>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#8c7e6f] dark:text-[#baa997] hover:bg-[#ede7dc] dark:hover:bg-[#25211c] hover:text-[#171513] dark:hover:text-[#f5ebd7] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        <div className="bg-[#f5f0e6] dark:bg-[#1a1815] px-4 py-2.5 border-b border-[#ded5c4] dark:border-[#2d2720] text-xs">
          {isFreeDelivery ? (
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold">
              <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Complimentary Concierge Thermal Chauffeur Unlocked</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between text-[#5a524a] dark:text-[#baa997]">
                <span>Add {currency === 'INR' ? `₹${freeThreshold - subtotal}` : `$${(freeThreshold - subtotal).toFixed(2)}`} for Complimentary Chauffeur</span>
                <span className="font-bold text-[#781d18] dark:text-[#dfc285]">{Math.round((subtotal / freeThreshold) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#ded5c4] dark:bg-[#2d2720] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#781d18] to-[#c5a059] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#ede7dc] dark:bg-[#25211c] text-[#8c7e6f] dark:text-[#dfc285] flex items-center justify-center mx-auto border border-[#ded5c4] dark:border-[#38322a]">
                <ShoppingBag className="w-6 h-6 text-[#c5a059]" />
              </div>
              <h3 className="font-bold text-sm text-[#171513] dark:text-[#f5ebd7] font-display">Your Degustation Bag is Empty</h3>
              <p className="text-xs text-[#5a524a] dark:text-[#baa997] max-w-xs mx-auto">
                Explore our 72-hour naturally fermented pizzas, Perigord truffle dishes, and house-made pasta.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 rounded-xl bg-[#781d18] text-white font-bold text-xs cursor-pointer shadow-sm border border-[#c5a059]/40 font-serif"
              >
                Explore La Carte
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-white dark:bg-[#191714] rounded-xl border border-[#ded5c4] dark:border-[#322c24] p-3.5 shadow-xs space-y-2.5 hover:border-[#c5a059]/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <img
                      src={item.dish.image}
                      alt={item.dish.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-lg object-cover border border-[#ded5c4] dark:border-[#38322a]"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-[#171513] dark:text-[#f5ebd7] font-display">{item.dish.name}</h4>
                      {item.selectedCrust && (
                        <p className="text-[10px] text-[#781d18] dark:text-[#dfc285] font-bold mt-0.5">
                          {item.selectedCrust.name}
                        </p>
                      )}
                      <span className="font-bold text-xs text-[#171513] dark:text-[#f5ebd7] mt-1 block font-sans">
                        {currency === 'INR'
                          ? `₹${Math.round(calculateItemPrice(item))}`
                          : `$${calculateItemPrice(item).toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.cartItemId)}
                    className="text-[#8c7e6f] dark:text-[#baa997] hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Selected Add-ons & Pairings list */}
                {(item.selectedAddOns.length > 0 || item.selectedPairings.length > 0 || item.cookingInstructions.length > 0) && (
                  <div className="pt-2 border-t border-[#ede7dc] dark:border-[#2a251e] text-[10px] text-[#5a524a] dark:text-[#baa997] space-y-0.5">
                    {item.selectedAddOns.map((a) => (
                      <div key={a.id} className="flex justify-between">
                        <span>+ {a.name}</span>
                        <span className="font-sans">{currency === 'INR' ? `₹${a.priceInr}` : `$${a.priceUsd.toFixed(2)}`}</span>
                      </div>
                    ))}
                    {item.selectedPairings.map((p) => (
                      <div key={p.id} className="flex justify-between text-[#781d18] dark:text-[#dfc285]">
                        <span>+ {p.name}</span>
                        <span className="font-sans">{currency === 'INR' ? `₹${p.priceInr}` : `$${p.priceUsd.toFixed(2)}`}</span>
                      </div>
                    ))}
                    {item.cookingInstructions.map((inst, i) => (
                      <div key={i} className="text-[#8c7e6f] dark:text-[#a89b8d] italic">
                        Nota dello Chef: {inst}
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity adjuster */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#8c7e6f] dark:text-[#a89b8d]">Porzioni</span>
                  <div className="flex items-center border border-[#ded5c4] dark:border-[#38322a] rounded-lg bg-[#f5f0e6] dark:bg-[#231f1c]">
                    <button
                      onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#171513] dark:text-[#f5ebd7] hover:bg-[#ede7dc] dark:hover:bg-[#2c2722] rounded-l-lg cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-sans">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#171513] dark:text-[#f5ebd7] hover:bg-[#ede7dc] dark:hover:bg-[#2c2722] rounded-r-lg cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo code & Totals Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-white dark:bg-[#191714] border-t-2 border-[#ded5c4] dark:border-[#2d2720] space-y-3 shrink-0">
            {/* Promo Code Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-[#8c7e6f] dark:text-[#a89b8d] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter BELLISSIMO25"
                  className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-[#ded5c4] dark:border-[#38322a] bg-white dark:bg-[#231f1c] text-xs uppercase font-mono font-bold text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059]"
                />
              </div>
              <button
                onClick={handleApplyPromo}
                className="px-3.5 py-1.5 rounded-lg bg-[#f5f0e6] dark:bg-[#231f1c] hover:bg-[#ede7dc] dark:hover:bg-[#2c2722] border border-[#ded5c4] dark:border-[#38322a] text-xs font-bold text-[#171513] dark:text-[#f5ebd7] transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            {isPromoApplied && (
              <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800/50">
                <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Privé Privilege {promoCode.toUpperCase()} applied: 25% Off Carte</span>
              </div>
            )}
            {promoError && (
              <div className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                {promoError}
              </div>
            )}

            {/* Bill breakdown */}
            <div className="space-y-1.5 text-xs text-[#5a524a] dark:text-[#baa997] border-t border-[#ede7dc] dark:border-[#2a251e] pt-2">
              <div className="flex justify-between">
                <span>Degustation Subtotal</span>
                <span className="font-sans">{currency === 'INR' ? `₹${Math.round(subtotal)}` : `$${subtotal.toFixed(2)}`}</span>
              </div>
              {isPromoApplied && (
                <div className="flex justify-between text-emerald-800 dark:text-emerald-400 font-semibold">
                  <span>Privé Privilege (25%)</span>
                  <span className="font-sans">-{currency === 'INR' ? `₹${Math.round(discountAmount)}` : `$${discountAmount.toFixed(2)}`}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Thermal Chauffeur Dispatch</span>
                <span>{deliveryFee === 0 ? 'COMPLIMENTARY' : currency === 'INR' ? `₹${deliveryFee}` : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Gastronomy Tax & Insulated Velvet Pod (5%)</span>
                <span className="font-sans">{currency === 'INR' ? `₹${Math.round(taxAmount)}` : `$${taxAmount.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#171513] dark:text-[#f5ebd7] pt-1.5 border-t border-[#ded5c4] dark:border-[#2d2720]">
                <span className="font-display">Total Amount</span>
                <span className="text-base text-[#781d18] dark:text-[#dfc285] font-display font-bold">
                  {currency === 'INR' ? `₹${Math.round(grandTotal)}` : `$${grandTotal.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="cart-checkout-proceed-btn"
              onClick={onCheckout}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#781d18] to-[#5c1511] hover:from-[#601410] hover:to-[#450e0a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#781d18]/25 border border-[#c5a059]/40 transition-all hover:scale-101 cursor-pointer font-serif tracking-wide"
            >
              <span>Proceed to Bespoke Checkout • {currency === 'INR' ? `₹${Math.round(grandTotal)}` : `$${grandTotal.toFixed(2)}`}</span>
              <ArrowRight className="w-4 h-4 text-[#dfc285]" />
            </button>
            <div className="text-[10px] text-center text-[#8c7e6f] dark:text-[#a89b8d] flex items-center justify-center gap-1.5 font-serif">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Certified 60°C Refractory Thermal Retention Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
