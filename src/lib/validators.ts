import { z } from "zod";
import {
  ASSET_TYPES,
  ALLOWED_SCRIPT_TYPES,
  ALLOWED_IMAGE_TYPES,
  MAX_SCRIPT_SIZE_MB,
  MAX_IMAGE_SIZE_MB,
} from "./constants";

export const createEpisodeSchema = z.object({
  episodeNumber: z.coerce.number().int().positive("集号必须为正整数"),
  title: z.string().min(1, "标题不能为空").max(200),
  summary: z.string().max(2000).optional().nullable(),
  dramaId: z.string().optional().nullable(),
});

export const updateEpisodeSchema = z.object({
  episodeNumber: z.coerce.number().int().positive().optional(),
  title: z.string().min(1).max(200).optional(),
  summary: z.string().max(2000).optional().nullable(),
  dramaId: z.string().optional().nullable(),
});

export const createDramaSchema = z.object({
  title: z.string().min(1, "名称不能为空").max(200),
  description: z.string().max(2000).optional().nullable(),
});

export const updateDramaSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
});

export const createAssetSchema = z.object({
  name: z.string().min(1, "名称不能为空").max(200),
  description: z.string().max(2000).optional().nullable(),
  type: z.enum(ASSET_TYPES as [string, ...string[]], {
    errorMap: () => ({ message: "无效的资产类型" }),
  }),
  tags: z.string().max(500).optional().nullable(),
});

export const updateAssetSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  type: z.enum(ASSET_TYPES as [string, ...string[]], {
    errorMap: () => ({ message: "无效的资产类型" }),
  }).optional(),
  tags: z.string().max(500).optional().nullable(),
});

export function validateScriptFile(file: {
  mimetype?: string | null;
  size: number;
}): string | null {
  if (!file.mimetype || !ALLOWED_SCRIPT_TYPES.includes(file.mimetype)) {
    return "仅支持 PDF、DOCX、TXT 格式";
  }
  if (file.size > MAX_SCRIPT_SIZE_MB * 1024 * 1024) {
    return `文件不能超过 ${MAX_SCRIPT_SIZE_MB}MB`;
  }
  return null;
}

export function validateImageFile(file: {
  mimetype?: string | null;
  size: number;
}): string | null {
  if (!file.mimetype || !ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return "仅支持 JPG、PNG、WEBP、GIF 格式";
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `图片不能超过 ${MAX_IMAGE_SIZE_MB}MB`;
  }
  return null;
}
