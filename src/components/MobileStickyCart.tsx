import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const MobileStickyCart: React.FC = () => {
  const { cart, cartCount, cartTotal, setIsCartOpen, activeTab } = useStore();

  // Hide if cart is empty or we are already in checkout or tracking or admin
  if (
    cart.length === 0 ||
    activeTab === 'checkout' ||
    activeTab === 'confirmation' ||
    activeTab === 'admin' ||
    activeTab === 'check-in'
  ) {
    return null;
  }

  return (
    <div
      id="mobile-sticky-cart-bar"
      className="md:hidden fixed bottom-4 left-4 right-4 z-30 animate-in slide-in-from-bottom duration-300"
    >
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-full bg-[#111111] text-white p-4 rounded-2xl shadow-2xl border border-neutral-800 flex items-center justify-between active:scale-98 transition-all hover:bg-neutral-900"
        aria-label="View Cart"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#F51B55] text-white flex items-center justify-center font-black text-xs">
            {cartCount}
          </div>
          <div className="text-left">
            <span className="font-extrabold text-sm block leading-tight">
              {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
            </span>
            <span className="text-[11px] text-neutral-400 font-medium">
              Tap to view order
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-black text-base text-white">
            RWF {cartTotal.toLocaleString()}
          </span>
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </button>
    </div>
  );
};
