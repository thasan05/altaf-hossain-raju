import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM career_roles ORDER BY sort_order ASC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch career roles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    const id = `role_${Date.now()}`;
    const cleanSlug = (roleSlug || `${company}-${roleTitle}`.toLowerCase().replace(/[^a-z0-9]/g, "-")).trim();

    const respArray = Array.isArray(keyResponsibilities) 
      ? keyResponsibilities 
      : (typeof keyResponsibilities === "string" ? keyResponsibilities.split("\n").filter(Boolean) : []);

    const achArray = Array.isArray(achievements)
      ? achievements
      : (typeof achievements === "string" ? achievements.split("\n").filter(Boolean) : []);

    await runQuery(
      `INSERT INTO career_roles (
        id, role_slug, company, role_title, period, location, cluster, role_type,
        company_filter, logo_url, key_responsibilities, achievements, industry_context,
        sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        id,
        cleanSlug,
        company,
        roleTitle,
        period,
        location,
        cluster || null,
        roleType || "previous",
        companyFilter || "marico",
        logoUrl || "/logos/marico-logo.png",
        JSON.stringify(respArray),
        JSON.stringify(achArray),
        industryContext || "",
        Number(sortOrder) || 0,
        isPublished !== false,
      ]
    );

    await logActivity("CREATE", "CAREER_ROLE", id, `Added role: ${roleTitle} at ${company}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Career role create error:", error);
    return NextResponse.json({ error: "Failed to create career role" }, { status: 500 });
  }
}
