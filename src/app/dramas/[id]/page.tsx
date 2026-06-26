"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMode } from "@/context/ModeContext";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import EpisodeListRow from "@/components/episodes/EpisodeListRow";
import type { DramaDetail, EpisodeListItem } from "@/types";

export default function DramaDetailPage() {
  const params = useParams();
  const id = (params?.id ?? "") as string;
  const { isEdit } = useMode();
  const [drama, setDrama] = useState<DramaDetail | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchData = () => {
    setLoaded(false);
    fetch(`/api/dramas/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setDrama(d.data); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, [id]);

  async function handleDeleteEpisode(ep: EpisodeListItem) {
    if (!confirm(`确定删除「${ep.title}」？`)) return;
    await fetch(`/api/episodes/${ep.id}`, { method: "DELETE" });
    fetchData();
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch(`/api/export?dramaId=${id}`);
      if (!res.ok) { alert("导出失败"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${drama?.title || "export"}_资产表.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch { alert("导出失败"); } finally { setExporting(false); }
  }

  if (!drama && loaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex items-center justify-center flex-1 flex-col gap-5 px-4">
          <p className="text-red-400 text-base">剧集不存在</p>
          <Link href="/dramas" className="text-gold-400 hover:text-gold-300 text-sm transition-colors">返回剧集列表</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-10">
        <div className="animate-reveal-up">
          <Link href="/dramas" className="inline-flex items-center gap-2 text-sm text-noir-400 hover:text-champagne-300 transition-colors duration-300 px-3 py-1.5 -ml-3 rounded-lg hover:bg-[#1e1e2e]/40 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            返回剧集列表
          </Link>
        </div>

        {!loaded ? (
          <div className="flex items-center justify-center py-28">
            <div className="w-6 h-6 border-[3px] border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
          </div>
        ) : drama ? (
          <>
            <div className="mb-6 sm:mb-10 mt-4 animate-reveal-up stagger-1">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0">
                <div>
                  <p className="text-noir-500 text-2xs tracking-[0.18em] uppercase mb-2">Drama</p>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-champagne-300 tracking-tight">{drama.title}</h1>
                  {drama.description && (
                    <p className="text-noir-400 text-sm sm:text-base mt-3 max-w-lg leading-relaxed">{drama.description}</p>
                  )}
                </div>
                <span className="text-sm sm:text-base text-noir-500 font-mono tabular-nums">
                  {drama._count.episodes} 集
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-champagne-300/80 font-bold text-sm sm:text-base tracking-wide">集数列表</h2>
              <div className="flex items-center gap-3">
                {drama.episodes.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleExport} disabled={exporting}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    {exporting ? "导出中..." : "导出"}
                  </Button>
                )}
                {isEdit && (
                  <Link href={`/episodes/new?dramaId=${id}`}>
                    <Button size="sm">+ 添加集数</Button>
                  </Link>
                )}
              </div>
            </div>

            {drama.episodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 animate-reveal-up">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl neumorph-inset flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-noir-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-noir-500 text-base">{isEdit ? "添加第一集" : "暂无集数"}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {drama.episodes.map((ep, i) => (
                  <div key={ep.id} className="animate-reveal-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <EpisodeListRow episode={ep} isEdit={isEdit} onDelete={handleDeleteEpisode} />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
