"use client";

import { useMode } from "@/context/ModeContext";
import Link from "next/link";

export default function Home() {
  const { setMode } = useMode();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-10 sm:px-16 relative overflow-hidden bg-gradient-to-b from-[#08080c] via-[#0c0a06] to-[#08080c]">
      <div className="w-full max-w-4xl mx-auto">
        <div className="space-y-16 sm:space-y-20">
          {/* ---- HEADLINE ---- */}
          <div className="animate-reveal-up">
            <div className="flex items-baseline gap-4 sm:gap-6">
              <span className="text-7xl sm:text-[7.5rem] font-extrabold text-champagne-300 tracking-[-0.03em] leading-[0.85] font-heading italic">
                元气
              </span>
              <span className="text-5xl sm:text-6xl font-bold text-champagne-300/70 tracking-[0.12em] leading-[0.9] hidden sm:block font-heading">
                制片
              </span>
            </div>
            <span className="text-5xl sm:text-6xl font-bold text-champagne-300/70 tracking-[0.12em] leading-[0.9] sm:hidden font-heading">
              制片
            </span>

            {/* Separator */}
            <div className="mt-6 sm:mt-8 h-px w-full max-w-xs bg-gradient-to-r from-gold-500/40 via-gold-500/20 to-transparent" />

            {/* Subtitle */}
            <p className="mt-6 sm:mt-8 text-noir-400 text-base tracking-[0.25em] leading-relaxed max-w-lg font-light">
              UNIFIED DRAMA ASSET PRODUCTION
            </p>
          </div>

          {/* ---- BODY ---- */}
          <div className="flex flex-col gap-10 sm:gap-12 animate-reveal-up stagger-2">
            <p className="text-noir-400 text-lg leading-relaxed max-w-md font-light tracking-wider">
              统一管理短剧剧本、人物装造、场景设计与道具，让每一集的视觉资产协调一致
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link
                href="/dashboard"
                onClick={() => setMode("edit")}
                className="group inline-flex items-center gap-4 px-8 py-5 rounded-2xl neumorph-gold-raised text-[#0c0b08] font-bold text-base tracking-[0.15em] transition-all duration-600 hover:shadow-gold-glow-lg active:scale-[0.97]"
              >
                <span className="font-mono text-xs opacity-50">01</span>
                导演编辑
                <svg className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform duration-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setMode("preview")}
                className="group inline-flex items-center gap-4 px-8 py-5 rounded-2xl neumorph-raised text-champagne-300 font-semibold text-base tracking-[0.15em] border-gold-500/10 transition-all duration-600 hover:shadow-gold-glow hover:border-gold-500/25 active:scale-[0.97]"
              >
                <span className="font-mono text-xs text-noir-500">02</span>
                团队预览
                <svg className="w-3.5 h-3.5 ml-1 text-noir-500 group-hover:text-champagne-300 group-hover:translate-x-0.5 transition-all duration-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>

        {/* ---- FOOTER LINE ---- */}
        <div className="mt-20 sm:mt-24 flex items-center gap-6 animate-reveal-fade stagger-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />
          <span className="text-2xs text-noir-500 tracking-[0.35em] font-mono">DRAMA · ASSET · WORKFLOW</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />
        </div>
      </div>

      {/* ---- SIGNATURE ---- */}
      <div className="absolute bottom-8 right-10 z-10">
        <span className="font-script text-lg text-champagne-300/15 hover:text-gold-400/25 transition-all duration-700 select-none">
          by WangZhengYu
        </span>
      </div>
    </div>
  );
}
