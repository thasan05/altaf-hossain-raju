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
    const rows = await runQuery("SELECT * FROM testimonials WHERE id = $1 LIMIT 1", [id]);
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonial" }, { status: 500 });
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
    const { name, role, organization, quote, context, sortOrder, isPublished } = body;

    await runQuery(
      `UPDATE testimonials SET
        name = $1,
        role = $2,
        organization = $3,
        quote = $4,
        context = $5,
        sort_order = $6,
        is_published = $7,
        updated_at = NOW()
      WHERE id = $8`,
      [
        name,
        role,
        organization,
        quote,
        context || "",
        Number(sortOrder) || 0,
        Boolean(isPublished),
        id,
      ]
    );

    await logActivity("UPDATE", "TESTIMONIAL", id, `Updated testimonial by ${name}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Testimonial update error:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
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
    await runQuery("DELETE FROM testimonials WHERE id = $1", [id]);

    await logActivity("DELETE", "TESTIMONIAL", id, `Deleted testimonial ID: ${id}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Testimonial delete error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
