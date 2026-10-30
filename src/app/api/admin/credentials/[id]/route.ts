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
    const rows = await runQuery("SELECT * FROM credentials WHERE id = $1 LIMIT 1", [id]);
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch credential" }, { status: 500 });
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
      institution,
      periodOrYear,
      status,
      field,
      logoUrl,
      details,
      verificationNote,
      isPremier,
      sortOrder,
      isPublished,
    } = body;

    await runQuery(
      `UPDATE credentials SET
        slug = $1,
        title = $2,
        institution = $3,
        period_or_year = $4,
        status = $5,
        field = $6,
        logo_url = $7,
        details = $8,
        verification_note = $9,
        is_premier = $10,
        sort_order = $11,
        is_published = $12,
        updated_at = NOW()
      WHERE id = $13`,
      [
        slug,
        title,
        institution,
        periodOrYear,
        status || "Completed",
        field,
        logoUrl || null,
        details || "",
        verificationNote || "",
        Boolean(isPremier),
        Number(sortOrder) || 0,
        Boolean(isPublished),
        id,
      ]
    );

    await logActivity("UPDATE", "CREDENTIAL", id, `Updated credential: ${title}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Credential update error:", error);
    return NextResponse.json({ error: "Failed to update credential" }, { status: 500 });
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
    await runQuery("DELETE FROM credentials WHERE id = $1", [id]);

    await logActivity("DELETE", "CREDENTIAL", id, `Deleted credential ID: ${id}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Credential delete error:", error);
    return NextResponse.json({ error: "Failed to delete credential" }, { status: 500 });
  }
}
