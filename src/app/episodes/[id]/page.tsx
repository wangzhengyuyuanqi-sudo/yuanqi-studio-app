"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMode } from "@/context/ModeContext";
import type { EpisodeDetail, AssetItem } from "@/types";
import { ASSET_TYPE_LABELS, ASSET_TYPE_ICONS, ASSET_TYPES, ASSET_TYPE_COLORS } from "@/lib/constants";
import AssetUploadForm from "@/components/assets/AssetUploadForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function EpisodeDetailPage() {
  const params = useParams();
  const id = (params?.id ?? "") as string;
  const { isEdit } = useMode();

  const [episode, setEpisode] = useState<EpisodeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<string>("");
  const [editingAsset, setEditingAsset] = useState<AssetItem | null>(null);
  const [previewAsset, setPreviewAsset] = useState<AssetItem | null>(null);

  const fetchEpisode = useCallback(async () => {
    try {
      const res = await fetch(`/api/episodes/${id}`);
      const json = await res.json();
      if (json.success && json.data) setEpisode(json.data);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { if (id) fetchEpisode(); }, [id, fetchEpisode]);

  const groupedAssets: Record<string, AssetItem[]> = {};
  if (episode) {
    for (const type of ASSET_TYPES) groupedAssets[type] = [];
    for (const asset of episode.assets) {
      if (groupedAssets[asset.type]) groupedAssets[asset.type].push(asset);
    }
  }

  const sections = ASSET_TYPES.map((type) => ({
    type,
    label: ASSET_TYPE_LABELS[type] || type,
    icon: ASSET_TYPE_ICONS[type] || "📦",
    count: (groupedAssets[type] || []).length,
    assets: groupedAssets[type] || [],
  }));

  useEffect(() => {
    if (episode) {
      setExpandedSections((prev) => {
        if (Object.keys(prev).length > 0) return prev;
        const first = sections.find((s) => s.count > 0);
        return first ? { [first.type]: true } : { [ASSET_TYPES[0]]: true };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode]);

  function toggleSection(type: string) {
    setExpandedSections((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  function handleAddAssetForType(type: string) {
    setAddType(type);
    setEditingAsset(null);
    setShowAddModal(true);
  }

  function handleEditAsset(asset: AssetItem) {
    setEditingAsset(asset);
    setAddType("");
    setShowAddModal(true);
  }

  async function handleDeleteAsset(asset: AssetItem) {
    if (!confirm(`确认删除资产「${asset.name}」？`)) return;
    await fetch(`/api/assets/${asset.id}`, { method: "DELETE" });
    fetchEpisode();
  }

  function handleAssetFormSuccess() {
    setShowAddModal(false);
    setEditingAsset(null);
    setAddType("");
    fetchEpisode();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="w-5 h-5 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-center flex-1 flex-col gap-4">
          <p className="text-red-400 text-sm">集数不存在</p>
          <Link href="/dashboard" className="text-gold-400 hover:text-gold-300 text-sm transition-colors">返回控制台</Link>
        </div>
      </div>
    );
  }

  const backUrl = episode.dramaId ? `/dramas/${episode.dramaId}` : "/dashboard";
  const backLabel = episode.dramaId ? "返回剧集详情" : "返回控制台";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 animate-fade-in">
        {/* Back link */}
        <Link href={backUrl} className="inline-flex items-center gap-2 text-xs text-noir-500 hover:text-noir-300 transition-colors duration-200 mb-5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          {backLabel}
        </Link>

        {/* Episode header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-1">
            <p className="text-noir-500 text-xs tracking-[0.15em] uppercase">Episode</p>
            <span className="px-2.5 py-1 rounded-lg bg-gold-500/8 text-gold-400 text-xs font-bold border border-gold-500/15 font-mono">
              第 {episode.episodeNumber} 集
            </span>
          </div>
          <h1 className="text-2xl font-bold text-noir-50 mt-2">{episode.title}</h1>
          {episode.summary && (
            <p className="text-noir-400 text-sm mt-3 max-w-2xl leading-relaxed">{episode.summary}</p>
          )}

          {episode.scriptPath && (
            <div className="mt-4 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-fade-in">
              <svg className="w-4 h-4 text-gold-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span className="text-xs text-noir-300 font-medium">{episode.scriptName}</span>
              <a href={episode.scriptPath} target="_blank" rel="noopener noreferrer" className="text-xs text-gold-400 hover:text-gold-300 transition-colors ml-auto">
                查看
              </a>
            </div>
          )}
        </div>

        {/* Asset accordions */}
        <div className="space-y-2">
          {sections.map((section) => (
            <SectionAccordion
              key={section.type}
              section={section}
              isExpanded={!!expandedSections[section.type]}
              isEdit={isEdit}
              onToggle={() => toggleSection(section.type)}
              onAdd={() => handleAddAssetForType(section.type)}
              onEditAsset={handleEditAsset}
              onDeleteAsset={handleDeleteAsset}
              onPreviewAsset={setPreviewAsset}
            />
          ))}
        </div>

        {/* Add / Edit Asset Modal */}
        <Modal open={showAddModal} onClose={() => { setShowAddModal(false); setEditingAsset(null); setAddType(""); }} title={editingAsset ? "编辑资产" : "添加资产"}>
          <AssetUploadForm
            initialType={editingAsset ? editingAsset.type : addType}
            initialData={editingAsset ? { name: editingAsset.name, description: editingAsset.description || "", type: editingAsset.type, tags: editingAsset.tags || "" } : undefined}
            onSubmit={editingAsset ? (async (fd) => {
              const res = await fetch(`/api/assets/${editingAsset.id}`, { method: "PUT", body: fd });
              const data = await res.json();
              if (!data.success) throw new Error(data.error);
              handleAssetFormSuccess();
            }) : (async (fd) => {
              const res = await fetch(`/api/episodes/${id}/assets`, { method: "POST", body: fd });
              const data = await res.json();
              if (!data.success) throw new Error(data.error);
              handleAssetFormSuccess();
            })}
            onCancel={() => { setShowAddModal(false); setEditingAsset(null); setAddType(""); }}
            title={editingAsset ? "更新" : "上传"}
          />
        </Modal>

        {/* Preview Asset Modal */}
        {previewAsset && (
          <Modal open={true} onClose={() => setPreviewAsset(null)} title={previewAsset.name}>
            <AssetPreviewDetail asset={previewAsset} />
          </Modal>
        )}
      </main>
    </div>
  );
}

// ══════════════════════════════════════════
//  AssetPreviewDetail — 预览模式下查看大图 + 下载
// ══════════════════════════════════════════

function AssetPreviewDetail({ asset }: { asset: AssetItem }) {
  const isScript = asset.type === "SCRIPT";
  const hasFile = !!asset.imagePath;

  async function handleDownload() {
    if (!asset.imagePath) return;
    try {
      const res = await fetch(asset.imagePath);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = asset.imageName || asset.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(asset.imagePath, "_blank");
    }
  }

  return (
    <div className="space-y-5">
      {/* Image / File preview */}
      {hasFile ? (
        isScript ? (
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-8 flex flex-col items-center gap-4">
            <svg className="w-16 h-16 text-gold-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-noir-400 text-sm font-medium">{asset.imageName || "剧本文件"}</p>
            <Button variant="primary" onClick={handleDownload}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              下载文件
            </Button>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.imagePath!}
              alt={asset.name}
              className="w-full max-h-[50vh] object-contain bg-black/20"
            />
            <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-noir-500 truncate max-w-[60%]">{asset.imageName}</span>
              <Button size="sm" onClick={handleDownload}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                下载原图
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6 flex flex-col items-center gap-2">
          <svg className="w-10 h-10 text-noir-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p className="text-noir-600 text-sm">暂未上传文件</p>
        </div>
      )}

      {/* Meta info */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-noir-500 text-xs">类型</span>
          <span className="text-noir-200 text-sm font-medium">{ASSET_TYPE_LABELS[asset.type]}</span>
        </div>
        {asset.description && (
          <div>
            <span className="text-noir-500 text-xs block mb-1">描述</span>
            <p className="text-noir-300 text-sm leading-relaxed">{asset.description}</p>
          </div>
        )}
        {asset.tags && (
          <div>
            <span className="text-noir-500 text-xs block mb-1.5">标签</span>
            <div className="flex flex-wrap gap-1.5">
              {asset.tags.split(",").filter(Boolean).map((tag, i) => (
                <span key={`${tag.trim()}-${i}`} className="px-2 py-1 text-xs rounded-lg bg-white/[0.04] border border-white/[0.06] text-noir-400">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <span className="text-noir-500 text-xs">ID</span>
          <span className="text-noir-600 text-xs font-mono">{asset.id}</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
//  SectionAccordion — 完全受控
// ══════════════════════════════════════════

function SectionAccordion({
  section, isExpanded, isEdit, onToggle, onAdd, onEditAsset, onDeleteAsset, onPreviewAsset,
}: {
  section: { type: string; label: string; icon: string; count: number; assets: AssetItem[] };
  isExpanded: boolean; isEdit: boolean; onToggle: () => void; onAdd: () => void;
  onEditAsset: (asset: AssetItem) => void; onDeleteAsset: (asset: AssetItem) => void;
  onPreviewAsset: (asset: AssetItem) => void;
}) {
  const colorKey = section.type as keyof typeof ASSET_TYPE_COLORS;
  const colorClasses = (ASSET_TYPE_COLORS[colorKey] || "bg-noir-600/20 text-noir-500 border-noir-600/30").split(" ").filter(Boolean);
  const bgClass = colorClasses.find((c) => c.startsWith("bg-")) || "bg-noir-600/20";
  const textClass = colorClasses.find((c) => c.startsWith("text-")) || "text-noir-400";
  const borderClass = colorClasses.find((c) => c.startsWith("border-")) || "border-noir-600/30";
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    const observer = new ResizeObserver(() => {
      setContentHeight(el.scrollHeight);
    });
    observer.observe(el);
    setContentHeight(el.scrollHeight);
    return () => observer.disconnect();
  }, [section.count, isExpanded]);

  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] overflow-hidden transition-all duration-500 hover:border-white/[0.08]">
      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all duration-400 cursor-pointer ${isExpanded ? "bg-white/[0.02]" : "hover:bg-white/[0.015]"}`}
      >
        <span className="text-lg shrink-0 opacity-70">{section.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-bold text-noir-200">{section.label}</h2>
            <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${textClass} ${bgClass} ${borderClass}`}>
              {section.count}
            </span>
          </div>
        </div>

        {isEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.04] text-noir-400 hover:text-noir-100 hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-250 hover:scale-[1.03] active:scale-[0.97]"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            添加
          </button>
        )}

        <svg className={`w-4 h-4 text-noir-600 shrink-0 transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>

      {/* Content — smooth slide via measured height */}
      <div
        className="transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden"
        style={{ maxHeight: isExpanded ? `${contentHeight}px` : "0px", opacity: isExpanded ? 1 : 0 }}
      >
        <div ref={contentRef} className="px-5 pb-5 pt-1">
          {section.count === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-noir-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
              </div>
              <p className="text-noir-600 text-sm mb-3">{isEdit ? "此分类暂无资产" : "暂无资产"}</p>
              {isEdit && (
                <Button variant="ghost" size="sm" onClick={onAdd}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  添加{section.label}资产
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {section.assets.map((asset, idx) => (
                <AssetListRow
                  key={asset.id}
                  asset={asset}
                  idx={idx}
                  isEdit={isEdit}
                  onEdit={onEditAsset}
                  onDelete={onDeleteAsset}
                  onPreview={onPreviewAsset}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
//  AssetListRow — 列表行（替代卡片）
// ══════════════════════════════════════════

function AssetListRow({
  asset, idx, isEdit, onEdit, onDelete, onPreview,
}: {
  asset: AssetItem; idx: number; isEdit: boolean;
  onEdit: (a: AssetItem) => void; onDelete: (a: AssetItem) => void;
  onPreview?: (a: AssetItem) => void;
}) {
  const isScript = asset.type === "SCRIPT";
  const hasFile = !!asset.imagePath;

  return (
    <div
      className={`flex items-center gap-4 py-3.5 first:pt-2 last:pb-2 group rounded-lg px-2 -mx-2 transition-all duration-200 animate-card-in ${!isEdit ? "cursor-pointer hover:bg-white/[0.03]" : "hover:bg-white/[0.02]"}`}
      style={{ animationDelay: `${idx * 40}ms` }}
      onClick={() => { if (!isEdit && onPreview) onPreview(asset); }}
    >
      {/* Thumbnail */}
      {isScript ? (
        <div className="w-11 h-11 rounded-lg bg-gold-500/[0.06] border border-gold-500/10 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-gold-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      ) : asset.imagePath ? (
        <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-white/[0.03] border border-white/[0.05]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset.imagePath} alt={asset.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
      ) : (
        <div className="w-11 h-11 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-noir-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-noir-200 group-hover:text-noir-100 transition-colors duration-200">{asset.name}</h4>
          <span className="text-[11px] text-noir-600">{ASSET_TYPE_LABELS[asset.type]}</span>
          {hasFile && !isEdit && (
            <svg className="w-3.5 h-3.5 text-noir-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          )}
        </div>
        {asset.description && (
          <p className="text-xs text-noir-500 line-clamp-1 mt-0.5">{asset.description}</p>
        )}
        {asset.tags && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {asset.tags.split(",").filter(Boolean).map((tag, i) => (
              <span key={`${tag.trim()}-${i}`} className="px-1.5 py-0.5 text-[11px] rounded-md bg-white/[0.03] border border-white/[0.04] text-noir-500">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {isScript && asset.imagePath && (
        <a href={asset.imagePath} target="_blank" rel="noopener noreferrer" className="text-xs text-gold-400/70 hover:text-gold-400 shrink-0 transition-colors duration-200" onClick={(e) => e.stopPropagation()}>
          下载
        </a>
      )}

      {isEdit && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
          <button onClick={(e) => { e.stopPropagation(); onEdit(asset); }} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-noir-500 hover:text-gold-400 transition-all duration-200">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(asset); }} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-noir-500 hover:text-red-400 transition-all duration-200">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
