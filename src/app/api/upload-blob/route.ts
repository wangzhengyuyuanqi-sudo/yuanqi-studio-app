import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const fd = await request.formData();
    const file = fd.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: "未收到文件" }, { status: 400 });
    }

    const prefix = fd.get("prefix") as string || "uploads";
    const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : ".bin";
    const safeName = `${prefix}/${Date.now()}_${Math.random().toString(36).slice(2, 10)}${ext}`;

    const blob = await put(safeName, file, { access: "public" });

    return NextResponse.json({
      success: true,
      url: blob.url,
      name: file.name,
    });
  } catch (error) {
    console.error("upload error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "上传失败" },
      { status: 500 }
    );
  }
}
