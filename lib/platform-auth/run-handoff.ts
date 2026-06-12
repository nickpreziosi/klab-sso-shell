"use client";

export async function runPlatformHandoff(
  returnTo: string,
  getIdToken: () => Promise<string | null>,
): Promise<void> {
  const idToken = await getIdToken();
  if (!idToken) {
    throw new Error("Could not obtain session token.");
  }

  const res = await fetch("/api/auth/handoff/issue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ returnTo, idToken }),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Handoff failed.");
  }

  const data = (await res.json()) as { redirectUrl?: string };
  if (!data.redirectUrl) {
    throw new Error("Handoff failed.");
  }

  window.location.replace(data.redirectUrl);
}
