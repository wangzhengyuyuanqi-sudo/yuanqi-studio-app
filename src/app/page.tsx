"use client";

import { useMode } from "@/context/ModeContext";
import Link from "next/link";

export default function Home() {
  const { setMode } = useMode();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-gradient-to-b from-[#08080c] via-[#0c0b08] to-[#08080c]">
      <div className="relative z-10 flex flex-col items-center gap-12 max-w-lg mx-auto w-full">
        <div className="text-center space-y-4 animate-reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neumorph-inset text-2xs tracking-[0.22em] uppercase text-gold-500/70 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
            Production Studio
          </div>
          <h1 className="text-6xl sm:text-7xl font-extrabold text-champagne-300 tracking-tighter leading-none font-heading">
            元气制片
          </h1>
          <p className="text-noir-400 text-base max-w-xs mx-auto leading-relaxed font-light tracking-wide">
            统一管理短剧剧本、人物装造、场景设计与道具<br className="hidden sm:block" />
            让每一集的视觉资产协调一致
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-reveal-up stagger-2">
          <Link
            href="/dashboard"
            onClick={() => setMode("edit")}
            className="group relative px-10 py-5 rounded-2xl neumorph-gold-raised text-[#0c0b08] font-bold text-base tracking-wider text-center transition-all duration-500 hover:shadow-gold-glow-lg active:scale-[0.97]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              导演编辑端
            </span>
          </Link>

          <Link
            href="/dashboard"
            onClick={() => setMode("preview")}
            className="px-10 py-5 rounded-2xl neumorph-raised text-champagne-300 font-semibold text-base tracking-wider text-center border-gold-500/10 transition-all duration-500 hover:shadow-gold-glow hover:border-gold-500/20 active:scale-[0.97]"
          >
            团队预览端
          </Link>
        </div>

        <p className="text-2xs text-noir-500 tracking-[0.3em] uppercase animate-reveal-fade stagger-4">
          DRAMA · ASSET · WORKFLOW
        </p>
      </div>

      {/* Signature */}
      <div className="absolute bottom-8 right-10 z-10">
        <span className="font-script text-xl text-champagne-300/20 hover:text-gold-400/30 transition-all duration-700 select-none tracking-wider">
          by WangZhengYu
        </span>
      </div>
    </div>
  );
}
