import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Plus, Check, Sparkles, TrendingUp } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const { addToCart } = useStore();
  const [isAdded, setIsAdded] = useState(false);

  // Fallback logic: Custom photo has priority, otherwise standard menu photo
  const displayImage = product.uploadedImage || product.defaultImage;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;

    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group relative flex flex-col h-full bg-white rounded-2xl border border-neutral-100/90 shadow-sm hover:shadow-xl hover:border-neutral-200 transition-all duration-300 overflow-hidden ${
        !product.isAvailable ? 'opacity-70 grayscale-[30%]' : ''
      }`}
    >
      {/* Fixed Aspect Ratio & Fixed Visual Height Image Container */}
      <div
        className="relative w-full aspect-[4/3] bg-neutral-100 overflow-hidden cursor-pointer"
        onClick={() => onOpenDetail?.(product)}
      >
        <img
          src={displayImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="inline-flex items-center gap-1 bg-[#F51B55] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {product.badge === 'HOT' && <TrendingUp className="w-3 h-3" />}
              {product.badge === 'NEW' && <Sparkles className="w-3 h-3" />}
              {product.badge}
            </span>
          )}
          {!product.isAvailable && (
            <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Sold Out
            </span>
          )}
        </div>

        {/* Preparation Time Tag */}
        {product.prepTimeMinutes && (
          <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
            {product.prepTimeMinutes} mins
          </span>
        )}
      </div>

      {/* Content Container with Consistent Height & Spacing */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Category Tag */}
          <p className="text-[11px] font-bold text-[#F51B55] uppercase tracking-wider mb-1">
            {product.categoryName}
          </p>

          {/* Product Name */}
          <h3
            onClick={() => onOpenDetail?.(product)}
            className="font-bold text-sm sm:text-lg text-[#111111] leading-snug mb-1.5 line-clamp-1 group-hover:text-[#F51B55] transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short Description with 2-line clamp */}
          <p className="text-neutral-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Bottom Price & Add Action */}
        <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-tight">Price</span>
            <span className="font-extrabold text-sm sm:text-lg text-[#111111]">
              RWF {product.price.toLocaleString()}
            </span>
          </div>

          <button
            id={`btn-add-${product.id}`}
            onClick={handleAdd}
            disabled={!product.isAvailable}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-[11px] sm:text-sm flex flex-1 sm:flex-none items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : !product.isAvailable
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-[#F51B55] text-white hover:bg-[#d41446] hover:shadow-md hover:shadow-pink-500/20'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>ADD</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
