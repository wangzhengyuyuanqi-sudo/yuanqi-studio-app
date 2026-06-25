import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateAssetSchema, validateImageFile, validateScriptFile } from "@/lib/validators";
import { saveAssetImage, saveScriptFile, deleteFile } from "@/lib/upload";
import type { ApiResponse, AssetItem } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const asset = await prisma.asset.findUnique({ where: { id: params.id } });
    if (!asset) return NextResponse.json({ success: false, error: "资产不存在" } satisfies ApiResponse<null>, { status: 404 });
    const data: AssetItem = {
      id: asset.id, name: asset.name, description: asset.description,
      type: asset.type as AssetItem["type"], imagePath: asset.imagePath, imageName: asset.imageName,
      tags: asset.tags, episodeId: asset.episodeId,
      createdAt: asset.createdAt.toISOString(), updatedAt: asset.updatedAt.toISOString(),
    };
    return NextResponse.json({ success: true, data } satisfies ApiResponse<AssetItem>);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "获取失败" } satisfies ApiResponse<null>, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const existing = await prisma.asset.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ success: false, error: "资产不存在" } satisfies ApiResponse<null>, { status: 404 });

    const fd = await request.formData();
    const raw: Record<string, string | null> = {};
    ["name", "description", "type", "tags"].forEach((k) => {
      const val = fd.get(k);
      if (val !== null) raw[k] = String(val);
    });
    const v = updateAssetSchema.safeParse(raw);
    if (!v.success) return NextResponse.json({ success: false, error: v.error.errors[0].message } satisfies ApiResponse<null>, { status: 400 });

    const resolvedType = v.data.type || existing.type;
    const isScript = resolvedType === "SCRIPT";
    let imagePath = existing.imagePath;
    let imageName = existing.imageName;

    const file = isScript ? (fd.get("script") as File | null) : (fd.get("image") as File | null);
    if (file && file.size > 0) {
      const err = isScript
        ? validateScriptFile({ mimetype: file.type, size: file.size })
        : validateImageFile({ mimetype: file.type, size: file.size });
      if (err) return NextResponse.json({ success: false, error: err } satisfies ApiResponse<null>, { status: 400 });
      if (existing.imagePath) await deleteFile(existing.imagePath);
      const saved = isScript ? await saveScriptFile(file, params.id) : await saveAssetImage(file, params.id);
      imagePath = saved.filePath; imageName = saved.fileName;
    }

    if (fd.get("removeFile") === "true") {
      if (existing.imagePath) await deleteFile(existing.imagePath);
      imagePath = null; imageName = null;
    }

    const updated = await prisma.asset.update({ where: { id: params.id }, data: { ...v.data, imagePath, imageName } });
    const data: AssetItem = {
      id: updated.id, name: updated.name, description: updated.description,
      type: updated.type as AssetItem["type"], imagePath: updated.imagePath, imageName: updated.imageName,
      tags: updated.tags, episodeId: updated.episodeId,
      createdAt: updated.createdAt.toISOString(), updatedAt: updated.updatedAt.toISOString(),
    };
    return NextResponse.json({ success: true, data } satisfies ApiResponse<AssetItem>);
  } catch (error) {
    console.error("Asset update error:", error);
    const message = error instanceof Error ? error.message : "更新失败";
    return NextResponse.json({ success: false, error: message } satisfies ApiResponse<null>, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const existing = await prisma.asset.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ success: false, error: "资产不存在" } satisfies ApiResponse<null>, { status: 404 });
    if (existing.imagePath) await deleteFile(existing.imagePath);
    await prisma.asset.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: null } satisfies ApiResponse<null>);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "删除失败" } satisfies ApiResponse<null>, { status: 500 });
  }
}
