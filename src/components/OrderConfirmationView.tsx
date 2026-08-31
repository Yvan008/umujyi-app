import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  Receipt,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const OrderConfirmationView: React.FC = () => {
  const { lastConfirmedOrder, setActiveTab, setActiveTrackingOrder } = useStore();

  if (!lastConfirmedOrder) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-black text-[#111111] mb-2">No Active Order Confirmation</h2>
        <p className="text-neutral-500 text-sm mb-6">
          You can track any previous order using your order ID.
        </p>
        <button
          onClick={() => setActiveTab('tracking')}
          className="bg-[#111111] text-white px-6 py-3 rounded-xl font-bold"
        >
          Go to Order Tracker
        </button>
      </div>
    );
  }

  const handleGoToTracking = () => {
    setActiveTrackingOrder(lastConfirmedOrder);
    setActiveTab('tracking');
  };

  return (
    <div className="py-10 sm:py-16 bg-[#F5F5F5] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xl text-center">
          {/* Success Animated Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm border-2 border-emerald-100 animate-bounce">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-pink-100 text-[#F51B55] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Placed Successfully</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight mb-2">
            THANK YOU FOR YOUR ORDER!
          </h1>
          <p className="text-neutral-500 text-sm max-w-md mx-auto mb-8">
            Your delicious meal is now being prepared fresh in our kitchen and will be heading your way shortly.
          </p>

          {/* Key Summary Cards */}
          <div className="grid grid-cols-2 gap-4 text-left mb-8">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Order ID
              </span>
              <span className="font-mono font-black text-base text-[#111111]">
                #{lastConfirmedOrder.id}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Estimated Delivery
              </span>
              <span className="font-bold text-base text-[#F51B55] flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {lastConfirmedOrder.estimatedDeliveryTime || '30 - 45 mins'}
              </span>
            </div>
          </div>

          {/* Order Details Accordion / Preview */}
          <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 text-left space-y-3 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <Receipt className="w-4 h-4" />
              <span>Order Summary</span>
            </h3>

            <div className="space-y-2 pt-2 border-t border-neutral-200/60">
              {lastConfirmedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-neutral-700">
                  <span className="font-medium">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-bold text-[#111111]">
                    RWF {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-neutral-200/60 flex justify-between text-sm font-black text-[#111111]">
              <span>Total Paid</span>
              <span className="text-[#F51B55]">
                RWF {lastConfirmedOrder.total.toLocaleString()}
              </span>
            </div>

            {lastConfirmedOrder.deliveryAddress && (
              <div className="pt-2 border-t border-neutral-200/60 text-xs text-neutral-600 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F51B55] mt-0.5 shrink-0" />
                <span>{lastConfirmedOrder.deliveryAddress}</span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleGoToTracking}
              className="bg-[#F51B55] hover:bg-[#d41446] text-white px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all"
            >
              <span>TRACK LIVE ORDER</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className="bg-white hover:bg-neutral-50 text-[#111111] px-6 py-4 rounded-2xl font-bold text-sm border border-neutral-200 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
