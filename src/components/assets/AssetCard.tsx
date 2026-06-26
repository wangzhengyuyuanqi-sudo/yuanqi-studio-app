"use client";

import type { AssetItem } from "@/types";
import AssetTypeBadge from "./AssetTypeBadge";
import { ImageWithPreview } from "@/components/ui/ImagePreview";
import { useState } from "react";

interface AssetCardProps { asset: AssetItem; onEdit?: (a: AssetItem) => void; onDelete?: (a: AssetItem) => void; }

export default function AssetCard({ asset, onEdit, onDelete }: AssetCardProps) {
  const [showActions, setShowActions] = useState(false);
  const isScript = asset.type === "SCRIPT";

  return (
    <div className="group relative neumorph-raised rounded-2xl overflow-hidden" onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      {isScript ? (
        <div className="aspect-video w-full bg-gradient-to-br from-gold-500/5 to-[#06060a] flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-gold-400/50 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            {asset.imageName && <span className="block text-xs text-noir-500 truncate max-w-[120px] mx-auto">{asset.imageName}</span>}
          </div>
        </div>
      ) : asset.imagePath ? (
        <ImageWithPreview src={asset.imagePath} alt={asset.name} className="aspect-video w-full" />
      ) : (
        <div className="aspect-video w-full bg-[#06060a] flex items-center justify-center">
          <svg className="w-10 h-10 text-noir-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
      )}
      <div className={`absolute top-2 right-2 flex gap-1 transition-all duration-300 ${showActions ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}>
        {onEdit && <button onClick={(e) => { e.preventDefault(); onEdit(asset); }} className="p-1.5 rounded-xl neumorph-inset text-noir-400 hover:text-gold-400/70 transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>}
        {onDelete && <button onClick={(e) => { e.preventDefault(); onDelete(asset); }} className="p-1.5 rounded-xl neumorph-inset text-noir-400 hover:text-red-400/70 transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2"><h4 className="text-sm font-bold text-champagne-300/80 line-clamp-1">{asset.name}</h4><AssetTypeBadge type={asset.type} /></div>
        {asset.description && <p className="text-xs text-noir-500/80 line-clamp-2 mb-2">{asset.description}</p>}
        <div className="flex items-center gap-2">
          {asset.tags && <div className="flex flex-wrap gap-1 flex-1 min-w-0">{asset.tags.split(",").filter(Boolean).map((tag, i) => (<span key={`${tag.trim()}-${i}`} className="px-1.5 py-0.5 text-xs rounded-lg neumorph-inset text-noir-500">{tag.trim()}</span>))}</div>}
          {isScript && asset.imagePath && <a href={asset.imagePath} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 ml-auto text-xs text-gold-400/60 hover:text-gold-400 transition-colors duration-300">下载</a>}
        </div>
      </div>
    </div>
  );
}
