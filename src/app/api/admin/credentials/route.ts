import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM credentials ORDER BY sort_order ASC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 });
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

    const id = `cred_${Date.now()}`;
    const cleanSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]/g, "-")).trim();

    await runQuery(
      `INSERT INTO credentials (
        id, slug, title, institution, period_or_year, status, field,
        logo_url, details, verification_note, is_premier, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        id,
        cleanSlug,
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
        isPublished !== false,
      ]
    );

    await logActivity("CREATE", "CREDENTIAL", id, `Created credential: ${title}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Credential create error:", error);
    return NextResponse.json({ error: "Failed to create credential" }, { status: 500 });
  }
}
