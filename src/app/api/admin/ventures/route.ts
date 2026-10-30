import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM ventures ORDER BY sort_order ASC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ventures" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    const id = `ven_${Date.now()}`;
    const cleanSlug = (ventureSlug || name.toLowerCase().replace(/[^a-z0-9]/g, "-")).trim();

    const metricsArray = Array.isArray(impactMetrics) ? impactMetrics : [];
    const highlightsArray = Array.isArray(highlights) ? highlights : (typeof highlights === "string" ? highlights.split("\n").filter(Boolean) : []);

    await runQuery(
      `INSERT INTO ventures (
        id, venture_slug, name, acronym, tagline, founded, role, status,
        website_url, description, detailed_story, impact_metrics, featured_image,
        highlights, cta_label, cta_url, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        id,
        cleanSlug,
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
        featuredImage || "/images/lcb-campus-leads-summit.webp",
        JSON.stringify(highlightsArray),
        ctaLabel || null,
        ctaUrl || null,
        Number(sortOrder) || 0,
        isPublished !== false,
      ]
    );

    await logActivity("CREATE", "VENTURE", id, `Created venture: ${name}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Venture create error:", error);
    return NextResponse.json({ error: "Failed to create venture" }, { status: 500 });
  }
}
