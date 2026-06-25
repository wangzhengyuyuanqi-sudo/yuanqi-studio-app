"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const inputClass = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-noir-200 placeholder:text-noir-600 focus:outline-none focus:border-gold-500/40 focus:ring-1 focus:ring-gold-500/20 transition-all duration-200";

interface DramaFormProps {
  initialData?: { title: string; description: string };
  onSubmit: (data: { title: string; description: string }) => Promise<void>;
  onCancel?: () => void;
}

export default function DramaForm({ initialData, onSubmit, onCancel }: DramaFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) { setError("名称不能为空"); return; }

    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "提交失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-400 bg-red-500/8 border border-red-500/15 px-3.5 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-noir-400 mb-1.5">剧集名称</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="如：第一季" />
      </div>

      <div>
        <label className="block text-xs font-medium text-noir-400 mb-1.5">描述</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="可选" />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "提交中..." : "提交"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            取消
          </Button>
        )}
      </div>
    </form>
  );
}
