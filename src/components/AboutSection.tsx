import React from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, ShieldCheck, Heart, Users, MapPin, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-pink-100 text-[#F51B55] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>Our Rwandan Story</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight mb-4">
            REDEFINING FAST FOOD IN RWANDA
          </h1>
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
            Umujyi Rwanda was founded with a single mission: to deliver uncompromisingly delicious, crispy, and fresh comfort meals across Kigali at lightning speed.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111]">
              Fresh Local Produce, Unmatched Crunch & Flavor
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Every recipe at Umujyi is developed in Kigali using fresh, locally sourced ingredients. From golden Musanze potatoes transformed into our signature seasoned fries to tender poultry hand-breaded in 11 secret herbs and spices, we never compromise on freshness.
            </p>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Unlike frozen industrial alternatives, our chicken is marinated for 12 hours and cooked fresh to order in temperature-calibrated fryers so you experience the juiciest bite every single time.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                <span className="text-2xl font-black text-[#F51B55]">100%</span>
                <p className="text-xs font-bold text-[#111111] mt-1">Halal Certified</p>
                <p className="text-[11px] text-neutral-500">Ethically sourced poultry</p>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                <span className="text-2xl font-black text-[#F51B55]">30 Min</span>
                <p className="text-xs font-bold text-[#111111] mt-1">Kigali Delivery Guarantee</p>
                <p className="text-[11px] text-neutral-500">From hot fryers to your door</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200"
                alt="Umujyi Kitchen in Kigali"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-3xl bg-[#F5F5F5] border border-neutral-200/60">
            <div className="w-12 h-12 rounded-2xl bg-[#F51B55] text-white flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#111111] mb-2">Hospitality & Quality</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every box is checked before leaving the kitchen to ensure piping-hot temperature and pristine presentation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F5F5F5] border border-neutral-200/60">
            <div className="w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-[#F51B55]" />
            </div>
            <h3 className="text-lg font-black text-[#111111] mb-2">Supporting Rwandan Farmers</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              We partner directly with Rwandan agricultural cooperatives for potatoes, tomatoes, dairy, and spices.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F5F5F5] border border-neutral-200/60">
            <div className="w-12 h-12 rounded-2xl bg-[#F51B55] text-white flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#111111] mb-2">Empowering Local Youth</h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Our culinary chefs, front-of-house staff, and delivery riders receive comprehensive hospitality training.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#111111] text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Hungry for the Best Crunch in Town?</h2>
          <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
            Browse our signature menu and taste the passion cooked into every bite.
          </p>
          <button
            onClick={() => setActiveTab('menu')}
            className="bg-[#F51B55] hover:bg-[#d41446] text-white px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg transition-all"
          >
            Explore the Menu
          </button>
        </div>
      </div>
    </div>
  );
};
