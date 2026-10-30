import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM corporate_awards ORDER BY sort_order ASC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch awards" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, organization, year, description, sortOrder, isPublished } = body;

    const id = `awd_${Date.now()}`;

    await runQuery(
      `INSERT INTO corporate_awards (id, title, organization, year, description, sort_order, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        id,
        title,
        organization,
        year,
        description || "",
        Number(sortOrder) || 0,
        isPublished !== false,
      ]
    );

    await logActivity("CREATE", "AWARD", id, `Created award: ${title}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Award create error:", error);
    return NextResponse.json({ error: "Failed to create award" }, { status: 500 });
  }
}
