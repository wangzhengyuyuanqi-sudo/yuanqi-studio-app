import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createEpisodeSchema, validateScriptFile } from "@/lib/validators";
import { saveScriptFile } from "@/lib/upload";
import type { ApiResponse, EpisodeListItem } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";

    const episodes = await prisma.episode.findMany({
      where: search ? { OR: [{ title: { contains: search } }, { summary: { contains: search } }] } : undefined,
      orderBy: { episodeNumber: sort },
      include: { _count: { select: { assets: true } } },
    });

    const data: EpisodeListItem[] = episodes.map((ep) => ({
      id: ep.id, episodeNumber: ep.episodeNumber, title: ep.title, summary: ep.summary,
      scriptPath: ep.scriptPath, scriptName: ep.scriptName, dramaId: ep.dramaId,
      createdAt: ep.createdAt.toISOString(), updatedAt: ep.updatedAt.toISOString(),
      _count: { assets: ep._count.assets },
    }));
    return NextResponse.json({ success: true, data } satisfies ApiResponse<EpisodeListItem[]>);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "获取剧集失败" } satisfies ApiResponse<null>, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const fd = await request.formData();
    const v = createEpisodeSchema.safeParse({
      episodeNumber: fd.get("episodeNumber"),
      title: fd.get("title"),
      summary: fd.get("summary"),
      dramaId: fd.get("dramaId"),
    });
    if (!v.success) return NextResponse.json({ success: false, error: v.error.errors[0].message } satisfies ApiResponse<null>, { status: 400 });

    const scriptFile = fd.get("script") as File | null;
    let scriptPath: string | null = null;
    let scriptName: string | null = null;

    const episode = await prisma.episode.create({
      data: {
        episodeNumber: v.data.episodeNumber,
        title: v.data.title,
        summary: v.data.summary || null,
        dramaId: v.data.dramaId || null,
      },
    });

    if (scriptFile && scriptFile.size > 0) {
      const err = validateScriptFile({ mimetype: scriptFile.type, size: scriptFile.size });
      if (err) {
        await prisma.episode.delete({ where: { id: episode.id } });
        return NextResponse.json({ success: false, error: err } satisfies ApiResponse<null>, { status: 400 });
      }
      const saved = await saveScriptFile(scriptFile, episode.id);
      scriptPath = saved.filePath;
      scriptName = saved.fileName;
      await prisma.episode.update({ where: { id: episode.id }, data: { scriptPath, scriptName } });
    }

    const data: EpisodeListItem = {
      id: episode.id, episodeNumber: episode.episodeNumber, title: episode.title, summary: episode.summary,
      scriptPath, scriptName, dramaId: episode.dramaId,
      createdAt: episode.createdAt.toISOString(), updatedAt: episode.updatedAt.toISOString(),
      _count: { assets: 0 },
    };
    return NextResponse.json({ success: true, data } satisfies ApiResponse<EpisodeListItem>, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "创建剧集失败" } satisfies ApiResponse<null>, { status: 500 });
  }
}
