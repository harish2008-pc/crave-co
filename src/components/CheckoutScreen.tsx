import React, { useState } from 'react';
import { 
  CartItem, 
  Currency, 
  DeliveryAddress, 
  Order, 
  DeliverySpeed, 
  PackagingOption, 
  PaymentMethodCategory,
  SavedCard 
} from '../types';
import { INITIAL_DELIVERY_ADDRESSES, SAVED_CARDS, PACKAGING_OPTIONS, ACTIVE_ORDER } from '../data/mockData';
import { 
  MapPin, 
  Plus, 
  Check, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Wallet, 
  Building2, 
  Clock, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  Edit3, 
  KeyRound, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Users, 
  Lock, 
  Zap, 
  Gift, 
  Leaf, 
  Award, 
  Phone, 
  Tag, 
  Radio, 
  Truck,
  HelpCircle,
  Banknote
} from 'lucide-react';
import { AddressModal } from './AddressModal';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  currency: Currency;
  userPoints: number;
  onPlaceOrder: (order: Order, pointsDeducted: number) => void;
  onBackToMenu: () => void;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cartItems,
  currency,
  userPoints,
  onPlaceOrder,
  onBackToMenu,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  // Addresses
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(INITIAL_DELIVERY_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    INITIAL_DELIVERY_ADDRESSES.find((a) => a.isDefault)?.id || INITIAL_DELIVERY_ADDRESSES[0].id
  );
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<DeliveryAddress | null>(null);

  // Delivery Speed & Scheduling
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>('express');
  const [scheduledTime, setScheduledTime] = useState('Today, 8:45 PM');
  const [useSecretPin, setUseSecretPin] = useState(true);

  // Packaging Option
  const [selectedPackaging, setSelectedPackaging] = useState<'eco' | 'luxury_seal' | 'minimal'>('eco');
  const [includeCutlery, setIncludeCutlery] = useState(false);

  // Tip
  const [tipAmount, setTipAmount] = useState<number>(50); // Default ₹50 or ~$2
  const [customTip, setCustomTip] = useState<string>('');
  const [tipToCourier, setTipToCourier] = useState(true);

  // Bellissimo Club Points Burn
  const [redeemedPoints, setRedeemedPoints] = useState<number>(500); // 500 pts = ₹100 or $3

  // Promo Code
  const [promoCode, setPromoCode] = useState('BELLISSIMO25');
  const [isPromoApplied, setIsPromoApplied] = useState(true);
  const [promoMessage, setPromoMessage] = useState('Code BELLISSIMO25 applied: 25% Off Hearth Feast');

  // Payment State
  const [paymentCategory, setPaymentCategory] = useState<PaymentMethodCategory>('upi');
  
  // UPI State
  const [upiOption, setUpiOption] = useState<'qr' | 'gpay' | 'phonepe' | 'paytm' | 'cred' | 'vpa'>('qr');
  const [customVpa, setCustomVpa] = useState('elena.vance@okaxis');
  const [isQrScanned, setIsQrScanned] = useState(false);

  // Card State
  const [savedCards, setSavedCards] = useState<SavedCard[]>(SAVED_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string>(SAVED_CARDS[0].id);
  const [cardCvv, setCardCvv] = useState<string>('482');
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('ELENA VANCE');
  const [newCardExpiry, setNewCardExpiry] = useState('12/28');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [enableEmi, setEnableEmi] = useState(false);
  const [selectedEmiTenure, setSelectedEmiTenure] = useState<'3' | '6'>('3');

  // NetBanking State
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // COD State
  const [needChange, setNeedChange] = useState(false);

  // Split Bill State
  const [splitDiners, setSplitDiners] = useState<number>(1);
  const [isSplitCopied, setIsSplitCopied] = useState(false);

  // Submitting Animation
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const calculateItemPrice = (item: CartItem) => {
    const base = currency === 'INR' ? item.dish.priceInr : item.dish.priceUsd;
    const crust = item.selectedCrust ? (currency === 'INR' ? item.selectedCrust.priceInr : item.selectedCrust.priceUsd) : 0;
    const addOns = item.selectedAddOns.reduce((s, a) => s + (currency === 'INR' ? a.priceInr : a.priceUsd), 0);
    const pairings = item.selectedPairings.reduce((s, p) => s + (currency === 'INR' ? p.priceInr : p.priceUsd), 0);
    return (base + crust + addOns + pairings) * item.quantity;
  };

  const rawSubtotal = cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  
  // Free delivery threshold
  const freeThreshold = currency === 'INR' ? 999 : 30;
  const isFreeDelivery = rawSubtotal >= freeThreshold;
  const baseDeliveryFee = isFreeDelivery || rawSubtotal === 0 ? 0 : (currency === 'INR' ? 60 : 3.5);
  
  // Speed fee
  const speedFee = deliverySpeed === 'express' ? (currency === 'INR' ? 39 : 1.5) : 0;
  
  // Packaging fee
  const packagingOption = PACKAGING_OPTIONS.find((p) => p.id === selectedPackaging);
  const packagingFee = packagingOption ? (currency === 'INR' ? packagingOption.priceInr : packagingOption.priceUsd) : 0;

  // Discounts
  const promoDiscount = isPromoApplied ? rawSubtotal * 0.25 : 0;
  
  // Points Discount: 100 points = ₹20 or $0.60
  const pointsDiscountValue = currency === 'INR' ? (redeemedPoints / 100) * 20 : (redeemedPoints / 100) * 0.6;
  
  // Taxes: 5% on discounted subtotal
  const taxableAmount = Math.max(0, rawSubtotal - promoDiscount - pointsDiscountValue);
  const taxAmount = taxableAmount * 0.05;

  // Tip calculation
  const tipValue = customTip !== '' ? Number(customTip) || 0 : (currency === 'INR' ? tipAmount : tipAmount / 35);

  // Grand Total
  const grandTotal = Math.max(
    0,
    rawSubtotal - promoDiscount - pointsDiscountValue + baseDeliveryFee + speedFee + packagingFee + taxAmount + tipValue
  );

  const pointsToEarn = Math.round(grandTotal * (currency === 'INR' ? 0.1 : 3.5));

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  // Address Handlers
  const handleSaveAddress = (newAddr: DeliveryAddress) => {
    setAddresses((prev) => {
      const exists = prev.some((a) => a.id === newAddr.id);
      if (exists) {
        return prev.map((a) => (a.id === newAddr.id ? newAddr : a));
      }
      return [newAddr, ...prev];
    });
    setSelectedAddressId(newAddr.id);
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'BELLISSIMO25' || code === 'CRAVE25') {
      setIsPromoApplied(true);
      setPromoMessage(`Code ${code} applied: 25% Off Hearth Feast`);
    } else {
      setIsPromoApplied(false);
      setPromoMessage('Invalid code. Try BELLISSIMO25');
    }
  };

  const handleCopySplitLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setIsSplitCopied(true);
    setTimeout(() => setIsSplitCopied(false), 2500);
  };

  // Place Order / Submit
  const handleFinalPlaceOrder = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      // Build new order object
      const newOrder: Order = {
        id: `order-cb-${Math.floor(10000 + Math.random() * 90000)}`,
        orderNumber: `CB-${Math.floor(10000 + Math.random() * 90000)}`,
        placedAt: 'Just now',
        estimatedDelivery: deliverySpeed === 'express' ? '18-22 mins' : deliverySpeed === 'scheduled' ? scheduledTime : '30-35 mins',
        status: 'In Hearth',
        courier: {
          name: 'Marco Bellini',
          rating: 4.98,
          deliveriesCount: 2150,
          vehicle: 'Maserati Private Thermal Chauffeur',
          plate: 'MH-01-CB-1988',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          phone: '+91 98450 12891',
          etaMinutes: deliverySpeed === 'express' ? 18 : 28,
          distanceKm: 1.8,
        },
        handOffPin: Math.floor(1000 + Math.random() * 9000).toString(),
        address: {
          label: selectedAddress.label,
          street: selectedAddress.street,
          apartment: selectedAddress.apartment,
          city: `${selectedAddress.city}, ${selectedAddress.pincode}`,
          instructions: selectedAddress.instructions || 'Concierge hand-off with VIP PIN',
        },
        items: cartItems.map((item) => ({
          dishName: item.dish.name,
          quantity: item.quantity,
          customizations: [
            ...(item.selectedCrust ? [item.selectedCrust.name] : []),
            ...item.selectedAddOns.map((a) => a.name),
            ...item.selectedPairings.map((p) => p.name),
            ...item.cookingInstructions,
          ],
          priceUsd: calculateItemPrice(item) / item.quantity,
          priceInr: calculateItemPrice(item) / item.quantity,
        })),
        subtotalUsd: currency === 'INR' ? rawSubtotal / 38.5 : rawSubtotal,
        subtotalInr: currency === 'INR' ? rawSubtotal : rawSubtotal * 38.5,
        deliveryFeeUsd: baseDeliveryFee + speedFee,
        deliveryFeeInr: baseDeliveryFee + speedFee,
        taxUsd: taxAmount,
        taxInr: taxAmount,
        discountUsd: promoDiscount + pointsDiscountValue,
        discountInr: promoDiscount + pointsDiscountValue,
        totalUsd: currency === 'INR' ? grandTotal / 38.5 : grandTotal,
        totalInr: currency === 'INR' ? grandTotal : grandTotal * 38.5,
        pointsEarned: pointsToEarn,
        chamberTempCelsius: 64.8,
      };

      setIsSubmitting(false);
      onPlaceOrder(newOrder, redeemedPoints);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200 text-[#171513] dark:text-[#f5ebd7] font-serif transition-colors">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-[#ded5c4] dark:border-[#2d2720] pb-4">
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#5a524a] dark:text-[#a89b8c] hover:text-[#781d18] dark:hover:text-[#dfc285] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Artisanal Menu</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5ebd7] dark:bg-[#2c2017] text-[#781d18] dark:text-[#dfc285] text-xs font-bold border border-[#c5a059]/40">
            <Flame className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>815°F Oak Hearth Ready</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>256-Bit SSL Encrypted Vault</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Steps (7 cols) + Right Order Summary (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Comprehensive Logistics & Futuristic Payment Options */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* STEP 1: DELIVERY DESTINATION & GPS PIN */}
          <section id="checkout-address-section" className="bg-white dark:bg-[#191714] rounded-3xl p-5 sm:p-7 border border-[#ded5c4] dark:border-[#2d2720] shadow-xs space-y-5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#f5ebd7] dark:bg-[#2e2017] text-[#781d18] dark:text-[#dfc285] flex items-center justify-center font-black text-sm border border-[#c5a059]/40 font-display">
                  1
                </div>
                <div>
                  <h2 className="font-bold text-lg text-[#171513] dark:text-[#f5ebd7] font-display">
                    Delivery Address & Dispatch Pod Drop
                  </h2>
                  <p className="text-xs text-[#5a524a] dark:text-[#a89b8c]">
                    Select destination or pin a new GPS coordinate for thermal unboxing
                  </p>
                </div>
              </div>

              <button
                id="add-new-address-btn"
                onClick={() => {
                  setAddressToEdit(null);
                  setIsAddressModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl border border-[#ded5c4] dark:border-[#383127] bg-[#f5f0e6] dark:bg-[#25201a] hover:bg-[#ede6d8] dark:hover:bg-[#2e261f] text-xs font-bold text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs font-serif"
              >
                <Plus className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Saved Addresses Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`relative rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#781d18] dark:border-[#c5a059] bg-[#fdf9f3] dark:bg-[#2b2018] ring-1 ring-[#781d18] dark:ring-[#c5a059] shadow-sm'
                        : 'border-[#ded5c4] dark:border-[#2d2720] hover:border-[#c5a059]/60 bg-white dark:bg-[#1e1b18] hover:bg-[#faf7f2] dark:hover:bg-[#231f1b]'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-[#781d18] dark:bg-[#dfc285]' : 'bg-[#ded5c4] dark:bg-[#383127]'}`} />
                          <span className="font-bold text-xs text-[#171513] dark:text-[#f5ebd7] font-display">{addr.label}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#f5f0e6] dark:bg-[#25201a] text-[#5a524a] dark:text-[#baa997] uppercase font-mono font-semibold border border-[#ded5c4] dark:border-[#383127]">
                          {addr.tag}
                        </span>
                      </div>

                      <p className="text-xs text-[#171513] dark:text-[#e8dec8] font-medium leading-relaxed font-sans">
                        {addr.apartment}, {addr.street}
                      </p>
                      <p className="text-[11px] text-[#5a524a] dark:text-[#a89b8c]">
                        {addr.city} &bull; <span className="font-mono">{addr.pincode}</span>
                      </p>

                      {addr.gateCode && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-[#781d18] dark:text-[#dfc285] bg-[#f5ebd7] dark:bg-[#341b17] px-2 py-0.5 rounded font-mono font-medium border border-[#c5a059]/30">
                          <KeyRound className="w-3 h-3 text-[#c5a059]" /> Gate: {addr.gateCode}
                        </div>
                      )}

                      {addr.instructions && (
                        <p className="text-[10px] text-[#8c7e6f] dark:text-[#8d7f72] italic line-clamp-1 pt-0.5">
                          Note: "{addr.instructions}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 mt-2 border-t border-[#f1ede7] dark:border-[#2d2720] flex items-center justify-between text-[11px]">
                      <span className="text-[#8c7e6f] dark:text-[#8d7f72] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#c5a059]" /> {addr.contactPhone}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddressToEdit(addr);
                          setIsAddressModalOpen(true);
                        }}
                        className="text-[#781d18] dark:text-[#dfc285] font-bold hover:underline flex items-center gap-0.5 cursor-pointer font-serif"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Timing & Priority Speed */}
            <div className="pt-2 border-t border-[#f1ede7] dark:border-[#2d2720] space-y-3">
              <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] flex items-center justify-between font-display">
                <span>Dispatch Timing & Speed</span>
                <span className="text-[11px] text-[#781d18] dark:text-[#dfc285] font-bold font-serif">Monitored via IoT Heat Sensors</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Priority Express */}
                <button
                  type="button"
                  onClick={() => setDeliverySpeed('express')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    deliverySpeed === 'express'
                      ? 'border-[#781d18] dark:border-[#c5a059] bg-[#fdf9f3] dark:bg-[#2c2017] ring-1 ring-[#781d18] dark:ring-[#c5a059]'
                      : 'border-[#ded5c4] dark:border-[#2d2720] hover:bg-[#f7f3ed] dark:hover:bg-[#231f1a] bg-white dark:bg-[#1a1714]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#171513] dark:text-[#f5ebd7]">
                    <span className="flex items-center gap-1 text-[#781d18] dark:text-[#dfc285]">
                      <Zap className="w-3.5 h-3.5 fill-[#c5a059] text-[#c5a059]" /> Priority Express
                    </span>
                    <span className="text-[10px] font-mono text-[#781d18] dark:text-[#dfc285]">
                      {currency === 'INR' ? '+₹39' : '+$1.50'}
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-[#171513] dark:text-[#f5ebd7] mt-1 font-display">15-20 mins</div>
                  <div className="text-[10px] text-[#5a524a] dark:text-[#a89b8c] mt-0.5">
                    Dedicated Ather EV courier, zero intermediate stops
                  </div>
                </button>

                {/* Standard Hearth */}
                <button
                  type="button"
                  onClick={() => setDeliverySpeed('standard')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    deliverySpeed === 'standard'
                      ? 'border-[#781d18] dark:border-[#c5a059] bg-[#fdf9f3] dark:bg-[#2c2017] ring-1 ring-[#781d18] dark:ring-[#c5a059]'
                      : 'border-[#ded5c4] dark:border-[#2d2720] hover:bg-[#f7f3ed] dark:hover:bg-[#231f1a] bg-white dark:bg-[#1a1714]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#171513] dark:text-[#f5ebd7]">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#c5a059]" /> Standard Hearth
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">FREE</span>
                  </div>
                  <div className="text-sm font-extrabold text-[#171513] dark:text-[#f5ebd7] mt-1 font-display">25-35 mins</div>
                  <div className="text-[10px] text-[#5a524a] dark:text-[#a89b8c] mt-0.5">
                    Direct dispatch upon oven emergence
                  </div>
                </button>

                {/* Scheduled Slot */}
                <button
                  type="button"
                  onClick={() => setDeliverySpeed('scheduled')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    deliverySpeed === 'scheduled'
                      ? 'border-[#781d18] dark:border-[#c5a059] bg-[#fdf9f3] dark:bg-[#2c2017] ring-1 ring-[#781d18] dark:ring-[#c5a059]'
                      : 'border-[#ded5c4] dark:border-[#2d2720] hover:bg-[#f7f3ed] dark:hover:bg-[#231f1a] bg-white dark:bg-[#1a1714]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#171513] dark:text-[#f5ebd7]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#c5a059]" /> Scheduled Feast
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">FREE</span>
                  </div>
                  <div className="text-sm font-extrabold text-[#171513] dark:text-[#f5ebd7] mt-1 font-display">Choose Slot</div>
                  <div className="text-[10px] text-[#5a524a] dark:text-[#a89b8c] mt-0.5">
                    Fired precisely 20 mins before your arrival
                  </div>
                </button>
              </div>

              {deliverySpeed === 'scheduled' && (
                <div className="p-3 bg-[#f7f3ed] dark:bg-[#231f1a] rounded-xl border border-[#ded5c4] dark:border-[#2d2720] flex items-center justify-between gap-3 text-xs animate-in fade-in">
                  <span className="text-[#5a524a] dark:text-[#a89b8c] font-medium">Select dinner slot:</span>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-[#1a1714] border border-[#ded5c4] dark:border-[#383127] rounded-lg font-bold text-[#171513] dark:text-[#f5ebd7] text-xs focus:outline-none focus:border-[#c5a059]"
                  >
                    <option value="Today, 8:45 PM">Today, 8:45 PM (Prime Dinner)</option>
                    <option value="Today, 9:15 PM">Today, 9:15 PM</option>
                    <option value="Today, 9:45 PM">Today, 9:45 PM (Late Supper)</option>
                    <option value="Tomorrow, 1:00 PM">Tomorrow, 1:00 PM (Artisan Lunch)</option>
                    <option value="Tomorrow, 8:00 PM">Tomorrow, 8:00 PM</option>
                  </select>
                </div>
              )}

              {/* Secret 4-digit Pin Handshake Option */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fdf9f3] dark:bg-[#231f1a] border border-[#ded5c4] dark:border-[#2d2720]">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#c5a059]" />
                  <div>
                    <span className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] block font-display">Require 4-Digit Hand-off PIN</span>
                    <span className="text-[11px] text-[#5a524a] dark:text-[#a89b8c]">Thermal capsule unseals only when courier verifies your PIN</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useSecretPin}
                  onChange={(e) => setUseSecretPin(e.target.checked)}
                  className="w-4 h-4 accent-[#781d18] rounded cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* STEP 2: PACKAGING & ARTISANAL PRESENTATION */}
          <section id="checkout-packaging-section" className="bg-white dark:bg-[#191714] rounded-3xl p-5 sm:p-7 border border-[#ded5c4] dark:border-[#2d2720] shadow-xs space-y-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#f5ebd7] dark:bg-[#2e2017] text-[#781d18] dark:text-[#dfc285] flex items-center justify-center font-black text-sm border border-[#c5a059]/40 font-display">
                2
              </div>
              <div>
                <h2 className="font-bold text-lg text-[#171513] dark:text-[#f5ebd7] font-display">
                  Packaging & Hearth Unboxing Experience
                </h2>
                <p className="text-xs text-[#5a524a] dark:text-[#a89b8c]">
                  Select presentation aesthetics and dining tableware preferences
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PACKAGING_OPTIONS.map((pkg) => {
                const isSelected = selectedPackaging === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackaging(pkg.id as any)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#781d18] dark:border-[#c5a059] bg-[#fdf9f3] dark:bg-[#2c2017] ring-1 ring-[#781d18] dark:ring-[#c5a059]'
                        : 'border-[#ded5c4] dark:border-[#2d2720] bg-white dark:bg-[#1a1714] hover:bg-[#faf7f2] dark:hover:bg-[#231f1a]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-[#171513] dark:text-[#f5ebd7]">
                        <span className="flex items-center gap-1 font-display">
                          {pkg.id === 'eco' && <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                          {pkg.id === 'luxury_seal' && <Gift className="w-3.5 h-3.5 text-[#c5a059]" />}
                          {pkg.id === 'minimal' && <Flame className="w-3.5 h-3.5 text-[#8c7e6f]" />}
                          {pkg.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#781d18] dark:text-[#dfc285] font-semibold mt-0.5 block font-serif">
                        {pkg.tag}
                      </span>
                      <p className="text-[11px] text-[#5a524a] dark:text-[#a89b8c] mt-1.5 leading-relaxed">
                        {pkg.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-[#f1ede7] dark:border-[#2d2720] text-right font-bold text-xs">
                      {pkg.priceInr === 0 ? (
                        <span className="text-emerald-700 dark:text-emerald-400">Included Free</span>
                      ) : (
                        <span className="text-[#171513] dark:text-[#f5ebd7] font-mono">
                          {currency === 'INR' ? `+₹${pkg.priceInr}` : `+$${pkg.priceUsd.toFixed(2)}`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cutlery Opt-in */}
            <div className="p-3 bg-[#f7f3ed] dark:bg-[#231f1a] rounded-xl border border-[#ded5c4] dark:border-[#2d2720] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] block font-display">Include FSC Birchwood Dining Set</span>
                <span className="text-[11px] text-[#5a524a] dark:text-[#a89b8c]">Compostable birchwood forks, napkins, and bamboo toothpicks</span>
              </div>
              <button
                type="button"
                onClick={() => setIncludeCutlery(!includeCutlery)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer font-serif ${
                  includeCutlery
                    ? 'bg-[#781d18] text-white border-[#781d18]'
                    : 'bg-white dark:bg-[#2d261e] text-[#5a524a] dark:text-[#baa997] border-[#ded5c4] dark:border-[#3d3328] hover:bg-[#ede6d8] dark:hover:bg-[#382f25]'
                }`}
              >
                {includeCutlery ? '✓ Included' : 'No Cutlery (Eco)'}
              </button>
            </div>
          </section>

          {/* STEP 3: TIP THE ARTISAN BRIGADE & COURIER */}
          <section id="checkout-tip-section" className="bg-white dark:bg-[#191714] rounded-3xl p-5 sm:p-7 border border-[#ded5c4] dark:border-[#2d2720] shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#f5ebd7] dark:bg-[#2e2017] text-[#781d18] dark:text-[#dfc285] flex items-center justify-center font-black text-sm border border-[#c5a059]/40 font-display">
                  3
                </div>
                <div>
                  <h2 className="font-bold text-lg text-[#171513] dark:text-[#f5ebd7] font-display">
                    Appreciation for Dev Patel & Kitchen Brigade
                  </h2>
                  <p className="text-xs text-[#5a524a] dark:text-[#a89b8c]">
                    100% of your appreciation goes directly with zero platform deduction
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[0, 30, 50, 100, 150].map((amount) => {
                const isSelected = customTip === '' && tipAmount === amount;
                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setTipAmount(amount);
                      setCustomTip('');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer font-serif ${
                      isSelected
                        ? 'bg-[#781d18] text-white border-[#781d18] shadow-xs'
                        : 'bg-[#f7f3ed] dark:bg-[#231f1a] text-[#5a524a] dark:text-[#baa997] border-[#ded5c4] dark:border-[#2d2720] hover:bg-[#ede6d8] dark:hover:bg-[#2a241e]'
                    }`}
                  >
                    {amount === 0 ? 'No Tip' : currency === 'INR' ? `₹${amount}` : `$${(amount / 35).toFixed(2)}`}
                  </button>
                );
              })}

              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-xs text-[#8c7e6f] dark:text-[#8d7f72]">Custom:</span>
                <input
                  type="number"
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  placeholder={currency === 'INR' ? '₹ Custom' : '$ Custom'}
                  className="w-24 px-2.5 py-1.5 rounded-lg border border-[#ded5c4] dark:border-[#2d2720] bg-white dark:bg-[#221e1a] text-xs font-bold text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>
          </section>

          {/* STEP 4: FUTURISTIC MULTI-GATEWAY PAYMENT MATRIX */}
          <section id="checkout-payment-section" className="bg-white dark:bg-[#191714] rounded-3xl p-5 sm:p-7 border border-[#ded5c4] dark:border-[#2d2720] shadow-xs space-y-6 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#f5ebd7] dark:bg-[#2e2017] text-[#781d18] dark:text-[#dfc285] flex items-center justify-center font-black text-sm border border-[#c5a059]/40 font-display">
                  4
                </div>
                <div>
                  <h2 className="font-bold text-lg text-[#171513] dark:text-[#f5ebd7] font-display">
                    Secure Payment Matrix
                  </h2>
                  <p className="text-xs text-[#5a524a] dark:text-[#a89b8c]">
                    Select instant UPI, tokenized credit cards, wallets, or split bill
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/60 font-serif">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                PCI-DSS Level 1
              </span>
            </div>

            {/* Payment Category Navigation Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-[#ded5c4] dark:border-[#2d2720] pb-3 font-serif">
              <button
                type="button"
                onClick={() => setPaymentCategory('upi')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentCategory === 'upi'
                    ? 'bg-[#171513] dark:bg-[#dfc285] text-white dark:text-[#171513] shadow-sm'
                    : 'bg-[#f7f3ed] dark:bg-[#231f1a] text-[#5a524a] dark:text-[#a89b8c] hover:bg-[#ede6d8] dark:hover:bg-[#2a241e]'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI 2.0</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentCategory('card')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentCategory === 'card'
                    ? 'bg-[#171513] dark:bg-[#dfc285] text-white dark:text-[#171513] shadow-sm'
                    : 'bg-[#f7f3ed] dark:bg-[#231f1a] text-[#5a524a] dark:text-[#a89b8c] hover:bg-[#ede6d8] dark:hover:bg-[#2a241e]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cards & Vault</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentCategory('wallet')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentCategory === 'wallet'
                    ? 'bg-[#171513] dark:bg-[#dfc285] text-white dark:text-[#171513] shadow-sm'
                    : 'bg-[#f7f3ed] dark:bg-[#231f1a] text-[#5a524a] dark:text-[#a89b8c] hover:bg-[#ede6d8] dark:hover:bg-[#2a241e]'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Wallets / Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentCategory('netbanking')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentCategory === 'netbanking'
                    ? 'bg-[#171513] dark:bg-[#dfc285] text-white dark:text-[#171513] shadow-sm'
                    : 'bg-[#f7f3ed] dark:bg-[#231f1a] text-[#5a524a] dark:text-[#a89b8c] hover:bg-[#ede6d8] dark:hover:bg-[#2a241e]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentCategory('cod')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentCategory === 'cod'
                    ? 'bg-[#171513] dark:bg-[#dfc285] text-white dark:text-[#171513] shadow-sm'
                    : 'bg-[#f7f3ed] dark:bg-[#231f1a] text-[#5a524a] dark:text-[#a89b8c] hover:bg-[#ede6d8] dark:hover:bg-[#2a241e]'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Pod Handshake</span>
              </button>
            </div>

            {/* TAB 1: UPI 2.0 */}
            {paymentCategory === 'upi' && (
              <div className="space-y-4 animate-in fade-in">
                {/* UPI Subtabs */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUpiOption('qr')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer font-serif ${
                      upiOption === 'qr'
                        ? 'bg-[#781d18] text-white border-[#781d18]'
                        : 'bg-white dark:bg-[#231f1a] text-[#5a524a] dark:text-[#baa997] border-[#ded5c4] dark:border-[#2d2720] hover:bg-[#f7f3ed] dark:hover:bg-[#2a241e]'
                    }`}
                  >
                    Dynamic Live QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiOption('gpay')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer font-serif ${
                      upiOption === 'gpay'
                        ? 'bg-[#781d18] text-white border-[#781d18]'
                        : 'bg-white dark:bg-[#231f1a] text-[#5a524a] dark:text-[#baa997] border-[#ded5c4] dark:border-[#2d2720] hover:bg-[#f7f3ed] dark:hover:bg-[#2a241e]'
                    }`}
                  >
                    1-Tap UPI Apps
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiOption('vpa')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer font-serif ${
                      upiOption === 'vpa'
                        ? 'bg-[#781d18] text-white border-[#781d18]'
                        : 'bg-white dark:bg-[#231f1a] text-[#5a524a] dark:text-[#baa997] border-[#ded5c4] dark:border-[#2d2720] hover:bg-[#f7f3ed] dark:hover:bg-[#2a241e]'
                    }`}
                  >
                    Enter UPI ID / VPA
                  </button>
                </div>

                {upiOption === 'qr' && (
                  <div className="p-5 rounded-2xl bg-[#171513] dark:bg-[#12100e] text-white flex flex-col sm:flex-row items-center gap-6 justify-between border border-[#c5a059]/30 relative overflow-hidden">
                    <div className="space-y-2 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#781d18] text-[#dfc285] text-[10px] font-bold border border-[#c5a059]/40 font-serif">
                        <Zap className="w-3 h-3 text-[#dfc285]" /> Auto-Expiring Dynamic QR
                      </div>
                      <h4 className="text-base font-bold font-display text-white">
                        Scan with GPay, PhonePe, Paytm, or CRED
                      </h4>
                      <p className="text-xs text-[#dddad4] max-w-sm font-serif">
                        Chamber temp locks in automatically upon receipt of instant webhook verification.
                      </p>
                      <div className="pt-2 text-xs font-mono text-[#f5ebd7] flex items-center gap-2 justify-center sm:justify-start">
                        <span>Paying: <strong className="text-[#dfc285]">{currency === 'INR' ? `₹${Math.round(grandTotal)}` : `$${grandTotal.toFixed(2)}`}</strong></span>
                        <span>&bull;</span>
                        <span className="text-emerald-400">Zero surcharge</span>
                      </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="relative p-3 bg-white rounded-2xl shadow-xl shrink-0 flex flex-col items-center">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=bellissimo.dining@okhdfcbank&pn=CaffeBellissimo&cu=INR"
                        alt="Dynamic UPI QR"
                        referrerPolicy="no-referrer"
                        className="w-32 h-32 rounded-lg"
                      />
                      <span className="text-[10px] text-[#171513] font-mono font-bold mt-1.5">
                        bellissimo@hdfc
                      </span>
                    </div>
                  </div>
                )}

                {upiOption === 'gpay' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { name: 'Google Pay', icon: '🟢', vpa: 'gpay@okaxis' },
                      { name: 'PhonePe', icon: '🟣', vpa: 'phonepe@ybl' },
                      { name: 'Paytm UPI', icon: '🔵', vpa: 'paytm@paytm' },
                      { name: 'CRED Pay', icon: '⚫', vpa: 'cred@axis' },
                    ].map((app) => (
                      <button
                        key={app.name}
                        type="button"
                        onClick={() => alert(`Simulated deep-link dispatching to ${app.name}`)}
                        className="p-3.5 rounded-2xl border border-[#ded5c4] dark:border-[#2d2720] bg-[#fdf9f3] dark:bg-[#231f1a] hover:border-[#c5a059] text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 shadow-2xs hover:scale-102"
                      >
                        <span className="text-2xl">{app.icon}</span>
                        <span className="font-bold text-xs text-[#171513] dark:text-[#f5ebd7] font-display">{app.name}</span>
                        <span className="text-[10px] text-[#8c7e6f] dark:text-[#8d7f72] font-serif">1-Tap Trigger</span>
                      </button>
                    ))}
                  </div>
                )}

                {upiOption === 'vpa' && (
                  <div className="space-y-2 p-4 rounded-2xl bg-[#f7f3ed] dark:bg-[#231f1a] border border-[#ded5c4] dark:border-[#2d2720]">
                    <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">Virtual Payment Address (VPA)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customVpa}
                        onChange={(e) => setCustomVpa(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#191714] border border-[#ded5c4] dark:border-[#383127] text-xs font-mono font-bold text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059]"
                      />
                      <button
                        type="button"
                        onClick={() => alert(`Verified VPA for Elena Vance (${customVpa})`)}
                        className="px-4 py-2 rounded-xl bg-[#171513] dark:bg-[#dfc285] text-white dark:text-[#171513] text-xs font-bold cursor-pointer font-serif"
                      >
                        Verify VPA
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CARDS & TOKENIZED VAULT */}
            {paymentCategory === 'card' && (
              <div className="space-y-5 animate-in fade-in">
                {/* 3D Holographic Card Preview */}
                <div className="relative w-full max-w-sm mx-auto h-48 rounded-2xl p-5 text-white shadow-2xl bg-gradient-to-tr from-[#171513] via-[#2d241c] to-[#453628] border border-[#c5a059]/40 flex flex-col justify-between overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#781d18]/40 rounded-full blur-2xl" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-bold font-display text-sm tracking-widest text-[#dfc285]">
                      CAFFÈ BELLISSIMO VAULT
                    </span>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                      {isAddingNewCard ? 'NEW CARD' : 'HDFC INFINIA'}
                    </span>
                  </div>

                  <div className="relative z-10 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 bg-amber-400/80 rounded-sm" />
                      <span className="text-[10px] text-white/60 font-mono">CONTACTLESS CHIP</span>
                    </div>
                    <div className="text-lg font-mono tracking-widest text-white font-bold pt-1">
                      {isAddingNewCard
                        ? newCardNumber || '•••• •••• •••• 4920'
                        : '•••• •••• •••• 4920'}
                    </div>
                  </div>

                  <div className="flex items-end justify-between relative z-10 text-xs font-mono">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-white/60">Cardholder</div>
                      <div className="font-bold tracking-wider">{newCardHolder}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider text-white/60">Expires</div>
                      <div className="font-bold">{isAddingNewCard ? newCardExpiry : '08/29'}</div>
                    </div>
                  </div>
                </div>

                {/* Saved Cards Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">Saved Tokenized Cards (RBI Safe)</label>
                  <div className="space-y-2">
                    {savedCards.map((card) => {
                      const isSelected = !isAddingNewCard && selectedCardId === card.id;
                      return (
                        <div
                          key={card.id}
                          onClick={() => {
                            setSelectedCardId(card.id);
                            setIsAddingNewCard(false);
                          }}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-[#781d18] dark:border-[#c5a059] bg-[#fdf9f3] dark:bg-[#2c2017] ring-1 ring-[#781d18] dark:ring-[#c5a059]'
                              : 'border-[#ded5c4] dark:border-[#2d2720] hover:bg-[#faf7f2] dark:hover:bg-[#231f1a] bg-white dark:bg-[#1a1714]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-[#171513] dark:bg-[#2e261f] text-white dark:text-[#dfc285] flex items-center justify-center font-bold text-xs uppercase font-mono border border-[#c5a059]/30">
                              {card.cardType}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">{card.bankName}</div>
                              <div className="text-[11px] text-[#5a524a] dark:text-[#a89b8c] font-mono">
                                •••• {card.last4} &bull; Exp: {card.expiryMonth}/{card.expiryYear}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-[#8c7e6f] dark:text-[#8d7f72]">CVV:</span>
                              <input
                                type="password"
                                maxLength={3}
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                placeholder="•••"
                                className="w-14 px-2 py-1 bg-white dark:bg-[#221e1a] border border-[#781d18] dark:border-[#c5a059] text-[#171513] dark:text-[#f5ebd7] rounded-lg text-center font-mono font-bold text-xs focus:outline-none"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add New Card Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCard(!isAddingNewCard)}
                    className="text-xs font-bold text-[#781d18] dark:text-[#dfc285] hover:underline flex items-center gap-1 cursor-pointer font-serif"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingNewCard ? 'Select Saved Card Instead' : 'Add Another Credit/Debit Card'}</span>
                  </button>

                  {isAddingNewCard && (
                    <div className="mt-3 p-4 rounded-2xl bg-[#f7f3ed] dark:bg-[#231f1a] border border-[#ded5c4] dark:border-[#2d2720] space-y-3 animate-in fade-in">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#171513] dark:text-[#f5ebd7]">Card Number</label>
                        <input
                          type="text"
                          value={newCardNumber}
                          onChange={(e) => setNewCardNumber(e.target.value)}
                          placeholder="4123 4567 8901 2345"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#191714] border border-[#ded5c4] dark:border-[#383127] text-xs font-mono font-bold text-[#171513] dark:text-[#f5ebd7]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#171513] dark:text-[#f5ebd7]">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={newCardExpiry}
                            onChange={(e) => setNewCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#191714] border border-[#ded5c4] dark:border-[#383127] text-xs font-mono font-bold text-[#171513] dark:text-[#f5ebd7]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-[#171513] dark:text-[#f5ebd7]">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={newCardCvv}
                            onChange={(e) => setNewCardCvv(e.target.value)}
                            placeholder="123"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#191714] border border-[#ded5c4] dark:border-[#383127] text-xs font-mono font-bold text-[#171513] dark:text-[#f5ebd7]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* No-cost EMI Toggle */}
                <div className="p-3 bg-[#fdf9f3] dark:bg-[#231f1a] rounded-2xl border border-[#ded5c4] dark:border-[#2d2720] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] block font-display">No-Cost EMI Options</span>
                    <span className="text-[11px] text-[#5a524a] dark:text-[#a89b8c]">Split payment across 3 or 6 months with 0% interest on HDFC/Amex</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableEmi}
                    onChange={(e) => setEnableEmi(e.target.checked)}
                    className="w-4 h-4 accent-[#781d18] rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: WALLETS */}
            {paymentCategory === 'wallet' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                {[
                  { name: 'Apple Pay', desc: 'Touch ID / Face ID Biometric', icon: '' },
                  { name: 'Google Pay 1-Tap', desc: 'Direct saved account', icon: 'G' },
                  { name: 'Amazon Pay Balance', desc: 'Fast 1-click checkout', icon: 'a' },
                  { name: 'PayPal International', desc: 'USD & Multicurrency balance', icon: 'P' },
                ].map((w) => (
                  <button
                    key={w.name}
                    type="button"
                    onClick={() => alert(`Simulating 1-Tap connection to ${w.name}`)}
                    className="p-4 rounded-2xl border border-[#ded5c4] dark:border-[#2d2720] bg-[#fdf9f3] dark:bg-[#231f1a] hover:border-[#c5a059] text-left transition-all cursor-pointer flex items-center gap-3.5 shadow-2xs hover:scale-101"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#171513] dark:bg-[#2d241c] text-white dark:text-[#dfc285] flex items-center justify-center font-bold text-lg border border-[#c5a059]/30">
                      {w.icon}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#171513] dark:text-[#f5ebd7] font-display">{w.name}</div>
                      <div className="text-[11px] text-[#5a524a] dark:text-[#a89b8c] font-serif">{w.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* TAB 4: NETBANKING */}
            {paymentCategory === 'netbanking' && (
              <div className="space-y-3 animate-in fade-in">
                <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">Popular Indian Banks</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {['HDFC', 'ICICI', 'SBI', 'AXIS'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-colors cursor-pointer font-serif ${
                        selectedBank === b
                          ? 'border-[#781d18] dark:border-[#c5a059] bg-[#f5ebd7] dark:bg-[#2e2017] text-[#781d18] dark:text-[#dfc285]'
                          : 'border-[#ded5c4] dark:border-[#2d2720] bg-white dark:bg-[#231f1a] text-[#5a524a] dark:text-[#baa997] hover:bg-[#f7f3ed] dark:hover:bg-[#2a241e]'
                      }`}
                    >
                      {b} Bank
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-[11px] font-bold text-[#8c7e6f] dark:text-[#8d7f72] block mb-1">Or choose all other banks:</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#221e1a] border border-[#ded5c4] dark:border-[#2d2720] text-xs font-semibold text-[#171513] dark:text-[#f5ebd7]"
                  >
                    <option value="HDFC">HDFC Bank Limited</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="KOTAK">Kotak Mahindra Bank</option>
                    <option value="YES">Yes Bank</option>
                    <option value="IDFC">IDFC FIRST Bank</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB 5: COD / THERMAL POD HANDSHAKE */}
            {paymentCategory === 'cod' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#f7f3ed] dark:bg-[#231f1a] border border-[#ded5c4] dark:border-[#2d2720] space-y-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#f5ebd7] dark:bg-[#2e2017] text-[#781d18] dark:text-[#dfc285] flex items-center justify-center font-bold border border-[#c5a059]/40">
                    <Banknote className="w-5 h-5 text-[#c5a059]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#171513] dark:text-[#f5ebd7] font-display">Thermal Pod Doorstep Handshake</h4>
                    <p className="text-xs text-[#5a524a] dark:text-[#a89b8c]">
                      Pay on delivery via portable Ather courier POS machine (Tap Card / UPI) or Cash.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-[#1a1714] rounded-xl border border-[#ded5c4] dark:border-[#2d2720] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#171513] dark:text-[#f5ebd7]">Need change for larger currency notes?</span>
                  <input
                    type="checkbox"
                    checked={needChange}
                    onChange={(e) => setNeedChange(e.target.checked)}
                    className="w-4 h-4 accent-[#781d18] rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* ADVANCED SPLIT BILL FEATURE */}
            <div className="pt-4 border-t border-[#f1ede7] dark:border-[#2d2720] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#c5a059]" />
                  <span className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">Split Table Bill with Companions</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#f7f3ed] dark:bg-[#231f1a] px-2.5 py-1 rounded-lg border border-[#ded5c4] dark:border-[#2d2720]">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSplitDiners(num)}
                      className={`w-6 h-6 rounded-md text-xs font-bold transition-colors cursor-pointer font-serif ${
                        splitDiners === num
                          ? 'bg-[#781d18] text-white'
                          : 'text-[#5a524a] dark:text-[#a89b8c] hover:bg-[#ede6d8] dark:hover:bg-[#2a241e]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {splitDiners > 1 && (
                <div className="p-3.5 rounded-2xl bg-[#fdf9f3] dark:bg-[#231f1a] border border-[#c5a059]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-in fade-in">
                  <div>
                    <span className="font-bold text-[#171513] dark:text-[#f5ebd7]">
                      Each Person's Share: {currency === 'INR' ? `₹${Math.round(grandTotal / splitDiners)}` : `$${(grandTotal / splitDiners).toFixed(2)}`}
                    </span>
                    <span className="text-[#5a524a] dark:text-[#a89b8c] block text-[11px] font-serif">
                      Split across {splitDiners} diners including all taxes & hearth delivery
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySplitLink}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#2e261f] border border-[#ded5c4] dark:border-[#383127] hover:bg-[#171513] hover:text-white dark:hover:bg-[#dfc285] dark:hover:text-[#171513] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs font-serif"
                  >
                    {isSplitCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isSplitCopied ? 'Link Copied!' : 'Copy Split Link'}</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary, Bellissimo Club Burn, Promo & Fire CTA */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          {/* ORDER ITEMS REVIEW CARD */}
          <div className="bg-white dark:bg-[#191714] rounded-3xl p-5 sm:p-6 border border-[#ded5c4] dark:border-[#2d2720] shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-[#ded5c4] dark:border-[#2d2720] pb-3">
              <h3 className="font-bold text-base text-[#171513] dark:text-[#f5ebd7] font-display">
                Culinary Bag Recap
              </h3>
              <span className="text-xs text-[#8c7e6f] dark:text-[#8d7f72] font-serif">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items selected
              </span>
            </div>

            {/* List of items */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex items-start justify-between gap-3 text-xs border-b border-[#f1ede7] dark:border-[#28221b] pb-2.5">
                  <div className="flex gap-2.5">
                    <img
                      src={item.dish.image}
                      alt={item.dish.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-[#ded5c4] dark:border-[#2d2720] shrink-0"
                    />
                    <div>
                      <div className="font-bold text-[#171513] dark:text-[#f5ebd7]">
                        {item.quantity}× {item.dish.name}
                      </div>
                      {item.selectedCrust && (
                        <div className="text-[10px] text-[#781d18] dark:text-[#dfc285] font-semibold">
                          {item.selectedCrust.name}
                        </div>
                      )}
                      {item.selectedAddOns.length > 0 && (
                        <div className="text-[10px] text-[#5a524a] dark:text-[#a89b8c]">
                          + {item.selectedAddOns.map((a) => a.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="font-bold text-xs text-[#171513] dark:text-[#f5ebd7] shrink-0 font-serif">
                    {currency === 'INR' ? `₹${Math.round(calculateItemPrice(item))}` : `$${calculateItemPrice(item).toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>

            {/* BELLISSIMO CLUB LOYALTY POINTS BURN SLIDER */}
            <div className="p-4 rounded-2xl bg-[#171513] dark:bg-[#12100e] text-white space-y-3 border border-[#c5a059]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-serif">
                  <Award className="w-4 h-4 text-[#dfc285]" />
                  <span className="text-[#dfc285]">Burn Bellissimo Club Points</span>
                </div>
                <span className="text-xs font-mono text-[#dddad4]">
                  Avail: <strong className="text-[#dfc285]">{userPoints.toLocaleString()}p</strong>
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium font-serif">
                  <span className="text-[#dddad4]">Redeeming: {redeemedPoints} pts</span>
                  <span className="text-emerald-400 font-bold">
                    Save -{currency === 'INR' ? `₹${Math.round(pointsDiscountValue)}` : `$${pointsDiscountValue.toFixed(2)}`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.min(userPoints, 2000)}
                  step="250"
                  value={redeemedPoints}
                  onChange={(e) => setRedeemedPoints(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#403b35] rounded-lg appearance-none cursor-pointer accent-[#c5a059]"
                />
                <div className="flex justify-between text-[10px] text-[#baa997] font-mono">
                  <span>0 pts</span>
                  <span>1000 pts (-₹200)</span>
                  <span>2000 pts (-₹400)</span>
                </div>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="space-y-1.5 pt-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#8c7e6f] dark:text-[#8d7f72] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (BELLISSIMO25)"
                    className="w-full pl-8 pr-2 py-1.5 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] bg-white dark:bg-[#1a1714] text-xs uppercase font-mono font-bold text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 rounded-xl bg-[#f7f3ed] dark:bg-[#231f1a] hover:bg-[#ede6d8] dark:hover:bg-[#2a241e] border border-[#ded5c4] dark:border-[#2d2720] text-xs font-bold text-[#171513] dark:text-[#f5ebd7] cursor-pointer font-serif"
                >
                  Apply
                </button>
              </div>
              {isPromoApplied && (
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 font-serif">
                  <Check className="w-3.5 h-3.5" />
                  <span>{promoMessage}</span>
                </div>
              )}
            </div>

            {/* Detailed Bill Breakdown */}
            <div className="space-y-2 text-xs text-[#5a524a] dark:text-[#a89b8c] border-t border-[#ded5c4] dark:border-[#2d2720] pt-3 font-serif">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#171513] dark:text-[#f5ebd7]">{currency === 'INR' ? `₹${Math.round(rawSubtotal)}` : `$${rawSubtotal.toFixed(2)}`}</span>
              </div>

              {isPromoApplied && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>Spring Harvest (25% Off)</span>
                  <span>-{currency === 'INR' ? `₹${Math.round(promoDiscount)}` : `$${promoDiscount.toFixed(2)}`}</span>
                </div>
              )}

              {redeemedPoints > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>Bellissimo Club Rewards ({redeemedPoints} pts)</span>
                  <span>-{currency === 'INR' ? `₹${Math.round(pointsDiscountValue)}` : `$${pointsDiscountValue.toFixed(2)}`}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Thermal Delivery Fee</span>
                <span className="font-semibold text-[#171513] dark:text-[#f5ebd7]">{baseDeliveryFee === 0 ? 'FREE' : currency === 'INR' ? `₹${baseDeliveryFee}` : `$${baseDeliveryFee.toFixed(2)}`}</span>
              </div>

              {speedFee > 0 && (
                <div className="flex justify-between text-[#781d18] dark:text-[#dfc285] font-semibold">
                  <span>Priority Thermal Express Speed</span>
                  <span>{currency === 'INR' ? `+₹${speedFee}` : `+$${speedFee.toFixed(2)}`}</span>
                </div>
              )}

              {packagingFee > 0 && (
                <div className="flex justify-between">
                  <span>Luxury Wax-Sealed Packaging</span>
                  <span className="font-semibold text-[#171513] dark:text-[#f5ebd7]">{currency === 'INR' ? `+₹${packagingFee}` : `+$${packagingFee.toFixed(2)}`}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Artisan Kitchen & Courier Tip</span>
                <span className="font-semibold text-[#171513] dark:text-[#f5ebd7]">{currency === 'INR' ? `₹${tipValue}` : `$${tipValue.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between">
                <span>GST / Taxes (5%)</span>
                <span className="font-semibold text-[#171513] dark:text-[#f5ebd7]">{currency === 'INR' ? `₹${Math.round(taxAmount)}` : `$${taxAmount.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between font-bold text-base text-[#171513] dark:text-[#f5ebd7] pt-2 border-t border-[#ded5c4] dark:border-[#2d2720]">
                <div>
                  <span className="font-display">Totale Riserva</span>
                  <span className="text-[10px] text-[#8c7e6f] dark:text-[#8d7f72] block font-normal font-serif">
                    Includes haute culinary VAT & thermal pod insurance
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl text-[#781d18] dark:text-[#dfc285] font-display font-bold">
                    {currency === 'INR' ? `₹${Math.round(grandTotal)}` : `$${grandTotal.toFixed(2)}`}
                  </span>
                  <span className="text-[11px] text-[#c5a059] font-bold block font-serif">
                    +{pointsToEarn} Bellissimo Privé pts
                  </span>
                </div>
              </div>
            </div>

            {/* Fire Order CTA */}
            <button
              id="fire-order-final-btn"
              type="button"
              disabled={isSubmitting || cartItems.length === 0}
              onClick={handleFinalPlaceOrder}
              className={`w-full py-4 rounded-2xl bg-gradient-to-r from-[#781d18] via-[#601410] to-[#450e0a] hover:from-[#601410] hover:to-[#380b08] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xl shadow-[#781d18]/30 border-2 border-[#c5a059]/50 transition-all hover:scale-101 cursor-pointer font-serif tracking-wide ${
                isSubmitting ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#dfc285] border-t-transparent rounded-full animate-spin" />
                  <span>Sealing Thermal Capsule & Commencing Dispatch...</span>
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5 fill-[#dfc285] text-[#dfc285]" />
                  <span>Seal Thermal Pod & Dispatch • {currency === 'INR' ? `₹${Math.round(grandTotal)}` : `$${grandTotal.toFixed(2)}`}</span>
                  <ArrowRight className="w-5 h-5 text-[#dfc285]" />
                </>
              )}
            </button>

            {/* Guarantee Footer */}
            <div className="p-3.5 bg-[#f5f0e6] dark:bg-[#231f1a] rounded-xl border border-[#ded5c4] dark:border-[#2d2720] text-[11px] text-[#5a524a] dark:text-[#baa997] space-y-1 font-serif">
              <div className="flex items-center gap-1.5 font-bold text-[#171513] dark:text-[#f5ebd7]">
                <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                <span>60°C Minimum Chamber Temperature Guarantee</span>
              </div>
              <p className="text-[10px] text-[#8c7e6f] dark:text-[#8d7f72] leading-relaxed">
                If the core temperature drops below 60°C upon private chauffeur arrival, your entire order is on the house.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Address Management Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSaveAddress={handleSaveAddress}
        initialAddress={addressToEdit}
      />
    </div>
  );
};
