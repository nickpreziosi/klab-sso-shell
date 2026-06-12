import { HANDOFF_CODE_TTL_MS } from "@/lib/platform-auth/constants";
import { randomBytes } from "crypto";

type HandoffEntry = {
  idToken: string;
  customToken?: string;
  expiresAt: number;
};

const store = new Map<string, HandoffEntry>();

function pruneExpired(): void {
  const now = Date.now();
  for (const [code, entry] of store) {
    if (entry.expiresAt <= now) store.delete(code);
  }
}

export function issueHandoffCode(idToken: string, customToken?: string): string {
  pruneExpired();
  const code = randomBytes(24).toString("base64url");
  store.set(code, {
    idToken,
    customToken,
    expiresAt: Date.now() + HANDOFF_CODE_TTL_MS,
  });
  return code;
}

export function consumeHandoffCode(code: string): HandoffEntry | null {
  pruneExpired();
  const entry = store.get(code);
  if (!entry || entry.expiresAt <= Date.now()) {
    store.delete(code);
    return null;
  }
  store.delete(code);
  return entry;
}
