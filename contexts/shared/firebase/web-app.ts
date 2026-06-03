"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirebaseWebOptions } from "@/contexts/shared/firebase/web-config";

let app: FirebaseApp | undefined;

/** Singleton Firebase web app for the browser. */
export function getFirebaseWebApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase Web SDK is browser-only.");
  }
  if (!app) {
    app = getApps().length > 0 ? getApps()[0]! : initializeApp(getFirebaseWebOptions());
  }
  return app;
}
