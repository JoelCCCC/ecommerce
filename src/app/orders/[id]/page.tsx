"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  Home,
  SlidersHorizontal,
} from "lucide-react";
import { Order } from "@/lib/types";

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (e) {
        console.error("Failed to load order", e);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-2"></div>
        <div className="h-4 w-72 bg-gray-100 rounded mx-auto"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">
          We could not locate the requested order in the database.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-950 text-white font-semibold text-xs"
        >
          <Home className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          label: "Delivered",
        };
      case "shipped":
        return {
          bg: "bg-indigo-100 text-indigo-800 border-indigo-200",
          icon: <Truck className="w-3.5 h-3.5" />,
          label: "Shipped & In Transit",
        };
      case "processing":
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-200",
          icon: <Package className="w-3.5 h-3.5" />,
          label: "Processing Garments",
        };
      case "cancelled":
        return {
          bg: "bg-rose-100 text-rose-800 border-rose-200",
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          label: "Cancelled",
        };
      case "pending":
      default:
        return {
          bg: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Clock className="w-3.5 h-3.5" />,
          label: "Order Placed (Pending)",
        };
    }
  };

  const statusConfig = getStatusBadge(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Success banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xs mb-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Order Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-950">
                Thank you for your order!
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                A confirmation has been recorded with order number:{" "}
                <span className="font-bold text-gray-900">{order.order_number}</span>
              </p>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${statusConfig.bg}`}
          >
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-xs">
          <div>
            <h4 className="font-bold uppercase tracking-wider text-gray-400 mb-1">
              Customer Details
            </h4>
            <p className="font-semibold text-gray-900">{order.customer_name}</p>
            <p className="text-gray-500">{order.customer_email}</p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-gray-400 mb-1">
              Shipping Address
            </h4>
            <p className="text-gray-900 font-medium">{order.shipping_address}</p>
            <p className="text-gray-500">
              {order.city}, {order.postal_code}, {order.country}
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-gray-400 mb-1">
              Payment & Date
            </h4>
            <p className="font-semibold text-gray-900">{order.payment_method}</p>
            <p className="text-gray-500">
              {new Date(order.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Itemized Order Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-gray-950">Garments Ordered</h2>

        <div className="divide-y divide-gray-100">
          {order.items?.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                <Image
                  src={item.product_image}
                  alt={item.product_name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">
                  {item.product_name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">Size: {item.size}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">Color: {item.color}</span>
                  <span>•</span>
                  <span>Qty: {item.quantity}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-gray-950">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <p className="text-[11px] text-gray-400">
                  (${item.price.toFixed(2)} ea)
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-6 border-t border-gray-200 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-semibold text-gray-900">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping Fee</span>
            <span className="font-semibold text-gray-900">
              {order.shipping_fee === 0 ? "FREE" : `$${order.shipping_fee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-black text-gray-950 pt-2 border-t border-gray-200">
            <span>Total Paid</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Next Actions */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
          <Link
            href="/"
            className="flex-1 py-3 px-5 rounded-xl bg-gray-950 text-white font-bold text-xs text-center hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/admin"
            className="py-3 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Manage Order in Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
