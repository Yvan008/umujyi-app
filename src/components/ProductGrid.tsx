import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { Search, SlidersHorizontal, Utensils, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  onOpenDetail?: (product: Product) => void;
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  onOpenDetail,
  title,
  subtitle,
}) => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'popular'>('featured');

  // Active Category Name
  const currentCategoryObj = categories.find((c) => c.id === selectedCategory);
  const categoryTitle = currentCategoryObj ? currentCategoryObj.name : 'All Menu';

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'cat-all') {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    } else {
      // featured
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="menu-section" className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              {title || (searchQuery ? `Search Results for "${searchQuery}"` : `${categoryTitle} Dishes`)}
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1">
              {subtitle || `Showing ${filteredAndSortedProducts.length} fresh options ready for fast delivery in Kigali`}
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-100 hover:bg-neutral-200/70 text-xs sm:text-sm font-bold text-neutral-700 py-2 px-3 rounded-xl border border-transparent focus:border-[#F51B55] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="py-16 px-4 text-center max-w-md mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-pink-50 text-[#F51B55] flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#111111] mb-2">No food items found</h3>
            <p className="text-neutral-500 text-sm mb-6">
              We couldn't find any dishes matching your query. Try searching for "chicken", "burger", "pizza", or "fries".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('cat-all');
              }}
              className="inline-flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Filters & View All</span>
            </button>
          </div>
        ) : (
          /* Fixed Product Grid: 2 cols on mobile, 3 cols on md, 4 cols on lg */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
