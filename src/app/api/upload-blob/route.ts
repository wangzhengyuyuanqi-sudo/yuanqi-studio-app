import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const jsonResponse = await handleUpload({
      body: await request.json(),
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            "image/jpeg", "image/png", "image/webp", "image/gif",
            "application/pdf", "text/plain",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
          maximumSizeInBytes: 25 * 1024 * 1024,
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("upload-blob error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "上传服务异常" },
      { status: 500 }
    );
  }
}
