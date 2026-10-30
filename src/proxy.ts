import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "cms_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.CMS_JWT_SECRET || "default_super_secret_jwt_key_altaf_hossain_raju_2026_x1y2z3"
);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    let isValid = false;

    if (sessionToken) {
      try {
        const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
        if (payload.id && payload.email) {
          isValid = true;
        }
      } catch {
        isValid = false;
      }
    }

    // If visiting login page while already authenticated, redirect to /admin dashboard
    if (pathname === "/admin/login") {
      if (isValid) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // For all other /admin routes, require authentication
    if (!isValid) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /api/admin routes
  if (pathname.startsWith("/api/admin")) {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    let isValid = false;

    if (sessionToken) {
      try {
        const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
        if (payload.id && payload.email) {
          isValid = true;
        }
      } catch {
        isValid = false;
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized access to administrative API." }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
