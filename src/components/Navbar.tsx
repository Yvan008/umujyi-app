import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Search,
  Menu as MenuIcon,
  X,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  Flame,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    businessSettings,
    products,
    setSelectedCategory,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSelectSearchResult = (catId: string) => {
    setSelectedCategory(catId);
    setSearchQuery('');
    setIsSearchOpen(false);
    setActiveTab('menu');
  };

  return (
    <>
      {/* Top Banner - Rwandan Location & Fast Delivery info */}
      <div className="bg-[#111111] text-neutral-300 text-xs py-2 px-4 border-b border-neutral-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#F51B55]" />
              <span>Kigali, Rwanda (Kimihurura • Nyarutarama • Downtown)</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 font-medium text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-[#F51B55]" />
              <span>30-40 Min Average Delivery Time</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${businessSettings.phone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F51B55]" />
              <span className="font-bold">{businessSettings.phone}</span>
            </a>
            <span className="text-neutral-600">|</span>
            <span className="text-[#F51B55] font-bold">Fast Guest Checkout</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white border-b border-neutral-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group text-left"
              aria-label="Umujyi Rwanda Home"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F51B55] flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[#111111] leading-none">
                  UMUJYI<span className="text-[#F51B55]">.</span>
                </span>
                <span className="text-[9px] font-extrabold tracking-widest text-neutral-400 uppercase">
                  RWANDA
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'menu', label: 'Menu' },
                { id: 'offers', label: 'Offers' },
                { id: 'about', label: 'About' },
                { id: 'contact', label: 'Contact' },
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                      isActive
                        ? 'bg-neutral-100 text-[#F51B55]'
                        : 'text-neutral-700 hover:text-[#111111] hover:bg-neutral-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Search Bar + Cart CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Input Box */}
            <div className="relative hidden md:block w-56 lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chicken, burgers, pizza..."
                className="w-full bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-full border border-transparent focus:border-[#F51B55] focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Instant Search Dropdown preview */}
              {searchQuery.trim().length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-2 z-50">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1">
                    Matching Food Items ({searchResults.length})
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-neutral-500">
                      No dishes found for "{searchQuery}"
                    </div>
                  ) : (
                    searchResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSearchResult(item.categoryId)}
                        className="w-full flex items-center justify-between p-2 hover:bg-neutral-50 rounded-xl transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.uploadedImage || item.defaultImage}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#111111] line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-[#F51B55] font-semibold">
                              RWF {item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                      </button>
                    ))
                  )}
                  <button
                    onClick={() => {
                      setActiveTab('menu');
                    }}
                    className="w-full text-center text-xs font-bold text-[#F51B55] py-2 mt-1 border-t border-neutral-100 hover:underline"
                  >
                    View all results in Menu →
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Search Toggle Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2.5 text-neutral-700 bg-neutral-100 rounded-full hover:bg-neutral-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#111111] text-white hover:bg-neutral-900 px-4 py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#F51B55]" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-[#F51B55] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 text-neutral-700 bg-neutral-100 rounded-full hover:bg-neutral-200"
              aria-label="Open mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pt-3 pb-2 border-t border-neutral-100 bg-white">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crispy chicken, burgers, pizza..."
                className="w-full bg-neutral-100 text-sm pl-9 pr-8 py-2.5 rounded-xl border border-transparent focus:border-[#F51B55] focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[65px] bg-white border-b border-neutral-200 shadow-2xl p-6 z-50 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'menu', label: 'Menu' },
                { id: 'offers', label: 'Offers & Specials' },
                { id: 'about', label: 'About Umujyi' },
                { id: 'contact', label: 'Contact & Branches' },
                { id: 'tracking', label: 'Track My Order' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left py-3 px-4 rounded-xl font-bold text-base transition-colors ${
                    activeTab === item.id ? 'bg-[#F51B55] text-white' : 'text-neutral-800 hover:bg-neutral-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2 text-xs text-neutral-500">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F51B55]" />
                Call orders: <span className="font-bold text-[#111111]">{businessSettings.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F51B55]" />
                HQ: Kimihurura, Kigali
              </p>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
