import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    cartCount,
    deliverySettings,
    appliedOffer,
    applyPromoCode,
    removePromoCode,
    setActiveTab,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const result = applyPromoCode(promoInput);
    if (!result.success) {
      setPromoError(result.message);
    } else {
      setPromoError('');
      setPromoInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActiveTab('checkout');
  };

  // Free delivery calculation
  const amountNeededForFreeDelivery = Math.max(
    0,
    deliverySettings.freeDeliveryThreshold - cartSubtotal
  );
  const freeDeliveryProgress = Math.min(
    100,
    (cartSubtotal / deliverySettings.freeDeliveryThreshold) * 100
  );

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        id="cart-drawer-panel"
        className="w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 sm:rounded-l-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#F51B55] flex items-center justify-center font-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#111111] leading-tight">YOUR CART</h2>
              <p className="text-xs text-neutral-500 font-medium">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in order
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 flex items-center justify-center transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        {cart.length > 0 && (
          <div className="px-4 sm:px-6 py-3 bg-neutral-50 border-b border-neutral-100 shrink-0">
            {amountNeededForFreeDelivery > 0 ? (
              <div>
                <p className="text-xs text-neutral-700 font-semibold mb-1.5 flex items-center justify-between">
                  <span>
                    Add <strong className="text-[#F51B55]">RWF {amountNeededForFreeDelivery.toLocaleString()}</strong> for Free Delivery
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold">{Math.round(freeDeliveryProgress)}%</span>
                </p>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#F51B55] h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                <Sparkles className="w-4 h-4" />
                <span>You unlocked FREE Delivery across Kigali!</span>
              </div>
            )}
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-20 h-20 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-1">Your cart is empty</h3>
              <p className="text-xs text-neutral-500 max-w-xs mb-6">
                Explore our crispy chicken, gourmet burgers, pizza, and combos to start ordering.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveTab('menu');
                }}
                className="bg-[#F51B55] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:bg-[#d41446] transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const displayImg = item.product.uploadedImage || item.product.defaultImage;

              return (
                <div
                  key={item.product.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  {/* Product Image */}
                  <img
                    src={displayImg}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-neutral-200/60"
                  />

                  {/* Details */}
                  <div className="flex flex-col justify-between flex-grow">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-sm text-[#111111] leading-tight line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.selectedOptions && (
                      <p className="text-[11px] text-neutral-500 font-medium">
                        {item.selectedOptions.spiciness && `${item.selectedOptions.spiciness}`}
                        {item.selectedOptions.extraSauce && ` • Extra Sauce`}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-sm text-[#111111]">
                        RWF {(item.product.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-neutral-200 shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-black"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-extrabold text-xs w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-black"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Promo Code Input & Checkout Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-6 bg-white border-t border-neutral-100 shrink-0 space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedOffer ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Promo "{appliedOffer.code}" Applied</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-xs text-red-500 font-extrabold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value);
                      setPromoError('');
                    }}
                    placeholder="Enter promo code (e.g. FIRSTUMUJYI)"
                    className="flex-grow text-xs px-3.5 py-2.5 bg-neutral-100 rounded-xl border border-transparent focus:border-[#F51B55] focus:outline-none uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-[#111111] hover:bg-neutral-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{promoError}</p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#111111]">
                  RWF {cartSubtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee (Kigali)</span>
                <span className="font-bold text-[#111111]">
                  {cartDeliveryFee === 0 ? (
                    <span className="text-emerald-600 uppercase font-black">FREE</span>
                  ) : (
                    `RWF ${cartDeliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>- RWF {cartDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-neutral-100 text-sm font-black text-[#111111]">
                <span>Total Amount</span>
                <span className="text-[#F51B55] text-base">
                  RWF {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2">
              <button
                id="cart-checkout-btn"
                onClick={handleProceedToCheckout}
                className="w-full bg-[#F51B55] hover:bg-[#d41446] text-white font-extrabold text-base py-4 rounded-2xl shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>CHECKOUT</span>
                <span>•</span>
                <span>RWF {cartTotal.toLocaleString()}</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2.5 text-neutral-500 hover:text-[#111111] font-bold text-xs transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
