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
    const rows = await runQuery("SELECT * FROM impact_metrics WHERE id = $1 LIMIT 1", [id]);
    if (rows.length === 0) return NextResponse.json({ error: "Metric not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch metric" }, { status: 500 });
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
      metricKey,
      value,
      numberValue,
      suffix,
      label,
      description,
      verificationSource,
      category,
      isPrimary,
      sortOrder,
      isPublished,
    } = body;

    await runQuery(
      `UPDATE impact_metrics SET
        metric_key = $1,
        value = $2,
        number_value = $3,
        suffix = $4,
        label = $5,
        description = $6,
        verification_source = $7,
        category = $8,
        is_primary = $9,
        sort_order = $10,
        is_published = $11,
        updated_at = NOW()
      WHERE id = $12`,
      [
        metricKey,
        value,
        Number(numberValue) || 0,
        suffix || "",
        label,
        description || "",
        verificationSource || "",
        category || "Operational",
        Boolean(isPrimary),
        Number(sortOrder) || 0,
        Boolean(isPublished),
        id,
      ]
    );

    await logActivity("UPDATE", "METRIC", id, `Updated metric: ${label}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Metric update error:", error);
    return NextResponse.json({ error: "Failed to update metric" }, { status: 500 });
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
    await runQuery("DELETE FROM impact_metrics WHERE id = $1", [id]);

    await logActivity("DELETE", "METRIC", id, `Deleted metric ID: ${id}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Metric delete error:", error);
    return NextResponse.json({ error: "Failed to delete metric" }, { status: 500 });
  }
}
