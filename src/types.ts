export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethodType = 'MOMO' | 'AIRTEL' | 'CARD' | 'CASH';
export type PaymentStatus = 'PAID' | 'PENDING' | 'UNPAID' | 'FAILED';
export type DeliveryMethod = 'DELIVERY' | 'PICKUP';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in RWF
  categoryId: string;
  categoryName: string;
  defaultImage: string; // AI generated default
  uploadedImage?: string | null; // Admin override
  isAvailable: boolean;
  isFeatured: boolean;
  isPopular?: boolean;
  badge?: string; // "NEW", "HOT", "BESTSELLER", "PROMO", "20% OFF"
  prepTimeMinutes?: number;
  calories?: number;
  spicyLevel?: 0 | 1 | 2 | 3;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: {
    spiciness?: string;
    drinkChoice?: string;
    extraSauce?: boolean;
  };
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string; // e.g. "ZST-84920"
  customerName: string;
  phone: string;
  email?: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  district?: string;
  sector?: string;
  pickupLocation?: string;
  instructions?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  createdAt: string;
  estimatedDeliveryTime: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  title: string;
  tagline: string;
  description: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED' | 'FREE_DELIVERY';
  discountValue: number;
  minOrderAmount: number;
  image: string;
  badge: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface DeliveryZone {
  id: string;
  district: string;
  sectors: string[];
  fee: number;
  estimatedMinutes: number;
  isActive: boolean;
}

export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  operatingHours: string;
  isActive: boolean;
}

export interface DeliverySettings {
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  minOrderAmount: number;
  defaultEstimatedDeliveryMinutes: number;
  zones: DeliveryZone[];
  pickupLocations: PickupLocation[];
}

export interface BusinessSettings {
  name: string;
  tagline: string;
  logoText: string;
  phone: string;
  supportEmail: string;
  address: string;
  city: string;
  openingHours: string;
  currency: string;
  currencySymbol: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    whatsapp?: string;
  };
  enabledPaymentMethods: {
    momo: boolean;
    airtel: boolean;
    card: boolean;
    cashOnDelivery: boolean;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  avatar?: string;
}
