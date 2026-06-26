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

function uploadWithProgress(
  file: File,
  prefix: string,
  onProgress: (pct: number) => void
): Promise<{ url: string; name: string }> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("prefix", prefix);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload-blob");

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success) {
            resolve({ url: data.url, name: data.name });
          } else {
            reject(new Error(data.error || "上传失败"));
          }
        } catch {
          reject(new Error("服务器响应异常"));
        }
      } else if (xhr.status === 413) {
        reject(new Error("文件过大，请尝试压缩后再上传（单文件不超过 4.5MB）"));
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          reject(new Error(data.error || `服务器错误 ${xhr.status}`));
        } catch {
          reject(new Error(`服务器错误 ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () => reject(new Error("网络连接失败，请检查网络后重试")));
    xhr.addEventListener("abort", () => reject(new Error("上传已取消")));

    xhr.send(fd);
  });
}

export default function AssetUploadForm({ initialType, initialData, onSubmit, onCancel, title }: AssetUploadFormProps) {
  const [type, setType] = useState(initialData?.type || initialType || ASSET_TYPES[0]);
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [tags, setTags] = useState(initialData?.tags || "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<"idle" | "uploading" | "saving">("idle");

  const isScript = type === "SCRIPT";
  const accept = isScript ? ".pdf,.docx,.doc,.txt" : "image/jpeg,image/png,image/webp,image/gif";

  const inputClass = "w-full neumorph-inset rounded-2xl px-5 py-3.5 text-sm text-champagne-300/90 placeholder:text-noir-600 focus:outline-none focus:shadow-gold-sm transition-all duration-300";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("名称不能为空"); return; }

    setLoading(true);
    setProgress(0);
    setUploadStage(file ? "uploading" : "saving");

    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("type", type);
    if (description.trim()) fd.append("description", description.trim());
    if (tags.trim()) fd.append("tags", tags.trim());

    if (file) {
      try {
        const prefix = isScript ? "scripts" : "assets";
        const uploaded = await uploadWithProgress(file, prefix, setProgress);
        fd.append(isScript ? "blobScriptUrl" : "blobImageUrl", uploaded.url);
        fd.append(isScript ? "blobScriptName" : "blobImageName", uploaded.name);
        setUploadStage("saving");
      } catch (uploadErr) {
        setError(uploadErr instanceof Error ? uploadErr.message : "文件上传失败，请重试");
        setLoading(false);
        setUploadStage("idle");
        return;
      }
    }

    try {
      await onSubmit(fd);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "提交失败");
    } finally {
      setLoading(false);
      setUploadStage("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-400 bg-red-500/8 border border-red-500/15 px-4 py-3 rounded-2xl">
          {error}
        </div>
      )}

      {uploadStage !== "idle" && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-noir-400">
            <span>{uploadStage === "uploading" ? "正在上传文件..." : "正在保存..."}</span>
            {uploadStage === "uploading" && <span>{progress}%</span>}
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                uploadStage === "saving"
                  ? "bg-gold-500 animate-pulse"
                  : "bg-gold-500"
              }`}
              style={{ width: uploadStage === "saving" ? "100%" : `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-champagne-300/70 mb-2 tracking-wide">资产类型</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
          {ASSET_TYPES.map((t) => (
            <option key={t} value={t} className="bg-[#101018]">{ASSET_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-champagne-300/70 mb-2 tracking-wide">名称</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="资产名称" />
      </div>

      <div>
        <label className="block text-sm font-bold text-champagne-300/70 mb-2 tracking-wide">描述</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="可选" />
      </div>

      <div>
        <label className="block text-sm font-bold text-champagne-300/70 mb-2 tracking-wide">标签（逗号分隔）</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} placeholder="如: 主角, 日景" />
      </div>

      <div>
        <label className="block text-sm font-bold text-champagne-300/70 mb-2 tracking-wide">
          {isScript ? "上传剧本" : "上传图片"}
        </label>
        <input type="file" accept={accept} onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-noir-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-white/[0.04] file:text-noir-300 hover:file:bg-white/[0.08] file:transition-colors file:cursor-pointer" />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? (uploadStage === "uploading" ? "上传中..." : "保存中...") : title}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          取消
        </Button>
      </div>
    </form>
  );
}
