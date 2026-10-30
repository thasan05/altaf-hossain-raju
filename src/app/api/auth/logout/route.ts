import { NextResponse } from "next/server";
import { getCurrentAdmin, clearAdminSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function POST() {
  try {
    const admin = await getCurrentAdmin();
    if (admin) {
      try {
        await logActivity("LOGOUT", "USER", admin.id, `User ${admin.email} logged out.`, admin.id);
      } catch (logErr) {
        console.warn("Logout activity log warning:", logErr);
      }
    }
    try {
      await clearAdminSessionCookie();
    } catch (cookieErr) {
      console.warn("Clear cookie warning:", cookieErr);
    }
    const response = NextResponse.json({ success: true });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
