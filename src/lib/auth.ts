import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.CMS_JWT_SECRET || "default_super_secret_jwt_key_altaf_hossain_raju_2026_x1y2z3"
);

export const SESSION_COOKIE_NAME = "cms_session";

export interface AdminSessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Sign a JWT token for the admin user
 */
export async function signAdminToken(user: AdminSessionUser): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verify a JWT session token
 */
export async function verifyAdminToken(
  token: string
): Promise<AdminSessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.id || !payload.email) {
      return null;
    }
    return {
      id: String(payload.id),
      email: String(payload.email),
      name: String(payload.name || "Administrator"),
      role: String(payload.role || "superadmin"),
    };
  } catch {
    return null;
  }
}

/**
 * Get currently authenticated admin user from cookies
 */
export async function getCurrentAdmin(): Promise<AdminSessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

/**
 * Set HTTP-only secure cookie for the admin session
 */
export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear admin session cookie
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
