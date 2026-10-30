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
    const rows = await runQuery("SELECT * FROM media_features WHERE id = $1 LIMIT 1", [id]);
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coverage" }, { status: 500 });
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

    await runQuery(
      `UPDATE media_features SET
        slug = $1,
        title = $2,
        outlet = $3,
        date_text = $4,
        category = $5,
        summary = $6,
        link_text = $7,
        url = $8,
        highlight_quote = $9,
        sort_order = $10,
        is_published = $11,
        updated_at = NOW()
      WHERE id = $12`,
      [
        slug,
        title,
        outlet,
        dateText,
        category || "National Print Media",
        summary || "",
        linkText || "Read Coverage",
        url,
        highlightQuote || null,
        Number(sortOrder) || 0,
        Boolean(isPublished),
        id,
      ]
    );

    await logActivity("UPDATE", "MEDIA_PRESS", id, `Updated coverage: ${title}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media press update error:", error);
    return NextResponse.json({ error: "Failed to update coverage" }, { status: 500 });
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
    await runQuery("DELETE FROM media_features WHERE id = $1", [id]);

    await logActivity("DELETE", "MEDIA_PRESS", id, `Deleted media press ID: ${id}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media press delete error:", error);
    return NextResponse.json({ error: "Failed to delete media press" }, { status: 500 });
  }
}
