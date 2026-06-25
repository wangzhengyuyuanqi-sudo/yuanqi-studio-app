"use client";

import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import EpisodeForm from "@/components/episodes/EpisodeForm";
import Link from "next/link";

function NewEpisodeForm() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-8 animate-fade-in">
        <Link href="/dashboard" className="text-xs text-noir-500 hover:text-noir-300 transition-colors duration-200">
          ← 返回控制台
        </Link>
        <h1 className="text-2xl font-bold text-noir-50 mt-3 mb-8">新建集数</h1>
        <EpisodeForm />
      </main>
    </div>
  );
}

export default function NewEpisodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-5 h-5 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" /></div>}>
      <NewEpisodeForm />
    </Suspense>
  );
}
