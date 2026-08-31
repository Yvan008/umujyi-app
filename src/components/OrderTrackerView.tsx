import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Bike,
  ChefHat,
  PackageCheck,
  Home,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Play,
  RotateCcw,
} from 'lucide-react';

export const OrderTrackerView: React.FC = () => {
  const {
    orders,
    activeTrackingOrder,
    setActiveTrackingOrder,
    trackOrderById,
    updateOrderStatus,
    showToast,
    setActiveTab,
  } = useStore();

  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState('');

  // Fallback to active order or latest order
  const order = activeTrackingOrder || orders[0] || null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const result = trackOrderById(searchId);
    if (!result) {
      setSearchError(`No order found with ID "${searchId}". Please verify your order number.`);
    } else {
      setSearchError('');
      setSearchId('');
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'CONFIRMED':
        return 1;
      case 'PREPARING':
        return 2;
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  const steps = [
    {
      label: 'Order Placed',
      desc: 'We received your order',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: 'Confirmed',
      desc: 'Sent to Kigali kitchen',
      icon: <PackageCheck className="w-5 h-5" />,
    },
    {
      label: 'In the Kitchen',
      desc: 'Cooking fresh & hot',
      icon: <ChefHat className="w-5 h-5" />,
    },
    {
      label: 'Out for Delivery',
      desc: 'Driver on motorcycle',
      icon: <Bike className="w-5 h-5" />,
    },
    {
      label: 'Delivered',
      desc: 'Bon Appétit / Murakoze!',
      icon: <Home className="w-5 h-5" />,
    },
  ];

  // Helper to advance state for simulation/testing
  const handleAdvanceSimulation = () => {
    if (!order) return;
    const statusSequence: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIdx = statusSequence.indexOf(order.status);
    const nextIdx = (currentIdx + 1) % statusSequence.length;
    updateOrderStatus(order.id, statusSequence[nextIdx]);
    showToast(`Simulation: Advanced order to ${statusSequence[nextIdx]}`, 'info');
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F5F5F5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Order Tracker Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-pink-100 text-[#F51B55] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Kigali Dispatch</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
                TRACK YOUR ORDER
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Enter your order tracking ID (e.g. ZST-88219) to watch live updates.
              </p>
            </div>

            {/* Tracker Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value);
                    setSearchError('');
                  }}
                  placeholder="Order ID (e.g. ZST-88219)"
                  className="w-full pl-9 pr-4 py-3 bg-neutral-100 rounded-xl border border-neutral-200 text-xs sm:text-sm font-mono uppercase focus:outline-none focus:border-[#F51B55]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#111111] hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors shrink-0"
              >
                Track
              </button>
            </form>
          </div>

          {searchError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {order ? (
          <div className="space-y-8">
            {/* Live Progress Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-neutral-400 uppercase">Tracking Order</span>
                    <span className="font-mono font-black text-xl text-[#111111]">#{order.id}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Placed by <strong className="text-[#111111]">{order.customerName}</strong> • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-pink-50 border border-pink-200 px-4 py-2 rounded-2xl text-left">
                    <span className="text-[10px] font-extrabold text-[#F51B55] uppercase tracking-wider block">
                      Estimated Arrival
                    </span>
                    <span className="font-extrabold text-sm text-[#111111] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#F51B55]" />
                      {order.estimatedDeliveryTime || '30 - 40 mins'}
                    </span>
                  </div>

                  {/* Demo status simulation button */}
                  <button
                    onClick={handleAdvanceSimulation}
                    title="Advance status for demonstration"
                    className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-4 h-4 text-[#F51B55]" />
                    <span className="hidden sm:inline">Simulate Next Step</span>
                  </button>
                </div>
              </div>

              {/* Progress Timeline Stepper */}
              <div className="py-8">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1.5 bg-neutral-200 rounded-full z-0">
                    <div
                      className="h-full bg-[#F51B55] rounded-full transition-all duration-500"
                      style={{
                        width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Steps Icons */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-2 relative z-10">
                    {steps.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div
                          key={step.label}
                          className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
                        >
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 shadow-sm shrink-0 ${
                              isCurrent
                                ? 'bg-[#F51B55] text-white ring-4 ring-pink-100 scale-110'
                                : isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                            }`}
                          >
                            {isCompleted && !isCurrent ? (
                              <CheckCircle2 className="w-6 h-6" />
                            ) : (
                              step.icon
                            )}
                          </div>

                          <div className="text-left sm:text-center">
                            <p
                              className={`text-xs sm:text-sm font-black ${
                                isCurrent
                                  ? 'text-[#F51B55]'
                                  : isCompleted
                                  ? 'text-[#111111]'
                                  : 'text-neutral-400'
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-[11px] text-neutral-500 hidden sm:block">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Delivery Courier / Driver Card */}
              {order.deliveryMethod === 'DELIVERY' && currentStep >= 2 && (
                <div className="mt-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                      alt="Driver"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-[#111111]">
                          Jean-Paul Niyonzima
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Driver
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Motorcycle: <strong className="text-neutral-800 font-mono">RAE 819B</strong> • Honda 125cc
                      </p>
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Bike className="w-3.5 h-3.5" />
                        <span>En route to your location in Kigali</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href="tel:+250788998877"
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-[#111111] hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#F51B55]" />
                      <span>Call Driver</span>
                    </a>
                    <a
                      href="https://wa.me/250788998877"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Map Simulation & Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Kigali Map Route Card */}
              <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-black text-[#111111] mb-2 flex items-center justify-between">
                    <span>Live GPS Delivery Path</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Live Signal
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500 mb-4">
                    Dispatching from Umujyi Kimihurura Kitchen directly to {order.sector || 'your location'}, Kigali.
                  </p>
                </div>

                {/* Simulated SVG Interactive Map */}
                <div className="relative aspect-[16/10] bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 p-4 flex items-center justify-center text-white">
                  {/* Background Road Grid SVG Simulation */}
                  <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#444" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    {/* Simulated Kigali Route */}
                    <path
                      d="M 50 120 Q 150 40, 240 100 T 360 80"
                      fill="none"
                      stroke="#F51B55"
                      strokeWidth="4"
                      strokeDasharray="6 6"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Hub Marker */}
                  <div className="absolute top-1/4 left-1/6 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#F51B55] text-white flex items-center justify-center font-bold text-xs shadow-lg ring-4 ring-pink-500/30">
                      🍗
                    </div>
                    <span className="text-[10px] font-bold mt-1 bg-black/80 px-2 py-0.5 rounded text-white">
                      Umujyi Hub
                    </span>
                  </div>

                  {/* Destination Marker */}
                  <div className="absolute bottom-1/4 right-1/6 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-lg ring-4 ring-emerald-500/30">
                      📍
                    </div>
                    <span className="text-[10px] font-bold mt-1 bg-black/80 px-2 py-0.5 rounded text-white">
                      {order.sector || 'Destination'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] text-neutral-300 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#F51B55]" />
                    <span>Kigali Central Sector Route</span>
                  </div>
                </div>
              </div>

              {/* Order Items & Breakdown */}
              <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-black text-[#111111] pb-3 border-b border-neutral-100">
                    Order Details
                  </h3>

                  <div className="space-y-3 py-3 max-h-56 overflow-y-auto">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-[#111111]">{item.name}</p>
                          <p className="text-neutral-400">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-black text-[#111111]">
                          RWF {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#111111]">RWF {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-bold text-[#111111]">
                        {order.deliveryFee === 0 ? 'FREE' : `RWF ${order.deliveryFee.toLocaleString()}`}
                      </span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Discount</span>
                        <span>- RWF {order.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-neutral-100 font-black text-sm text-[#111111]">
                      <span>Total</span>
                      <span className="text-[#F51B55] text-base">RWF {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-2xl text-xs text-neutral-600 space-y-1">
                  <p>
                    <strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})
                  </p>
                  {order.deliveryAddress && (
                    <p className="line-clamp-2">
                      <strong>Address:</strong> {order.deliveryAddress}
                    </p>
                  )}
                  {order.instructions && (
                    <p>
                      <strong>Note:</strong> {order.instructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200">
            <h3 className="text-xl font-bold text-[#111111] mb-2">No Active Order Selected</h3>
            <p className="text-neutral-500 text-sm mb-6">
              Enter your order ID above or start a new order to see live tracking updates.
            </p>
            <button
              onClick={() => setActiveTab('menu')}
              className="bg-[#F51B55] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md"
            >
              Order Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
