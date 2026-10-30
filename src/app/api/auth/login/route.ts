import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { runQuery } from "@/lib/db";
import { signAdminToken, setAdminSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth";
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

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "DATABASE_URL is not configured in environment variables. Please add it to your hosting settings." },
        { status: 503 }
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

    // Sign session token
    const token = await signAdminToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    try {
      await setAdminSessionCookie(token);
    } catch (cookieErr) {
      console.warn("setAdminSessionCookie warning:", cookieErr);
    }

    // Optional updates - never block login
    try {
      await runQuery(
        "UPDATE admin_users SET last_login_at = NOW() WHERE id = $1",
        [user.id]
      );
      await logActivity("LOGIN", "USER", user.id, `User ${user.email} logged in.`, user.id);
    } catch (auditErr) {
      console.warn("Audit/last_login update warning:", auditErr);
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Explicitly set cookie on response header for serverless compatibility
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    const message = error?.message || "An unexpected error occurred during authentication.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
