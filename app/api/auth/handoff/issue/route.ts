import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PLATFORM_PRESENCE_COOKIE,
  PRESENCE_COOKIE_NAME,
} from "@/lib/auth/presence-cookie";
import { issueHandoffCode } from "@/lib/platform-auth/handoff-store";
import { childOriginFromReturnTo, safeReturnTo } from "@/lib/platform-auth/safe-return-to";
import { createCustomTokenForUid, verifyFirebaseIdToken } from "@/lib/firebase-admin";

function hasPresence(request: NextRequest): boolean {
  return (
    request.cookies.get(PLATFORM_PRESENCE_COOKIE)?.value === "1" ||
    request.cookies.get(PRESENCE_COOKIE_NAME)?.value === "1"
  );
}

export async function POST(request: NextRequest) {
  if (!hasPresence(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { returnTo?: string; idToken?: string };
  try {
    body = (await request.json()) as { returnTo?: string; idToken?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const idToken = body.idToken?.trim();
  const returnTo = safeReturnTo(body.returnTo, "");
  if (!idToken || !returnTo) {
    return NextResponse.json({ error: "Missing idToken or returnTo" }, { status: 400 });
  }

  const childOrigin = childOriginFromReturnTo(returnTo);
  if (!childOrigin) {
    return NextResponse.json({ error: "Invalid returnTo" }, { status: 400 });
  }

  let customToken: string | undefined;
  try {
    const decoded = await verifyFirebaseIdToken(idToken);
    customToken = await createCustomTokenForUid(decoded.uid);
  } catch {
    // Admin may be unavailable in dev; idToken is still exchanged once for child verify.
  }
  const code = issueHandoffCode(idToken, customToken);

  const callbackUrl = new URL("/auth/callback", childOrigin);
  callbackUrl.searchParams.set("code", code);
  callbackUrl.searchParams.set("returnTo", returnTo);

  return NextResponse.json({ redirectUrl: callbackUrl.toString() });
}
