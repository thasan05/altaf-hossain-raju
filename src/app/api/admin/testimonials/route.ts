import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM testimonials ORDER BY sort_order ASC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, role, organization, quote, context, sortOrder, isPublished } = body;

    const id = `tst_${Date.now()}`;

    await runQuery(
      `INSERT INTO testimonials (id, name, role, organization, quote, context, sort_order, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        id,
        name,
        role,
        organization,
        quote,
        context || "",
        Number(sortOrder) || 0,
        isPublished !== false,
      ]
    );

    await logActivity("CREATE", "TESTIMONIAL", id, `Created testimonial by ${name}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Testimonial create error:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
