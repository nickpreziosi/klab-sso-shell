import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const app =
  getApps().length === 0
    ? initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID! })
    : getApps()[0];

export const adminAuth = getAuth(app);
