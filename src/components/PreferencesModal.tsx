import React, { useState } from 'react';
import { X, Check, SlidersHorizontal, Sparkles, ShieldCheck, Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../types';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: string[]) => void;
  theme?: ThemeMode;
  onSelectTheme?: (theme: ThemeMode) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  theme = 'light',
  onSelectTheme,
}) => {
  const [dietary, setDietary] = useState('Vegetarian Lean');
  const [spiceLevel, setSpiceLevel] = useState('Fiery Hot Honey');
  const [allergies, setAllergies] = useState<string[]>(['No Peanuts', 'Nut Free']);
  const [ecoFriendly, setEcoFriendly] = useState(true);

  if (!isOpen) return null;

  const allergyOptions = [
    'No Peanuts',
    'Nut Free',
    'Shellfish Free',
    'Soy Free',
    'Low Sodium',
  ];

  const toggleAllergy = (a: string) => {
    if (allergies.includes(a)) {
      setAllergies(allergies.filter((item) => item !== a));
    } else {
      setAllergies([...allergies, a]);
    }
  };

  const handleSave = () => {
    onSave([dietary, spiceLevel, ...allergies]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-serif">
      <div 
        id="preferences-modal-dialog"
        className="w-full max-w-md bg-[#faf7f2] dark:bg-[#1a1815] rounded-3xl shadow-2xl border-2 border-[#c5a059]/40 overflow-hidden p-6 space-y-5"
      >
        <div className="flex items-center justify-between border-b border-[#ded5c4] dark:border-[#38322a] pb-3.5">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-4 h-4 text-[#c5a059]" />
            <h3 className="font-bold text-base text-[#171513] dark:text-[#f5ebd7] font-display">Bespoke Dining Palette</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-[#8c7e6f] dark:text-[#baa997] hover:bg-[#f5f0e6] dark:hover:bg-[#282420] hover:text-[#171513] dark:hover:text-[#f5ebd7] flex items-center justify-center transition-colors cursor-pointer border border-[#ded5c4] dark:border-[#38322a]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ambiance & Theme Mode */}
        {onSelectTheme && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display flex items-center justify-between">
              <span>Ambiance & Visual Theme</span>
              <span className="text-[10px] text-[#8c7e6f] dark:text-[#baa997] font-normal uppercase tracking-wider">
                {theme === 'dark' ? 'Notte (Dark)' : 'Giorno (Light)'}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="pref-theme-light-btn"
                onClick={() => onSelectTheme('light')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-[#c5a059] bg-[#f5ebd7] text-[#781d18] shadow-xs ring-1 ring-[#c5a059]/40'
                    : 'border-[#ded5c4] dark:border-[#38322a] bg-white dark:bg-[#221f1c] hover:bg-[#f5f0e6] dark:hover:bg-[#2a2622] text-[#5a524a] dark:text-[#c7bcae]'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Giorno (Light)</span>
              </button>
              <button
                type="button"
                id="pref-theme-dark-btn"
                onClick={() => onSelectTheme('dark')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-[#c5a059] bg-[#292218] text-[#dfc285] shadow-xs ring-1 ring-[#c5a059]/50'
                    : 'border-[#ded5c4] dark:border-[#38322a] bg-white dark:bg-[#221f1c] hover:bg-[#f5f0e6] dark:hover:bg-[#2a2622] text-[#5a524a] dark:text-[#c7bcae]'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-[#dfc285]" />
                <span>Notte (Dark)</span>
              </button>
            </div>
          </div>
        )}

        {/* Dietary Bias */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">Primary Gastronomic Preference</label>
          <div className="grid grid-cols-2 gap-2">
            {['Vegetarian Lean', 'Omnivore Gourmet', 'Pescatarian', 'Plant-Based'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDietary(item)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors cursor-pointer ${
                  dietary === item
                    ? 'border-[#c5a059] bg-[#f5ebd7] dark:bg-[#292218] text-[#781d18] dark:text-[#dfc285] shadow-xs'
                    : 'border-[#ded5c4] dark:border-[#38322a] bg-white dark:bg-[#221f1c] hover:bg-[#f5f0e6] dark:hover:bg-[#2a2622] text-[#5a524a] dark:text-[#c7bcae]'
                }`}
              >
                {dietary === item ? '✓ ' : ''}{item}
              </button>
            ))}
          </div>
        </div>

        {/* Spice Tolerance */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">Heat & Pepper Affinity</label>
          <div className="grid grid-cols-3 gap-2">
            {['Subtle & Mild', 'Artisan Medium', 'Fiery Hot Honey'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSpiceLevel(level)}
                className={`p-2 rounded-xl border text-xs font-semibold text-center transition-colors cursor-pointer ${
                  spiceLevel === level
                    ? 'border-[#c5a059] bg-[#f5ebd7] dark:bg-[#292218] text-[#781d18] dark:text-[#dfc285] shadow-xs'
                    : 'border-[#ded5c4] dark:border-[#38322a] bg-white dark:bg-[#221f1c] hover:bg-[#f5f0e6] dark:hover:bg-[#2a2622] text-[#5a524a] dark:text-[#c7bcae]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Allergies & Exclusions */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">Allergies & Exclusions (Kitchen Flagged)</label>
          <div className="flex flex-wrap gap-2">
            {allergyOptions.map((opt) => {
              const active = allergies.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleAllergy(opt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? 'border-[#781d18] bg-gradient-to-r from-[#781d18] to-[#5c1511] text-white font-bold shadow-xs'
                      : 'border-[#ded5c4] dark:border-[#38322a] bg-white dark:bg-[#221f1c] text-[#5a524a] dark:text-[#c7bcae] hover:bg-[#f5f0e6] dark:hover:bg-[#2a2622]'
                  }`}
                >
                  {active ? '✓ ' : '+ '}{opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Eco Packaging Toggle */}
        <div className="p-3.5 rounded-2xl bg-[#f5f0e6] dark:bg-[#221f1c] border border-[#ded5c4] dark:border-[#38322a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            <div>
              <div className="text-xs font-bold text-[#171513] dark:text-[#f5ebd7] font-display">Artisanal Eco Presentation</div>
              <div className="text-[11px] text-[#5a524a] dark:text-[#baa997]">FSC-certified Italian parchment & plant boxes</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEcoFriendly(!ecoFriendly)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              ecoFriendly ? 'bg-[#781d18]' : 'bg-[#ded5c4] dark:bg-[#38322a]'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                ecoFriendly ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#ded5c4] dark:border-[#38322a] text-xs font-bold text-[#5a524a] dark:text-[#c7bcae] hover:bg-[#f5f0e6] dark:hover:bg-[#221f1c] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#781d18] to-[#5c1511] hover:from-[#601410] hover:to-[#450e0a] text-white text-xs font-bold shadow-md border border-[#c5a059]/40 cursor-pointer font-serif tracking-wide"
          >
            Save Palette
          </button>
        </div>
      </div>
    </div>
  );
};
