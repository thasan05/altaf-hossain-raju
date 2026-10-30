import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "general";
    const customAlt = (formData.get("altText") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" is not supported. Please upload an image (JPG, PNG, WebP, SVG) or PDF.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 10MB maximum limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe unique filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}-${safeName}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadsDir, { recursive: true });
    const targetPath = path.join(uploadsDir, uniqueFileName);
    await writeFile(targetPath, buffer);

    const publicPath = `/uploads/${uniqueFileName}`;
    const assetId = `asset_${Date.now()}`;
    const altText = customAlt || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

    await runQuery(
      `INSERT INTO media_assets (id, file_name, file_path, file_size, mime_type, alt_text, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        assetId,
        uniqueFileName,
        publicPath,
        file.size,
        file.type,
        altText,
        category,
      ]
    );

    await logActivity("UPLOAD", "MEDIA", assetId, `Uploaded media asset: ${uniqueFileName}`, admin.id);

    return NextResponse.json({
      success: true,
      asset: {
        id: assetId,
        fileName: uniqueFileName,
        filePath: publicPath,
        fileSize: file.size,
        mimeType: file.type,
        altText,
        category,
      },
    });
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
