import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM areas_of_expertise ORDER BY sort_order ASC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expertise" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, tier, description, competencies, sortOrder, isPublished } = body;

    const id = `exp_${Date.now()}`;
    const compArray = Array.isArray(competencies) ? competencies : (typeof competencies === "string" ? competencies.split(",").map((s: string) => s.trim()).filter(Boolean) : []);

    await runQuery(
      `INSERT INTO areas_of_expertise (id, title, tier, description, competencies, sort_order, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        id,
        title,
        tier || "secondary",
        description,
        JSON.stringify(compArray),
        Number(sortOrder) || 0,
        isPublished !== false,
      ]
    );

    await logActivity("CREATE", "EXPERTISE", id, `Created domain: ${title}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Expertise create error:", error);
    return NextResponse.json({ error: "Failed to create expertise" }, { status: 500 });
  }
}
