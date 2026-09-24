import React, { useState, useMemo, useEffect } from 'react';
import { Dish, Currency } from '../types';
import { 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  SlidersHorizontal,
  X,
  Clock,
  Star,
  RotateCcw,
  Check,
  Filter,
  ArrowUpDown,
  Tag,
  ChevronDown
} from 'lucide-react';

interface MenuScreenProps {
  dishes: Dish[];
  currency: Currency;
  onSelectDishToCustomize: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
  searchQuery: string;
  onSearchChange?: (q: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

type DietaryFilterType = 'all' | 'veg' | 'non-veg' | 'gluten-free' | 'spicy' | 'chef-reserve';
type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc' | 'prep-time';
type PriceRangeOption = 'all' | 'under-500' | '500-1000' | 'above-1000';

export const MenuScreen: React.FC<MenuScreenProps> = ({
  dishes,
  currency,
  onSelectDishToCustomize,
  onQuickAdd,
  searchQuery: externalSearchQuery,
  onSearchChange,
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [priceRange, setPriceRange] = useState<PriceRangeOption>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlySignature, setOnlySignature] = useState<boolean>(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; // Exactly 4 columns × 2 rows = 8 items per view

  const categories = [
    'All',
    'Gourmet Breakfast',
    'Starters & Soups',
    'Gourmet Pizzas',
    'Artisan Pastas',
    'Smash Burgers',
    'Crispy Wings & Sides',
    'Decadent Desserts',
    'Drinks & Refreshers',
  ];

  // Combined search from top header and secondary row search input
  const activeSearch = (localSearch || externalSearchQuery || '').trim().toLowerCase();

  // Check if any filters are currently active
  const hasActiveFilters = useMemo(() => {
    return (
      activeCategory !== 'All' ||
      dietaryFilter !== 'all' ||
      sortBy !== 'recommended' ||
      priceRange !== 'all' ||
      minRating > 0 ||
      onlySignature ||
      Boolean(activeSearch)
    );
  }, [activeCategory, dietaryFilter, sortBy, priceRange, minRating, onlySignature, activeSearch]);

  // Count active non-default filters (excluding plain category or including)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== 'All') count++;
    if (dietaryFilter !== 'all') count++;
    if (sortBy !== 'recommended') count++;
    if (priceRange !== 'all') count++;
    if (minRating > 0) count++;
    if (onlySignature) count++;
    if (activeSearch) count++;
    return count;
  }, [activeCategory, dietaryFilter, sortBy, priceRange, minRating, onlySignature, activeSearch]);

  // Clear all filters handler
  const handleClearAllFilters = () => {
    setActiveCategory('All');
    setDietaryFilter('all');
    setSortBy('recommended');
    setPriceRange('all');
    setMinRating(0);
    setOnlySignature(false);
    setLocalSearch('');
    if (onSearchChange) {
      onSearchChange('');
    }
    setCurrentPage(1);
  };

  // Filtered & Sorted dishes
  const filteredDishes = useMemo(() => {
    let result = dishes.filter((dish) => {
      // 1. Search Query
      if (activeSearch) {
        const matchName = dish.name.toLowerCase().includes(activeSearch);
        const matchDesc = dish.description.toLowerCase().includes(activeSearch);
        const matchCategory = dish.category.toLowerCase().includes(activeSearch);
        const matchDietary = dish.dietary.some((d) => d.toLowerCase().includes(activeSearch));
        if (!matchName && !matchDesc && !matchCategory && !matchDietary) return false;
      }

      // 2. Category Filter
      if (activeCategory !== 'All') {
        if (activeCategory === 'Gourmet Breakfast') {
          const match =
            dish.category === 'Drinks & Refreshers' ||
            dish.id.includes('cannoli') ||
            dish.id.includes('calzone') ||
            dish.id.includes('sparkler') ||
            dish.id.includes('espresso');
          if (!match) return false;
        } else if (activeCategory === 'Starters & Soups') {
          const match =
            dish.category === 'Crispy Wings & Sides' ||
            dish.id.includes('arancini') ||
            dish.id.includes('burrata') ||
            dish.id.includes('broccolini');
          if (!match) return false;
        } else if (dish.category !== activeCategory) {
          return false;
        }
      }

      // 3. Dietary Preferences
      const isVeg = dish.dietary.includes('Vegetarian');
      if (dietaryFilter === 'veg' && !isVeg) return false;
      if (dietaryFilter === 'non-veg' && isVeg) return false;
      if (
        dietaryFilter === 'gluten-free' &&
        !dish.dietary.includes('Gluten-Free') &&
        !dish.crustOptions?.some((c) => c.tag === 'Gluten-Free')
      )
        return false;
      if (dietaryFilter === 'spicy' && !dish.dietary.includes('Spicy')) return false;
      if (
        dietaryFilter === 'chef-reserve' &&
        !dish.dietary.includes('Chef Reserve') &&
        !dish.isSignature
      )
        return false;

      // 4. Chef's Signature Only
      if (onlySignature && !dish.isSignature) return false;

      // 5. Minimum Rating
      if (minRating > 0 && dish.rating < minRating) return false;

      // 6. Price Range
      const effectivePrice = currency === 'INR' ? dish.priceInr : dish.priceUsd;
      if (currency === 'INR') {
        if (priceRange === 'under-500' && effectivePrice >= 500) return false;
        if (priceRange === '500-1000' && (effectivePrice < 500 || effectivePrice > 1000)) return false;
        if (priceRange === 'above-1000' && effectivePrice <= 1000) return false;
      } else {
        if (priceRange === 'under-500' && effectivePrice >= 15) return false;
        if (priceRange === '500-1000' && (effectivePrice < 15 || effectivePrice > 25)) return false;
        if (priceRange === 'above-1000' && effectivePrice <= 25) return false;
      }

      return true;
    });

    // Sort Dishes
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) =>
        currency === 'INR' ? a.priceInr - b.priceInr : a.priceUsd - b.priceUsd
      );
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) =>
        currency === 'INR' ? b.priceInr - a.priceInr : b.priceUsd - a.priceUsd
      );
    } else if (sortBy === 'rating-desc') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'prep-time') {
      const getMinutes = (d: Dish) => {
        const match = d.prepTime.match(/\d+/);
        return match ? parseInt(match[0], 10) : 30;
      };
      result = [...result].sort((a, b) => getMinutes(a) - getMinutes(b));
    }

    return result;
  }, [
    dishes,
    activeCategory,
    activeSearch,
    dietaryFilter,
    sortBy,
    priceRange,
    minRating,
    onlySignature,
    currency,
  ]);

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeCategory,
    activeSearch,
    dietaryFilter,
    sortBy,
    priceRange,
    minRating,
    onlySignature,
  ]);

  // Pagination calculation
  const totalItems = filteredDishes.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedDishes = filteredDishes.slice(startIndex, startIndex + itemsPerPage);

  const formatPrice = (dish: Dish) => {
    if (currency === 'INR') {
      return `Price ₹${dish.priceInr}`;
    }
    return `Price $${Math.round(dish.priceUsd)}`;
  };

  const getDietaryLabel = (type: DietaryFilterType) => {
    switch (type) {
      case 'veg':
        return 'Vegetarian';
      case 'non-veg':
        return 'Non-Vegetarian';
      case 'gluten-free':
        return 'Gluten-Free';
      case 'spicy':
        return 'Spicy';
      case 'chef-reserve':
        return 'Chef Reserve';
      default:
        return 'All';
    }
  };

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'price-asc':
        return 'Price: Low to High';
      case 'price-desc':
        return 'Price: High to Low';
      case 'rating-desc':
        return 'Highest Rated';
      case 'prep-time':
        return 'Fastest Prep';
      default:
        return 'Curated';
    }
  };

  const getPriceRangeLabel = (range: PriceRangeOption) => {
    if (currency === 'INR') {
      switch (range) {
        case 'under-500':
          return '< ₹500';
        case '500-1000':
          return '₹500 - ₹1,000';
        case 'above-1000':
          return '> ₹1,000';
        default:
          return 'All Prices';
      }
    } else {
      switch (range) {
        case 'under-500':
          return '< $15';
        case '500-1000':
          return '$15 - $25';
        case 'above-1000':
          return '> $25';
        default:
          return 'All Prices';
      }
    }
  };

  return (
    <div 
      id="in-room-dining-container"
      className="p-4 sm:p-6 lg:p-7 flex flex-col min-h-full space-y-4 text-white font-sans max-w-7xl mx-auto w-full"
    >
      {/* 4. Page Title & Category Filter Bar */}
      <div className="space-y-4">
        {/* Left-Aligned Greeting Text & Subheader */}
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
            Good Evening, Guest
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#a89b8c] mt-0.5 font-sans">
            In-Room Dining &bull; Hearth Gastronomia
          </p>
        </div>

        {/* Horizontally Scrollable Row of Rounded Category Pills */}
        <div className="relative">
          <div 
            id="category-pill-row"
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar py-1"
          >
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#c5a059] to-[#dfc285] text-[#171513] border-[#c5a059] shadow-md shadow-[#c5a059]/20 font-bold scale-102'
                      : 'bg-[#201c18] text-[#a89b8c] border-[#332c25] hover:text-white hover:bg-[#2a241f]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Row: Total Count, Filters Option, Clear Filter Option, and Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-[#2a2520]">
          {/* Left: Item Count & Active Indicator */}
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#a89b8c]">
            <span>
              Total: <span className="text-white font-bold">{totalItems} items</span>
            </span>
            {hasActiveFilters && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c5a059]/15 text-[#dfc285] border border-[#c5a059]/30 font-medium">
                Filtered ({activeFiltersCount})
              </span>
            )}
          </div>

          {/* Right: Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Clear Filter Option Button (prominent whenever any filter is applied) */}
            {hasActiveFilters && (
              <button
                id="clear-filters-opt-btn"
                onClick={handleClearAllFilters}
                title="Reset and clear all active filters"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-[#291715] hover:bg-[#381c19] text-[#fca5a5] border border-[#991b1b]/50 hover:border-[#b91c1c] transition-all cursor-pointer shadow-sm active:scale-95 animate-in fade-in duration-200"
              >
                <RotateCcw className="w-3 h-3 text-[#fca5a5]" />
                <span>Clear Filters</span>
              </button>
            )}

            {/* Filters Option Button */}
            <button
              id="filters-opt-btn"
              onClick={() => setIsFilterPanelOpen((prev) => !prev)}
              aria-expanded={isFilterPanelOpen}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isFilterPanelOpen || (activeFiltersCount > 0 && !isFilterPanelOpen)
                  ? 'bg-gradient-to-r from-[#29221b] to-[#362c22] text-[#dfc285] border-[#c5a059] shadow-md shadow-[#c5a059]/15'
                  : 'bg-[#1c1916] text-[#a89b8c] border-[#332c25] hover:text-white hover:bg-[#25201a]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-[#c5a059] to-[#dfc285] text-[#171513] font-black text-[10px] flex items-center justify-center shadow-xs">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#a89b8c] transition-transform duration-200 ${
                  isFilterPanelOpen ? 'rotate-180 text-[#dfc285]' : ''
                }`}
              />
            </button>

            {/* Search Input Field */}
            <div className="relative flex-1 sm:w-64 min-w-[190px]">
              <Search className="w-3.5 h-3.5 text-[#a89b8c] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search or filter items..."
                className="w-full pl-9 pr-8 py-2 rounded-full bg-[#1c1916] border border-[#332c25] focus:border-[#c5a059] focus:outline-none text-xs text-white placeholder-[#7d7367] transition-colors font-sans"
              />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  title="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a89b8c] hover:text-white p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {isFilterPanelOpen && (
          <div 
            id="filters-drawer-panel"
            className="rounded-2xl bg-[#1a1714] border border-[#382f25] p-4 sm:p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2a2520]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#c5a059]" />
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  Refine Menu Filters
                </span>
                <span className="text-[11px] text-[#a89b8c]">
                  &bull; Select culinary preferences & sorting
                </span>
              </div>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAllFilters}
                    className="text-xs text-[#dfc285] hover:text-white flex items-center gap-1 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear all filters</span>
                  </button>
                )}
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="p-1 rounded-full bg-[#241f1a] text-[#a89b8c] hover:text-white hover:bg-[#2e2721] transition-colors cursor-pointer"
                  title="Close filter panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Options Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Dietary Filter */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#dfc285] uppercase tracking-wider flex items-center gap-1">
                  <span>Dietary Preference</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: 'all', label: 'All Dishes' },
                      { id: 'veg', label: '🌱 Pure Veg' },
                      { id: 'non-veg', label: '🥩 Non-Veg' },
                      { id: 'gluten-free', label: '🌾 Gluten-Free' },
                      { id: 'spicy', label: '🌶️ Spicy' },
                      { id: 'chef-reserve', label: '⭐ Reserve' },
                    ] as const
                  ).map((option) => {
                    const isSelected = dietaryFilter === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setDietaryFilter(option.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#c5a059] text-gray-950 font-bold border-[#c5a059] shadow-xs'
                            : 'bg-[#221d18] text-[#a89b8c] border-[#332c25] hover:text-white hover:bg-[#2a241f]'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Sort By */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#dfc285] uppercase tracking-wider flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3 text-[#c5a059]" />
                  <span>Sort Dishes By</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: 'recommended', label: 'Curated' },
                      { id: 'rating-desc', label: 'Highest Rated ★' },
                      { id: 'price-asc', label: 'Price: Low → High' },
                      { id: 'price-desc', label: 'Price: High → Low' },
                      { id: 'prep-time', label: 'Quickest Prep' },
                    ] as const
                  ).map((option) => {
                    const isSelected = sortBy === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#c5a059] text-gray-950 font-bold border-[#c5a059] shadow-xs'
                            : 'bg-[#221d18] text-[#a89b8c] border-[#332c25] hover:text-white hover:bg-[#2a241f]'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Price Range */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#dfc285] uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#c5a059]" />
                  <span>Price Range ({currency})</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: 'all', label: 'All' },
                      { id: 'under-500', label: currency === 'INR' ? '< ₹500' : '< $15' },
                      { id: '500-1000', label: currency === 'INR' ? '₹500 - ₹1,000' : '$15 - $25' },
                      { id: 'above-1000', label: currency === 'INR' ? '> ₹1,000' : '> $25' },
                    ] as const
                  ).map((option) => {
                    const isSelected = priceRange === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setPriceRange(option.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#c5a059] text-gray-950 font-bold border-[#c5a059] shadow-xs'
                            : 'bg-[#221d18] text-[#a89b8c] border-[#332c25] hover:text-white hover:bg-[#2a241f]'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Minimum Rating & Special Curations */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#dfc285] uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3 h-3 text-[#dfc285] fill-[#dfc285]" />
                  <span>Rating & Reserve</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setMinRating((prev) => (prev === 0 ? 4.5 : 0))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border flex items-center gap-1 ${
                      minRating === 4.5
                        ? 'bg-[#c5a059] text-gray-950 font-bold border-[#c5a059]'
                        : 'bg-[#221d18] text-[#a89b8c] border-[#332c25] hover:text-white hover:bg-[#2a241f]'
                    }`}
                  >
                    <span>4.5+ ★</span>
                  </button>

                  <button
                    onClick={() => setMinRating((prev) => (prev === 4.8 ? 0 : 4.8))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border flex items-center gap-1 ${
                      minRating === 4.8
                        ? 'bg-[#c5a059] text-gray-950 font-bold border-[#c5a059]'
                        : 'bg-[#221d18] text-[#a89b8c] border-[#332c25] hover:text-white hover:bg-[#2a241f]'
                    }`}
                  >
                    <span>4.8+ ★ Elite</span>
                  </button>

                  <button
                    onClick={() => setOnlySignature((prev) => !prev)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border flex items-center gap-1 ${
                      onlySignature
                        ? 'bg-[#c5a059] text-gray-950 font-bold border-[#c5a059]'
                        : 'bg-[#221d18] text-[#a89b8c] border-[#332c25] hover:text-white hover:bg-[#2a241f]'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-[#dfc285]" />
                    <span>Signature Only</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Panel Bottom Bar */}
            <div className="pt-3 border-t border-[#2a2520] flex items-center justify-between">
              <div className="text-xs text-[#a89b8c]">
                Found <span className="text-white font-bold">{totalItems}</span> matching culinary dishes
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAllFilters}
                    className="px-3.5 py-1.5 rounded-full bg-[#291715] text-[#fca5a5] hover:bg-[#381c19] text-xs font-bold border border-[#991b1b]/50 transition-colors cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="px-4 py-1.5 rounded-full bg-[#c5a059] hover:bg-[#dfc285] text-[#171513] font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Apply & Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Tag Bar (allows clearing individual or all active filters) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1 animate-in fade-in duration-150">
            <span className="text-[11px] font-semibold text-[#a89b8c] flex items-center gap-1">
              Active Filters:
            </span>

            {/* Category Filter Tag */}
            {activeCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#241f1a] text-xs font-medium text-[#f5ebd7] border border-[#3d3327]">
                <span>Category: {activeCategory}</span>
                <button
                  onClick={() => setActiveCategory('All')}
                  title="Remove category filter"
                  className="hover:text-[#fca5a5] p-0.5 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Dietary Filter Tag */}
            {dietaryFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#241f1a] text-xs font-medium text-[#f5ebd7] border border-[#3d3327]">
                <span>Diet: {getDietaryLabel(dietaryFilter)}</span>
                <button
                  onClick={() => setDietaryFilter('all')}
                  title="Remove dietary filter"
                  className="hover:text-[#fca5a5] p-0.5 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Sort Tag */}
            {sortBy !== 'recommended' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#241f1a] text-xs font-medium text-[#f5ebd7] border border-[#3d3327]">
                <span>Sort: {getSortLabel(sortBy)}</span>
                <button
                  onClick={() => setSortBy('recommended')}
                  title="Reset sort"
                  className="hover:text-[#fca5a5] p-0.5 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Price Range Tag */}
            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#241f1a] text-xs font-medium text-[#f5ebd7] border border-[#3d3327]">
                <span>Price: {getPriceRangeLabel(priceRange)}</span>
                <button
                  onClick={() => setPriceRange('all')}
                  title="Remove price filter"
                  className="hover:text-[#fca5a5] p-0.5 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Rating Tag */}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#241f1a] text-xs font-medium text-[#f5ebd7] border border-[#3d3327]">
                <span>Rating: {minRating}+ ★</span>
                <button
                  onClick={() => setMinRating(0)}
                  title="Remove rating filter"
                  className="hover:text-[#fca5a5] p-0.5 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Signature Only Tag */}
            {onlySignature && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#241f1a] text-xs font-medium text-[#f5ebd7] border border-[#3d3327]">
                <span>Signature Only</span>
                <button
                  onClick={() => setOnlySignature(false)}
                  title="Remove signature filter"
                  className="hover:text-[#fca5a5] p-0.5 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Search Query Tag */}
            {activeSearch && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#241f1a] text-xs font-medium text-[#f5ebd7] border border-[#3d3327]">
                <span>Search: &ldquo;{activeSearch}&rdquo;</span>
                <button
                  onClick={() => {
                    setLocalSearch('');
                    onSearchChange?.('');
                  }}
                  title="Clear search filter"
                  className="hover:text-[#fca5a5] p-0.5 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Quick Clear All Filters Pill */}
            <button
              id="tag-clear-all-btn"
              onClick={handleClearAllFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#291715] hover:bg-[#381c19] text-[#fca5a5] text-xs font-bold border border-[#991b1b]/50 transition-colors cursor-pointer"
              title="Clear all filters at once"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Product Grid Layout (Responsive 4-column CSS grid, 2 rows visible per view) */}
      {displayedDishes.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#1c1916] border border-[#2a2520] p-6 space-y-3">
          <p className="text-sm font-semibold text-[#a89b8c]">
            No culinary items found matching your current filter settings.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              id="empty-state-clear-filters-btn"
              onClick={handleClearAllFilters}
              className="px-4 py-2 rounded-full bg-[#c5a059] text-gray-950 font-bold text-xs hover:bg-[#dfc285] transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        </div>
      ) : (
        <div 
          id="product-grid"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-4.5"
        >
          {displayedDishes.map((dish) => {
            const isVegetarian = dish.dietary.includes('Vegetarian');

            return (
              <div
                key={dish.id}
                id={`card-${dish.id}`}
                className="group rounded-2xl bg-[#1c1916] border border-[#2e2721] hover:border-[#c5a059]/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top of Card: Edge-to-edge image container with top-left badge */}
                <div 
                  onClick={() => onSelectDishToCustomize(dish)}
                  className="relative h-44 sm:h-46 w-full overflow-hidden bg-[#12100e] cursor-pointer"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1916]/95 via-transparent to-black/25" />

                  {/* Absolute-positioned badge at the top-left */}
                  <div className="absolute top-3 left-3 flex items-center">
                    {isVegetarian ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/85 backdrop-blur-md text-emerald-300 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Vegetarian
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#3b1210]/85 backdrop-blur-md text-[#f8a39a] text-[10px] font-bold border border-[#a83228]/50 flex items-center gap-1 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e84a3d]"></span>
                        Non-Vegetarian
                      </span>
                    )}
                  </div>

                  {/* Top-Right: Rating Tag */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#dfc285] text-[10px] font-bold border border-white/10 font-mono">
                    <Star className="w-3 h-3 fill-[#dfc285] text-[#dfc285]" />
                    <span>{dish.rating}</span>
                  </div>
                </div>

                {/* Body of Card: Left-aligned food title directly below the image */}
                <div 
                  onClick={() => onSelectDishToCustomize(dish)}
                  className="px-4 pt-3 pb-1 cursor-pointer"
                >
                  <h3 className="font-bold text-sm text-white truncate group-hover:text-[#dfc285] transition-colors font-sans text-left">
                    {dish.name}
                  </h3>
                  <p className="text-[11px] text-[#a89b8c] mt-0.5 line-clamp-1 text-left font-sans">
                    {dish.description}
                  </p>
                </div>

                {/* Footer of Card: 2-column flex row at bottom with price left & "+ Add to Cart" right */}
                <div className="px-4 pb-3.5 pt-2 flex items-center justify-between mt-auto border-t border-[#2a2520]">
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#dfc285] font-sans">
                      {formatPrice(dish)}
                    </span>
                  </div>

                  <button
                    id={`add-btn-${dish.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdd(dish);
                    }}
                    title={`Add ${dish.name} to cart`}
                    className="rounded-full px-3.5 py-1.5 bg-gradient-to-r from-[#781d18] to-[#992620] hover:from-[#88211b] text-white font-bold text-xs shadow-md hover:scale-103 active:scale-98 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#dfc285]" />
                    <span>+ Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Bottom Pagination Bar */}
      <div 
        id="pagination-footer-bar"
        className="mt-auto pt-4 pb-2 border-t border-[#2a2520] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs text-[#a89b8c]"
      >
        {/* Left-align result counts */}
        <div className="text-left font-medium">
          Showing <span className="text-white font-bold">{totalItems === 0 ? 0 : startIndex + 1}</span> to{' '}
          <span className="text-white font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{' '}
          <span className="text-white font-bold">{totalItems}</span> items
        </div>

        {/* Right-align page navigation controls */}
        <div className="flex items-center gap-1.5">
          {/* Previous Page Arrow */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            title="Previous Page"
            className="w-8 h-8 rounded-full bg-[#201c18] border border-[#332c25] flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-[#2a241f] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Numbered Page Buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const isCurrent = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#c5a059] to-[#dfc285] text-[#171513] shadow-md shadow-[#c5a059]/25 scale-105'
                    : 'bg-[#201c18] text-[#a89b8c] border border-[#332c25] hover:text-white hover:bg-[#2a241f]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Page Arrow */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            title="Next Page"
            className="w-8 h-8 rounded-full bg-[#201c18] border border-[#332c25] flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-[#2a241f] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
