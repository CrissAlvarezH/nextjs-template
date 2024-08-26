"use server";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { rgbaToDataURL } from "thumbhash";

export async function streamImageFromUrl(url: string) {
  const fetchResponse = await fetch(url);

  if (!fetchResponse.ok) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const file = fetchResponse.body;

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const contentType = fetchResponse.headers.get("content-type") || "image/*";
  const contentLength =
    Number(fetchResponse.headers.get("content-length")) || 0;

  const stream = new ReadableStream({
    start(controller) {
      const reader = file.getReader();
      const pump = () => {
        reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
          pump();
        });
      };
      pump();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(contentLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function generateThumbnailHash(file: File) {
  const buffer = await file.arrayBuffer();
  const thumbnailBuffer = await sharp(Buffer.from(buffer))
    .raw()
    .ensureAlpha()
    .resize(2)
    .toBuffer({ resolveWithObject: true });

  return rgbaToDataURL(
    thumbnailBuffer.info.width,
    thumbnailBuffer.info.height,
    thumbnailBuffer.data,
  );
}
