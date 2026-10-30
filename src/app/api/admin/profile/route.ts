import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM site_profile WHERE id = 'default' LIMIT 1");
    if (rows.length === 0) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const p = rows[0];
    let bio: string[] = [];
    if (p.executive_bio_paragraphs) {
      bio = typeof p.executive_bio_paragraphs === "string" ? JSON.parse(p.executive_bio_paragraphs) : p.executive_bio_paragraphs;
    }

    return NextResponse.json({
      fullName: p.full_name,
      displayName: p.display_name,
      shortName: p.short_name,
      initials: p.initials,
      honorificSuffix: p.honorific_suffix,
      heroHeadline: p.hero_headline,
      heroSubheadline: p.hero_subheadline,
      heroNarrativeBio: p.hero_narrative_bio,
      executiveBio: bio,
      philosophy: p.philosophy_quote,
      portraitMainUrl: p.portrait_main_url,
      portraitCorporateUrl: p.portrait_corporate_url,
      updatedAt: p.updated_at,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const {
      fullName,
      displayName,
      shortName,
      initials,
      honorificSuffix,
      heroHeadline,
      heroSubheadline,
      heroNarrativeBio,
      executiveBio,
      philosophy,
      portraitMainUrl,
      portraitCorporateUrl,
    } = body;

    const bioArray = Array.isArray(executiveBio) ? executiveBio : (typeof executiveBio === "string" ? [executiveBio] : []);

    await runQuery(
      `UPDATE site_profile SET
        full_name = $1,
        display_name = $2,
        short_name = $3,
        initials = $4,
        honorific_suffix = $5,
        hero_headline = $6,
        hero_subheadline = $7,
        hero_narrative_bio = $8,
        executive_bio_paragraphs = $9,
        philosophy_quote = $10,
        portrait_main_url = $11,
        portrait_corporate_url = $12,
        updated_at = NOW()
      WHERE id = 'default'`,
      [
        fullName,
        displayName,
        shortName,
        initials,
        honorificSuffix || "PMP®",
        heroHeadline,
        heroSubheadline,
        heroNarrativeBio,
        JSON.stringify(bioArray),
        philosophy,
        portraitMainUrl,
        portraitCorporateUrl,
      ]
    );

    await logActivity("UPDATE", "PROFILE", "default", "Updated site profile and biography.", admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, message: "Profile updated successfully." });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
