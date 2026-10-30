import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM leadership_roles ORDER BY sort_order ASC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch affiliations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { roleTitle, organization, period, sortOrder, isPublished } = body;

    const id = `lead_${Date.now()}`;

    await runQuery(
      `INSERT INTO leadership_roles (id, role_title, organization, period, sort_order, is_published)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        id,
        roleTitle,
        organization,
        period,
        Number(sortOrder) || 0,
        isPublished !== false,
      ]
    );

    await logActivity("CREATE", "AFFILIATION", id, `Created role: ${roleTitle}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Affiliation create error:", error);
    return NextResponse.json({ error: "Failed to create affiliation" }, { status: 500 });
  }
}
