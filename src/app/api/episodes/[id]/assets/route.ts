import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAssetSchema, validateImageFile, validateScriptFile } from "@/lib/validators";
import { saveAssetImage, saveScriptFile } from "@/lib/upload";
import type { ApiResponse, AssetItem } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const ep = await prisma.episode.findUnique({ where: { id: params.id } });
    if (!ep) return NextResponse.json({ success: false, error: "剧集不存在" } satisfies ApiResponse<null>, { status: 404 });

    const assets = await prisma.asset.findMany({
      where: { episodeId: params.id, ...(type ? { type } : {}) },
      orderBy: { createdAt: "desc" },
    });

    const data: AssetItem[] = assets.map((a) => ({
      id: a.id, name: a.name, description: a.description,
      type: a.type as AssetItem["type"], imagePath: a.imagePath, imageName: a.imageName,
      tags: a.tags, episodeId: a.episodeId,
      createdAt: a.createdAt.toISOString(), updatedAt: a.updatedAt.toISOString(),
    }));
    return NextResponse.json({ success: true, data } satisfies ApiResponse<AssetItem[]>);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "获取资产失败" } satisfies ApiResponse<null>, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const ep = await prisma.episode.findUnique({ where: { id: params.id } });
    if (!ep) return NextResponse.json({ success: false, error: "剧集不存在" } satisfies ApiResponse<null>, { status: 404 });

    const fd = await request.formData();
    const v = createAssetSchema.safeParse({
      name: fd.get("name"), description: fd.get("description"),
      type: fd.get("type"), tags: fd.get("tags"),
    });
    if (!v.success) return NextResponse.json({ success: false, error: v.error.errors[0].message } satisfies ApiResponse<null>, { status: 400 });

    const isScript = v.data.type === "SCRIPT";
    const file = isScript ? (fd.get("script") as File | null) : (fd.get("image") as File | null);

    const asset = await prisma.asset.create({
      data: {
        name: v.data.name, description: v.data.description || null,
        type: v.data.type, tags: v.data.tags || null, episodeId: params.id,
      },
    });

    if (file && file.size > 0) {
      const err = isScript
        ? validateScriptFile({ mimetype: file.type, size: file.size })
        : validateImageFile({ mimetype: file.type, size: file.size });
      if (err) {
        await prisma.asset.delete({ where: { id: asset.id } });
        return NextResponse.json({ success: false, error: err } satisfies ApiResponse<null>, { status: 400 });
      }
      const saved = isScript ? await saveScriptFile(file, asset.id) : await saveAssetImage(file, asset.id);
      const updated = await prisma.asset.update({ where: { id: asset.id }, data: { imagePath: saved.filePath, imageName: saved.fileName } });
      const data: AssetItem = {
        id: updated.id, name: updated.name, description: updated.description,
        type: updated.type as AssetItem["type"], imagePath: updated.imagePath, imageName: updated.imageName,
        tags: updated.tags, episodeId: updated.episodeId,
        createdAt: updated.createdAt.toISOString(), updatedAt: updated.updatedAt.toISOString(),
      };
      return NextResponse.json({ success: true, data } satisfies ApiResponse<AssetItem>, { status: 201 });
    }

    const data: AssetItem = {
      id: asset.id, name: asset.name, description: asset.description,
      type: asset.type as AssetItem["type"], imagePath: asset.imagePath, imageName: asset.imageName,
      tags: asset.tags, episodeId: asset.episodeId,
      createdAt: asset.createdAt.toISOString(), updatedAt: asset.updatedAt.toISOString(),
    };
    return NextResponse.json({ success: true, data } satisfies ApiResponse<AssetItem>, { status: 201 });
  } catch (error) {
    console.error("Asset upload error:", error);
    const message = error instanceof Error ? error.message : "上传失败";
    return NextResponse.json({ success: false, error: message } satisfies ApiResponse<null>, { status: 500 });
  }
}
