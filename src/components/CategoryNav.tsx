import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Utensils,
  Flame,
  Sandwich,
  Box,
  Layers,
  Pizza,
  Salad,
  Coffee,
  IceCream,
  Users,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'cat-all': <Utensils className="w-4 h-4" />,
  'cat-chicken': <Flame className="w-4 h-4" />,
  'cat-burgers': <Sandwich className="w-4 h-4" />,
  'cat-combos': <Box className="w-4 h-4" />,
  'cat-wraps': <Layers className="w-4 h-4" />,
  'cat-pizza': <Pizza className="w-4 h-4" />,
  'cat-sides': <Salad className="w-4 h-4" />,
  'cat-drinks': <Coffee className="w-4 h-4" />,
  'cat-desserts': <IceCream className="w-4 h-4" />,
  'cat-family': <Users className="w-4 h-4" />,
};

export const CategoryNav: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, products } = useStore();

  const getCategoryCount = (catId: string) => {
    if (catId === 'cat-all') return products.filter((p) => p.isAvailable).length;
    return products.filter((p) => p.categoryId === catId && p.isAvailable).length;
  };

  return (
    <div className="sticky top-[64px] z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories
            .filter((c) => c.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = getCategoryCount(cat.id);

              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.slug}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95 shrink-0 ${
                    isSelected
                      ? 'bg-[#111111] text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80 hover:text-black'
                  }`}
                >
                  <span
                    className={`${
                      isSelected ? 'text-[#F51B55]' : 'text-neutral-400'
                    }`}
                  >
                    {CATEGORY_ICONS[cat.id] || <Utensils className="w-4 h-4" />}
                  </span>
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[#F51B55] text-white'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
