"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check, Star, ShoppingBag, ArrowUpRight } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || "Standard");
  const [isAdded, setIsAdded] = useState(false);

  // Original price for strikethrough discount display
  const originalPrice = Math.round(product.price * 1.25);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article aria-label={product.name} className="group relative bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col">
      {/* Product Image & Badges */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-3/4 w-full bg-gray-100 overflow-hidden block"
      >
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlay for visual depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          {product.featured ? (
            <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-white" />
              Featured Drop
            </span>
          ) : (
            <span className="bg-gray-950/85 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
              {product.category}
            </span>
          )}
        </div>

        {/* Stock / Sale Badge */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              Only {product.stock} left
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
              20% Off
            </span>
          )}
        </div>

        {/* Department tag at bottom */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-2xs border border-white/60">
            {product.gender}
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Star Reviews Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>
            <span className="text-[11px] text-gray-400 font-medium">(4.9)</span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-bold text-gray-950 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
            <Link href={`/products/${product.id}`}>{product.name}</Link>
          </h3>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-black text-gray-950">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400 line-through font-medium">
              ${originalPrice.toFixed(2)}
            </span>
          </div>

          {/* Quick Size Chips */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5 font-medium">
              <span>Size:</span>
              <span className="font-bold text-gray-900">{selectedSize}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(s);
                  }}
                  className={`min-w-7 h-6 px-1.5 text-[10px] font-bold rounded-md border transition-all cursor-pointer ${
                    selectedSize === s
                      ? "bg-gray-950 text-white border-gray-950 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color preview swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1 font-medium">
                <span>Color:</span>
                <span className="font-bold text-gray-900">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColor(c);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border transition-all cursor-pointer ${
                      selectedColor === c
                        ? "bg-indigo-50 border-indigo-400 text-indigo-700 font-bold"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 py-2 px-3 text-center text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isAdded
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-gray-950 hover:bg-indigo-600 text-white shadow-xs"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
