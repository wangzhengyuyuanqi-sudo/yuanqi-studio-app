export const ASSET_TYPE_LABELS: Record<string, string> = {
  CHARACTER_COSTUME: "人物装造",
  SCENE_DESIGN: "场景设计",
  PROP: "道具",
  SCRIPT: "剧本",
};

export const ASSET_TYPE_COLORS: Record<string, string> = {
  CHARACTER_COSTUME: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  SCENE_DESIGN: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  PROP: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  SCRIPT: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export const ASSET_TYPE_ICONS: Record<string, string> = {
  CHARACTER_COSTUME: "👤",
  SCENE_DESIGN: "🎬",
  PROP: "🔧",
  SCRIPT: "📄",
};

export const ASSET_TYPES = Object.keys(ASSET_TYPE_LABELS);

export const ALLOWED_SCRIPT_TYPES = [
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_SCRIPT_SIZE_MB = parseInt(process.env.MAX_SCRIPT_SIZE_MB || "25", 10);
export const MAX_IMAGE_SIZE_MB = parseInt(process.env.MAX_IMAGE_SIZE_MB || "25", 10);
