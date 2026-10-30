import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { runQuery } from "@/lib/db";
import { signAdminToken, setAdminSessionCookie } from "@/lib/auth";
import { logActivity } from "@/lib/dal";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Look up user
    const users = await runQuery(
      "SELECT id, email, password_hash, name, role FROM admin_users WHERE LOWER(email) = $1 LIMIT 1",
      [cleanEmail]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = users[0];
    const passwordValid = await bcrypt.compare(String(password), user.password_hash);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Update last login
    await runQuery(
      "UPDATE admin_users SET last_login_at = NOW() WHERE id = $1",
      [user.id]
    );

    // Sign session token
    const token = await signAdminToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setAdminSessionCookie(token);

    await logActivity("LOGIN", "USER", user.id, `User ${user.email} logged in.`, user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
