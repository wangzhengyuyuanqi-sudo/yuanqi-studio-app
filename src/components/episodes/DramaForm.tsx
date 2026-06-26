"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const inputClasses = "w-full neumorph-inset rounded-2xl px-5 py-3.5 text-sm text-champagne-300/80 placeholder:text-noir-600 focus:outline-none focus:border-gold-500/20 transition-all duration-300";

interface DramaFormProps { initialData?: { title: string; description: string }; onSubmit: (data: { title: string; description: string }) => Promise<void>; onCancel?: () => void; }

export default function DramaForm({ initialData, onSubmit, onCancel }: DramaFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!title.trim()) { setError("名称不能为空"); return; }
    setLoading(true);
    try { await onSubmit({ title: title.trim(), description: description.trim() }); } catch (err: unknown) { setError(err instanceof Error ? err.message : "提交失败"); } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="text-sm text-red-400/80 bg-red-500/5 border border-red-500/10 px-4 py-3 rounded-2xl">{error}</div>}
      <div><label className="block text-sm font-bold text-champagne-300/70 mb-2 tracking-wide">剧集名称</label><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} placeholder="如：第一季" /></div>
      <div><label className="block text-sm font-bold text-champagne-300/70 mb-2 tracking-wide">描述</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={`${inputClasses} resize-none`} placeholder="可选" /></div>
      <div className="flex gap-3 pt-3">
        <Button type="submit" disabled={loading}>{loading ? "提交中..." : "提交"}</Button>
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>取消</Button>}
      </div>
    </form>
  );
}
