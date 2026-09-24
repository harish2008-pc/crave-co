import React, { useState, useEffect } from 'react';
import { Currency, ThemeMode, Dish, CartItem, CrustOption, AddOnOption, PairingOption, Order, DeliveryAddress } from './types';
import { DISHES, ACTIVE_ORDER, INITIAL_DELIVERY_ADDRESSES } from './data/mockData';
import { DashboardSidebar } from './components/DashboardSidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { MenuScreen } from './components/MenuScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { LiveTrackingScreen } from './components/LiveTrackingScreen';
import { PastOrdersAndClubScreen } from './components/PastOrdersAndClubScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { AddressModal } from './components/AddressModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { DishCustomizerModal } from './components/DishCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { ChatModal } from './components/ChatModal';
import { PreferencesModal } from './components/PreferencesModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { 
  Flame, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Clock,
  Heart
} from 'lucide-react';

export default function App() {
  // Navigation screen
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'dashboard' | 'tracking' | 'club' | 'checkout'>('menu');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [theme, setTheme] = useState<ThemeMode>('dark'); // Dark theme primary

  // Apply dark class to documentElement
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Orders
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartItemId: 'item-initial-1',
      dish: DISHES[0], // Truffle & Wild Mushroom Pizza
      selectedCrust: DISHES[0].crustOptions?.[0],
      selectedAddOns: [DISHES[0].addOns![0]], // Fresh Shaved Black Summer Truffle
      selectedPairings: [],
      cookingInstructions: ['Cut in 6 slices'],
      customNote: 'Extra basil infused oil',
      quantity: 1,
    },
  ]);

  const [activeOrder, setActiveOrder] = useState<Order>(ACTIVE_ORDER);
  const [userPoints, setUserPoints] = useState<number>(2450);

  // Modals
  const [customizingDish, setCustomizingDish] = useState<Dish | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialTab, setChatInitialTab] = useState<'courier' | 'concierge'>('courier');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isGlobalAddressModalOpen, setIsGlobalAddressModalOpen] = useState(false);
  const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Feedback Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Currency toggle
  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'INR' ? 'USD' : 'INR'));
  };

  // Cart actions
  const handleAddToCart = (
    dish: Dish,
    selectedCrust: CrustOption | undefined,
    selectedAddOns: AddOnOption[],
    selectedPairings: PairingOption[],
    cookingInstructions: string[],
    customNote: string,
    quantity: number
  ) => {
    const newItem: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      dish,
      selectedCrust,
      selectedAddOns,
      selectedPairings,
      cookingInstructions,
      customNote,
      quantity,
    };

    setCartItems((prev) => [...prev, newItem]);
    showToast(`Added ${quantity}× "${dish.name}" to your bag!`);
  };

  const handleQuickAdd = (dish: Dish) => {
    const defaultCrust = dish.crustOptions?.find((c) => c.isDefault) || dish.crustOptions?.[0];
    const newItem: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      dish,
      selectedCrust: defaultCrust,
      selectedAddOns: [],
      selectedPairings: [],
      cookingInstructions: ['Cut in 6 slices'],
      quantity: 1,
    };

    setCartItems((prev) => [...prev, newItem]);
    showToast(`Added "${dish.name}" to your dining bag!`);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from your bag.');
  };

  // Cart total counts & subtotal
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const calculateSubtotalUsd = () => {
    return cartItems.reduce((acc, item) => {
      let itemPrice = item.dish.priceUsd;
      if (item.selectedCrust) itemPrice += item.selectedCrust.priceUsd;
      item.selectedAddOns?.forEach((addon) => (itemPrice += addon.priceUsd));
      item.selectedPairings?.forEach((pair) => (itemPrice += pair.priceUsd));
      return acc + itemPrice * item.quantity;
    }, 0);
  };

  const cartSubtotal = calculateSubtotalUsd();

  const handleTriggerCheckout = () => {
    setIsCartOpen(false);
    setCurrentScreen('checkout');
  };

  const handleReorder = (itemsText: string) => {
    const itemNames = itemsText.split(',');
    let count = 0;
    itemNames.forEach((raw) => {
      const clean = raw.replace(/\b\d+x\b/i, '').trim().toLowerCase();
      const foundDish = DISHES.find((d) => d.name.toLowerCase().includes(clean)) || DISHES[0];
      handleQuickAdd(foundDish);
      count++;
    });
    showToast(`Re-added ${count} dishes to your dining bag!`);
    setIsCartOpen(true);
  };

  const handlePlaceFinalOrder = (order: Order) => {
    setActiveOrder(order);
    setCartItems([]);
    setUserPoints((prev) => prev + (order.pointsEarned || 150));
    setIsOrderSuccessModalOpen(true);
    setCurrentScreen('tracking');
    showToast(`🔥 Order #${order.orderNumber} placed & dispatched to 815°F Oak Hearth!`);
  };

  return (
    <div 
      id="dashboard-root"
      className="h-screen w-screen overflow-hidden bg-[#0f0e0d] text-[#f7f4ee] flex p-2 sm:p-3 md:p-3.5 gap-2 sm:gap-3 md:gap-3.5 font-sans select-none dark antialiased"
    >
      {/* High-Visibility Notification Toast */}
      {toastMessage && (
        <div 
          id="global-toast-notification"
          className="fixed top-5 right-5 z-50 bg-[#1c1916] text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-[#c5a059] flex items-center gap-3 animate-in slide-in-from-top duration-300 text-xs sm:text-sm font-bold max-w-md font-sans"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#781d18] to-[#992620] text-[#dfc285] flex items-center justify-center shrink-0 shadow-sm border border-[#c5a059]/40">
            <Flame className="w-4 h-4 fill-[#dfc285] text-[#dfc285]" />
          </div>
          <div className="flex-1 leading-snug">
            {toastMessage}
          </div>
        </div>
      )}

      {/* 1 & 2. Fixed, Narrow Vertical Sidebar on the Left */}
      <DashboardSidebar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenChat={() => {
          setChatInitialTab('concierge');
          setIsChatOpen(true);
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currency}
        onToggleCurrency={toggleCurrency}
      />

      {/* 1. Main Content Container on the Right (Rounded Card Style) */}
      <div 
        id="dashboard-main-container"
        className="flex-1 h-full bg-[#161412] border border-[#2a2520] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative"
      >
        {/* 3. Top Header Bar Layout */}
        <DashboardHeader
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          cartCount={totalCartCount}
          cartSubtotal={currency === 'INR' ? calculateSubtotalUsd() : cartSubtotal}
          currency={currency}
          onOpenCart={() => setIsCartOpen(true)}
          hasActiveOrder={Boolean(activeOrder)}
          onOpenNotifications={() => setCurrentScreen('tracking')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 bg-[#161412]">
          {/* Dining / In-Room Dining Menu (4. Page Title, 5. Product Grid, 6. Pagination) */}
          {currentScreen === 'menu' && (
            <MenuScreen
              dishes={DISHES}
              currency={currency}
              onSelectDishToCustomize={(dish) => setCustomizingDish(dish)}
              onQuickAdd={handleQuickAdd}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              cartCount={totalCartCount}
              cartTotal={calculateSubtotalUsd()}
              onOpenCart={() => setIsCartOpen(true)}
            />
          )}

          {/* Kitchen & Hearth Dashboard */}
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              currency={currency}
              activeOrder={activeOrder}
              userPoints={userPoints}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onQuickAdd={handleQuickAdd}
              onOpenPreferences={() => setIsPreferencesOpen(true)}
              onOpenAddressModal={() => setIsGlobalAddressModalOpen(true)}
            />
          )}

          {/* Checkout Screen */}
          {currentScreen === 'checkout' && (
            <CheckoutScreen
              cartItems={cartItems}
              currency={currency}
              userPoints={userPoints}
              onPlaceOrder={handlePlaceFinalOrder}
              onBackToMenu={() => setCurrentScreen('menu')}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          )}

          {/* Services & Live Tracking */}
          {currentScreen === 'tracking' && (
            <LiveTrackingScreen
              order={activeOrder}
              currency={currency}
              onOpenChat={(tab = 'courier') => {
                setChatInitialTab(tab);
                setIsChatOpen(true);
              }}
              onNavigateMenu={() => setCurrentScreen('menu')}
            />
          )}

          {/* My Orders & Privé Club */}
          {currentScreen === 'club' && (
            <PastOrdersAndClubScreen
              userPoints={userPoints}
              onDeductPoints={(pts) => {
                setUserPoints((prev) => Math.max(0, prev - pts));
                showToast(`Redeemed perk for ${pts} Bellissimo Club Points!`);
              }}
              currency={currency}
              onTrackOrder={() => setCurrentScreen('tracking')}
              onReorder={handleReorder}
              onOpenPreferences={() => setIsPreferencesOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Gastronomic Voice Assistant Modal (Alta Voce) */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        dishes={DISHES}
        currency={currency}
        onQuickAdd={handleQuickAdd}
        onSearchChange={setSearchQuery}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenCart={() => setIsCartOpen(true)}
        onShowToast={showToast}
      />

      {/* Dish Customizer Modal */}
      {customizingDish && (
        <DishCustomizerModal
          dish={customizingDish}
          currency={currency}
          onClose={() => setCustomizingDish(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleTriggerCheckout}
      />

      {/* Live In-App Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        courier={activeOrder.courier}
        initialTab={chatInitialTab}
      />

      {/* Dietary Profile Preferences Modal */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        theme={theme}
        onSelectTheme={setTheme}
        onSave={() => {
          showToast('Updated Elena’s taste profile & dining preferences!');
        }}
      />

      {/* Global Address Opt-in / Management Modal */}
      <AddressModal
        isOpen={isGlobalAddressModalOpen}
        onClose={() => setIsGlobalAddressModalOpen(false)}
        onSaveAddress={(savedAddr) => {
          showToast(`Address "${savedAddr.label}" saved as preferred drop point!`);
        }}
      />

      {/* Prominent Celebratory Order Placed Modal */}
      <OrderSuccessModal
        isOpen={isOrderSuccessModalOpen}
        order={activeOrder}
        currency={currency}
        onClose={() => setIsOrderSuccessModalOpen(false)}
        onTrackOrder={() => {
          setIsOrderSuccessModalOpen(false);
          setCurrentScreen('tracking');
        }}
        onViewMenu={() => {
          setIsOrderSuccessModalOpen(false);
          setCurrentScreen('menu');
        }}
      />
    </div>
  );
}
