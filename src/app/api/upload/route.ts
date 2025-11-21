import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import tinify from "tinify";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

if (process.env.TINIFY_API_KEY) {
  tinify.key = process.env.TINIFY_API_KEY;
}

export async function POST(request: Request) {
  if (!process.env.TINIFY_API_KEY) {
    return NextResponse.json(
      { error: "Konfigurasi TINIFY_API_KEY belum tersedia." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Berkas tidak ditemukan dalam permintaan." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Format gambar harus JPG, PNG, atau WEBP." },
        { status: 415 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    if (!originalBuffer.length) {
      return NextResponse.json(
        { error: "Gagal membaca isi gambar." },
        { status: 400 }
      );
    }

    const compressed = await tinify.fromBuffer(originalBuffer).toBuffer();

    const contentType = file.type || "application/octet-stream";
    const extension = EXTENSION_BY_TYPE[contentType] ?? "bin";
    const baseName = file.name
      ? file.name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9_-]/gi, "-")
      : "gambar";
    const objectKey = `uploads/${new Date().toISOString().slice(0, 10)}/${baseName}-${randomUUID()}.${extension}`;

    const blob = await put(objectKey, compressed, {
      access: "public",
      contentType,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });

    // Generate URL untuk halaman tampilan gambar
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const viewUrl = `${baseUrl}/p/${objectKey.split('/').pop()}`;

    return NextResponse.json({
      url: viewUrl,  // Gunakan URL halaman tampilan, bukan URL blob langsung
      blobUrl: blob.url,  // Sertakan juga URL blob untuk referensi
      size: compressed.length,
      originalSize: originalBuffer.length,
    });
  } catch (error) {
    console.error("Upload gagal:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat memproses gambar.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
