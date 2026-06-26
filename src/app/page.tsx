"use client";

import { useMode } from "@/context/ModeContext";
import Link from "next/link";

export default function Home() {
  const { setMode } = useMode();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 sm:px-8 relative overflow-hidden">

      {/* ---- HERO ---- */}
      <section className="flex flex-col items-center text-center gap-12 sm:gap-20 max-w-3xl mx-auto relative z-10">

        {/* Brand */}
        <div className="space-y-6 sm:space-y-8 animate-reveal-up">
          <h1 className="text-6xl sm:text-8xl font-extrabold text-champagne-200 drop-shadow-[0_0_40px_rgba(212,175,55,0.15)] tracking-[0.04em] leading-[0.9] font-heading">
            元气制片
          </h1>

          <div className="flex items-center gap-4 sm:gap-6 justify-center">
            <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
            <span className="text-2xs sm:text-xs tracking-[0.35em] text-noir-400 font-mono uppercase">
              Studio
            </span>
            <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
          </div>
        </div>

        {/* Description */}
        <p className="text-noir-400/70 text-base sm:text-xl leading-relaxed tracking-[0.1em] max-w-lg font-light animate-reveal-up stagger-2">
          短剧视觉资产统一管理平台
          <br />
          <span className="text-noir-500/60">剧本 · 人物 · 场景 · 道具</span>
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-reveal-up stagger-3 w-full sm:w-auto">
          <Link
            href="/dashboard"
            onClick={() => setMode("edit")}
            className="group relative px-10 sm:px-14 py-4 sm:py-5 rounded-2xl glass-gold text-sm sm:text-base tracking-[0.15em] text-center overflow-hidden"
          >
            <span className="relative z-10">导演编辑端</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>

          <Link
            href="/dashboard"
            onClick={() => setMode("preview")}
            className="px-10 sm:px-14 py-4 sm:py-5 rounded-2xl neumorph-raised text-champagne-300/80 font-semibold text-sm sm:text-base tracking-[0.15em] text-center border-gold-500/10 hover:text-champagne-300"
          >
            团队预览端
          </Link>
        </div>

        {/* Bottom marker */}
        <div className="animate-reveal-fade stagger-4">
          <span className="text-2xs text-noir-600 tracking-[0.4em] font-mono">
            DRAMA &nbsp;·&nbsp; ASSET &nbsp;·&nbsp; WORKFLOW
          </span>
        </div>

      </section>

      {/* ---- SIGNATURE ---- */}
      <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-12 z-10">
        <span className="font-script text-lg sm:text-xl text-champagne-300/8 hover:text-gold-400/20 transition-all duration-700 select-none tracking-wider">
          by WangZhengYu
        </span>
      </div>
    </div>
  );
}
