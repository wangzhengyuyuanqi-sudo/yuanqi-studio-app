"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="h-14 sm:h-16 border-b border-gold-500/8 bg-[#08080c]/85 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-40">
      <Link
        href="/"
        className="text-champagne-300 font-extrabold text-lg sm:text-xl tracking-tighter hover:text-gold-400 transition-all duration-500 flex items-center gap-2.5"
      >
        <span className="w-2 h-2 rounded-full bg-gold-500 shadow-gold-sm animate-pulse" />
        元气制片
      </Link>

      <Link
        href="/"
        className="text-xs text-noir-400 hover:text-champagne-300 transition-all duration-300 px-3 py-1.5 rounded-lg hover:bg-[#1e1e2e]/50"
      >
        退出
      </Link>
    </nav>
  );
}
