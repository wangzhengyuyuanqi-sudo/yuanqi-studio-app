import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateDramaSchema } from "@/lib/validators";
import type { ApiResponse, DramaDetail, EpisodeListItem } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const drama = await prisma.drama.findUnique({
      where: { id: params.id },
      include: {
        episodes: { orderBy: { episodeNumber: "asc" }, include: { _count: { select: { assets: true } } } },
        _count: { select: { episodes: true } },
      },
    });
    if (!drama) return NextResponse.json({ success: false, error: "剧集不存在" } satisfies ApiResponse<null>, { status: 404 });

    const episodes: EpisodeListItem[] = drama.episodes.map((ep) => ({
      id: ep.id, episodeNumber: ep.episodeNumber, title: ep.title, summary: ep.summary,
      scriptPath: ep.scriptPath, scriptName: ep.scriptName, dramaId: ep.dramaId,
      createdAt: ep.createdAt.toISOString(), updatedAt: ep.updatedAt.toISOString(),
      _count: { assets: ep._count.assets },
    }));

    const data: DramaDetail = {
      id: drama.id, title: drama.title, description: drama.description,
      createdAt: drama.createdAt.toISOString(), updatedAt: drama.updatedAt.toISOString(),
      _count: { episodes: drama._count.episodes }, episodes,
    };
    return NextResponse.json({ success: true, data } satisfies ApiResponse<DramaDetail>);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "获取剧集失败" } satisfies ApiResponse<null>, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const exist = await prisma.drama.findUnique({ where: { id: params.id } });
    if (!exist) return NextResponse.json({ success: false, error: "剧集不存在" } satisfies ApiResponse<null>, { status: 404 });

    const body = await request.json();
    const v = updateDramaSchema.safeParse(body);
    if (!v.success) return NextResponse.json({ success: false, error: v.error.errors[0].message } satisfies ApiResponse<null>, { status: 400 });

    const updated = await prisma.drama.update({ where: { id: params.id }, data: v.data });
    const data: DramaDetail = {
      id: updated.id, title: updated.title, description: updated.description,
      createdAt: updated.createdAt.toISOString(), updatedAt: updated.updatedAt.toISOString(),
      _count: { episodes: 0 }, episodes: [],
    };
    return NextResponse.json({ success: true, data } satisfies ApiResponse<DramaDetail>);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "更新失败" } satisfies ApiResponse<null>, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const exist = await prisma.drama.findUnique({ where: { id: params.id } });
    if (!exist) return NextResponse.json({ success: false, error: "剧集不存在" } satisfies ApiResponse<null>, { status: 404 });

    await prisma.episode.updateMany({ where: { dramaId: params.id }, data: { dramaId: null } });
    await prisma.drama.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, data: null } satisfies ApiResponse<null>);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "删除失败" } satisfies ApiResponse<null>, { status: 500 });
  }
}
