"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Legacy URL — redirect to shell login (the only login entry point). */
export function AuthHandoffView() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}
