"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, ShoppingBag, CreditCard, Sparkles, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "Alex Parker",
    email: "alex.parker@example.com",
    address: "742 Evergreen Terrace",
    city: "San Francisco",
    postalCode: "94107",
    country: "United States",
    paymentMethod: "Credit Card (Demo)",
  });

  const shippingFee = subtotal >= 75 || items.length === 0 ? 0 : 8.0;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight mb-2">
          No garments in bag
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          Your shopping bag is currently empty. Please add garments before checking out.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gray-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-600 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Collection</span>
        </Link>
      </div>
    );
  }

  const handleQuickFill = () => {
    setFormData({
      name: "Marcus Aurelius",
      email: "marcus.aurelius@atelier.io",
      address: "10 Downing Plaza, Suite 400",
      city: "New York",
      postalCode: "10001",
      country: "United States",
      paymentMethod: "Credit Card (Demo)",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        customer_name: formData.name,
        customer_email: formData.email,
        shipping_address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country,
        payment_method: formData.paymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          image_url: i.image_url,
          size: i.size,
          color: i.color,
          price: i.price,
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process order");
      }

      clearCart();
      router.push(`/orders/${data.order.id}`);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred while creating your order.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back button */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shopping Bag</span>
        </Link>

        <button
          type="button"
          onClick={handleQuickFill}
          className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
        >
          ⚡ Auto-Fill Demo Address
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">
                  Express Checkout
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Deliver your garments directly to your doorstep.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">
                  1. Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-600 transition-all font-medium"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-600 transition-all font-medium"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">
                  2. Shipping Destination
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-600 transition-all font-medium"
                      placeholder="123 Fashion Blvd, Apt 4B"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-600 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-600 transition-all font-medium"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-600 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">
                  3. Payment Method
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Credit Card (Demo)", "Apple / Google Pay", "Cash on Delivery"].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer text-xs font-bold transition-all ${
                        formData.paymentMethod === method
                          ? "bg-indigo-50 border-indigo-500 text-indigo-950 shadow-xs"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 bg-gray-950 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <span>Confirm & Pay • ${total.toFixed(2)}</span>
                  )}
                </button>
                <p className="text-[11px] text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Transactions are logged safely inside local SQLite storage.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 sticky top-28">
            <h2 className="text-base font-black uppercase tracking-tight text-gray-950">
              Garments in Order ({items.length})
            </h2>

            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 flex gap-3.5 items-center">
                  <div className="relative w-14 h-18 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Size: {item.size} • {item.color} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-black text-gray-950">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs text-gray-600 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span className="font-bold text-gray-900">
                  {shippingFee === 0 ? "FREE (Orders over $75)" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-black text-gray-950">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
