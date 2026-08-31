import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, businessSettings, setSelectedCategory } = useStore();

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              {businessSettings.logoUrl ? (
                <img
                  src={businessSettings.logoUrl}
                  alt={businessSettings.name}
                  className="h-10 max-w-[160px] object-contain brightness-0 invert"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
                  {businessSettings.logoText ? (
                    businessSettings.logoText
                  ) : (
                    <>UMUJYI<span className="text-[#F51B55]">.</span></>
                  )}
                </span>
              )}
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Kigali's premier fast-casual food delivery experience. Crispy marinated chicken, smash burgers, stone-baked pizza, and signature seasoned fries prepared fresh daily.
            </p>
            <div className="pt-2 text-xs text-neutral-400 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F51B55]" />
                <span>{businessSettings.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F51B55]" />
                <span>{businessSettings.phone}</span>
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold tracking-widest text-neutral-300 uppercase">
              Explore Menu
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('cat-chicken');
                    setActiveTab('menu');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Crispy Fried Chicken
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('cat-burgers');
                    setActiveTab('menu');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Gourmet Burgers
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('cat-combos');
                    setActiveTab('menu');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Value Meal Combos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('cat-pizza');
                    setActiveTab('menu');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Woodfired Pizza
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('cat-family');
                    setActiveTab('menu');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Family & Party Platters
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold tracking-widest text-neutral-300 uppercase">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-white transition-colors"
                >
                  About Umujyi Rwanda
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('offers')}
                  className="hover:text-white transition-colors"
                >
                  Promos & Coupons
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="hover:text-white transition-colors"
                >
                  Locations & Hours
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="hover:text-white transition-colors"
                >
                  Catering Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Ordering & Tracking */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold tracking-widest text-neutral-300 uppercase">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => setActiveTab('tracking')}
                  className="hover:text-[#F51B55] transition-colors font-bold text-neutral-300"
                >
                  Track Live Order →
                </button>
              </li>
              <li>
                <a
                  href={`tel:${businessSettings.phone}`}
                  className="hover:text-white transition-colors"
                >
                  Call Dispatch
                </a>
              </li>
              <li>
                <span className="text-neutral-500">Delivery: 10:00 AM - 11:30 PM</span>
              </li>
              <li>
                <span className="text-neutral-500">Payment: MoMo, Airtel, Cards, Cash</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer with Copyright & Discreet "Check-in" link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Umujyi Rwanda Food Co. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Crafted in Kigali</span>
          </div>

          {/* Discreet Footer secondary links containing the subtle "Check-in" text link */}
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="text-neutral-700">|</span>
            {/* MANDATORY: Discreet, subtle text link labeled "Check-in" in the footer */}
            <button
              id="footer-checkin-link"
              onClick={() => setActiveTab('check-in')}
              className="text-neutral-500 hover:text-neutral-300 hover:underline transition-colors font-medium text-xs cursor-pointer"
              title="Staff Portal"
            >
              Check-in
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
