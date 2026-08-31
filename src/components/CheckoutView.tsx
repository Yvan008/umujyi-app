import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { DeliveryMethod, PaymentMethodType } from '../types';
import {
  MapPin,
  Store,
  CreditCard,
  Smartphone,
  Banknote,
  ArrowLeft,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    deliverySettings,
    businessSettings,
    createOrder,
    setActiveTab,
    showToast,
  } = useStore();

  // Form State
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('DELIVERY');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+250 78');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Gasabo');
  const [sector, setSector] = useState('Kimihurura');
  const [streetAddress, setStreetAddress] = useState('');
  const [pickupLocation, setPickupLocation] = useState(
    deliverySettings.pickupLocations[0]?.name || ''
  );
  const [instructions, setInstructions] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('MOMO');
  const [momoPhone, setMomoPhone] = useState('+250 78');
  const [airtelPhone, setAirtelPhone] = useState('+250 72');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const [checkoutState, setCheckoutState] = useState<'idle' | 'initializing' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');

  // Kigali Sectors Map
  const kigaliSectors: Record<string, string[]> = {
    Gasabo: ['Kimihurura', 'Kacyiru', 'Remera', 'Gisozi', 'Nyarutarama', 'Gacuriro', 'Kibagabaga', 'Kimironko', 'Bumbogo'],
    Kicukiro: ['Kicukiro', 'Gikondo', 'Niboye', 'Kanombe', 'Kagarama', 'Gahanga', 'Masaka', 'Nyarugunga'],
    Nyarugenge: ['Kiyovu', 'Nyarugenge CBD', 'Nyamirambo', 'Muhima', 'Gitega', 'Kimisagara', 'Mageragere'],
  };

  const calculatedDeliveryFee = deliveryMethod === 'PICKUP' ? 0 : cartDeliveryFee;
  const grandTotal = Math.max(0, cartSubtotal + calculatedDeliveryFee - cartDiscount);

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) {
      newErrors.phone = 'Please enter a valid Rwandan phone number';
    }

    if (deliveryMethod === 'DELIVERY') {
      if (!streetAddress.trim()) {
        newErrors.streetAddress = 'Delivery address / street name is required';
      }
    }

    if (paymentMethod === 'MOMO') {
      if (!momoPhone.trim() || momoPhone.replace(/\D/g, '').length < 9) {
        newErrors.momoPhone = 'Enter MTN Mobile Money number';
      }
    } else if (paymentMethod === 'AIRTEL') {
      if (!airtelPhone.trim() || airtelPhone.replace(/\D/g, '').length < 9) {
        newErrors.airtelPhone = 'Enter Airtel Money number';
      }
    } else if (paymentMethod === 'CARD') {
      if (!cardNumber.replace(/\s/g, '') || cardNumber.replace(/\s/g, '').length < 15) {
        newErrors.cardNumber = 'Valid 16-digit card number required';
      }
      if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
        newErrors.cardExpiry = 'Valid MM/YY required';
      }
      if (!cardCvc || cardCvc.length < 3) {
        newErrors.cardCvc = '3-digit CVV required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your cart is empty. Please add food items first.', 'error');
      setActiveTab('menu');
      return;
    }

    if (!validateForm()) {
      showToast('Please correct the highlighted fields before proceeding.', 'error');
      return;
    }

    setCheckoutState('initializing');
    setPaymentMessage('Initializing payment...');

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.uploadedImage || item.product.defaultImage,
      }));

      // Call our StoreContext createOrder which now sets it up as PENDING 
      // without immediately redirecting.
      const newOrder = await createOrder({
        customerName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        deliveryMethod,
        deliveryAddress:
          deliveryMethod === 'DELIVERY'
            ? `${streetAddress.trim()}, ${sector}, ${district}, Kigali`
            : undefined,
        district: deliveryMethod === 'DELIVERY' ? district : undefined,
        sector: deliveryMethod === 'DELIVERY' ? sector : undefined,
        pickupLocation: deliveryMethod === 'PICKUP' ? pickupLocation : undefined,
        instructions: instructions.trim() || undefined,
        items: orderItems,
        subtotal: cartSubtotal,
        deliveryFee: calculatedDeliveryFee,
        discount: cartDiscount,
        total: grandTotal,
        status: 'PENDING',
        paymentMethod,
        paymentStatus: 'PENDING',
        paymentReference: '', // Will be updated via our simulated backend
        estimatedDeliveryTime:
          deliveryMethod === 'DELIVERY'
            ? `${deliverySettings.defaultEstimatedDeliveryMinutes} - ${deliverySettings.defaultEstimatedDeliveryMinutes + 15} mins`
            : 'Ready for pickup in 20 mins',
      });

      if (paymentMethod === 'CASH') {
        // Cash on delivery completes immediately
        setCheckoutState('success');
        showToast('Order placed successfully!', 'success');
        setActiveTab('confirmation');
        return;
      }

      setCheckoutState('processing');
      setPaymentMessage('Processing your payment... Please check your phone for the prompt.');
      
      // Simulate backend payment initialization and verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demonstration in local React SPA, simulate verification:
      // Real app would poll a `verifyPayment` API endpoint here or listen for a webhook.
      
      const isSuccess = Math.random() > 0.1; // 90% success rate
      
      if (isSuccess) {
        setCheckoutState('success');
        setPaymentMessage('Payment confirmed');
        // Update order status in store
        useStore.getState().updateOrderStatus(newOrder.id, 'CONFIRMED', 'PAID');
        showToast('Payment successful!', 'success');
        setActiveTab('confirmation');
      } else {
        setCheckoutState('failed');
        setPaymentMessage('Payment could not be completed.');
        useStore.getState().updateOrderStatus(newOrder.id, 'PENDING', 'FAILED');
      }

    } catch (err) {
      console.error(err);
      setCheckoutState('failed');
      setPaymentMessage('There was an error communicating with the payment provider.');
      showToast('There was an issue creating your order. Please try again.', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-black text-[#111111] mb-2">Your Cart is Empty</h2>
        <p className="text-neutral-500 text-sm mb-6">
          Add some delicious items from our menu before checking out.
        </p>
        <button
          onClick={() => setActiveTab('menu')}
          className="bg-[#F51B55] text-white px-6 py-3 rounded-xl font-bold"
        >
          View Menu
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#F5F5F5] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          onClick={() => setActiveTab('menu')}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-[#111111] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Checkout Form */}
          <form onSubmit={handlePlaceOrder} className="w-full lg:w-7/12 space-y-6">
            {/* Step 1: Delivery Method Toggle */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
              <h2 className="text-lg font-black text-[#111111] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F51B55] text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Choose Delivery Option</span>
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('DELIVERY')}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm flex flex-col items-center gap-2 transition-all ${
                    deliveryMethod === 'DELIVERY'
                      ? 'border-[#F51B55] bg-pink-50/50 text-[#F51B55]'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <MapPin className="w-6 h-6" />
                  <span>Doorstep Delivery</span>
                  <span className="text-[11px] font-medium text-neutral-500">Kigali Express</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('PICKUP')}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm flex flex-col items-center gap-2 transition-all ${
                    deliveryMethod === 'PICKUP'
                      ? 'border-[#F51B55] bg-pink-50/50 text-[#F51B55]'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <Store className="w-6 h-6" />
                  <span>Branch Pickup</span>
                  <span className="text-[11px] font-medium text-emerald-600">Free (No fee)</span>
                </button>
              </div>
            </div>

            {/* Step 2: Customer Details & Location */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-[#111111] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F51B55] text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Customer & {deliveryMethod === 'DELIVERY' ? 'Address' : 'Pickup'} Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Patrick Mugisha"
                    className={`w-full p-3 bg-neutral-50 rounded-xl border text-sm focus:outline-none focus:border-[#F51B55] ${
                      errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-neutral-200'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Phone Number (Rwanda) *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 788 123 456"
                    className={`w-full p-3 bg-neutral-50 rounded-xl border text-sm focus:outline-none focus:border-[#F51B55] ${
                      errors.phone ? 'border-red-500 bg-red-50/20' : 'border-neutral-200'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Email Address <span className="text-neutral-400 font-normal">(Optional for digital receipt)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#F51B55]"
                />
              </div>

              {deliveryMethod === 'DELIVERY' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        District (Kigali)
                      </label>
                      <select
                        value={district}
                        onChange={(e) => {
                          const dist = e.target.value;
                          setDistrict(dist);
                          setSector(kigaliSectors[dist][0]);
                        }}
                        className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-800 focus:outline-none focus:border-[#F51B55]"
                      >
                        <option value="Gasabo">Gasabo</option>
                        <option value="Kicukiro">Kicukiro</option>
                        <option value="Nyarugenge">Nyarugenge</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Sector
                      </label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-800 focus:outline-none focus:border-[#F51B55]"
                      >
                        {kigaliSectors[district]?.map((sec) => (
                          <option key={sec} value={sec}>
                            {sec}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Street Address / House / Landmark *
                    </label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. KG 622 St, House #14 (Opposite Kigali Heights)"
                      className={`w-full p-3 bg-neutral-50 rounded-xl border text-sm focus:outline-none focus:border-[#F51B55] ${
                        errors.streetAddress ? 'border-red-500 bg-red-50/20' : 'border-neutral-200'
                      }`}
                    />
                    {errors.streetAddress && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.streetAddress}</p>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Select Pickup Branch
                  </label>
                  <div className="space-y-2">
                    {deliverySettings.pickupLocations.map((loc) => (
                      <label
                        key={loc.id}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          pickupLocation === loc.name
                            ? 'border-[#F51B55] bg-pink-50/40'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pickupHub"
                          value={loc.name}
                          checked={pickupLocation === loc.name}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          className="mt-1 accent-[#F51B55]"
                        />
                        <div>
                          <p className="text-sm font-bold text-[#111111]">{loc.name}</p>
                          <p className="text-xs text-neutral-500">{loc.address}</p>
                          <p className="text-[11px] text-[#F51B55] font-semibold mt-0.5">
                            {loc.operatingHours}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Delivery / Chef Instructions
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Ring gate bell, keep sauce separate, call on arrival"
                  className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#F51B55]"
                />
              </div>
            </div>

            {/* Step 3: Rwanda Payment Methods */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-[#111111] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F51B55] text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>Payment Method (Rwanda)</span>
              </h2>

              <div className="space-y-3">
                {/* MTN Mobile Money */}
                {businessSettings.enabledPaymentMethods.momo && (
                  <div
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'MOMO'
                        ? 'border-[#F51B55] bg-pink-50/20'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                    onClick={() => setPaymentMethod('MOMO')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black text-xs shadow-xs">
                          MTN
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#111111]">MTN Mobile Money</p>
                          <p className="text-xs text-neutral-500">Pay directly via MoMo prompt (*182#)</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'MOMO'}
                        onChange={() => setPaymentMethod('MOMO')}
                        className="accent-[#F51B55] w-5 h-5 cursor-pointer"
                      />
                    </div>

                    {paymentMethod === 'MOMO' && (
                      <div className="mt-4 pt-3 border-t border-pink-100/60 space-y-2">
                        <label className="block text-xs font-bold text-neutral-700">
                          MTN Phone Number to Charge *
                        </label>
                        <input
                          type="tel"
                          value={momoPhone}
                          onChange={(e) => setMomoPhone(e.target.value)}
                          placeholder="+250 788 123 456"
                          className="w-full p-2.5 bg-white rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#F51B55]"
                        />
                        {errors.momoPhone && (
                          <p className="text-[11px] text-red-500">{errors.momoPhone}</p>
                        )}
                        <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5 text-[#F51B55]" />
                          You will receive a payment push prompt on your phone to confirm with your MoMo PIN.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Airtel Money */}
                {businessSettings.enabledPaymentMethods.airtel && (
                  <div
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'AIRTEL'
                        ? 'border-[#F51B55] bg-pink-50/20'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                    onClick={() => setPaymentMethod('AIRTEL')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                          AIRTEL
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#111111]">Airtel Money</p>
                          <p className="text-xs text-neutral-500">Pay via Airtel Money (*500#)</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'AIRTEL'}
                        onChange={() => setPaymentMethod('AIRTEL')}
                        className="accent-[#F51B55] w-5 h-5 cursor-pointer"
                      />
                    </div>

                    {paymentMethod === 'AIRTEL' && (
                      <div className="mt-4 pt-3 border-t border-pink-100/60 space-y-2">
                        <label className="block text-xs font-bold text-neutral-700">
                          Airtel Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={airtelPhone}
                          onChange={(e) => setAirtelPhone(e.target.value)}
                          placeholder="+250 722 123 456"
                          className="w-full p-2.5 bg-white rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#F51B55]"
                        />
                        {errors.airtelPhone && (
                          <p className="text-[11px] text-red-500">{errors.airtelPhone}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Visa / Mastercard */}
                {businessSettings.enabledPaymentMethods.card && (
                  <div
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'border-[#F51B55] bg-pink-50/20'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                    onClick={() => setPaymentMethod('CARD')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          <CreditCard className="w-5 h-5 text-neutral-200" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#111111]">Credit / Debit Card</p>
                          <p className="text-xs text-neutral-500">Visa, Mastercard, 3D Secure</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'CARD'}
                        onChange={() => setPaymentMethod('CARD')}
                        className="accent-[#F51B55] w-5 h-5 cursor-pointer"
                      />
                    </div>

                    {paymentMethod === 'CARD' && (
                      <div className="mt-4 pt-3 border-t border-pink-100/60 space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4000 1234 5678 9010"
                            maxLength={19}
                            className="w-full p-2.5 bg-white rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#F51B55]"
                          />
                          {errors.cardNumber && (
                            <p className="text-[11px] text-red-500">{errors.cardNumber}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1">
                              Expiry (MM/YY) *
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="08/28"
                              maxLength={5}
                              className="w-full p-2.5 bg-white rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#F51B55]"
                            />
                            {errors.cardExpiry && (
                              <p className="text-[11px] text-red-500">{errors.cardExpiry}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-neutral-700 mb-1">
                              CVV *
                            </label>
                            <input
                              type="password"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="123"
                              maxLength={4}
                              className="w-full p-2.5 bg-white rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#F51B55]"
                            />
                            {errors.cardCvc && (
                              <p className="text-[11px] text-red-500">{errors.cardCvc}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Cash on Delivery */}
                {businessSettings.enabledPaymentMethods.cashOnDelivery && (
                  <div
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'CASH'
                        ? 'border-[#F51B55] bg-pink-50/20'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                    onClick={() => setPaymentMethod('CASH')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#111111]">Cash on Delivery / Pickup</p>
                          <p className="text-xs text-neutral-500">Pay in cash or MoMo when your food arrives</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'CASH'}
                        onChange={() => setPaymentMethod('CASH')}
                        className="accent-[#F51B55] w-5 h-5 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Place Order CTA on mobile */}
            <div className="block lg:hidden">
              <button
                type="submit"
                disabled={checkoutState !== 'idle' && checkoutState !== 'failed'}
                className={`w-full text-white font-extrabold text-lg py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-75 ${
                  checkoutState === 'success' ? 'bg-emerald-500' :
                  checkoutState === 'failed' ? 'bg-red-500' :
                  'bg-[#F51B55] hover:bg-[#d41446]'
                }`}
              >
                {checkoutState === 'initializing' || checkoutState === 'processing' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">{paymentMessage || 'Processing...'}</span>
                  </>
                ) : checkoutState === 'success' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Payment Confirmed</span>
                  </>
                ) : checkoutState === 'failed' ? (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    <span>Payment Failed - Try Again</span>
                  </>
                ) : (
                  <span>PLACE ORDER • RWF {grandTotal.toLocaleString()}</span>
                )}
              </button>
            </div>
          </form>

          {/* Right Summary Column */}
          <div className="w-full lg:w-5/12 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-sm sticky top-24 space-y-6">
            <h3 className="text-lg font-black text-[#111111] pb-3 border-b border-neutral-100">
              Order Summary
            </h3>

            {/* Item List Preview */}
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.product.uploadedImage || item.product.defaultImage}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <p className="font-bold text-[#111111] line-clamp-1">{item.product.name}</p>
                      <p className="text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#111111] shrink-0">
                    RWF {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#111111]">
                  RWF {cartSubtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-[#111111]">
                  {calculatedDeliveryFee === 0 ? (
                    <span className="text-emerald-600 font-black uppercase">FREE</span>
                  ) : (
                    `RWF ${calculatedDeliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount</span>
                  <span>- RWF {cartDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between pt-3 border-t border-neutral-100 text-base font-black text-[#111111]">
                <span>Grand Total</span>
                <span className="text-[#F51B55] text-xl">
                  RWF {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Desktop Place Order Button */}
            <div className="hidden lg:block pt-2">
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={checkoutState !== 'idle' && checkoutState !== 'failed'}
                className={`w-full text-white font-extrabold text-base py-4 rounded-2xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-75 ${
                  checkoutState === 'success' ? 'bg-emerald-500 shadow-emerald-500/25' :
                  checkoutState === 'failed' ? 'bg-red-500 shadow-red-500/25' :
                  'bg-[#F51B55] hover:bg-[#d41446]'
                }`}
              >
                {checkoutState === 'initializing' || checkoutState === 'processing' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">{paymentMessage || 'Processing...'}</span>
                  </>
                ) : checkoutState === 'success' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Payment Confirmed</span>
                  </>
                ) : checkoutState === 'failed' ? (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    <span>Payment Failed - Try Again</span>
                  </>
                ) : (
                  <span>PLACE ORDER • RWF {grandTotal.toLocaleString()}</span>
                )}
              </button>
            </div>

            {/* Security Guarantee Note */}
            <div className="p-3 bg-neutral-50 rounded-xl flex items-center gap-2 text-[11px] text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Guaranteed fresh delivery with real-time driver tracking.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
