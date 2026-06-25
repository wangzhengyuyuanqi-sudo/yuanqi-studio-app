import path from "path";
import fs from "fs/promises";

type BlobResult = { filePath: string; fileName: string };

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

function getExtension(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i > 0 ? filename.slice(i) : ".bin";
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function saveLocal(subDir: string, file: File, id: string): Promise<BlobResult> {
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
  return BLOB_TOKEN ? saveBlob("scripts", file, id) : saveLocal("scripts", file, id);
}

export async function saveAssetImage(file: File, id: string): Promise<BlobResult> {
  return BLOB_TOKEN ? saveBlob("assets", file, id) : saveLocal("assets", file, id);
}

export async function deleteFile(url: string): Promise<void> {
  if (!url) return;
  try {
    if (BLOB_TOKEN && (url.startsWith("https://") || url.startsWith("http://"))) {
      const { del } = await import("@vercel/blob");
      await del(url);
    } else {
      const fullPath = path.join(process.cwd(), "public", url);
      await fs.unlink(fullPath);
    }
  } catch {
    // 文件可能已被删除
  }
}
