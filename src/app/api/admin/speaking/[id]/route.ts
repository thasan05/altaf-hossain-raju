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
    const rows = await runQuery("SELECT * FROM speaking_events WHERE id = $1 LIMIT 1", [id]);
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
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

    const topicsArray = Array.isArray(keyTopics) ? keyTopics : (typeof keyTopics === "string" ? keyTopics.split(",").map((s: string) => s.trim()).filter(Boolean) : []);

    await runQuery(
      `UPDATE speaking_events SET
        slug = $1,
        title = $2,
        organizer = $3,
        event_type = $4,
        institution = $5,
        date_text = $6,
        participants = $7,
        description = $8,
        image_url = $9,
        key_topics = $10,
        sort_order = $11,
        is_published = $12,
        updated_at = NOW()
      WHERE id = $13`,
      [
        slug,
        title,
        organizer,
        eventType || "Keynote",
        institution,
        dateText || null,
        participants || null,
        description,
        imageUrl,
        JSON.stringify(topicsArray),
        Number(sortOrder) || 0,
        Boolean(isPublished),
        id,
      ]
    );

    await logActivity("UPDATE", "SPEAKING", id, `Updated event: ${title}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Speaking event update error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
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
    await runQuery("DELETE FROM speaking_events WHERE id = $1", [id]);

    await logActivity("DELETE", "SPEAKING", id, `Deleted speaking event ID: ${id}`, admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Speaking event delete error:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
