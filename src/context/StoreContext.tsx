import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  Offer,
  DeliverySettings,
  BusinessSettings,
  AdminUser,
  PaymentStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_OFFERS,
  INITIAL_DELIVERY_SETTINGS,
  INITIAL_BUSINESS_SETTINGS,
  INITIAL_SAMPLE_ORDERS,
} from '../data/initialData';

export type AppView =
  | 'home'
  | 'menu'
  | 'offers'
  | 'about'
  | 'contact'
  | 'checkout'
  | 'confirmation'
  | 'tracking'
  | 'check-in'
  | 'admin';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  // Navigation
  activeTab: AppView;
  setActiveTab: (tab: AppView) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (p: Product | null) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductPrice: (id: string, newPrice: number) => void;
  uploadProductImage: (id: string, imageUrl: string) => void;
  removeProductImage: (id: string) => void;
  resetToDefaultProducts: () => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Offers
  offers: Offer[];
  appliedOffer: Offer | null;
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  updateOffer: (id: string, updates: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, options?: any, notes?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartDiscount: number;
  cartTotal: number;
  cartCount: number;

  // Orders
  orders: Order[];
  activeTrackingOrder: Order | null;
  lastConfirmedOrder: Order | null;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => void;
  trackOrderById: (orderId: string) => Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;

  // Settings
  deliverySettings: DeliverySettings;
  updateDeliverySettings: (settings: Partial<DeliverySettings>) => void;
  businessSettings: BusinessSettings;
  updateBusinessSettings: (settings: Partial<BusinessSettings>) => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'umujyi_products_v2',
  CATEGORIES: 'umujyi_categories_v2',
  OFFERS: 'umujyi_offers_v2',
  ORDERS: 'umujyi_orders_v2',
  DELIVERY_SETTINGS: 'umujyi_delivery_settings_v2',
  BUSINESS_SETTINGS: 'umujyi_business_settings_v2',
  CART: 'umujyi_cart_v2',
  ADMIN_AUTH: 'umujyi_admin_auth_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & View
  const [activeTab, setActiveTab] = useState<AppView>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('cat-all');
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Data states with localStorage initialization
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OFFERS);
      return saved ? JSON.parse(saved) : INITIAL_OFFERS;
    } catch {
      return INITIAL_OFFERS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_ORDERS;
    } catch {
      return INITIAL_SAMPLE_ORDERS;
    }
  });

  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELIVERY_SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_DELIVERY_SETTINGS;
    } catch {
      return INITIAL_DELIVERY_SETTINGS;
    }
  });

  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUSINESS_SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_BUSINESS_SETTINGS;
    } catch {
      return INITIAL_BUSINESS_SETTINGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);

  // Admin Auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    return isAdminAuthenticated
      ? {
          id: 'adm-1',
          name: 'Eric Nshuti',
          email: 'admin@umujyi.rw',
          role: 'ADMIN',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        }
      : null;
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    } catch (e) {
      console.error(e);
    }
  }, [offers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DELIVERY_SETTINGS, JSON.stringify(deliverySettings));
    } catch (e) {
      console.error(e);
    }
  }, [deliverySettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUSINESS_SETTINGS, JSON.stringify(businessSettings));
    } catch (e) {
      console.error(e);
    }
  }, [businessSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Auto free delivery if subtotal exceeds threshold or applied offer
  const isFreeDeliveryEligible =
    cartSubtotal >= deliverySettings.freeDeliveryThreshold ||
    (appliedOffer && appliedOffer.discountType === 'FREE_DELIVERY' && cartSubtotal >= appliedOffer.minOrderAmount);

  const cartDeliveryFee = cart.length === 0 ? 0 : isFreeDeliveryEligible ? 0 : deliverySettings.defaultDeliveryFee;

  let cartDiscount = 0;
  if (appliedOffer && cartSubtotal >= appliedOffer.minOrderAmount) {
    if (appliedOffer.discountType === 'PERCENT') {
      cartDiscount = Math.round((cartSubtotal * appliedOffer.discountValue) / 100);
    } else if (appliedOffer.discountType === 'FIXED') {
      cartDiscount = appliedOffer.discountValue;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + cartDeliveryFee - cartDiscount);

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, options?: any, notes?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          selectedOptions: options || updated[existingIndex].selectedOptions,
          notes: notes || updated[existingIndex].notes,
        };
        return updated;
      } else {
        return [...prev, { product, quantity, selectedOptions: options, notes }];
      }
    });
    showToast(`Added "${product.name}" to your cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedOffer(null);
  };

  // Product Operations
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" created successfully!`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
    // Also update any item in the cart matching this product
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id
          ? { ...item, product: { ...item.product, ...updates } }
          : item
      )
    );
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    showToast('Product deleted', 'info');
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice, updatedAt: new Date().toISOString() } : p))
    );
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id
          ? { ...item, product: { ...item.product, price: newPrice } }
          : item
      )
    );
    showToast('Product price updated', 'success');
  };

  const uploadProductImage = (id: string, imageUrl: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, uploadedImage: imageUrl, updatedAt: new Date().toISOString() } : p
      )
    );
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id
          ? { ...item, product: { ...item.product, uploadedImage: imageUrl } }
          : item
      )
    );
    showToast('Product image uploaded!', 'success');
  };

  const removeProductImage = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, uploadedImage: null, updatedAt: new Date().toISOString() } : p
      )
    );
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id
          ? { ...item, product: { ...item.product, uploadedImage: null } }
          : item
      )
    );
    showToast('Custom image removed. Displaying AI default image.', 'info');
  };

  const resetToDefaultProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOffers(INITIAL_OFFERS);
    setDeliverySettings(INITIAL_DELIVERY_SETTINGS);
    setBusinessSettings(INITIAL_BUSINESS_SETTINGS);
    showToast('Demo data reset to initial defaults', 'info');
  };

  // Categories Operations
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now().toString(36)}`,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Category updated', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted', 'info');
  };

  // Offers Operations
  const addOffer = (offerData: Omit<Offer, 'id'>) => {
    const newOffer: Offer = {
      ...offerData,
      id: `off-${Date.now().toString(36)}`,
    };
    setOffers((prev) => [newOffer, ...prev]);
    showToast(`Offer "${newOffer.title}" created`, 'success');
  };

  const updateOffer = (id: string, updates: Partial<Offer>) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    showToast('Offer updated', 'success');
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    if (appliedOffer?.id === id) {
      setAppliedOffer(null);
    }
    showToast('Offer removed', 'info');
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = offers.find((o) => o.isActive && o.code.toUpperCase() === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid promo code. Please check and try again.' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `This coupon requires a minimum basket of RWF ${found.minOrderAmount.toLocaleString()}`,
      };
    }
    setAppliedOffer(found);
    showToast(`Promo code "${found.code}" applied!`, 'success');
    return { success: true, message: `Promo code "${found.code}" applied successfully!` };
  };

  const removePromoCode = () => {
    setAppliedOffer(null);
    showToast('Promo code removed', 'info');
  };

  // Orders Operations
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const orderNumber = `ZST-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      id: orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastConfirmedOrder(newOrder);
    setActiveTrackingOrder(newOrder);
    clearCart();
    setActiveTab('confirmation');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              ...(paymentStatus ? { paymentStatus } : {}),
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    // If customer is actively tracking this order, update in real-time
    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder((prev) =>
        prev
          ? {
              ...prev,
              status,
              ...(paymentStatus ? { paymentStatus } : {}),
              updatedAt: new Date().toISOString(),
            }
          : null
      );
    }
    showToast(`Order #${orderId} status changed to ${status}`, 'info');
  };

  const trackOrderById = (orderId: string): Order | null => {
    const cleanId = orderId.trim().toUpperCase();
    const found = orders.find((o) => o.id.toUpperCase() === cleanId);
    if (found) {
      setActiveTrackingOrder(found);
      setActiveTab('tracking');
      return found;
    }
    return null;
  };

  // Settings Operations
  const updateDeliverySettings = (settings: Partial<DeliverySettings>) => {
    setDeliverySettings((prev) => ({ ...prev, ...settings }));
    showToast('Delivery settings updated', 'success');
  };

  const updateBusinessSettings = (settings: Partial<BusinessSettings>) => {
    setBusinessSettings((prev) => ({ ...prev, ...settings }));
    showToast('Business settings updated', 'success');
  };

  // Admin Auth Operations
  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Artificial safe delay for realistic authentication
    await new Promise((resolve) => setTimeout(resolve, 600));

    const normalizedEmail = email.trim().toLowerCase();
    
    // Check credentials (supports staff/admin credentials)
    if (
      (normalizedEmail === 'admin@umujyi.rw' && password === 'admin123') ||
      (normalizedEmail === 'staff@umujyi.rw' && password === 'staff123') ||
      (normalizedEmail === 'manager@umujyi.rw' && password === 'kigali2026')
    ) {
      const user: AdminUser = {
        id: 'adm-1',
        name: normalizedEmail.includes('manager') ? 'Sarah Uwera' : 'Eric Nshuti',
        email: normalizedEmail,
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      };
      setIsAdminAuthenticated(true);
      setAdminUser(user);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      setActiveTab('admin');
      showToast('Welcome to Umujyi Admin Portal', 'success');
      return { success: true };
    }

    // Secure failure: do NOT reveal whether email or password was the issue
    return {
      success: false,
      message: 'Invalid credentials. Please verify your email and password.',
    };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    setActiveTab('home');
    showToast('Signed out of Admin Portal', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedProductDetail,
        setSelectedProductDetail,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductPrice,
        uploadProductImage,
        removeProductImage,
        resetToDefaultProducts,

        categories,
        addCategory,
        updateCategory,
        deleteCategory,

        offers,
        appliedOffer,
        addOffer,
        updateOffer,
        deleteOffer,
        applyPromoCode,
        removePromoCode,

        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartDeliveryFee,
        cartDiscount,
        cartTotal,
        cartCount,

        orders,
        activeTrackingOrder,
        lastConfirmedOrder,
        createOrder,
        updateOrderStatus,
        trackOrderById,
        setActiveTrackingOrder,

        deliverySettings,
        updateDeliverySettings,
        businessSettings,
        updateBusinessSettings,

        isAdminAuthenticated,
        adminUser,
        loginAdmin,
        logoutAdmin,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
