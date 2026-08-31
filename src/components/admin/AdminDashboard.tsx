import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Order, OrderStatus, Category, Offer, PaymentStatus } from '../../types';
import { AdminBrandingTab } from './AdminBrandingTab';
import { AdminBranchesTab } from './AdminBranchesTab';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Image as ImageIcon,
  ShoppingBag,
  Tags,
  Percent,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  Phone,
  MapPin,
  AlertCircle,
  Sparkles,
  Building2,
  Palette,
  Store,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    adminUser,
    logoutAdmin,
    setActiveTab,
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
    addOffer,
    updateOffer,
    deleteOffer,
    orders,
    updateOrderStatus,
    deliverySettings,
    updateDeliverySettings,
    businessSettings,
    updateBusinessSettings,
    showToast,
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'products' | 'images' | 'orders' | 'categories' | 'offers' | 'branches' | 'branding' | 'settings'
  >('overview');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 5000,
    categoryId: categories[0]?.id || 'cat-chicken',
    defaultImage: '',
    uploadedImage: '',
    isAvailable: true,
    isPopular: false,
    isFeatured: false,
    badge: 'HOT',
    prepTimeMinutes: 20,
    calories: 600,
  });

  // Inline Price Edit state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPriceValue, setNewPriceValue] = useState<number>(0);
  
  // Delete Product state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    iconName: 'Utensils',
    isActive: true,
  });

  // Offer Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerForm, setOfferForm] = useState({
    code: '',
    title: '',
    tagline: '',
    description: '',
    discountType: 'PERCENT' as 'PERCENT' | 'FIXED' | 'FREE_DELIVERY',
    discountValue: 15,
    minOrderAmount: 10000,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
    badge: 'PROMO',
    isActive: true,
  });

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Image Manager Selected Product
  const [selectedImageProductId, setSelectedImageProductId] = useState<string>(products[0]?.id || '');
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');

  // Overview metrics calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING' || o.status === 'OUT_FOR_DELIVERY'
  ).length;

  const deliveredOrdersCount = orders.filter((o) => o.status === 'DELIVERED').length;

  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Chart data for daily sales
  const salesChartData = [
    { day: 'Mon', revenue: 145000, orders: 12 },
    { day: 'Tue', revenue: 210000, orders: 18 },
    { day: 'Wed', revenue: 190000, orders: 15 },
    { day: 'Thu', revenue: 280000, orders: 24 },
    { day: 'Fri', revenue: 450000, orders: 38 },
    { day: 'Sat', revenue: 520000, orders: 45 },
    { day: 'Sun', revenue: 390000, orders: 32 },
  ];

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: 6000,
      categoryId: categories[0]?.id || 'cat-chicken',
      defaultImage:
        'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=800',
      uploadedImage: '',
      isAvailable: true,
      isPopular: false,
      isFeatured: false,
      badge: 'NEW',
      prepTimeMinutes: 20,
      calories: 550,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description,
      price: p.price,
      categoryId: p.categoryId,
      defaultImage: p.defaultImage,
      uploadedImage: p.uploadedImage || '',
      isAvailable: p.isAvailable,
      isPopular: !!p.isPopular,
      isFeatured: !!p.isFeatured,
      badge: p.badge || '',
      prepTimeMinutes: p.prepTimeMinutes || 20,
      calories: p.calories || 500,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const category = categories.find((c) => c.id === productForm.categoryId);
    const categoryName = category ? category.name : 'Specials';

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...productForm,
        categoryName,
        uploadedImage: productForm.uploadedImage.trim() ? productForm.uploadedImage.trim() : null,
      });
    } else {
      addProduct({
        ...productForm,
        categoryName,
        uploadedImage: productForm.uploadedImage.trim() ? productForm.uploadedImage.trim() : null,
      });
    }
    setIsProductModalOpen(false);
  };

  const handleSaveInlinePrice = (id: string) => {
    if (newPriceValue > 0) {
      updateProductPrice(id, newPriceValue);
    }
    setEditingPriceId(null);
  };

  // Image Upload for Product Form
  const [isUploadingFormImage, setIsUploadingFormImage] = useState(false);

  const handleFormImageUpload = async (file: File) => {
    setIsUploadingFormImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ADMIN_SECRET_TOKEN' },
            body: JSON.stringify({ imageBase64: e.target.result })
          });
          if (res.ok) {
            const data = await res.json();
            setProductForm({ ...productForm, uploadedImage: data.url });
            showToast('Image uploaded successfully', 'success');
          } else {
            showToast('Image upload failed', 'error');
          }
          setIsUploadingFormImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showToast('Error uploading image', 'error');
      setIsUploadingFormImage(false);
    }
  };

  const handleProductImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && selectedImageProductId) {
        uploadProductImage(selectedImageProductId, e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return;
    addCategory({
      name: categoryForm.name,
      slug: categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
      iconName: categoryForm.iconName,
      isActive: categoryForm.isActive,
      sortOrder: categories.length + 1,
    });
    setIsCategoryModalOpen(false);
    setCategoryForm({ name: '', slug: '', iconName: 'Utensils', isActive: true });
  };

  const handleAddOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerForm.code || !offerForm.title) return;
    addOffer({
      ...offerForm,
    });
    setIsOfferModalOpen(false);
  };

  const selectedImageProduct = products.find((p) => p.id === selectedImageProductId) || products[0];

  const [quickPhone, setQuickPhone] = useState(businessSettings.phone);

  React.useEffect(() => {
    setQuickPhone(businessSettings.phone);
  }, [businessSettings.phone]);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    const matchesSearch =
      !orderSearchQuery.trim() ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-neutral-900 flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-[#111111] text-white border-b border-neutral-800 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {businessSettings.logoUrl ? (
              <img
                src={businessSettings.logoUrl}
                alt={businessSettings.name}
                className="h-8 max-w-[120px] object-contain"
              />
            ) : null}
            <span className="font-black text-lg tracking-tight">
              {businessSettings.logoText || businessSettings.name || 'UMUJYI'}{' '}
              <span className="text-[#F51B55] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-neutral-800 rounded-md ml-1">
                Operations
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-bold text-neutral-200 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#F51B55]" />
            <span>View Live Storefront</span>
          </button>

          <div className="flex items-center gap-2.5 pl-3 border-l border-neutral-800">
            <img
              src={adminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt="Admin"
              className="w-8 h-8 rounded-full object-cover border border-neutral-700"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{adminUser?.name || 'Staff User'}</p>
              <p className="text-[10px] text-neutral-400 font-mono">{adminUser?.role || 'MANAGER'}</p>
            </div>
            <button
              onClick={logoutAdmin}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors ml-1 cursor-pointer"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Layout */}
      <div className="flex-grow flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white rounded-3xl p-4 border border-neutral-200/80 shadow-xs shrink-0 self-start">
          <div className="space-y-1">
            {[
              { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
              { id: 'orders', label: 'Live Orders', icon: ShoppingBag, badge: activeOrdersCount },
              { id: 'products', label: 'Products & Prices', icon: UtensilsCrossed, badge: products.length },
              { id: 'images', label: 'Photo Overrides', icon: ImageIcon },
              { id: 'categories', label: 'Menu Categories', icon: Tags, badge: categories.length },
              { id: 'offers', label: 'Promos & Offers', icon: Percent, badge: offers.length },
              { id: 'branches', label: 'Branches & Hubs', icon: Building2, badge: deliverySettings.pickupLocations?.length || 0 },
              { id: 'branding', label: 'Logo & Branding', icon: Palette },
              { id: 'settings', label: 'Delivery & Fees', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#111111] text-white shadow-md'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F51B55]' : 'text-neutral-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-[#F51B55] text-white' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 px-2">
            <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-bold mb-2">Quick Actions</p>
            <button
              onClick={handleOpenAddProduct}
              className="w-full py-2.5 px-3 bg-pink-50 text-[#F51B55] hover:bg-pink-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors mb-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
            <button
              onClick={() => setActiveSubTab('branding')}
              className="w-full py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-[#F51B55]" />
              <span>Update Brand Logo</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Sub-tab Panel */}
        <main className="flex-grow space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Total Sales
                    </span>
                    <p className="text-xl font-black text-[#111111] mt-1">
                      RWF {totalRevenue.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> +18.4% vs last week
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Active Orders
                    </span>
                    <p className="text-xl font-black text-[#F51B55] mt-1">
                      {activeOrdersCount}
                    </p>
                    <span className="text-[10px] text-neutral-500 font-medium mt-1 block">
                      In kitchen / transit
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#F51B55] flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Total Delivered
                    </span>
                    <p className="text-xl font-black text-[#111111] mt-1">
                      {deliveredOrdersCount}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                      100% On-time guarantee
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Avg. Order Value
                    </span>
                    <p className="text-xl font-black text-[#111111] mt-1">
                      RWF {averageOrderValue.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-neutral-500 font-medium mt-1 block">
                      Across Kigali
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Quick Brand Logo & Phone Number Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Hotline Quick Control */}
                <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#F51B55] flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#111111] uppercase tracking-wider">
                          Customer Phone Hotline
                        </h4>
                        <p className="text-[11px] text-neutral-500">Live ordering & support phone number</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('branding')}
                      className="text-[11px] font-bold text-[#F51B55] hover:underline cursor-pointer"
                    >
                      Full Settings →
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={quickPhone}
                      onChange={(e) => setQuickPhone(e.target.value)}
                      placeholder="+250 788 123 456"
                      className="flex-grow p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#F51B55]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateBusinessSettings({
                          phone: quickPhone.trim(),
                          socialLinks: {
                            ...businessSettings.socialLinks,
                            whatsapp: businessSettings.socialLinks?.whatsapp || quickPhone.trim(),
                          },
                        });
                        showToast('Customer hotline updated live across website', 'success');
                      }}
                      className="px-4 py-2.5 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      Save Phone
                    </button>
                  </div>
                </div>

                {/* Logo Quick Control */}
                <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 px-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-center overflow-hidden shrink-0">
                      {businessSettings.logoUrl ? (
                        <img
                          src={businessSettings.logoUrl}
                          alt={businessSettings.name}
                          className="h-8 max-w-[100px] object-contain"
                        />
                      ) : (
                        <span className="font-black text-sm tracking-tight text-[#111111]">
                          {businessSettings.logoText || 'UMUJYI'}
                          <span className="text-[#F51B55]">.</span>
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#111111] uppercase tracking-wider">
                        Restaurant Brand Logo
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {businessSettings.logoUrl ? 'Custom Image Logo Active' : 'Typography Brandmark Active'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveSubTab('branding')}
                    className="px-4 py-2.5 bg-pink-50 hover:bg-pink-100 text-[#F51B55] text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    Manage Logo
                  </button>
                </div>
              </div>

              {/* Sales Chart Section */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-black text-[#111111]">Weekly Kigali Revenue (RWF)</h3>
                    <p className="text-xs text-neutral-500">Daily gross turnover from online orders</p>
                  </div>
                  <span className="text-xs font-bold text-[#F51B55] bg-pink-50 px-3 py-1 rounded-full">
                    Current Week
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
                      <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(val) => `${val / 1000}k`}
                      />
                      <Tooltip
                        formatter={(value: any) => [`RWF ${Number(value).toLocaleString()}`, 'Revenue']}
                        contentStyle={{ borderRadius: '16px', border: '1px solid #eee', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="revenue" fill="#F51B55" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Orders in Overview */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black text-[#111111]">Latest Orders</h3>
                  <button
                    onClick={() => setActiveSubTab('orders')}
                    className="text-xs font-extrabold text-[#F51B55] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider font-bold">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Location</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-neutral-50/70 transition-colors">
                          <td className="py-3 font-mono font-black text-[#111111]">#{o.id}</td>
                          <td className="py-3 font-bold">{o.customerName}</td>
                          <td className="py-3 text-neutral-500">{o.sector || o.pickupLocation || 'Kigali'}</td>
                          <td className="py-3 font-black text-[#111111]">RWF {o.total.toLocaleString()}</td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                o.status === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : o.status === 'OUT_FOR_DELIVERY'
                                  ? 'bg-blue-100 text-blue-800'
                                  : o.status === 'PREPARING'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-pink-100 text-[#F51B55]'
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setActiveSubTab('orders');
                                setOrderSearchQuery(o.id);
                              }}
                              className="text-xs font-bold text-[#F51B55] hover:underline"
                            >
                              Manage →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS & PRICES */}
          {activeSubTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#111111]">Products & Live Price Management</h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Edit prices instantly with immediate customer reflection. Toggle item availability.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-[#F51B55] hover:bg-[#d41446] text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-400 uppercase tracking-wider font-bold">
                        <th className="p-4">Dish</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price (RWF)</th>
                        <th className="p-4">Image State</th>
                        <th className="p-4">Availability</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {products.map((prod) => {
                        const displayImg = prod.uploadedImage || prod.defaultImage;
                        const isCustom = !!prod.uploadedImage;
                        const isEditingPrice = editingPriceId === prod.id;

                        return (
                          <tr key={prod.id} className="hover:bg-neutral-50/60 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={displayImg}
                                  alt={prod.name}
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-sm text-[#111111] line-clamp-1">{prod.name}</p>
                                  <p className="text-[11px] text-neutral-400 line-clamp-1">{prod.description}</p>
                                </div>
                              </div>
                            </td>

                            <td className="p-4 font-semibold text-neutral-700">
                              {prod.categoryName}
                            </td>

                            {/* Instant Inline Price Editor */}
                            <td className="p-4">
                              {isEditingPrice ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    value={newPriceValue}
                                    onChange={(e) => setNewPriceValue(Number(e.target.value))}
                                    className="w-24 p-1.5 text-xs font-mono font-bold bg-white border border-[#F51B55] rounded-lg focus:outline-none"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveInlinePrice(prod.id)}
                                    className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingPriceId(null)}
                                    className="p-1.5 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-black text-sm text-[#111111]">
                                    RWF {prod.price.toLocaleString()}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setEditingPriceId(prod.id);
                                      setNewPriceValue(prod.price);
                                    }}
                                    className="p-1 text-neutral-400 hover:text-[#F51B55] hover:bg-pink-50 rounded transition-colors"
                                    title="Edit Price"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>

                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                  isCustom
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-neutral-100 text-neutral-600'
                                }`}
                              >
                                {isCustom ? 'Custom Upload' : 'Standard Photo'}
                              </span>
                            </td>

                            <td className="p-4">
                              <button
                                onClick={() => updateProduct(prod.id, { isAvailable: !prod.isAvailable })}
                                className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-colors ${
                                  prod.isAvailable
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                {prod.isAvailable ? 'In Stock' : 'Sold Out'}
                              </button>
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="p-2 text-neutral-500 hover:text-[#111111] hover:bg-neutral-100 rounded-xl transition-colors"
                                  title="Edit full product"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setProductToDelete(prod)}
                                  className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMAGE OVERRIDE MANAGER */}
          {activeSubTab === 'images' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
                <h2 className="text-xl font-black text-[#111111]">Food Photography & Image Overrides</h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Upload custom kitchen photos. If removed, the system seamlessly displays the high-resolution standard studio photography.
                </p>
              </div>

              {/* Product Selector for Image Upload */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 bg-white p-4 rounded-3xl border border-neutral-200/80 shadow-xs space-y-2 max-h-[600px] overflow-y-auto">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 px-2">
                    Select Dish ({products.length})
                  </p>
                  {products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedImageProductId(p.id);
                        setCustomImageUrlInput('');
                      }}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all ${
                        selectedImageProductId === p.id
                          ? 'bg-[#111111] text-white shadow-sm'
                          : 'hover:bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      <img
                        src={p.uploadedImage || p.defaultImage}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold truncate">{p.name}</p>
                        <p className="text-[10px] text-neutral-400">
                          {p.uploadedImage ? 'Custom Photo' : 'Standard Photo'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Image Comparison & Upload Workspace */}
                {selectedImageProduct && (
                  <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                      <div>
                        <h3 className="text-lg font-black text-[#111111]">{selectedImageProduct.name}</h3>
                        <p className="text-xs text-neutral-500">{selectedImageProduct.categoryName}</p>
                      </div>
                      {selectedImageProduct.uploadedImage && (
                        <button
                          onClick={() => removeProductImage(selectedImageProduct.id)}
                          className="px-3.5 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Revert to Standard Photo</span>
                        </button>
                      )}
                    </div>

                    {/* Side-by-side Dual Image comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Standard Studio Image */}
                      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                        <span className="text-xs font-bold text-neutral-500 uppercase block mb-2">
                          Standard Studio Photo
                        </span>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900">
                          <img
                            src={selectedImageProduct.defaultImage}
                            alt="Default"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-2 text-center">
                          High-resolution default photography
                        </p>
                      </div>

                      {/* Current Active / Uploaded Image */}
                      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#F51B55] uppercase">
                            Currently Active on Site
                          </span>
                          <span className="text-[10px] bg-pink-100 text-[#F51B55] font-bold px-2 py-0.5 rounded-full">
                            Live
                          </span>
                        </div>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 border-2 border-[#F51B55]">
                          <img
                            src={selectedImageProduct.uploadedImage || selectedImageProduct.defaultImage}
                            alt="Active"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-2 text-center font-medium">
                          {selectedImageProduct.uploadedImage ? 'Using custom uploaded photo' : 'Using standard studio photo'}
                        </p>
                      </div>
                    </div>

                    {/* Drag and Drop Uploader */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                        Upload New Photo
                      </label>

                      {/* Dropzone */}
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-300 hover:border-[#F51B55] rounded-2xl bg-neutral-50/50 hover:bg-pink-50/20 cursor-pointer transition-colors">
                        <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                        <span className="text-xs font-bold text-[#111111]">
                          Click to browse or drag & drop food photo
                        </span>
                        <span className="text-[10px] text-neutral-400 mt-1">
                          PNG, JPG, WEBP up to 5MB (4:3 aspect recommended)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleProductImageUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </label>

                      {/* OR via URL */}
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customImageUrlInput}
                          onChange={(e) => setCustomImageUrlInput(e.target.value)}
                          placeholder="Or paste external image URL (https://...)"
                          className="flex-grow text-xs p-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F51B55]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customImageUrlInput.trim()) {
                              uploadProductImage(selectedImageProduct.id, customImageUrlInput.trim());
                              setCustomImageUrlInput('');
                            }
                          }}
                          className="bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold px-4 rounded-xl transition-colors shrink-0 cursor-pointer"
                        >
                          Set Image URL
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: LIVE ORDERS */}
          {activeSubTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Filter and Search Bar */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#111111]">Kitchen & Dispatch Order Board</h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Advance statuses in real-time. Changes sync directly to the customer live tracker.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="Search ID, phone, name..."
                      className="pl-8 pr-3 py-2 bg-neutral-100 text-xs rounded-xl border border-transparent focus:border-[#F51B55] focus:outline-none"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="p-2 bg-neutral-100 text-xs font-bold rounded-xl border border-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PREPARING">In Kitchen</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Order Cards Grid */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-3xl border border-neutral-200">
                    <p className="text-neutral-500 font-bold">No orders found matching filters.</p>
                  </div>
                ) : (
                  filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-black text-lg text-[#111111]">#{ord.id}</span>
                            <span
                              className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                                ord.status === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'OUT_FOR_DELIVERY'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.status === 'PREPARING'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-pink-100 text-[#F51B55]'
                              }`}
                            >
                              {ord.status}
                            </span>
                            <span className="text-xs text-neutral-400">
                              {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 mt-1">
                            Customer: <strong className="text-[#111111]">{ord.customerName}</strong> ({ord.phone}) • {ord.deliveryMethod}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase block">Total Amount</span>
                          <span className="font-black text-lg text-[#F51B55]">
                            RWF {ord.total.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Order items + Location */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                        <div className="md:col-span-7 space-y-1.5">
                          <span className="font-bold text-neutral-400 uppercase text-[10px] block">Items in Order</span>
                          <div className="space-y-1 bg-neutral-50 p-3 rounded-2xl">
                            {ord.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span className="font-medium text-neutral-800">
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="font-bold text-neutral-600">
                                  RWF {(item.price * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-5 space-y-1.5">
                          <span className="font-bold text-neutral-400 uppercase text-[10px] block">Dispatch Info</span>
                          <div className="bg-neutral-50 p-3 rounded-2xl space-y-1 text-neutral-600">
                            <p><strong>Method:</strong> {ord.deliveryMethod}</p>
                            {ord.deliveryAddress && <p className="line-clamp-2"><strong>Address:</strong> {ord.deliveryAddress}</p>}
                            {ord.pickupLocation && <p><strong>Hub:</strong> {ord.pickupLocation}</p>}
                            <p><strong>Payment:</strong> {ord.paymentMethod} ({ord.paymentStatus})</p>
                            {ord.instructions && <p className="text-[#F51B55]"><strong>Note:</strong> {ord.instructions}</p>}
                          </div>
                        </div>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-500">Advance Status:</span>
                          {(['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'] as OrderStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => updateOrderStatus(ord.id, st)}
                              disabled={ord.status === st}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                ord.status === st
                                  ? 'bg-[#111111] text-white cursor-default'
                                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                              }`}
                            >
                              {st === 'CONFIRMED'
                                ? 'Confirm'
                                : st === 'PREPARING'
                                ? 'In Kitchen'
                                : st === 'OUT_FOR_DELIVERY'
                                ? 'Dispatch Moto'
                                : 'Mark Delivered'}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateOrderStatus(
                                ord.id,
                                ord.status,
                                ord.paymentStatus === 'PAID' ? 'UNPAID' : 'PAID'
                              )
                            }
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                              ord.paymentStatus === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Payment: {ord.paymentStatus}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CATEGORIES */}
          {activeSubTab === 'categories' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#111111]">Menu Categories</h2>
                  <p className="text-xs text-neutral-500 mt-1">Organize customer-facing menu sections</p>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="bg-[#F51B55] hover:bg-[#d41446] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((c) => {
                  const itemCount = products.filter((p) => p.categoryId === c.id).length;

                  return (
                    <div
                      key={c.id}
                      className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-[#111111]">{c.name}</h4>
                        <p className="text-xs text-neutral-400">/{c.slug} • {itemCount} items</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateCategory(c.id, { isActive: !c.isActive })}
                          className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                            c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-500'
                          }`}
                        >
                          {c.isActive ? 'Active' : 'Hidden'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: OFFERS & PROMOS */}
          {activeSubTab === 'offers' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#111111]">Promotions & Coupon Codes</h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Manage Rwandan promotional vouchers, discounts, and free delivery thresholds
                  </p>
                </div>
                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="bg-[#F51B55] hover:bg-[#d41446] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map((off) => (
                  <div
                    key={off.id}
                    className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono font-black text-sm bg-neutral-100 px-2.5 py-1 rounded-lg text-[#111111]">
                          {off.code}
                        </span>
                        <h4 className="font-bold text-base text-[#111111] mt-2">{off.title}</h4>
                        <p className="text-xs text-neutral-500">{off.description}</p>
                      </div>
                      <button
                        onClick={() => deleteOffer(off.id)}
                        className="text-neutral-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <span className="text-neutral-500">
                        Min. Basket: RWF {off.minOrderAmount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => updateOffer(off.id, { isActive: !off.isActive })}
                        className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${
                          off.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-500'
                        }`}
                      >
                        {off.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS & DELIVERY */}
          {activeSubTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
                <h2 className="text-xl font-black text-[#111111]">Delivery & Business Configuration</h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Adjust default delivery fees, free delivery minimums, and Kigali branch hubs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery Settings Card */}
                <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-[#111111]">Delivery Logistics</h3>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Standard Kigali Delivery Fee (RWF)
                    </label>
                    <input
                      type="number"
                      value={deliverySettings.defaultDeliveryFee}
                      onChange={(e) =>
                        updateDeliverySettings({ defaultDeliveryFee: Number(e.target.value) })
                      }
                      className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:border-[#F51B55]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Free Delivery Basket Minimum (RWF)
                    </label>
                    <input
                      type="number"
                      value={deliverySettings.freeDeliveryThreshold}
                      onChange={(e) =>
                        updateDeliverySettings({ freeDeliveryThreshold: Number(e.target.value) })
                      }
                      className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:border-[#F51B55]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Average Delivery Time (Minutes)
                    </label>
                    <input
                      type="number"
                      value={deliverySettings.defaultEstimatedDeliveryMinutes}
                      onChange={(e) =>
                        updateDeliverySettings({
                          defaultEstimatedDeliveryMinutes: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:border-[#F51B55]"
                    />
                  </div>
                </div>

                {/* Payment Methods Toggle Card */}
                <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-[#111111]">Enabled Payment Channels</h3>

                  <div className="space-y-3">
                    {[
                      { key: 'momo', label: 'MTN Mobile Money (*182# Prompt)' },
                      { key: 'airtel', label: 'Airtel Money (*500# Prompt)' },
                      { key: 'card', label: 'Credit & Debit Cards (Visa / Mastercard)' },
                      { key: 'cashOnDelivery', label: 'Cash / MoMo on Delivery' },
                    ].map((pm) => (
                      <div
                        key={pm.key}
                        className="flex items-center justify-between p-3 bg-neutral-50 rounded-2xl"
                      >
                        <span className="text-xs font-bold text-neutral-800">{pm.label}</span>
                        <input
                          type="checkbox"
                          checked={
                            (businessSettings.enabledPaymentMethods as any)[pm.key] || false
                          }
                          onChange={(e) =>
                            updateBusinessSettings({
                              enabledPaymentMethods: {
                                ...businessSettings.enabledPaymentMethods,
                                [pm.key]: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 accent-[#F51B55] rounded cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <p className="text-xs font-bold text-neutral-700 mb-1">Customer Support Phone</p>
                    <input
                      type="text"
                      value={businessSettings.phone}
                      onChange={(e) => updateBusinessSettings({ phone: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: BRANCHES & HUBS */}
          {activeSubTab === 'branches' && <AdminBranchesTab />}

          {/* TAB 9: LOGO & BRANDING */}
          {activeSubTab === 'branding' && <AdminBrandingTab />}
        </main>
      </div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-black text-[#111111]">
                {editingProduct ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. 6-Piece Crispy Wings Bucket"
                  required
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Price (RWF) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Category</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Freshly prepared with Rwandan spices..."
                  required
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2">Product Image (Upload or Drag & Drop)</label>
                
                {productForm.uploadedImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-neutral-200">
                    <img 
                      src={productForm.uploadedImage} 
                      alt="Product preview" 
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity gap-3">
                       <button
                         type="button"
                         onClick={() => {
                           const el = document.getElementById('productImageUpload');
                           if (el) el.click();
                         }}
                         className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-100"
                       >
                         Replace Image
                       </button>
                       <button
                         type="button"
                         onClick={() => {
                           if (window.confirm("Are you sure you want to remove this product image?")) {
                             setProductForm({ ...productForm, uploadedImage: '' });
                           }
                         }}
                         className="px-4 py-2 bg-[#F51B55] text-white font-bold text-xs rounded-xl hover:bg-[#d41446]"
                       >
                         Remove Image
                       </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-40 border-2 border-dashed border-neutral-300 rounded-2xl flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors relative"
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFormImageUpload(e.dataTransfer.files[0]);
                      }
                    }}
                  >
                    {isUploadingFormImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#F51B55]" />
                        <span className="text-xs text-neutral-500 font-bold">Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-neutral-400 mb-2" />
                        <span className="text-sm font-bold text-neutral-600">Drag & Drop Image Here</span>
                        <span className="text-xs text-neutral-400 mt-1 mb-3">OR</span>
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('productImageUpload');
                            if (el) el.click();
                          }}
                          className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 font-bold text-xs rounded-xl shadow-xs hover:bg-neutral-50"
                        >
                          CHOOSE IMAGE
                        </button>
                      </>
                    )}
                  </div>
                )}
                
                <input
                  id="productImageUpload"
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFormImageUpload(e.target.files[0]);
                    }
                  }}
                />
                {!productForm.uploadedImage && (
                  <p className="text-[10px] text-neutral-500 mt-2">
                    <span className="text-amber-600 font-bold">Using AI Default Fallback Image.</span> Upload a real photo to override.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="HOT, NEW, POPULAR"
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Prep Time (Mins)</label>
                  <input
                    type="number"
                    value={productForm.prepTimeMinutes}
                    onChange={(e) =>
                      setProductForm({ ...productForm, prepTimeMinutes: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isAvailable}
                    onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                    className="accent-[#F51B55]"
                  />
                  <span>Available in Store</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isPopular}
                    onChange={(e) => setProductForm({ ...productForm, isPopular: e.target.checked })}
                    className="accent-[#F51B55]"
                  />
                  <span>Popular Tag</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 bg-neutral-100 rounded-xl text-xs font-bold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#F51B55] hover:bg-[#d41446] text-white rounded-xl text-xs font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#111111]">Add New Category</h3>
            <form onSubmit={handleAddCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Salads & Bowls"
                  required
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F51B55] text-white rounded-xl text-xs font-bold"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[#111111]">Create Promo Offer</h3>
            <form onSubmit={handleAddOfferSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Promo Code</label>
                  <input
                    type="text"
                    value={offerForm.code}
                    onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. KIGALI25"
                    required
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={offerForm.badge}
                    onChange={(e) => setOfferForm({ ...offerForm, badge: e.target.value })}
                    placeholder="25% OFF"
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Offer Title</label>
                <input
                  type="text"
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  placeholder="Weekend Big Feast"
                  required
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Description</label>
                <input
                  type="text"
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  placeholder="Get 25% discount on orders above RWF 15,000"
                  required
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Discount % or Value</label>
                  <input
                    type="number"
                    value={offerForm.discountValue}
                    onChange={(e) => setOfferForm({ ...offerForm, discountValue: Number(e.target.value) })}
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Min Basket (RWF)</label>
                  <input
                    type="number"
                    value={offerForm.minOrderAmount}
                    onChange={(e) => setOfferForm({ ...offerForm, minOrderAmount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F51B55] text-white rounded-xl text-xs font-bold"
                >
                  Create Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2 text-red-500">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#111111]">Delete Product?</h3>
            <p className="text-sm text-neutral-500">
              Are you sure you want to delete <span className="font-bold text-[#111111]">"{productToDelete.name}"</span>? 
              This action cannot be easily undone.
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-sm font-bold text-neutral-700 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-bold text-white transition-colors shadow-lg shadow-red-500/25"
              >
                DELETE PRODUCT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
