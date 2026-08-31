import React from 'react';
import { useStore } from '../context/StoreContext';
import { Tag, Sparkles, Copy, Check, ArrowRight, Clock } from 'lucide-react';

export const OffersSection: React.FC = () => {
  const { offers, applyPromoCode, appliedOffer, setActiveTab, setSelectedCategory } = useStore();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopyAndApply = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    applyPromoCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <section id="offers-section" className="py-12 sm:py-16 bg-[#F5F5F5] border-b border-neutral-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-pink-100 text-[#F51B55] px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kigali Hot Deals & Promos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight">
            SPECIAL OFFERS & SAVINGS
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base mt-2">
            Enjoy great discounts, free delivery vouchers, and value combo bundles crafted for you.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {offers
            .filter((o) => o.isActive)
            .map((offer) => {
              const isApplied = appliedOffer?.code === offer.code;

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
                >
                  {/* Offer Image */}
                  <div className="relative sm:w-2/5 aspect-[16/10] sm:aspect-auto bg-neutral-100 overflow-hidden shrink-0">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#F51B55] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {offer.badge}
                    </span>
                  </div>

                  {/* Offer Details */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-bold text-[#F51B55] uppercase tracking-wider">
                          {offer.tagline}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-[#111111] leading-tight mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                        {offer.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Min. Order: RWF {offer.minOrderAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Promo Code & Action */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 bg-neutral-100 px-3 py-1.5 rounded-xl border border-dashed border-neutral-300">
                        <Tag className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="font-mono font-bold text-xs text-neutral-800">
                          {offer.code}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyAndApply(offer.code)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs ${
                          isApplied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#111111] hover:bg-neutral-800 text-white'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Applied</span>
                          </>
                        ) : copiedCode === offer.code ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Apply Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 bg-gradient-to-r from-[#111111] to-neutral-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black mb-1">Planning a Corporate Lunch or Party in Kigali?</h3>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Get customized bulk platters, whole chickens, and custom pizza boxes delivered hot to your office.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('cat-family');
              setActiveTab('menu');
            }}
            className="bg-[#F51B55] hover:bg-[#d41446] text-white px-6 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all shrink-0"
          >
            <span>View Family & Party Buckets</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
