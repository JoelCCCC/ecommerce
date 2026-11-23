"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Star,
  ShieldCheck,
  Truck,
  Leaf,
  Layers,
  ChevronRight,
  Flame,
} from "lucide-react";
import { Product } from "@/lib/types";
import { CATEGORIES, GENDERS } from "@/lib/seed-data";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("All");
  const [gender, setGender] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== "All") params.set("category", category);
      if (gender && gender !== "All") params.set("gender", gender);
      if (search) params.set("search", search);
      if (sort) params.set("sort", sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, gender, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleClearFilters = () => {
    setCategory("All");
    setGender("All");
    setSearch("");
    setSort("newest");
  };

  const hasActiveFilters = category !== "All" || gender !== "All" || search !== "" || sort !== "newest";

  // Visual category cards for the showcase
  const categoryHighlights = [
    {
      title: "Heavyweight Tees",
      desc: "280 GSM Boxy Cut",
      category: "T-Shirts",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "French Terry Hoodies",
      desc: "450 GSM Plush Cotton",
      category: "Hoodies & Sweats",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Outerwear & Denim",
      desc: "Workwear & Selvedge",
      category: "Jackets & Outerwear",
      image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Tailored Trousers",
      desc: "Pleated Chinos & Cargo",
      category: "Pants & Bottoms",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Editorial Hero Banner */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center bg-gray-950 overflow-hidden text-white">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
            alt="ThreadCraft Editorial Collection"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-40 scale-105 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Spring / Summer 2026 Capsule Collection</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] uppercase mb-6 font-sans">
              Form. <br />
              Function. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-200">
                Pure Cotton.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8 max-w-lg font-normal">
              High-density 280 GSM cottons, double-needle lockstitching, and intentional boxy tailoring crafted for your lifetime daily rotation.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#catalog"
                className="px-7 py-4 rounded-xl bg-white text-gray-950 font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-gray-100 transition-all shadow-xl hover:shadow-white/10 flex items-center gap-2 cursor-pointer"
              >
                <span>Shop New Drops</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/admin"
                className="px-6 py-4 rounded-xl bg-gray-900/90 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm border border-gray-700 backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <span>Admin Studio (CRUD)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="bg-white border-y border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-medium text-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-indigo-600">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Complimentary Shipping</span>
                <span className="text-gray-500 text-[11px]">Free delivery on orders $75+</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-emerald-600">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">30-Day Easy Returns</span>
                <span className="text-gray-500 text-[11px]">Hassle-free exchanges</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-purple-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Premium Heavy Cotton</span>
                <span className="text-gray-500 text-[11px]">280–450 GSM combed weave</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-amber-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Full Next.js + SQLite</span>
                <span className="text-gray-500 text-[11px]">Self-contained Dockerized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Category Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
              Curated Wardrobe
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight">
              Shop by Department
            </h2>
          </div>
          <a
            href="#catalog"
            className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
          >
            <span>View All Garments</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoryHighlights.map((item) => (
            <button
              key={item.title}
              onClick={() => {
                setCategory(item.category);
                const el = document.getElementById("catalog");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative aspect-4/5 rounded-2xl overflow-hidden bg-gray-900 text-left cursor-pointer border border-gray-200/80 shadow-xs hover:shadow-xl transition-all"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 block mb-0.5">
                  {item.desc}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                  {item.title}
                </h3>
                <span className="text-xs font-bold text-gray-300 group-hover:text-white flex items-center gap-1 mt-1 transition-colors">
                  Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Full Collection
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs font-semibold text-gray-500">
                {products.length} {products.length === 1 ? "Style" : "Styles"}
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-950 uppercase tracking-tight">
              All Garments & Drops
            </h2>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tees, denim trucker, hoodies, chinos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-2xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gray-950 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filters & Tabs */}
        <div className="py-6 space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  category === cat
                    ? "bg-gray-950 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sub Filters: Department & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {/* Gender Toggle */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[11px]">Department:</span>
              <div className="inline-flex p-1 bg-white border border-gray-200 rounded-xl shadow-2xs">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                      gender === g
                        ? "bg-gray-950 text-white shadow-2xs"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort & Reset */}
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}

              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[11px]">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 font-bold text-gray-800 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Product Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-12">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse aspect-3/4 flex flex-col justify-end p-4"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center my-8 max-w-lg mx-auto shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No garments found</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              We couldn&apos;t find any apparel matching your active filters. Try adjusting your search query or reset the filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 rounded-xl bg-gray-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-600 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Craftsmanship & Materials Spotlight */}
      <section className="bg-gray-950 text-white py-20 mt-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-2">
                Atelier Standards
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight mb-6">
                Engineered for 1,000+ Wears.
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
                Fast fashion cuts corners on fabric weight and wash shrinkage. At ThreadCraft, we pre-shrink all combed cottons and calibrate seam tension with Japanese computerized machines.
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wider">Zero Chemical Finishing</h4>
                    <p className="text-gray-400">Softened naturally with hot water tumbling instead of synthetic formaldehyde resins.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wider">Custom Ribbed Collars</h4>
                    <p className="text-gray-400">Reinforced with 5% elastane threading to prevent neckline sagging over months of washing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wider">Local SQLite Zero-Lag Storage</h4>
                    <p className="text-gray-400">High performance transactions, instant stock sync, and full CRUD control in Docker.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&auto=format&fit=crop&q=80"
                alt="Apparel fabrics and craftsmanship"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
