import { NextResponse } from "next/server";
import { getCurrentAdmin, clearAdminSessionCookie } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function POST() {
  try {
    const admin = await getCurrentAdmin();
    if (admin) {
      await logActivity("LOGOUT", "USER", admin.id, `User ${admin.email} logged out.`, admin.id);
    }
    await clearAdminSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
