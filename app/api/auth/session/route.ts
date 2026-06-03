import { NextResponse } from "next/server";
import { PRESENCE_COOKIE_MAX_AGE, PRESENCE_COOKIE_NAME } from "@/lib/auth/presence-cookie";

export async function POST() {
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
