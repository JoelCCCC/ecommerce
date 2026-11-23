import Link from "next/link";
import { Sparkles, Heart, Shield, RotateCcw, Truck, Database } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 text-sm mt-auto border-t border-gray-800">
      {/* Highlights Bar */}
      <div className="border-b border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-indigo-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-xs sm:text-sm">Free Express Shipping</h4>
                <p className="text-xs text-gray-400">On all orders over $75</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-emerald-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-xs sm:text-sm">30-Day Easy Returns</h4>
                <p className="text-xs text-gray-400">Hassle-free exchanges</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-xs sm:text-sm">100% Cotton & Wool</h4>
                <p className="text-xs text-gray-400">Sustainably sourced fabrics</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-cyan-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-xs sm:text-sm">Next.js + SQLite</h4>
                <p className="text-xs text-gray-400">Full CRUD & Docker ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">THREADCRAFT</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Curated everyday apparel engineered with high-density cottons, functional tailoring, and minimalist aesthetics. Built on Next.js and SQLite.
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Shop Collections</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/?category=T-Shirts" className="hover:text-white transition-colors">Heavyweight T-Shirts</Link></li>
              <li><Link href="/?category=Hoodies+%26+Sweats" className="hover:text-white transition-colors">French Terry Hoodies</Link></li>
              <li><Link href="/?category=Jackets+%26+Outerwear" className="hover:text-white transition-colors">Jackets & Coats</Link></li>
              <li><Link href="/?category=Pants+%26+Bottoms" className="hover:text-white transition-colors">Trousers & Chinos</Link></li>
              <li><Link href="/?category=Accessories" className="hover:text-white transition-colors">Beanies & Belts</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Ecommerce Tech</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Management Panel</Link></li>
              <li><span className="text-gray-500">Built-in node:sqlite DB</span></li>
              <li><span className="text-gray-500">Standalone Docker deployment</span></li>
              <li><span className="text-gray-500">Full REST CRUD API</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Newsletter</h5>
            <p className="text-xs text-gray-400 mb-3">Get private access to limited drops and seasonal discounts.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@domain.com"
                className="bg-gray-900 border border-gray-800 text-white rounded-lg px-3 py-2 text-xs w-full focus:outline-none focus:border-indigo-500"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-2 rounded-lg text-xs transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} ThreadCraft Clothing. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> using Next.js & SQLite
          </p>
        </div>
      </div>
    </footer>
  );
}
