"use client";

import { getAuth } from "firebase/auth";
import { getFirebaseWebApp } from "@/contexts/shared/firebase/web-app";

/** Tells the server to set the httpOnly presence cookie, verified against a Firebase ID token. */
export async function setPresenceSession(): Promise<void> {
  const token = await getAuth(getFirebaseWebApp()).currentUser?.getIdToken();
  if (!token) throw new Error("No authenticated user");
  const res = await fetch("/api/auth/session", {
    method: "POST",
    credentials: "include",
    headers: { "x-firebase-token": token },
  });
  if (!res.ok) {
    let message = `Session failed (${res.status})`;
    try {
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const json = await res.json();
        message = json?.error ?? message;
      }
    } catch {
      // ignore parse errors; use default message
    }
    throw new Error(message);
  }
}

export async function clearPresenceSession(): Promise<void> {
  await fetch("/api/auth/session", {
    method: "DELETE",
    credentials: "include",
  });
}
