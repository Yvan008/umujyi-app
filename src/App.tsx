import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryNav } from './components/CategoryNav';
import { ProductGrid } from './components/ProductGrid';
import { OffersSection } from './components/OffersSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { OrderTrackerView } from './components/OrderTrackerView';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { MobileStickyCart } from './components/MobileStickyCart';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ToastContainer } from './components/ToastContainer';
import { AdminCheckIn } from './components/admin/AdminCheckIn';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const {
    activeTab,
    selectedProductDetail,
    setSelectedProductDetail,
    isAdminAuthenticated,
  } = useStore();

  // Route 1: Admin Protected Portal
  if (activeTab === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <>
          <AdminCheckIn />
          <ToastContainer />
        </>
      );
    }
    return (
      <>
        <AdminDashboard />
        <ToastContainer />
      </>
    );
  }

  // Route 2: Discreet Check-in Page
  if (activeTab === 'check-in') {
    if (isAdminAuthenticated) {
      return (
        <>
          <AdminDashboard />
          <ToastContainer />
        </>
      );
    }
    return (
      <>
        <AdminCheckIn />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans selection:bg-[#F51B55] selection:text-white">
      {/* Primary Navigation */}
      <Navbar />

      {/* Main Routed View */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            <Hero />
            <CategoryNav />
            <ProductGrid onOpenDetail={setSelectedProductDetail} />
            <OffersSection />
          </>
        )}

        {activeTab === 'menu' && (
          <>
            <CategoryNav />
            <ProductGrid onOpenDetail={setSelectedProductDetail} />
          </>
        )}

        {activeTab === 'offers' && (
          <>
            <OffersSection />
            <CategoryNav />
            <ProductGrid onOpenDetail={setSelectedProductDetail} title="Dishes Eligible for Promo" />
          </>
        )}

        {activeTab === 'about' && <AboutSection />}

        {activeTab === 'contact' && <ContactSection />}

        {activeTab === 'checkout' && <CheckoutView />}

        {activeTab === 'confirmation' && <OrderConfirmationView />}

        {activeTab === 'tracking' && <OrderTrackerView />}
      </main>

      {/* Main Footer with Subtle Check-in Link */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Mobile Sticky Floating Cart summary */}
      <MobileStickyCart />

      {/* Optional Product Customization Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
      />

      {/* Global Notification Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

