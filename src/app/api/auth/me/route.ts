import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      authenticated: true,
      user: admin,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: "Failed to check session" }, { status: 500 });
  }
}
