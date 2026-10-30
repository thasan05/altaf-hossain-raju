import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM section_settings ORDER BY sort_order ASC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch section settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { sections } = body;

    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: "Sections must be an array" }, { status: 400 });
    }

    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      await runQuery(
        `UPDATE section_settings SET
          label = $1,
          is_visible = $2,
          sort_order = $3,
          custom_title = $4,
          custom_subtitle = $5,
          updated_at = NOW()
        WHERE id = $6`,
        [
          s.label,
          Boolean(s.is_visible),
          i + 1,
          s.custom_title || null,
          s.custom_subtitle || null,
          s.id,
        ]
      );
    }

    await logActivity("UPDATE", "SECTIONS", "all", `Updated layout order and visibility for ${sections.length} sections.`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, message: "Section layout updated successfully." });
  } catch (error) {
    console.error("Sections update error:", error);
    return NextResponse.json({ error: "Failed to update sections" }, { status: 500 });
  }
}
