import { NextResponse } from "next/server";
import { consumeHandoffCode } from "@/lib/platform-auth/handoff-store";

export async function POST(request: Request) {
  let body: { code?: string };
  try {
    body = (await request.json()) as { code?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = body.code?.trim();
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const entry = consumeHandoffCode(code);
  if (!entry) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }

  return NextResponse.json({
    idToken: entry.idToken,
    customToken: entry.customToken,
  });
}
