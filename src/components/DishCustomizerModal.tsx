import React, { useState } from 'react';
import { Dish, CrustOption, AddOnOption, PairingOption, Currency } from '../types';
import { 
  X, 
  Flame, 
  Clock, 
  Users, 
  Sparkles, 
  Check, 
  Plus, 
  Minus, 
  ShoppingBag,
  Info,
  ShieldCheck,
  Award
} from 'lucide-react';

interface DishCustomizerModalProps {
  dish: Dish | null;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (
    dish: Dish,
    selectedCrust: CrustOption | undefined,
    selectedAddOns: AddOnOption[],
    selectedPairings: PairingOption[],
    cookingInstructions: string[],
    customNote: string,
    quantity: number
  ) => void;
}

export const DishCustomizerModal: React.FC<DishCustomizerModalProps> = ({
  dish,
  currency,
  onClose,
  onAddToCart,
}) => {
  if (!dish) return null;

  // Selected state
  const defaultCrust = dish.crustOptions?.find((c) => c.isDefault) || dish.crustOptions?.[0];
  const [selectedCrust, setSelectedCrust] = useState<CrustOption | undefined>(defaultCrust);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [selectedPairings, setSelectedPairings] = useState<PairingOption[]>([]);
  const [instructions, setInstructions] = useState<string[]>(['Cut in 6 slices']);
  const [customNote, setCustomNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  const availableInstructions = [
    'Crust Well-Done',
    'Cut in 6 slices',
    'Sauce on the side',
    'Extra Crispy Cornicione',
    'Eco Packaging',
  ];

  const toggleAddOn = (addOn: AddOnOption) => {
    if (selectedAddOns.some((a) => a.id === addOn.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addOn.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const togglePairing = (pairing: PairingOption) => {
    if (selectedPairings.some((p) => p.id === pairing.id)) {
      setSelectedPairings(selectedPairings.filter((p) => p.id !== pairing.id));
    } else {
      setSelectedPairings([...selectedPairings, pairing]);
    }
  };

  const toggleInstruction = (inst: string) => {
    if (instructions.includes(inst)) {
      setInstructions(instructions.filter((i) => i !== inst));
    } else {
      setInstructions([...instructions, inst]);
    }
  };

  // Price calculations
  const basePrice = currency === 'INR' ? dish.priceInr : dish.priceUsd;
  const crustAdd = selectedCrust ? (currency === 'INR' ? selectedCrust.priceInr : selectedCrust.priceUsd) : 0;
  const addOnsTotal = selectedAddOns.reduce(
    (sum, a) => sum + (currency === 'INR' ? a.priceInr : a.priceUsd),
    0
  );
  const pairingsTotal = selectedPairings.reduce(
    (sum, p) => sum + (currency === 'INR' ? p.priceInr : p.priceUsd),
    0
  );

  const singleItemTotal = basePrice + crustAdd + addOnsTotal + pairingsTotal;
  const grandTotal = singleItemTotal * quantity;
  const pointsEarned = Math.round(grandTotal * (currency === 'INR' ? 0.1 : 3.5));

  const formatPrice = (usd: number, inr: number) => {
    return currency === 'INR' ? `₹${inr}` : `$${usd.toFixed(2)}`;
  };

  const handleConfirm = () => {
    onAddToCart(
      dish,
      selectedCrust,
      selectedAddOns,
      selectedPairings,
      instructions,
      customNote,
      quantity
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        id="customizer-dialog"
        className="relative w-full max-w-2xl bg-[#faf7f2] dark:bg-[#141210] rounded-3xl shadow-2xl border-2 border-[#c5a059]/40 overflow-hidden my-6 flex flex-col max-h-[90vh] font-serif transition-colors"
      >
        {/* Header with image */}
        <div className="relative h-64 sm:h-76 w-full overflow-hidden shrink-0">
          <img
            src={dish.image}
            alt={dish.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-black/25 to-black/40" />

          {/* Top action row */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {dish.isSignature && (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#781d18] to-[#4a100c] text-[#dfc285] text-xs font-bold flex items-center gap-1.5 shadow-md border border-[#c5a059]/40 font-display">
                  <Sparkles className="w-3.5 h-3.5 text-[#dfc285]" />
                  Selezione dello Chef
                </span>
              )}
              {dish.fermentation && (
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#dfc285] text-xs font-medium border border-[#c5a059]/30">
                  {dish.fermentation}
                </span>
              )}
            </div>
            <button
              id="close-customizer-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom title in hero */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {dish.dietary.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[#dfc285] border border-[#c5a059]/30"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-wide text-white drop-shadow-sm">
              {dish.name}
            </h2>
            <p className="text-xs text-[#dfc285]/90 mt-1 line-clamp-2 italic">
              {dish.sensoryDescription || dish.description}
            </p>
          </div>
        </div>

        {/* Scrollable Customization Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* Metadata highlights */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-[#f5f0e6] dark:bg-[#1a1815] border border-[#ded5c4] dark:border-[#322c24] text-center text-xs">
            <div className="flex flex-col items-center">
              <span className="text-[#8c7e6f] dark:text-[#a89b8d] flex items-center gap-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-[#781d18] dark:text-[#dfc285]" /> Hearth Firing
              </span>
              <span className="font-bold text-[#171513] dark:text-[#f5ebd7] mt-0.5">{dish.prepTime}</span>
            </div>
            <div className="flex flex-col items-center border-x border-[#ded5c4] dark:border-[#322c24]">
              <span className="text-[#8c7e6f] dark:text-[#a89b8d] flex items-center gap-1 text-[11px]">
                <Flame className="w-3.5 h-3.5 text-[#c5a059]" /> Calories
              </span>
              <span className="font-bold text-[#171513] dark:text-[#f5ebd7] mt-0.5 font-sans">{dish.calories} kcal</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#8c7e6f] dark:text-[#a89b8d] flex items-center gap-1 text-[11px]">
                <Users className="w-3.5 h-3.5 text-[#781d18] dark:text-[#dfc285]" /> Serves
              </span>
              <span className="font-bold text-[#171513] dark:text-[#f5ebd7] mt-0.5">{dish.serves}</span>
            </div>
          </div>

          {/* Section 1: Choose Your Crust */}
          {dish.crustOptions && dish.crustOptions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1.5 font-display">
                    <span className="w-5 h-5 rounded-full bg-[#f5ebd7] dark:bg-[#282218] text-[#781d18] dark:text-[#dfc285] text-xs font-bold flex items-center justify-center font-serif">1</span>
                    Choose Your Crust
                  </h3>
                  <p className="text-xs text-[#5a524a] dark:text-[#baa997]">Select one hearth-baked foundation</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f5ebd7] dark:bg-[#282218] text-[#781d18] dark:text-[#dfc285] font-serif">
                  Required
                </span>
              </div>

              <div className="space-y-2">
                {dish.crustOptions.map((crust) => {
                  const isSelected = selectedCrust?.id === crust.id;
                  return (
                    <button
                      key={crust.id}
                      type="button"
                      id={`crust-option-${crust.id}`}
                      onClick={() => setSelectedCrust(crust)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#781d18] dark:border-[#c5a059] bg-[#f5ebd7]/30 dark:bg-[#221e18] shadow-sm ring-1 ring-[#c5a059]'
                          : 'border-[#ded5c4] dark:border-[#322c24] bg-white dark:bg-[#1a1815] hover:bg-[#f7f3ed] dark:hover:bg-[#24201b]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                            isSelected ? 'border-[#781d18] bg-[#781d18] dark:border-[#dfc285] dark:bg-[#dfc285]' : 'border-[#8c7e6f]'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#171513]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#171513] dark:text-[#f5ebd7]">{crust.name}</span>
                            {crust.tag && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#f5ebd7] dark:bg-[#282218] text-[#781d18] dark:text-[#dfc285] rounded">
                                {crust.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5a524a] dark:text-[#baa997] mt-0.5">{crust.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] shrink-0 ml-2 font-sans">
                        {crust.priceInr === 0 ? 'Included' : `+${formatPrice(crust.priceUsd, crust.priceInr)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Artisanal Add-ons & Finishes */}
          {dish.addOns && dish.addOns.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1.5 font-display">
                    <span className="w-5 h-5 rounded-full bg-[#f5ebd7] dark:bg-[#282218] text-[#781d18] dark:text-[#dfc285] text-xs font-bold flex items-center justify-center font-serif">2</span>
                    Artisanal Add-ons & Finishes
                  </h3>
                  <p className="text-xs text-[#5a524a] dark:text-[#baa997]">Hand-selected ingredients shaved or added fresh</p>
                </div>
                <span className="text-[10px] font-medium text-[#8c7e6f] dark:text-[#a89b8d]">Optional</span>
              </div>

              <div className="space-y-2">
                {dish.addOns.map((addOn) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addOn.id);
                  return (
                    <button
                      key={addOn.id}
                      type="button"
                      id={`addon-option-${addOn.id}`}
                      onClick={() => toggleAddOn(addOn)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'border-[#781d18] dark:border-[#c5a059] bg-[#f5ebd7]/25 dark:bg-[#221e18] ring-1 ring-[#c5a059]'
                          : 'border-[#ded5c4] dark:border-[#322c24] bg-white dark:bg-[#1a1815] hover:bg-[#f7f3ed] dark:hover:bg-[#24201b]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                            isChecked ? 'border-[#781d18] bg-[#781d18] text-white' : 'border-[#8c7e6f]'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[#171513] dark:text-[#f5ebd7]">{addOn.name}</div>
                          <p className="text-[11px] text-[#5a524a] dark:text-[#baa997] mt-0.5">{addOn.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#781d18] dark:text-[#dfc285] shrink-0 ml-2 font-sans">
                        +{formatPrice(addOn.priceUsd, addOn.priceInr)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Cellar & Beverage Pairings */}
          {dish.pairings && dish.pairings.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1.5 font-display">
                    <span className="w-5 h-5 rounded-full bg-[#f5ebd7] dark:bg-[#282218] text-[#781d18] dark:text-[#dfc285] text-xs font-bold flex items-center justify-center font-serif">3</span>
                    Cellar & Side Pairings
                  </h3>
                  <p className="text-xs text-[#5a524a] dark:text-[#baa997]">Curated by Head Sommelier to complement this dish</p>
                </div>
                <span className="text-[10px] font-medium text-[#8c7e6f] dark:text-[#a89b8d]">Pairing Reserve</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dish.pairings.map((pairing) => {
                  const isChecked = selectedPairings.some((p) => p.id === pairing.id);
                  return (
                    <button
                      key={pairing.id}
                      type="button"
                      id={`pairing-option-${pairing.id}`}
                      onClick={() => togglePairing(pairing)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'border-[#781d18] dark:border-[#c5a059] bg-[#f5ebd7]/25 dark:bg-[#221e18] ring-1 ring-[#c5a059]'
                          : 'border-[#ded5c4] dark:border-[#322c24] bg-white dark:bg-[#1a1815] hover:bg-[#f7f3ed] dark:hover:bg-[#24201b]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-xs text-[#171513] dark:text-[#f5ebd7]">{pairing.name}</span>
                          {pairing.volume && (
                            <span className="text-[10px] text-[#8c7e6f] dark:text-[#a89b8d]">{pairing.volume}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5a524a] dark:text-[#baa997]">{pairing.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#ded5c4] dark:border-[#2d2720]">
                        <span className="text-xs font-bold text-[#781d18] dark:text-[#dfc285] font-sans">
                          +{formatPrice(pairing.priceUsd, pairing.priceInr)}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isChecked ? 'bg-[#781d18] text-white' : 'bg-[#f5ebd7] dark:bg-[#282218] text-[#171513] dark:text-[#f5ebd7]'
                        }`}>
                          {isChecked ? 'Added ✓' : '+ Add'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 4: Kitchen & Crust Instructions */}
          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-sm text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1.5 font-display">
                <span className="w-5 h-5 rounded-full bg-[#f5ebd7] dark:bg-[#282218] text-[#781d18] dark:text-[#dfc285] text-xs font-bold flex items-center justify-center font-serif">4</span>
                Kitchen & Crust Instructions
              </h3>
              <p className="text-xs text-[#5a524a] dark:text-[#baa997]">Direct instructions sent to the hearth pizzaiolo</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {availableInstructions.map((inst) => {
                const active = instructions.includes(inst);
                return (
                  <button
                    key={inst}
                    type="button"
                    onClick={() => toggleInstruction(inst)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      active
                        ? 'border-[#781d18] bg-[#781d18] text-white'
                        : 'border-[#ded5c4] dark:border-[#322c24] bg-white dark:bg-[#1a1815] text-[#5a524a] dark:text-[#baa997] hover:bg-[#f7f3ed] dark:hover:bg-[#24201b]'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}{inst}
                  </button>
                );
              })}
            </div>

            <input
              id="custom-cooking-note"
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g., Please keep in thermal box until driver handoff..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1a1815] border border-[#ded5c4] dark:border-[#322c24] focus:border-[#c5a059] focus:outline-none text-[#171513] dark:text-[#f5ebd7] placeholder-[#8c7e6f] dark:placeholder-[#6e6357]"
            />
          </div>
        </div>

        {/* Sticky Elevated Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white dark:bg-[#191714] border-t border-[#ded5c4] dark:border-[#2d2720] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl z-10 font-serif transition-colors">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            {/* Stepper Quantity Counter */}
            <div className="flex items-center border border-[#ded5c4] dark:border-[#322c24] rounded-xl bg-[#f5f0e6] dark:bg-[#231f1c] p-1">
              <button
                id="modal-quantity-minus"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#1a1815] text-[#171513] dark:text-[#f5ebd7] hover:bg-[#ede7dc] dark:hover:bg-[#2c2722] flex items-center justify-center font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-[#171513] dark:text-[#f5ebd7] font-sans">
                {quantity}
              </span>
              <button
                id="modal-quantity-plus"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#1a1815] text-[#171513] dark:text-[#f5ebd7] hover:bg-[#ede7dc] dark:hover:bg-[#2c2722] flex items-center justify-center font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total display & rewards preview */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold font-display text-[#171513] dark:text-[#f5ebd7] tracking-tight">
                  {currency === 'INR' ? `₹${grandTotal}` : `$${grandTotal.toFixed(2)}`}
                </span>
                <span className="text-[11px] text-[#8c7e6f] dark:text-[#a89b8d]">per portion</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#c5a059]">
                <Award className="w-3 h-3" />
                <span>+{pointsEarned} Bellissimo Privé PTS</span>
              </div>
            </div>
          </div>

          {/* Add to culinary bag CTA */}
          <button
            id="confirm-add-to-bag-btn"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#781d18] to-[#5c1511] hover:from-[#601410] hover:to-[#450e0a] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-[#781d18]/30 border border-[#c5a059]/40 transition-all hover:scale-102 active:scale-98 cursor-pointer tracking-wide"
          >
            <ShoppingBag className="w-4 h-4 text-[#dfc285]" />
            <span>Add to Degustation Bag • {currency === 'INR' ? `₹${grandTotal}` : `$${grandTotal.toFixed(2)}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
