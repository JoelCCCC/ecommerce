"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, SlidersHorizontal, Search, Heart, Shield } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const pathname = usePathname();

  const navLinks = [
    { label: "Shop All", href: "/" },
    { label: "T-Shirts", href: "/?category=T-Shirts" },
    { label: "Hoodies", href: "/?category=Hoodies+%26+Sweats" },
    { label: "Outerwear", href: "/?category=Jackets+%26+Outerwear" },
    { label: "Pants", href: "/?category=Pants+%26+Bottoms" },
    { label: "Accessories", href: "/?category=Accessories" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gray-950 text-white flex items-center justify-center font-black text-lg tracking-wider group-hover:bg-indigo-600 transition-colors shadow-xs">
                TC
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-950 uppercase font-sans">
                  Thread<span className="text-indigo-600">Craft</span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 -mt-1">
                  Atelier / Apparel
                </span>
              </div>
            </Link>

            {/* Navigation links */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-600">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3.5 py-2 rounded-lg hover:text-gray-950 hover:bg-gray-100/80 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Portal Button */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 transition-all shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Admin Studio</span>
            </Link>

            {/* Search link */}
            <Link
              href="/#catalog"
              className="p-2 sm:p-2.5 rounded-xl text-gray-600 hover:text-gray-950 hover:bg-gray-100 transition-colors"
              title="Search collection"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Shopping Bag CTA */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gray-950 hover:bg-indigo-600 text-white transition-all shadow-sm cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline">Bag</span>
              {totalItems > 0 && (
                <span className="ml-1 bg-indigo-500 text-white text-[11px] font-extrabold h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
