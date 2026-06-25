"use client";

import { useMode } from "@/context/ModeContext";
import Link from "next/link";

export default function Home() {
  const { setMode } = useMode();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gold-500/[0.02] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/[0.03] blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <div className="text-center space-y-3">
          <p className="text-noir-500 text-xs tracking-[0.2em] uppercase">Drama Production Toolkit</p>
          <h1 className="text-5xl font-bold text-noir-50 tracking-tight">
            元气制片
          </h1>
          <p className="text-noir-400 text-sm max-w-xs mx-auto leading-relaxed">
            统一管理短剧剧本、人物装造、场景设计与道具，让每一集的视觉资产协调一致
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/dashboard"
            onClick={() => setMode("edit")}
            className="group relative px-8 py-4 rounded-2xl bg-gold-500 text-[#08080c] font-semibold text-base transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_40px_rgba(245,166,35,0.15)] hover:shadow-[0_0_60px_rgba(245,166,35,0.25)]"
          >
            <span className="relative z-10">导演编辑端</span>
            <div className="absolute inset-0 rounded-2xl bg-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>

          <Link
            href="/dashboard"
            onClick={() => setMode("preview")}
            className="px-8 py-4 rounded-2xl bg-white/[0.03] text-noir-300 font-semibold text-base border border-white/[0.08] hover:border-white/[0.16] hover:text-noir-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
          >
            团队预览端
          </Link>
        </div>
      </div>
    </div>
  );
}
