"use client";

import { useEffect, useState } from "react";
import { useMode } from "@/context/ModeContext";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import type { DramaListItem } from "@/types";

export default function DramaListPage() {
  const { isEdit } = useMode();
  const [dramaList, setDramaList] = useState<DramaListItem[]>([]);
  const [exporting, setExporting] = useState(false);

  const fetchData = () => {
    fetch("/api/dramas")
      .then((r) => r.json())
      .then((d) => { if (d.success) setDramaList(d.data); })
      .catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("确定删除？")) return;
    await fetch(`/api/dramas/${id}`, { method: "DELETE" });
    fetchData();
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/export");
      if (!res.ok) { alert("导出失败"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "元气制片_全部资产表.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch { alert("导出失败"); } finally { setExporting(false); }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <div className="flex items-end justify-between mb-10 animate-fade-in">
          <div>
            <Link
              href="/dashboard"
              className="text-xs text-noir-500 hover:text-noir-300 transition-colors duration-200 mb-2 inline-block"
            >
              ← 返回剧集目录
            </Link>
            <h1 className="text-2xl font-bold text-noir-50 mt-1">剧集列表</h1>
          </div>
          <div className="flex items-center gap-3">
            {dramaList.length > 0 && (
              <Button variant="secondary" size="sm" onClick={handleExport} disabled={exporting}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                {exporting ? "导出中..." : "导出 Excel"}
              </Button>
            )}
            {isEdit && (
              <Link href="/dramas/new">
                <Button>+ 添加剧集</Button>
              </Link>
            )}
          </div>
        </div>

        {dramaList.length === 0 ? (
          <p className="text-noir-500 text-sm text-center py-24 animate-fade-in">暂无剧集</p>
        ) : (
          <div className="space-y-1.5">
            {dramaList.map((d, i) => (
              <div
                key={d.id}
                className="flex items-center gap-5 px-5 py-4 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300 group animate-card-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500/60 group-hover:bg-gold-400 group-hover:shadow-[0_0_8px_rgba(245,166,35,0.4)] transition-all duration-300 shrink-0" />
                <Link href={`/dramas/${d.id}`} className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-noir-200 group-hover:text-noir-50 transition-colors duration-200">
                    {d.title}
                  </h3>
                  {d.description && (
                    <p className="text-xs text-noir-500 line-clamp-1 mt-1 group-hover:text-noir-400 transition-colors">
                      {d.description}
                    </p>
                  )}
                </Link>
                <span className="text-xs text-noir-600 shrink-0 font-mono tabular-nums">
                  {d._count.episodes} 集
                </span>
                {isEdit && (
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="opacity-0 group-hover:opacity-100 text-xs text-red-400/60 hover:text-red-400 transition-all duration-200 shrink-0"
                  >
                    删除
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
