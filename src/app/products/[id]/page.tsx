"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Flame,
  HelpCircle,
  PackageCheck,
} from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | "care">("details");

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          if (data.product.sizes?.length > 0) setSelectedSize(data.product.sizes[0]);
          if (data.product.colors?.length > 0) setSelectedColor(data.product.colors[0]);

          // Fetch related products in the same category
          const relRes = await fetch(`/api/products?category=${encodeURIComponent(data.product.category)}`);
          const relData = await relRes.json();
          if (relData.success) {
            setRelatedProducts(relData.products.filter((p: Product) => p.id !== data.product.id).slice(0, 4));
          }
        }
      } catch (e) {
        console.error("Failed to load product", e);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-3/4 bg-gray-200 rounded-3xl"></div>
          <div className="space-y-6">
            <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
            <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-100 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-black text-gray-950 uppercase mb-2">Garment Not Found</h2>
        <p className="text-gray-500 text-xs mb-6">
          The requested apparel item may have been removed or is no longer available.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const originalPrice = Math.round(product.price * 1.25);

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product || isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/?category=${encodeURIComponent(product.category)}`}
          className="hover:text-gray-900 transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Product Imagery */}
        <div className="lg:col-span-7">
          <div className="relative aspect-3/4 w-full bg-gray-100 rounded-3xl overflow-hidden shadow-lg border border-gray-200">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-gray-950/90 backdrop-blur-md text-white text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-lg">
                {product.category}
              </span>
              {product.featured && (
                <span className="bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-white" /> Featured Drop
                </span>
              )}
            </div>

            <div className="absolute bottom-4 right-4">
              <span className="bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border border-gray-200">
                Department: {product.gender}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Buying Details */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div>
            {/* Reviews & Department */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-700">4.9 / 5.0 (84 Reviews)</span>
              </div>

              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  isOutOfStock
                    ? "bg-rose-100 text-rose-700"
                    : isLowStock
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {isOutOfStock
                  ? "Sold Out"
                  : isLowStock
                  ? `Only ${product.stock} units left`
                  : `In Stock (${product.stock})`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight mb-3">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-black text-gray-950">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through font-semibold">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase px-2 py-0.5 rounded-md">
                Save 20%
              </span>
            </div>

            {/* Urgency indicator */}
            {isLowStock && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-center gap-2 text-xs font-bold text-amber-800 mb-4">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>High demand: Only {product.stock} garments left in current batch.</span>
              </div>
            )}

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
              {product.description}
            </p>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5 font-bold uppercase tracking-wider">
              <span className="text-gray-900">Choose Size: {selectedSize}</span>
              <span className="text-indigo-600 font-semibold cursor-pointer flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Size Guide
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`h-11 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border ${
                    selectedSize === size
                      ? "bg-gray-950 text-white border-gray-950 shadow-sm"
                      : "bg-white text-gray-800 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5 font-bold uppercase tracking-wider">
              <span className="text-gray-900">Color Variation: {selectedColor}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedColor === color
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
              Quantity
            </label>
            <div className="inline-flex items-center border border-gray-200 rounded-xl bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-950 transition-colors font-bold"
              >
                -
              </button>
              <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-950 transition-colors font-bold disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-4 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : added
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-950 hover:bg-gray-800 text-white"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 py-4 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-40"
              >
                Express Buy Now
              </button>
            </div>
          </div>

          {/* Tabs: Details / Shipping / Care */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex gap-4 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-2 transition-colors cursor-pointer ${
                  activeTab === "details"
                    ? "text-gray-950 border-b-2 border-gray-950"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                Fabric & Fit
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-2 transition-colors cursor-pointer ${
                  activeTab === "shipping"
                    ? "text-gray-950 border-b-2 border-gray-950"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                Shipping & Returns
              </button>
              <button
                onClick={() => setActiveTab("care")}
                className={`pb-2 transition-colors cursor-pointer ${
                  activeTab === "care"
                    ? "text-gray-950 border-b-2 border-gray-950"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                Garment Care
              </button>
            </div>

            <div className="pt-4 text-xs text-gray-600 leading-relaxed">
              {activeTab === "details" && (
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>280–450 GSM Heavyweight carded organic cotton</li>
                  <li>Preshrunk fabric to guarantee minimal dimensional change</li>
                  <li>Double needle cover-stitching on seams and cuffs</li>
                  <li>Standard boxy fit, size up for oversized silhouette</li>
                </ul>
              )}
              {activeTab === "shipping" && (
                <div className="space-y-2">
                  <p>🚚 Free standard express delivery on orders over $75.</p>
                  <p>📦 Orders placed before 2:00 PM EST ship same business day.</p>
                  <p>🔄 30-day returns accepted on unworn garments with original tags intact.</p>
                </div>
              )}
              {activeTab === "care" && (
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Machine wash cold with like colors (30°C max)</li>
                  <li>Use mild non-bleach laundry detergent</li>
                  <li>Hang dry in shade to preserve cotton density</li>
                  <li>Iron inside-out on low heat if desired</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 uppercase tracking-tight">
              Complete the Look
            </h3>
            <Link
              href={`/?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800"
            >
              View More {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
