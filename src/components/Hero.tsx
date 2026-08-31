import React from 'react';
import { useStore } from '../context/StoreContext';
import { heroImg } from '../data/initialData';
import { ArrowRight, Clock, ShieldCheck, Zap, Star } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F5F5] to-white pt-6 pb-12 lg:pt-10 lg:pb-16 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-pink-100/80 border border-pink-200/60 px-3.5 py-1.5 rounded-full text-[#F51B55] text-xs font-extrabold tracking-wider uppercase mb-5 shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-[#F51B55]" />
              <span>Kigali's #1 Fast Food Delivery</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] tracking-tight leading-[1.08] mb-5">
              GOOD FOOD.<br />
              <span className="text-[#F51B55]">DELIVERED FAST.</span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-xl mb-8">
              Freshly prepared meals delivered straight to your door across Kigali. Crispy chicken, flame-grilled burgers, loaded fries, and woodfired pizza crafted with fresh Rwandan ingredients.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <button
                id="hero-order-now-btn"
                onClick={() => {
                  setActiveTab('menu');
                  const menuElem = document.getElementById('menu-section');
                  if (menuElem) {
                    menuElem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto bg-[#F51B55] hover:bg-[#d41446] text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/35 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>ORDER NOW</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-view-menu-btn"
                onClick={() => {
                  setActiveTab('menu');
                  const menuElem = document.getElementById('menu-section');
                  if (menuElem) {
                    menuElem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto bg-white hover:bg-neutral-50 text-[#111111] font-bold text-base px-8 py-4 rounded-2xl border-2 border-neutral-200 hover:border-neutral-400 transition-all duration-200 active:scale-95 flex items-center justify-center"
              >
                VIEW MENU
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200/80 w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-neutral-200 flex items-center justify-center text-[#F51B55] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#111111]">30 Mins</p>
                  <p className="text-[11px] text-neutral-500 font-medium">Average ETA</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-neutral-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#111111]">100% Fresh</p>
                  <p className="text-[11px] text-neutral-500 font-medium">Local Produce</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-neutral-200 flex items-center justify-center text-amber-500 shrink-0">
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#111111]">4.9 / 5.0</p>
                  <p className="text-[11px] text-neutral-500 font-medium">Kigali Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right AI Food Platter Hero Image Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative background glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#F51B55]/15 to-amber-500/10 rounded-[36px] blur-2xl -z-10" />

              {/* Main AI Hero Image */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-neutral-900">
                <img
                  src={heroImg}
                  alt="Umujyi Rwanda Gourmet Platter"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />

                {/* Overlay Floating Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F51B55] flex items-center justify-center text-white font-extrabold text-sm">
                      -20%
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#111111]">First Order Promo</p>
                      <p className="text-[11px] text-neutral-500">Code: FIRSTUMUJYI at checkout</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('offers')}
                    className="text-xs font-extrabold text-[#F51B55] hover:underline"
                  >
                    View Offer →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
