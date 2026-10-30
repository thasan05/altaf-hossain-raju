import { NextResponse } from "next/server";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM media_assets ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}
