"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="h-14 sm:h-16 border-b border-gold-500/6 bg-[#08080c]/70 backdrop-blur-2xl flex items-center justify-between px-5 sm:px-8 shrink-0 sticky top-0 z-40">
      <Link
        href="/"
        className="text-champagne-300/90 font-extrabold text-lg sm:text-xl tracking-tight hover:text-champagne-300 transition-all duration-500 flex items-center gap-3 group"
      >
        <span className="w-2 h-2 rounded-full bg-gold-500 shadow-[0_0_12px_rgba(212,160,32,0.5)] group-hover:shadow-[0_0_20px_rgba(212,160,32,0.7)] transition-shadow duration-500" />
        元气制片
      </Link>

      <Link
        href="/"
        className="text-xs text-noir-400 hover:text-champagne-300/70 transition-all duration-300 px-3 py-1.5 rounded-lg hover:bg-white/[0.03]"
      >
        退出
      </Link>
    </nav>
  );
}
