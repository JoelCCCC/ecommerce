"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag, Tag, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const freeShippingThreshold = 75;
  const discountAmount = discountApplied ? subtotal * 0.2 : 0;
  const shippingFee = (subtotal - discountAmount) >= freeShippingThreshold || items.length === 0 ? 0 : 8.00;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "FIRST20") {
      setDiscountApplied(true);
    } else {
      alert("Invalid code. Try using 'FIRST20' for 20% off!");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight mb-3">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
          Elevate your daily wardrobe with our heavyweight carded cotton tees, Japanese selvedge denim, and French terry hoodies.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gray-950 text-white font-black text-xs uppercase tracking-wider hover:bg-indigo-600 transition-colors shadow-lg"
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Reviewing {items.length} {items.length === 1 ? "garment item" : "garment items"}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Items List */}
        <div className="lg:col-span-7 divide-y divide-gray-200 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
          {items.map((item) => (
            <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex gap-5">
              <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-base font-bold text-gray-900">
                      <Link href={`/products/${item.productId}`} className="hover:text-indigo-600 transition-colors">
                        {item.name}
                      </Link>
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-600">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-md font-bold text-gray-800">
                      Size: {item.size}
                    </span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-md font-bold text-gray-800">
                      {item.color}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="font-extrabold text-gray-900">${item.price.toFixed(2)} ea</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-2xs">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-l-xl transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3.5 text-xs font-bold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-r-xl transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-lg font-black text-gray-950">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-950">
            Order Summary
          </h2>

          {/* Promo code */}
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Discount code (FIRST20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase font-mono focus:outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-950 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Apply
            </button>
          </form>

          {discountApplied && (
            <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl font-bold border border-emerald-200">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                20% First Order Discount Applied
              </span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            {discountApplied && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Express Delivery</span>
              <span className="font-bold text-gray-900">
                {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between text-lg font-black text-gray-950">
              <span>Estimated Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 px-6 bg-gray-950 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
