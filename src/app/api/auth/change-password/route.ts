import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentAdmin } from "@/lib/auth";
import { runQuery } from "@/lib/db";
import { logActivity } from "@/lib/dal";

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (String(newPassword).length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Fetch user hash
    const users = await runQuery(
      "SELECT id, password_hash FROM admin_users WHERE id = $1 LIMIT 1",
      [admin.id]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];
    const isCurrentValid = await bcrypt.compare(String(currentPassword), user.password_hash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(String(newPassword), 10);
    await runQuery(
      "UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [newHash, admin.id]
    );

    await logActivity("UPDATE", "USER", admin.id, "Password updated successfully.", admin.id);

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }
}
