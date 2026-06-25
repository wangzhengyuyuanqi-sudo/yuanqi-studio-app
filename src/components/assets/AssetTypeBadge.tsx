import { ASSET_TYPE_COLORS, ASSET_TYPE_ICONS } from "@/lib/constants";

interface AssetTypeBadgeProps {
  type: string;
}

export default function AssetTypeBadge({ type }: AssetTypeBadgeProps) {
  const color = ASSET_TYPE_COLORS[type] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  const icon = ASSET_TYPE_ICONS[type] || "";

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-md border shrink-0 ${color}`}>
      {icon} {type}
    </span>
  );
}
