"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="h-14 border-b border-white/[0.06] bg-[#08080c]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
      <Link
        href="/"
        className="text-noir-100 font-bold text-lg tracking-tight hover:text-gold-400 transition-colors duration-300"
      >
        元气制片
      </Link>

      <Link
        href="/"
        className="text-xs text-noir-500 hover:text-noir-300 transition-colors duration-200"
      >
        退出
      </Link>
    </nav>
  );
}
