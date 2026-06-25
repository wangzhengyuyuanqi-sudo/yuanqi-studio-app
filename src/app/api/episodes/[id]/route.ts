import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateEpisodeSchema, validateScriptFile } from "@/lib/validators";
import { saveScriptFile, deleteFile } from "@/lib/upload";
import type { ApiResponse, AssetItem, EpisodeDetail } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const ep = await prisma.episode.findUnique({
      where: { id: params.id },
      include: { assets: { orderBy: { createdAt: "desc" } }, _count: { select: { assets: true } } },
    });
    if (!ep) return NextResponse.json({ success: false, error: "剧集不存在" } satisfies ApiResponse<null>, { status: 404 });

    const data: EpisodeDetail = {
      id: ep.id, episodeNumber: ep.episodeNumber, title: ep.title, summary: ep.summary,
      scriptPath: ep.scriptPath, scriptName: ep.scriptName, dramaId: ep.dramaId,
      createdAt: ep.createdAt.toISOString(), updatedAt: ep.updatedAt.toISOString(),
      _count: { assets: ep._count.assets },
      assets: ep.assets.map((a) => ({
        id: a.id, name: a.name, description: a.description,
        type: a.type as AssetItem["type"], imagePath: a.imagePath, imageName: a.imageName,
        tags: a.tags, episodeId: a.episodeId,
        createdAt: a.createdAt.toISOString(), updatedAt: a.updatedAt.toISOString(),
      })),
    };
    return NextResponse.json({ success: true, data } satisfies ApiResponse<EpisodeDetail>);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "获取剧集失败" } satisfies ApiResponse<null>, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const existing = await prisma.episode.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ success: false, error: "剧集不存在" } satisfies ApiResponse<null>, { status: 404 });

    const fd = await request.formData();
    const raw: Record<string, string | null> = {};
    ["episodeNumber", "title", "summary", "dramaId"].forEach((k) => {
      const val = fd.get(k);
      if (val !== null) raw[k] = String(val);
    });
    const v = updateEpisodeSchema.safeParse(raw);
    if (!v.success) return NextResponse.json({ success: false, error: v.error.errors[0].message } satisfies ApiResponse<null>, { status: 400 });

    let scriptPath = existing.scriptPath;
    let scriptName = existing.scriptName;

    const scriptFile = fd.get("script") as File | null;
    if (scriptFile && scriptFile.size > 0) {
      const err = validateScriptFile({ mimetype: scriptFile.type, size: scriptFile.size });
      if (err) return NextResponse.json({ success: false, error: err } satisfies ApiResponse<null>, { status: 400 });
      if (existing.scriptPath) await deleteFile(existing.scriptPath);
      const saved = await saveScriptFile(scriptFile, params.id);
      scriptPath = saved.filePath; scriptName = saved.fileName;
    }

    if (fd.get("removeScript") === "true") {
      if (existing.scriptPath) await deleteFile(existing.scriptPath);
      scriptPath = null; scriptName = null;
    }

    const updated = await prisma.episode.update({
      where: { id: params.id },
      data: { ...v.data, scriptPath, scriptName },
      include: { assets: { orderBy: { createdAt: "desc" } }, _count: { select: { assets: true } } },
    });

    const data: EpisodeDetail = {
      id: updated.id, episodeNumber: updated.episodeNumber, title: updated.title, summary: updated.summary,
      scriptPath: updated.scriptPath, scriptName: updated.scriptName, dramaId: updated.dramaId,
      createdAt: updated.createdAt.toISOString(), updatedAt: updated.updatedAt.toISOString(),
      _count: { assets: updated._count.assets },
      assets: updated.assets.map((a) => ({
        id: a.id, name: a.name, description: a.description,
        type: a.type as AssetItem["type"], imagePath: a.imagePath, imageName: a.imageName,
        tags: a.tags, episodeId: a.episodeId,
        createdAt: a.createdAt.toISOString(), updatedAt: a.updatedAt.toISOString(),
      })),
    };
    return NextResponse.json({ success: true, data } satisfies ApiResponse<EpisodeDetail>);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "更新失败" } satisfies ApiResponse<null>, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const existing = await prisma.episode.findUnique({
      where: { id: params.id },
      include: { assets: true },
    });
    if (!existing) return NextResponse.json({ success: false, error: "剧集不存在" } satisfies ApiResponse<null>, { status: 404 });

    if (existing.scriptPath) await deleteFile(existing.scriptPath);
    for (const a of existing.assets) { if (a.imagePath) await deleteFile(a.imagePath); }
    await prisma.episode.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, data: null } satisfies ApiResponse<null>);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "删除失败" } satisfies ApiResponse<null>, { status: 500 });
  }
}
