export type Currency = 'INR' | 'USD';
export type ThemeMode = 'light' | 'dark';

export type DietaryTag = 'Vegetarian' | 'Spicy' | 'Chef Reserve' | 'Halal' | 'Gluten-Free' | 'Contains Dairy' | 'Nut-Free';

export interface CrustOption {
  id: string;
  name: string;
  description: string;
  priceUsd: number;
  priceInr: number;
  tag?: string;
  isDefault?: boolean;
}

export interface AddOnOption {
  id: string;
  name: string;
  description: string;
  priceUsd: number;
  priceInr: number;
  category: 'finishes' | 'cheese' | 'spices';
}

export interface PairingOption {
  id: string;
  name: string;
  description: string;
  priceUsd: number;
  priceInr: number;
  volume?: string;
  image?: string;
}

export interface Dish {
  id: string;
  name: string;
  category: 'Gourmet Pizzas' | 'Smash Burgers' | 'Artisan Pastas' | 'Crispy Wings & Sides' | 'Drinks & Refreshers' | 'Decadent Desserts';
  description: string;
  sensoryDescription?: string;
  priceUsd: number;
  priceInr: number;
  prepTime: string;
  calories: number;
  serves: string;
  rating: number;
  reviewCount: number;
  image: string;
  isSignature?: boolean;
  fermentation?: string;
  dietary: DietaryTag[];
  crustOptions?: CrustOption[];
  addOns?: AddOnOption[];
  pairings?: PairingOption[];
}

export interface CartItem {
  cartItemId: string;
  dish: Dish;
  selectedCrust?: CrustOption;
  selectedAddOns: AddOnOption[];
  selectedPairings: PairingOption[];
  cookingInstructions: string[];
  customNote?: string;
  quantity: number;
}

export interface CourierDriver {
  name: string;
  rating: number;
  deliveriesCount: number;
  vehicle: string;
  plate: string;
  avatar: string;
  phone: string;
  etaMinutes: number;
  distanceKm: number;
}

export interface OrderTrackingStep {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  completed: boolean;
  active: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  placedAt: string;
  estimatedDelivery: string;
  status: 'In Hearth' | 'Dispatched' | 'Delivered' | 'Scheduled';
  courier: CourierDriver;
  handOffPin: string;
  address: {
    label: string;
    street: string;
    apartment: string;
    city: string;
    instructions: string;
  };
  items: {
    dishName: string;
    quantity: number;
    customizations: string[];
    priceUsd: number;
    priceInr: number;
  }[];
  subtotalUsd: number;
  subtotalInr: number;
  deliveryFeeUsd: number;
  deliveryFeeInr: number;
  taxUsd: number;
  taxInr: number;
  discountUsd: number;
  discountInr: number;
  totalUsd: number;
  totalInr: number;
  pointsEarned: number;
  chamberTempCelsius: number;
}

export interface LoyaltyTier {
  name: string;
  badge: string;
  pointsRequired: number;
  color: string;
  multiplier: string;
}

export interface DeliveryAddress {
  id: string;
  label: string; // e.g. "Penthouse Residence", "Design Studio", "Koramangala Loft"
  tag: 'home' | 'work' | 'other';
  street: string;
  apartment: string;
  landmark?: string;
  city: string;
  pincode: string;
  instructions: string;
  gateCode?: string;
  contactName: string;
  contactPhone: string;
  isDefault?: boolean;
}

export type DeliverySpeed = 'express' | 'standard' | 'scheduled';

export interface PackagingOption {
  id: 'eco' | 'luxury_seal' | 'minimal';
  title: string;
  subtitle: string;
  priceInr: number;
  priceUsd: number;
  tag?: string;
}

export type PaymentMethodCategory = 'upi' | 'card' | 'wallet' | 'netbanking' | 'cod';

export interface SavedCard {
  id: string;
  bankName: string;
  cardType: 'visa' | 'mastercard' | 'amex';
  last4: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  gradient: string;
}

export interface RewardItem {
  id: string;
  title: string;
  category: string;
  pointsCost: number;
  image: string;
  description: string;
  unlocked?: boolean;
}
