import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDramaSchema } from "@/lib/validators";
import type { ApiResponse, DramaListItem } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dramas = await prisma.drama.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { episodes: true } } },
    });
    const data: DramaListItem[] = dramas.map((d) => ({
      id: d.id, title: d.title, description: d.description,
      createdAt: d.createdAt.toISOString(), updatedAt: d.updatedAt.toISOString(),
      _count: { episodes: d._count.episodes },
    }));
    return NextResponse.json({ success: true, data } satisfies ApiResponse<DramaListItem[]>);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "获取剧集失败" } satisfies ApiResponse<null>, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const v = createDramaSchema.safeParse(body);
    if (!v.success) return NextResponse.json({ success: false, error: v.error.errors[0].message } satisfies ApiResponse<null>, { status: 400 });

    const record = await prisma.drama.create({
      data: { title: v.data.title, description: v.data.description || null },
      include: { _count: { select: { episodes: true } } },
    });
    const data: DramaListItem = {
      id: record.id, title: record.title, description: record.description,
      createdAt: record.createdAt.toISOString(), updatedAt: record.updatedAt.toISOString(),
      _count: { episodes: record._count.episodes },
    };
    return NextResponse.json({ success: true, data } satisfies ApiResponse<DramaListItem>, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "创建剧集失败" } satisfies ApiResponse<null>, { status: 500 });
  }
}
