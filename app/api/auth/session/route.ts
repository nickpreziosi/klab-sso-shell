import { NextResponse } from "next/server";
import {
  PLATFORM_PRESENCE_COOKIE,
  PRESENCE_COOKIE_NAME,
} from "@/lib/auth/presence-cookie";
import {
  clearHostOnlyPresenceCookie,
  clearPlatformPresenceCookie,
  setHostOnlyPresenceCookie,
  setPlatformPresenceCookie,
} from "@/lib/platform-auth/cookie-options";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  setPlatformPresenceCookie(res, PLATFORM_PRESENCE_COOKIE);
  setHostOnlyPresenceCookie(res, PRESENCE_COOKIE_NAME);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearPlatformPresenceCookie(res, PLATFORM_PRESENCE_COOKIE);
  clearHostOnlyPresenceCookie(res, PRESENCE_COOKIE_NAME);
  return res;
}
