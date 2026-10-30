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
    const rows = await runQuery("SELECT * FROM ventures WHERE id = $1 LIMIT 1", [id]);
    if (rows.length === 0) return NextResponse.json({ error: "Venture not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch venture" }, { status: 500 });
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
      ventureSlug,
      name,
      acronym,
      tagline,
      founded,
      role,
      status,
      websiteUrl,
      description,
      detailedStory,
      impactMetrics,
      featuredImage,
      highlights,
      ctaLabel,
      ctaUrl,
      sortOrder,
      isPublished,
    } = body;

    const metricsArray = Array.isArray(impactMetrics) ? impactMetrics : [];
    const highlightsArray = Array.isArray(highlights) ? highlights : (typeof highlights === "string" ? highlights.split("\n").filter(Boolean) : []);

    await runQuery(
      `UPDATE ventures SET
        venture_slug = $1,
        name = $2,
        acronym = $3,
        tagline = $4,
        founded = $5,
        role = $6,
        status = $7,
        website_url = $8,
        description = $9,
        detailed_story = $10,
        impact_metrics = $11,
        featured_image = $12,
        highlights = $13,
        cta_label = $14,
        cta_url = $15,
        sort_order = $16,
        is_published = $17,
        updated_at = NOW()
      WHERE id = $18`,
      [
        ventureSlug,
        name,
        acronym || null,
        tagline,
        founded,
        role,
        status || "Active",
        websiteUrl || null,
        description,
        detailedStory || "",
        JSON.stringify(metricsArray),
        featuredImage,
        JSON.stringify(highlightsArray),
        ctaLabel || null,
        ctaUrl || null,
        Number(sortOrder) || 0,
        Boolean(isPublished),
        id,
      ]
    );

    await logActivity("UPDATE", "VENTURE", id, `Updated venture: ${name}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Venture update error:", error);
    return NextResponse.json({ error: "Failed to update venture" }, { status: 500 });
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
    await runQuery("DELETE FROM ventures WHERE id = $1", [id]);

    await logActivity("DELETE", "VENTURE", id, `Deleted venture ID: ${id}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Venture delete error:", error);
    return NextResponse.json({ error: "Failed to delete venture" }, { status: 500 });
  }
}
