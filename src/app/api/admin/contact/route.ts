import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runQuery } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rows = await runQuery("SELECT * FROM site_contact WHERE id = 'default' LIMIT 1");
    if (rows.length === 0) return NextResponse.json({ error: "Contact not found" }, { status: 404 });

    const c = rows[0];
    return NextResponse.json({
      email: c.email,
      phone: c.phone,
      secondaryPhone: c.secondary_phone,
      address: c.address,
      origin: c.origin,
      linkedinUrl: c.linkedin_url,
      lcbWebsiteUrl: c.lcb_website_url,
      whatsappNumber: c.whatsapp_number,
      updatedAt: c.updated_at,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact details" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const {
      email,
      phone,
      secondaryPhone,
      address,
      origin,
      linkedinUrl,
      lcbWebsiteUrl,
      whatsappNumber,
    } = body;

    await runQuery(
      `UPDATE site_contact SET
        email = $1,
        phone = $2,
        secondary_phone = $3,
        address = $4,
        origin = $5,
        linkedin_url = $6,
        lcb_website_url = $7,
        whatsapp_number = $8,
        updated_at = NOW()
      WHERE id = 'default'`,
      [
        email,
        phone,
        secondaryPhone || null,
        address,
        origin,
        linkedinUrl,
        lcbWebsiteUrl,
        whatsappNumber,
      ]
    );

    await logActivity("UPDATE", "CONTACT", "default", "Updated site contact channels.", admin.id);
    revalidatePath("/");

    return NextResponse.json({ success: true, message: "Contact channels updated successfully." });
  } catch (error) {
    console.error("Contact update error:", error);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}
