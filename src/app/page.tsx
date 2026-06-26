"use client";

import { useMode } from "@/context/ModeContext";
import Link from "next/link";

export default function Home() {
  const { setMode } = useMode();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden">

      {/* ---- HERO ---- */}
      <section className="flex flex-col items-center text-center gap-16 max-w-2xl mx-auto">

        {/* Brand */}
        <div className="space-y-10 animate-reveal-up">
          <h1 className="text-7xl sm:text-8xl font-bold text-champagne-300 tracking-[0.06em] leading-none font-heading">
            元气制片
          </h1>

          <div className="flex items-center gap-5 justify-center">
            <div className="h-px w-12 bg-gold-500/30" />
            <span className="text-xs tracking-[0.3em] text-noir-500 font-mono uppercase">
              Studio
            </span>
            <div className="h-px w-12 bg-gold-500/30" />
          </div>
        </div>

        {/* Description */}
        <p className="text-noir-400/80 text-lg leading-loose tracking-[0.12em] max-w-md font-light animate-reveal-up stagger-2">
          短剧视觉资产统一管理平台
          <br />
          剧本 · 人物 · 场景 · 道具
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-5 animate-reveal-up stagger-3">
          <Link
            href="/dashboard"
            onClick={() => setMode("edit")}
            className="px-12 py-5 rounded-2xl neumorph-gold-raised text-[#0c0b08] font-bold text-base tracking-[0.18em] text-center transition-all duration-600 hover:shadow-gold-glow-lg active:scale-[0.97]"
          >
            导演编辑端
          </Link>

          <Link
            href="/dashboard"
            onClick={() => setMode("preview")}
            className="px-12 py-5 rounded-2xl neumorph-raised text-champagne-300 font-semibold text-base tracking-[0.18em] text-center border-gold-500/10 transition-all duration-600 hover:shadow-gold-glow hover:border-gold-500/25 active:scale-[0.97]"
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
      <div className="absolute bottom-8 right-10 z-10">
        <span className="font-script text-xl text-champagne-300/12 hover:text-gold-400/25 transition-all duration-700 select-none tracking-wider">
          by WangZhengYu
        </span>
      </div>
    </div>
  );
}
