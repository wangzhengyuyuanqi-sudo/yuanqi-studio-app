import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { ASSET_TYPE_LABELS, ASSET_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const GOLD = "F5A623";
const DARK = "1A1A26";
const MEDIUM = "505068";
const WHITE = "FFFFFF";
const BG_ROW = "FAFAFB";
const BG_HEADER = GOLD;

const TYPE_COLORS: Record<string, string> = {
  CHARACTER_COSTUME: "E11D48",
  SCENE_DESIGN: "0EA5E9",
  PROP: "10B981",
  SCRIPT: GOLD,
};

const TYPE_ROW_FILLS: Record<string, string> = {
  CHARACTER_COSTUME: "FFF1F2",
  SCENE_DESIGN: "F0F9FF",
  PROP: "ECFDF5",
  SCRIPT: "FFF9EB",
};

async function fetchImageBuffer(url: string): Promise<Buffer<ArrayBufferLike> | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const arrBuf = await res.arrayBuffer();
    return Buffer.from(arrBuf) as Buffer<ArrayBufferLike>;
  } catch {
    return null;
  }
}

function resolveUrl(imagePath: string, host: string): string {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  const base = host.startsWith("http") ? host : `http://${host}`;
  return `${base}${imagePath}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dramaId = searchParams.get("dramaId");
    const imageWidth = 90;
    const imageHeight = 68;

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";

    const dramas = await prisma.drama.findMany({
      where: dramaId ? { id: dramaId } : undefined,
      include: {
        episodes: {
          orderBy: { episodeNumber: "asc" },
          include: {
            assets: { orderBy: { type: "asc" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (dramas.length === 0) {
      return NextResponse.json({ success: false, error: "没有可导出的数据" }, { status: 404 });
    }

    const wb = new ExcelJS.Workbook();
    wb.creator = "元气制片";
    wb.created = new Date();

    const headerFont = { name: "Microsoft YaHei", bold: true, size: 11, color: { argb: WHITE } };
    const headerFill = { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: BG_HEADER } };
    const cellBorder = (color = "E8E8E8") => ({
      top: { style: "thin" as const, color: { argb: color } },
      bottom: { style: "thin" as const, color: { argb: color } },
      left: { style: "thin" as const, color: { argb: color } },
      right: { style: "thin" as const, color: { argb: color } },
    });
    const centerV = { vertical: "middle" as const, horizontal: "center" as const };
    const leftV = { vertical: "middle" as const, horizontal: "left" as const, wrapText: true };
    const dataFont = (bold = false) => ({ name: "Microsoft YaHei", size: 10, bold, color: { argb: DARK } });
    const mutedFont = (bold = false) => ({ name: "Microsoft YaHei", size: 9, bold, color: { argb: MEDIUM } });

    for (const drama of dramas) {
      const sheetName = drama.title.slice(0, 31).replace(/[\\/*?:[\]]/g, "");
      const ws = wb.addWorksheet(sheetName || "未命名");

      // Define columns
      ws.columns = [
        { key: "image", width: 15 },
        { key: "drama", width: 14 },
        { key: "epNum", width: 8 },
        { key: "epTitle", width: 18 },
        { key: "assetType", width: 13 },
        { key: "name", width: 22 },
        { key: "desc", width: 28 },
        { key: "tags", width: 18 },
        { key: "fileName", width: 20 },
      ];
      const colCount = 9;

      let row = 1;

      // ─── Sheet Title ───
      ws.mergeCells(row, 1, row, colCount);
      const titleCell = ws.getCell(row, 1);
      titleCell.value = `📋 ${drama.title}`;
      titleCell.font = { name: "Microsoft YaHei", bold: true, size: 18, color: { argb: DARK } };
      titleCell.alignment = { vertical: "middle", horizontal: "left" };
      titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9EB" } };
      ws.getRow(row).height = 42;
      row++;

      if (drama.description) {
        ws.mergeCells(row, 1, row, colCount);
        const descCell = ws.getCell(row, 1);
        descCell.value = drama.description;
        descCell.font = { name: "Microsoft YaHei", size: 10, italic: true, color: { argb: MEDIUM } };
        descCell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
        ws.getRow(row).height = 24;
        row++;
      }

      row++;
      ws.getRow(row).height = 6;
      row++;

      // ─── Column Headers ───
      ws.getRow(row).height = 30;
      const headers = ["缩略图", "剧集名称", "集号", "集标题", "资产分类", "资产名称", "描述 / 备注", "标签", "文件名"];
      for (let c = 0; c < headers.length; c++) {
        const cell = ws.getCell(row, c + 1);
        cell.value = headers[c];
        cell.font = { ...headerFont };
        cell.fill = headerFill;
        cell.alignment = { ...centerV };
        cell.border = cellBorder("D4A017");
      }
      row++;

      // ─── Episodes ───
      for (const ep of drama.episodes) {
        const grouped: Record<string, typeof ep.assets> = {};
        for (const a of ep.assets) {
          if (!grouped[a.type]) grouped[a.type] = [];
          grouped[a.type].push(a);
        }

        const assetCount = ep.assets.length;
        if (assetCount === 0) continue;

        // Episode separator
        ws.mergeCells(row, 1, row, colCount);
        const epCell = ws.getCell(row, 1);
        epCell.value = `第 ${ep.episodeNumber} 集 — ${ep.title}（共 ${assetCount} 个资产）`;
        epCell.font = { name: "Microsoft YaHei", bold: true, size: 11, color: { argb: WHITE } };
        epCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "3A3A52" } };
        epCell.alignment = { vertical: "middle", horizontal: "left" };
        ws.getRow(row).height = 28;
        row++;

        for (const assetType of ASSET_TYPES) {
          const assets = grouped[assetType];
          if (!assets || assets.length === 0) continue;

          const typeColor = TYPE_COLORS[assetType] || GOLD;
          const typeLabel = ASSET_TYPE_LABELS[assetType] || assetType;

          // Type sub-header with colored left stripe
          ws.mergeCells(row, 1, row, colCount);
          const typeCell = ws.getCell(row, 1);
          typeCell.value = `▎${typeLabel}（${assets.length} 个）`;
          typeCell.font = { name: "Microsoft YaHei", bold: true, size: 10, color: { argb: "FFFFFF" } };
          typeCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: typeColor } };
          typeCell.alignment = { vertical: "middle", horizontal: "left" };
          ws.getRow(row).height = 24;
          row++;

          for (const asset of assets) {
            ws.getRow(row).height = 72;
            const isScript = asset.type === "SCRIPT";
            const rowFill = row % 2 === 0 ? "FFFFFF" : TYPE_ROW_FILLS[assetType] || BG_ROW;

            // Col 1 — Thumbnail
            if (asset.imagePath && !isScript) {
              const imgUrl = resolveUrl(asset.imagePath, host);
              const imgBuf = await fetchImageBuffer(imgUrl);
              if (imgBuf) {
                const rawExt = asset.imagePath.split(".").pop()?.toLowerCase() || "png";
                const ext: "png" | "jpeg" | "gif" = rawExt === "jpg" || rawExt === "jpeg" ? "jpeg" : rawExt === "gif" ? "gif" : "png";
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const imgId = wb.addImage({ buffer: imgBuf as any, extension: ext });
                ws.addImage(imgId, { tl: { col: 0, row: row - 1 }, ext: { width: imageWidth, height: imageHeight } });
              }
              ws.getCell(row, 1).value = "";
            } else if (asset.imagePath && isScript) {
              ws.getCell(row, 1).value = "📄 剧本";
              ws.getCell(row, 1).font = { name: "Microsoft YaHei", size: 10, color: { argb: GOLD } };
            } else {
              ws.getCell(row, 1).value = "—";
              ws.getCell(row, 1).font = { name: "Microsoft YaHei", size: 10, color: { argb: "BBBBBB" } };
            }
            ws.getCell(row, 1).alignment = { ...centerV };
            ws.getCell(row, 1).border = cellBorder();
            ws.getCell(row, 1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowFill } };

            // Col 2 — Drama name
            ws.getCell(row, 2).value = drama.title;
            ws.getCell(row, 2).font = { ...dataFont(true), size: 9 };
            ws.getCell(row, 2).alignment = { ...centerV };
            ws.getCell(row, 2).border = cellBorder();
            ws.getCell(row, 2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowFill } };

            // Col 3 — Episode number
            ws.getCell(row, 3).value = `第 ${ep.episodeNumber} 集`;
            ws.getCell(row, 3).font = { ...dataFont(true), size: 9 };
            ws.getCell(row, 3).alignment = { ...centerV };
            ws.getCell(row, 3).border = cellBorder();
            ws.getCell(row, 3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowFill } };

            // Col 4 — Episode title
            ws.getCell(row, 4).value = ep.title;
            ws.getCell(row, 4).font = { ...mutedFont(), size: 9 };
            ws.getCell(row, 4).alignment = { ...leftV };
            ws.getCell(row, 4).border = cellBorder();
            ws.getCell(row, 4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowFill } };

            // Col 5 — Asset type
            ws.getCell(row, 5).value = typeLabel;
            ws.getCell(row, 5).font = { name: "Microsoft YaHei", size: 9, bold: true, color: { argb: typeColor } };
            ws.getCell(row, 5).alignment = { ...centerV };
            ws.getCell(row, 5).border = cellBorder();
            ws.getCell(row, 5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowFill } };

            // Col 6 — Asset name
            ws.getCell(row, 6).value = asset.name;
            ws.getCell(row, 6).font = dataFont(true);
            ws.getCell(row, 6).alignment = { ...leftV };
            ws.getCell(row, 6).border = cellBorder();
            ws.getCell(row, 6).fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowFill } };

            // Col 7 — Description / note
            ws.getCell(row, 7).value = asset.description || "";
            ws.getCell(row, 7).font = mutedFont();
            ws.getCell(row, 7).alignment = { ...leftV };
            ws.getCell(row, 7).border = cellBorder();
            ws.getCell(row, 7).fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowFill } };

            // Col 8 — Tags
            ws.getCell(row, 8).value = asset.tags || "";
            ws.getCell(row, 8).font = { name: "Microsoft YaHei", size: 9, color: { argb: "666677" } };
            ws.getCell(row, 8).alignment = { ...leftV };
            ws.getCell(row, 8).border = cellBorder();
            ws.getCell(row, 8).fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowFill } };

            // Col 9 — File name
            ws.getCell(row, 9).value = asset.imageName || (asset.imagePath ? "已上传" : "—");
            ws.getCell(row, 9).font = { name: "Microsoft YaHei", size: 9, color: { argb: MEDIUM } };
            ws.getCell(row, 9).alignment = { ...leftV };
            ws.getCell(row, 9).border = cellBorder();
            ws.getCell(row, 9).fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowFill } };

            row++;
          }
        }
      }

      ws.views = [{ state: "frozen", ySplit: drama.description ? 5 : 4 }];
      ws.pageSetup = {
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      };

      ws.eachRow((r) => {
        if (r.height && r.height < 22) r.height = 22;
      });
    }

    const buffer = await wb.xlsx.writeBuffer();

    const filename = dramaId
      ? `${dramas[0]?.title || "export"}_资产表.xlsx`
      : "元气制片_全部资产表.xlsx";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "导出失败" }, { status: 500 });
  }
}
