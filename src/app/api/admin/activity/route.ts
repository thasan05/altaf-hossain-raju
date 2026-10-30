import { NextResponse } from "next/server";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    const rows = await runQuery(
      "SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT $1",
      [limit]
    );

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch activity logs" }, { status: 500 });
  }
}
