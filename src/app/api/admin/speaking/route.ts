import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM speaking_events ORDER BY sort_order ASC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch speaking events" }, { status: 500 });
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
      organizer,
      eventType,
      institution,
      dateText,
      participants,
      description,
      imageUrl,
      keyTopics,
      sortOrder,
      isPublished,
    } = body;

    const id = `spk_${Date.now()}`;
    const cleanSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]/g, "-")).trim();
    const topicsArray = Array.isArray(keyTopics) ? keyTopics : (typeof keyTopics === "string" ? keyTopics.split(",").map((s: string) => s.trim()).filter(Boolean) : []);

    await runQuery(
      `INSERT INTO speaking_events (
        id, slug, title, organizer, event_type, institution, date_text,
        participants, description, image_url, key_topics, sort_order, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        id,
        cleanSlug,
        title,
        organizer,
        eventType || "Keynote",
        institution,
        dateText || null,
        participants || null,
        description,
        imageUrl || "/images/lcb-campus-workshop.webp",
        JSON.stringify(topicsArray),
        Number(sortOrder) || 0,
        isPublished !== false,
      ]
    );

    await logActivity("CREATE", "SPEAKING", id, `Created event: ${title}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Speaking event create error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
