import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
    const rows = await runQuery("SELECT * FROM areas_of_expertise WHERE id = $1 LIMIT 1", [id]);
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch domain" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { title, tier, description, competencies, sortOrder, isPublished } = body;

    const compArray = Array.isArray(competencies) ? competencies : (typeof competencies === "string" ? competencies.split(",").map((s: string) => s.trim()).filter(Boolean) : []);

    await runQuery(
      `UPDATE areas_of_expertise SET
        title = $1,
        tier = $2,
        description = $3,
        competencies = $4,
        sort_order = $5,
        is_published = $6,
        updated_at = NOW()
      WHERE id = $7`,
      [
        title,
        tier || "secondary",
        description,
        JSON.stringify(compArray),
        Number(sortOrder) || 0,
        Boolean(isPublished),
        id,
      ]
    );

    await logActivity("UPDATE", "EXPERTISE", id, `Updated domain: ${title}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Expertise update error:", error);
    return NextResponse.json({ error: "Failed to update domain" }, { status: 500 });
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
    await runQuery("DELETE FROM areas_of_expertise WHERE id = $1", [id]);

    await logActivity("DELETE", "EXPERTISE", id, `Deleted domain ID: ${id}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Expertise delete error:", error);
    return NextResponse.json({ error: "Failed to delete domain" }, { status: 500 });
  }
}
