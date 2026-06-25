"use client";

import type { AssetItem } from "@/types";
import AssetCard from "./AssetCard";

interface AssetGridProps {
  assets: AssetItem[];
  onEdit?: (asset: AssetItem) => void;
  onDelete?: (asset: AssetItem) => void;
}

export default function AssetGrid({ assets, onEdit, onDelete }: AssetGridProps) {
  if (assets.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
