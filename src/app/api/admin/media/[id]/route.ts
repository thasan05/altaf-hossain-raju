import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const rows = await runQuery("SELECT * FROM media_assets WHERE id = $1 LIMIT 1", [id]);
    if (rows.length === 0) return NextResponse.json({ error: "Media not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media asset" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const rows = await runQuery("SELECT * FROM media_assets WHERE id = $1 LIMIT 1", [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
    }

    const asset = rows[0];

    // Delete from DB
    await runQuery("DELETE FROM media_assets WHERE id = $1", [id]);

    // If file is in /uploads/, remove from disk
    if (asset.file_path && asset.file_path.startsWith("/uploads/")) {
      const diskPath = path.join(process.cwd(), "public", asset.file_path);
      try {
        await unlink(diskPath);
      } catch (err) {
        console.warn("Could not delete file from disk:", diskPath, err);
      }
    }

    await logActivity("DELETE", "MEDIA", id, `Deleted media asset: ${asset.file_name}`, admin.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media delete error:", error);
    return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 });
  }
}
