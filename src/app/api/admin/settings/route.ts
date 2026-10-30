import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM site_customization WHERE id = 'default' LIMIT 1");
    if (rows.length === 0) return NextResponse.json({ error: "Settings not found" }, { status: 404 });

    const s = rows[0];
    let keywords: string[] = [];
    if (s.keywords) {
      keywords = typeof s.keywords === "string" ? JSON.parse(s.keywords) : s.keywords;
    }

    return NextResponse.json({
      siteTitle: s.site_title,
      metaDescription: s.meta_description,
      keywords,
      ogImageUrl: s.og_image_url,
      canonicalUrl: s.canonical_url,
      accentColor: s.accent_color,
      backgroundColor: s.background_color,
      surfaceColor: s.surface_color,
      updatedAt: s.updated_at,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const {
      siteTitle,
      metaDescription,
      keywords,
      ogImageUrl,
      canonicalUrl,
      accentColor,
      backgroundColor,
      surfaceColor,
    } = body;

    const keywordsArray = Array.isArray(keywords) 
      ? keywords 
      : (typeof keywords === "string" ? keywords.split(",").map((s: string) => s.trim()).filter(Boolean) : []);

    await runQuery(
      `UPDATE site_customization SET
        site_title = $1,
        meta_description = $2,
        keywords = $3,
        og_image_url = $4,
        canonical_url = $5,
        accent_color = $6,
        background_color = $7,
        surface_color = $8,
        updated_at = NOW()
      WHERE id = 'default'`,
      [
        siteTitle,
        metaDescription,
        JSON.stringify(keywordsArray),
        ogImageUrl,
        canonicalUrl,
        accentColor || "#D4AF37",
        backgroundColor || "#070A11",
        surfaceColor || "#0C111C",
      ]
    );

    await logActivity("UPDATE", "SETTINGS", "default", "Updated site customization and SEO settings.", admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, message: "Settings updated successfully." });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
