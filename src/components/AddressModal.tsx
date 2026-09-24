import React, { useState } from 'react';
import { DeliveryAddress } from '../types';
import { 
  X, 
  MapPin, 
  Building2, 
  Home, 
  Briefcase, 
  Compass, 
  Check, 
  KeyRound, 
  Phone, 
  User, 
  ShieldCheck, 
  Navigation
} from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAddress: (address: DeliveryAddress) => void;
  initialAddress?: DeliveryAddress | null;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSaveAddress,
  initialAddress,
}) => {
  const [tag, setTag] = useState<'home' | 'work' | 'other'>(initialAddress?.tag || 'home');
  const [label, setLabel] = useState(initialAddress?.label || 'Home Penthouse');
  const [street, setStreet] = useState(initialAddress?.street || '');
  const [apartment, setApartment] = useState(initialAddress?.apartment || '');
  const [landmark, setLandmark] = useState(initialAddress?.landmark || '');
  const [city, setCity] = useState(initialAddress?.city || 'Indiranagar, Bengaluru');
  const [pincode, setPincode] = useState(initialAddress?.pincode || '560038');
  const [instructions, setInstructions] = useState(initialAddress?.instructions || '');
  const [gateCode, setGateCode] = useState(initialAddress?.gateCode || '');
  const [contactName, setContactName] = useState(initialAddress?.contactName || 'Elena Vance');
  const [contactPhone, setContactPhone] = useState(initialAddress?.contactPhone || '+91 98450 12891');
  const [isDefault, setIsDefault] = useState(initialAddress?.isDefault ?? true);
  const [detectedGps, setDetectedGps] = useState(false);

  if (!isOpen) return null;

  const quickInstructions = [
    'Ring doorbell once',
    'Leave at doorstep',
    'Hand over with PIN only',
    'Call upon arrival',
    'Leave with security / lobby',
    'Do not ring (baby sleeping)',
  ];

  const handleApplyInstruction = (inst: string) => {
    if (instructions.includes(inst)) {
      setInstructions(instructions.replace(inst, '').replace(/,\s*,/g, ',').trim());
    } else {
      setInstructions(instructions ? `${instructions}, ${inst}` : inst);
    }
  };

  const handleSimulateGps = () => {
    setDetectedGps(true);
    setStreet('100 Feet Rd, HAL 2nd Stage, Defence Colony');
    setCity('Indiranagar, Bengaluru');
    setPincode('560038');
    setLandmark('Opposite Toit & Starbucks');
    if (!label || label === 'Home Penthouse') {
      setLabel('Current Location (GPS Pin)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !apartment.trim()) {
      alert('Please fill in your street and apartment/flat details.');
      return;
    }

    const newAddress: DeliveryAddress = {
      id: initialAddress?.id || `addr-${Date.now()}`,
      label: label.trim() || (tag === 'home' ? 'Home' : tag === 'work' ? 'Work' : 'Other'),
      tag,
      street,
      apartment,
      landmark,
      city,
      pincode,
      instructions,
      gateCode,
      contactName,
      contactPhone,
      isDefault,
    };

    onSaveAddress(newAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 font-serif">
      <div 
        id="delivery-address-modal"
        className="w-full max-w-xl bg-white dark:bg-[#191714] rounded-3xl shadow-2xl border-2 border-[#c5a059]/40 dark:border-[#c5a059]/30 overflow-hidden my-6 animate-in zoom-in-95 duration-200 text-[#171513] dark:text-[#f5ebd7] transition-colors"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#faf7f2] dark:bg-[#201d19] border-b border-[#ded5c4] dark:border-[#2d2720] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f5ebd7] dark:bg-[#2c2017] text-[#781d18] dark:text-[#dfc285] border border-[#c5a059]/40 flex items-center justify-center font-bold shadow-xs">
              <MapPin className="w-5 h-5 text-[#c5a059]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#171513] dark:text-[#f5ebd7] font-display">
                {initialAddress ? 'Modify Delivery Residence' : 'Register Delivery Residence'}
              </h3>
              <p className="text-xs text-[#5a524a] dark:text-[#a89b8c]">
                Precision GPS coordinates & Chauffeur Privé arrival protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-[#8c7e6f] hover:bg-[#f5f0e6] dark:hover:bg-[#2a241e] hover:text-[#171513] dark:hover:text-[#f5ebd7] flex items-center justify-center transition-colors cursor-pointer border border-[#ded5c4] dark:border-[#383127]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* GPS Auto-Detect Banner */}
          <div className="p-3.5 rounded-2xl bg-[#f5f0e6] dark:bg-[#231f1a] border border-[#ded5c4] dark:border-[#2d2720] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#1a1714] text-[#781d18] dark:text-[#dfc285] flex items-center justify-center shadow-xs border border-[#ded5c4] dark:border-[#383127]">
                <Navigation className="w-4 h-4 text-[#c5a059]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] block font-display">Use Live Satellite Coordinates</span>
                <span className="text-[11px] text-[#5a524a] dark:text-[#a89b8c]">
                  {detectedGps ? 'GPS Coordinates locked at Indiranagar 100ft Rd' : 'Pinpoint your exact hearth delivery pod drop'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSimulateGps}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#2d261e] hover:bg-[#171513] dark:hover:bg-[#3d3328] hover:text-white border border-[#ded5c4] dark:border-[#42392c] text-xs font-bold text-[#171513] dark:text-[#f5ebd7] transition-all cursor-pointer shadow-xs shrink-0"
            >
              {detectedGps ? '✓ Re-Pin Satellite' : 'Auto Detect'}
            </button>
          </div>

          {/* Address Tag / Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] flex items-center justify-between font-display">
              <span>Residence Archetype</span>
              <span className="text-[11px] text-[#8c7e6f] dark:text-[#7d7164] font-normal font-serif">Select drop protocol</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setTag('home'); if (!initialAddress) setLabel('Home Penthouse'); }}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tag === 'home'
                    ? 'border-[#c5a059] bg-[#f5ebd7] dark:bg-[#34241a] text-[#781d18] dark:text-[#dfc285] shadow-xs'
                    : 'border-[#ded5c4] dark:border-[#2d2720] text-[#5a524a] dark:text-[#baa997] hover:bg-[#f5f0e6] dark:hover:bg-[#241f1a]'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Residence</span>
              </button>
              <button
                type="button"
                onClick={() => { setTag('work'); if (!initialAddress) setLabel('Work Studio'); }}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tag === 'work'
                    ? 'border-[#c5a059] bg-[#f5ebd7] dark:bg-[#34241a] text-[#781d18] dark:text-[#dfc285] shadow-xs'
                    : 'border-[#ded5c4] dark:border-[#2d2720] text-[#5a524a] dark:text-[#baa997] hover:bg-[#f5f0e6] dark:hover:bg-[#241f1a]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Executive Office</span>
              </button>
              <button
                type="button"
                onClick={() => { setTag('other'); if (!initialAddress) setLabel('Private Loft'); }}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tag === 'other'
                    ? 'border-[#c5a059] bg-[#f5ebd7] dark:bg-[#34241a] text-[#781d18] dark:text-[#dfc285] shadow-xs'
                    : 'border-[#ded5c4] dark:border-[#2d2720] text-[#5a524a] dark:text-[#baa997] hover:bg-[#f5f0e6] dark:hover:bg-[#241f1a]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Private Loft / Villa</span>
              </button>
            </div>
          </div>

          {/* Label Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7]">Address Nickname</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Penthouse Residence, Design Atelier"
              className="w-full px-3.5 py-2 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] text-xs font-medium text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059] bg-white dark:bg-[#221e1a]"
              required
            />
          </div>

          {/* Street & Apartment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7]">Street / Road / Colony *</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. 742 Evergreen Terrace, 12th Main Road"
                className="w-full px-3.5 py-2 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] text-xs font-medium text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059] bg-white dark:bg-[#221e1a]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7]">Flat / House / Suite *</label>
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="e.g. Apt 4B (Tower 2, 4th Floor)"
                className="w-full px-3.5 py-2 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] text-xs font-medium text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059] bg-white dark:bg-[#221e1a]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7]">Nearby Landmark</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite Defence Colony Park"
                className="w-full px-3.5 py-2 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] text-xs font-medium text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059] bg-white dark:bg-[#221e1a]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7]">City & Area *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Indiranagar, Bengaluru"
                className="w-full px-3.5 py-2 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] text-xs font-medium text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059] bg-white dark:bg-[#221e1a]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7]">Pincode / Postal Code *</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 560038"
                className="w-full px-3.5 py-2 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] text-xs font-medium text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059] bg-white dark:bg-[#221e1a]"
                required
              />
            </div>
          </div>

          {/* Gate Access Code & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-[#c5a059]" />
                <span>Gate / Intercom</span>
              </label>
              <input
                type="text"
                value={gateCode}
                onChange={(e) => setGateCode(e.target.value)}
                placeholder="#4829 or Buzzer 4B"
                className="w-full px-3 py-2 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] text-xs font-medium text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059] bg-white dark:bg-[#221e1a]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1">
                <User className="w-3 h-3 text-[#c5a059]" />
                <span>Contact Person</span>
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Recipient name"
                className="w-full px-3 py-2 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] text-xs font-medium text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059] bg-white dark:bg-[#221e1a]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#c5a059]" />
                <span>Phone for Delivery</span>
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98450 12891"
                className="w-full px-3 py-2 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] text-xs font-medium text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059] bg-white dark:bg-[#221e1a]"
                required
              />
            </div>
          </div>

          {/* Delivery Instructions & Quick Presets */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] flex items-center justify-between font-display">
              <span>Chauffeur Privé Instructions</span>
              <span className="text-[11px] text-[#8c7e6f] dark:text-[#7d7164] font-normal font-serif">Thermal pod hand-off protocol</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickInstructions.map((item) => {
                const isSelected = instructions.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleApplyInstruction(item)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#781d18] to-[#5c1511] text-white border-[#781d18] font-bold shadow-xs'
                        : 'bg-[#f5f0e6] dark:bg-[#25201a] text-[#5a524a] dark:text-[#baa997] border-[#ded5c4] dark:border-[#2d2720] hover:bg-[#ede6d8] dark:hover:bg-[#2e261f]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{item}
                  </button>
                );
              })}
            </div>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={2}
              placeholder="e.g. Ring buzzer 4B. If unavailable, leave with private lobby concierge."
              className="w-full p-3.5 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] text-xs text-[#171513] dark:text-[#f5ebd7] focus:outline-none focus:border-[#c5a059] bg-[#f5f0e6]/50 dark:bg-[#221e1a] resize-none"
            />
          </div>

          {/* Default Address Opt-in Checkbox */}
          <div className="p-3.5 rounded-2xl bg-[#f5f0e6] dark:bg-[#231f1a] border border-[#ded5c4] dark:border-[#2d2720] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
              <div>
                <span className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] block font-display">Save as Primary Delivery Destination</span>
                <span className="text-[11px] text-[#5a524a] dark:text-[#a89b8c]">Auto-select for 1-Click Hearth Dispatch</span>
              </div>
            </div>
            <input
              type="checkbox"
              id="opt-in-default-address"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 accent-[#781d18] rounded cursor-pointer"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#ded5c4] dark:border-[#2d2720]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#ded5c4] dark:border-[#2d2720] text-xs font-bold text-[#5a524a] dark:text-[#baa997] hover:bg-[#f5f0e6] dark:hover:bg-[#28221c] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#781d18] to-[#5c1511] hover:from-[#601410] hover:to-[#450e0a] text-white text-xs font-bold shadow-md border border-[#c5a059]/40 transition-all hover:scale-102 cursor-pointer flex items-center gap-1.5 font-serif tracking-wide"
            >
              <Check className="w-4 h-4 text-[#dfc285]" />
              <span>Save & Confirm Destination</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
