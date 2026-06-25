"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import type { DramaListItem } from "@/types";

const inputClass = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-noir-200 placeholder:text-noir-600 focus:outline-none focus:border-gold-500/40 focus:ring-1 focus:ring-gold-500/20 transition-all duration-200";

export default function EpisodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDramaId = searchParams?.get("dramaId") || "";

  const [dramaList, setDramaList] = useState<DramaListItem[]>([]);
  const [episodeNumber, setEpisodeNumber] = useState("1");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [dramaId, setDramaId] = useState(preselectedDramaId);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dramas")
      .then((r) => r.json())
      .then((d) => { if (d.success) setDramaList(d.data); })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) { setError("标题不能为空"); return; }

    setLoading(true);
    const fd = new FormData();
    fd.append("episodeNumber", episodeNumber);
    fd.append("title", title.trim());
    if (summary.trim()) fd.append("summary", summary.trim());
    if (dramaId) fd.append("dramaId", dramaId);
    if (file) fd.append("script", file);

    try {
      const res = await fetch("/api/episodes", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      router.push(`/episodes/${data.data.id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "创建失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {error && (
        <div className="text-sm text-red-400 bg-red-500/8 border border-red-500/15 px-3.5 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-noir-400 mb-1.5">集号</label>
        <input type="number" value={episodeNumber} onChange={(e) => setEpisodeNumber(e.target.value)} min="1" className={inputClass} />
      </div>

      <div>
        <label className="block text-xs font-medium text-noir-400 mb-1.5">标题</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="如：第一集 · 初遇" />
      </div>

      <div>
        <label className="block text-xs font-medium text-noir-400 mb-1.5">摘要</label>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="可选" />
      </div>

      <div>
        <label className="block text-xs font-medium text-noir-400 mb-1.5">所属剧集</label>
        <select value={dramaId} onChange={(e) => setDramaId(e.target.value)} className={inputClass}>
          <option value="" className="bg-[#101018]">无</option>
          {dramaList.map((d) => (
            <option key={d.id} value={d.id} className="bg-[#101018]">{d.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-noir-400 mb-1.5">上传剧本（可选）</label>
        <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-noir-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-white/[0.04] file:text-noir-300 hover:file:bg-white/[0.08] file:transition-colors file:cursor-pointer" />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "创建中..." : "创建集数"}
      </Button>
    </form>
  );
}
