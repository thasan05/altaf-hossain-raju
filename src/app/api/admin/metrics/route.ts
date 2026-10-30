import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM impact_metrics ORDER BY sort_order ASC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    const id = `metric_${Date.now()}`;
    const cleanKey = (metricKey || label.toLowerCase().replace(/[^a-z0-9]/g, "-")).trim();

    await runQuery(
      `INSERT INTO impact_metrics (
        id, metric_key, value, number_value, suffix, label, description,
        verification_source, category, is_primary, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        id,
        cleanKey,
        value,
        Number(numberValue) || 0,
        suffix || "",
        label,
        description || "",
        verificationSource || "",
        category || "Operational",
        Boolean(isPrimary),
        Number(sortOrder) || 0,
        isPublished !== false,
      ]
    );

    await logActivity("CREATE", "METRIC", id, `Created metric: ${label}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Metric create error:", error);
    return NextResponse.json({ error: "Failed to create metric" }, { status: 500 });
  }
}
