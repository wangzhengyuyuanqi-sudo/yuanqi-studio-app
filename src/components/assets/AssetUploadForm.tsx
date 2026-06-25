"use client";

import { useState } from "react";
import { ASSET_TYPES, ASSET_TYPE_LABELS } from "@/lib/constants";
import Button from "@/components/ui/Button";

interface AssetUploadFormProps {
  initialType?: string;
  initialData?: { name: string; description: string; type: string; tags: string };
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  title: string;
}

async function uploadFile(file: File): Promise<{ url: string; name: string }> {
  const { upload } = await import("@vercel/blob/client");
  try {
    const blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload-blob",
    });
    return { url: blob.url, name: file.name };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "上传失败";
    throw new Error(msg.replace(/^Failed to fetch|Unexpected token|is not valid JSON/g, "上传服务繁忙，请稍后重试"));
  }
}

export default function AssetUploadForm({ initialType, initialData, onSubmit, onCancel, title }: AssetUploadFormProps) {
  const [type, setType] = useState(initialData?.type || initialType || ASSET_TYPES[0]);
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [tags, setTags] = useState(initialData?.tags || "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isScript = type === "SCRIPT";
  const accept = isScript ? ".pdf,.docx,.doc,.txt" : "image/jpeg,image/png,image/webp,image/gif";

  const inputClass = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-noir-200 placeholder:text-noir-600 focus:outline-none focus:border-gold-500/40 focus:ring-1 focus:ring-gold-500/20 transition-all duration-200";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("名称不能为空"); return; }

    setLoading(true);
    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("type", type);
    if (description.trim()) fd.append("description", description.trim());
    if (tags.trim()) fd.append("tags", tags.trim());

    if (file) {
      try {
        const uploaded = await uploadFile(file);
        fd.append(isScript ? "blobScriptUrl" : "blobImageUrl", uploaded.url);
        fd.append(isScript ? "blobScriptName" : "blobImageName", uploaded.name);
      } catch (uploadErr) {
        setError(uploadErr instanceof Error ? uploadErr.message : "文件上传失败，请重试");
        setLoading(false);
        return;
      }
    }

    try {
      await onSubmit(fd);
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
        <label className="block text-xs font-medium text-noir-400 mb-1.5">资产类型</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
          {ASSET_TYPES.map((t) => (
            <option key={t} value={t} className="bg-[#101018]">{ASSET_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-noir-400 mb-1.5">名称</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="资产名称" />
      </div>

      <div>
        <label className="block text-xs font-medium text-noir-400 mb-1.5">描述</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="可选" />
      </div>

      <div>
        <label className="block text-xs font-medium text-noir-400 mb-1.5">标签（逗号分隔）</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} placeholder="如: 主角, 日景" />
      </div>

      <div>
        <label className="block text-xs font-medium text-noir-400 mb-1.5">
          {isScript ? "上传剧本" : "上传图片"}
        </label>
        <input type="file" accept={accept} onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-noir-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-white/[0.04] file:text-noir-300 hover:file:bg-white/[0.08] file:transition-colors file:cursor-pointer" />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "上传中..." : title}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          取消
        </Button>
      </div>
    </form>
  );
}
