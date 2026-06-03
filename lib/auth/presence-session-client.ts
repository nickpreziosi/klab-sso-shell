"use client";

/** Tells the server to set the httpOnly presence cookie (no token; no Firebase on server). */
export async function setPresenceSession(): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Session failed (${res.status})`);
  }
}

export async function clearPresenceSession(): Promise<void> {
  await fetch("/api/auth/session", {
    method: "DELETE",
    credentials: "include",
  });
}
