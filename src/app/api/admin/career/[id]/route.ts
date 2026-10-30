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
    const rows = await runQuery("SELECT * FROM career_roles WHERE id = $1 LIMIT 1", [id]);
    if (rows.length === 0) return NextResponse.json({ error: "Role not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch career role" }, { status: 500 });
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
    const {
      roleSlug,
      company,
      roleTitle,
      period,
      location,
      cluster,
      roleType,
      companyFilter,
      logoUrl,
      keyResponsibilities,
      achievements,
      industryContext,
      sortOrder,
      isPublished,
    } = body;

    const respArray = Array.isArray(keyResponsibilities) 
      ? keyResponsibilities 
      : (typeof keyResponsibilities === "string" ? keyResponsibilities.split("\n").filter(Boolean) : []);

    const achArray = Array.isArray(achievements)
      ? achievements
      : (typeof achievements === "string" ? achievements.split("\n").filter(Boolean) : []);

    await runQuery(
      `UPDATE career_roles SET
        role_slug = $1,
        company = $2,
        role_title = $3,
        period = $4,
        location = $5,
        cluster = $6,
        role_type = $7,
        company_filter = $8,
        logo_url = $9,
        key_responsibilities = $10,
        achievements = $11,
        industry_context = $12,
        sort_order = $13,
        is_published = $14,
        updated_at = NOW()
      WHERE id = $15`,
      [
        roleSlug,
        company,
        roleTitle,
        period,
        location,
        cluster || null,
        roleType || "previous",
        companyFilter || "marico",
        logoUrl,
        JSON.stringify(respArray),
        JSON.stringify(achArray),
        industryContext || "",
        Number(sortOrder) || 0,
        Boolean(isPublished),
        id,
      ]
    );

    await logActivity("UPDATE", "CAREER_ROLE", id, `Updated role: ${roleTitle} at ${company}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Career role update error:", error);
    return NextResponse.json({ error: "Failed to update career role" }, { status: 500 });
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
    await runQuery("DELETE FROM career_roles WHERE id = $1", [id]);

    await logActivity("DELETE", "CAREER_ROLE", id, `Deleted career role ID: ${id}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Career role delete error:", error);
    return NextResponse.json({ error: "Failed to delete career role" }, { status: 500 });
  }
}
