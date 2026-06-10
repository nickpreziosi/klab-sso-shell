import { NextResponse } from "next/server";
import { PRESENCE_COOKIE_MAX_AGE, PRESENCE_COOKIE_NAME } from "@/lib/auth/presence-cookie";
import { adminAuth } from "@/lib/auth/admin-auth";

export async function POST(req: Request) {
  const token = req.headers.get("x-firebase-token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }
  try {
    await adminAuth.verifyIdToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(PRESENCE_COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: PRESENCE_COOKIE_MAX_AGE,
    secure,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(PRESENCE_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure,
  });
  return res;
}
