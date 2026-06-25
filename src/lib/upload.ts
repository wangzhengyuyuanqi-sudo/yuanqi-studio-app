import path from "path";
import fs from "fs/promises";

type BlobResult = { filePath: string; fileName: string };

function getExtension(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i > 0 ? filename.slice(i) : ".bin";
}

function isVercel(): boolean {
  return !!(process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_REGION);
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function saveLocal(subDir: string, file: File, id: string): Promise<BlobResult> {
  if (isVercel()) {
    throw new Error("Vercel 环境不支持本地文件存储，请配置 BLOB_READ_WRITE_TOKEN");
  }
  const dir = path.join(process.cwd(), "public", "uploads", subDir);
  await ensureDir(dir);
  const safeName = `${id}_${Date.now()}${getExtension(file.name)}`;
  const filePath = path.join(dir, safeName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return { filePath: `/uploads/${subDir}/${safeName}`, fileName: file.name };
}

async function saveBlob(prefix: string, file: File, id: string): Promise<BlobResult> {
  const { put } = await import("@vercel/blob");
  const safeName = `${prefix}/${id}_${Date.now()}${getExtension(file.name)}`;
  const blob = await put(safeName, file, { access: "public" });
  return { filePath: blob.url, fileName: file.name };
}

export async function saveScriptFile(file: File, id: string): Promise<BlobResult> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    return saveBlob("scripts", file, id).catch(async (err) => {
      console.error("Vercel Blob upload failed:", err);
      if (isVercel()) throw new Error("文件存储服务异常，请检查 BLOB_READ_WRITE_TOKEN 是否正确");
      return saveLocal("scripts", file, id);
    });
  }
  return saveLocal("scripts", file, id);
}

export async function saveAssetImage(file: File, id: string): Promise<BlobResult> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    return saveBlob("assets", file, id).catch(async (err) => {
      console.error("Vercel Blob upload failed:", err);
      if (isVercel()) throw new Error("文件存储服务异常，请检查 BLOB_READ_WRITE_TOKEN 是否正确");
      return saveLocal("assets", file, id);
    });
  }
  return saveLocal("assets", file, id);
}

export async function deleteFile(url: string): Promise<void> {
  if (!url) return;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  try {
    if (token && (url.startsWith("https://") || url.startsWith("http://"))) {
      const { del } = await import("@vercel/blob");
      await del(url);
    } else if (!isVercel()) {
      const fullPath = path.join(process.cwd(), "public", url);
      await fs.unlink(fullPath);
    }
  } catch {
    // 文件可能已被删除
  }
}
