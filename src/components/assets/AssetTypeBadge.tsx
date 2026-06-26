import { ASSET_TYPE_COLORS, ASSET_TYPE_LABELS, ASSET_TYPE_ICONS } from "@/lib/constants";

interface AssetTypeBadgeProps { type: string; }

export default function AssetTypeBadge({ type }: AssetTypeBadgeProps) {
  const color = ASSET_TYPE_COLORS[type] || "bg-noir-600/20 text-noir-500 border-noir-600/30";
  const icon = ASSET_TYPE_ICONS[type] || "";
  const label = ASSET_TYPE_LABELS[type] || type;

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-lg border shrink-0 ${color}`}>
      {icon} {label}
    </span>
  );
}
