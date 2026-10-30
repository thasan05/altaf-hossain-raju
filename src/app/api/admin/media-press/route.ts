import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM media_features ORDER BY sort_order ASC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media coverage" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const {
      slug,
      title,
      outlet,
      dateText,
      category,
      summary,
      linkText,
      url,
      highlightQuote,
      sortOrder,
      isPublished,
    } = body;

    const id = `med_${Date.now()}`;
    const cleanSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]/g, "-")).trim();

    await runQuery(
      `INSERT INTO media_features (
        id, slug, title, outlet, date_text, category, summary, link_text,
        url, highlight_quote, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        id,
        cleanSlug,
        title,
        outlet,
        dateText,
        category || "National Print Media",
        summary || "",
        linkText || "Read Coverage",
        url,
        highlightQuote || null,
        Number(sortOrder) || 0,
        isPublished !== false,
      ]
    );

    await logActivity("CREATE", "MEDIA_PRESS", id, `Created coverage: ${title}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Media press create error:", error);
    return NextResponse.json({ error: "Failed to create media press" }, { status: 500 });
  }
}
