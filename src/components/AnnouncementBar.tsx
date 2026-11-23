"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside aria-label="Announcement" className="bg-gray-950 text-white text-xs font-medium py-2 px-4 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center flex items-center justify-center gap-2 text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1 font-bold text-indigo-400 uppercase tracking-wider text-[10px] bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/60">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Limited Drop
          </span>
          <span className="text-gray-200">
            Complimentary express shipping on orders over <span className="font-bold text-white">$75</span> • Use code <span className="font-mono font-bold text-indigo-300">FIRST20</span> for 20% off
          </span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-white p-0.5 ml-2 transition-colors cursor-pointer"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
