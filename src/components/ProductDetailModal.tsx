import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { X, Plus, Minus, Flame, Clock, Sparkles, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Extra Spicy'>('Medium');
  const [extraSauce, setExtraSauce] = useState(false);
  const [notes, setNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const displayImage = product.uploadedImage || product.defaultImage;

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      {
        spiciness: spiceLevel,
        extraSauce,
      },
      notes
    );
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div
      id="product-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative aspect-[16/10] w-full bg-neutral-100">
          <img
            src={displayImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-neutral-800 hover:bg-white flex items-center justify-center shadow-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {product.badge && (
            <span className="absolute top-4 left-4 bg-[#F51B55] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-grow space-y-5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-[#F51B55] uppercase tracking-wider">
                {product.categoryName}
              </span>
              {product.prepTimeMinutes && (
                <span className="flex items-center gap-1 text-xs text-neutral-500 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {product.prepTimeMinutes} mins prep
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-[#111111]">{product.name}</h2>
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{product.description}</p>
          </div>

          {/* Spiciness Level Options */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-2">
              Spice Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mild', 'Medium', 'Extra Spicy'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSpiceLevel(level)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    spiceLevel === level
                      ? 'border-[#F51B55] bg-pink-50 text-[#F51B55]'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Addon Extra Sauce */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
            <div>
              <p className="text-xs font-bold text-[#111111]">Add Extra Signature Umujyi Sauce</p>
              <p className="text-[11px] text-neutral-500">+ RWF 500</p>
            </div>
            <input
              type="checkbox"
              checked={extraSauce}
              onChange={(e) => setExtraSauce(e.target.checked)}
              className="w-5 h-5 accent-[#F51B55] rounded cursor-pointer"
            />
          </div>

          {/* Special Instructions */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
              Special Kitchen Instructions
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra napkins, no onions, sauce on the side..."
              className="w-full text-xs sm:text-sm p-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#F51B55]"
            />
          </div>
        </div>

        {/* Footer with Quantity & Price Button */}
        <div className="p-4 sm:p-6 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-sm w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex-grow py-3.5 px-5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 text-white shadow-lg transition-all ${
              isAdded ? 'bg-emerald-600' : 'bg-[#F51B55] hover:bg-[#d41446]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <span>Add to Cart</span>
                <span>•</span>
                <span>
                  RWF {((product.price + (extraSauce ? 500 : 0)) * quantity).toLocaleString()}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
