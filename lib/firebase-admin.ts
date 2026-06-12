import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getFirebaseAdminApp(): App | null {
  if (getApps().length > 0) return getApps()[0]!;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson) as Record<string, string>;
      return initializeApp({
        credential: cert(serviceAccount),
        projectId,
      });
    } catch {
      return null;
    }
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({ projectId });
  }

  return null;
}

export async function verifyFirebaseIdToken(idToken: string) {
  const app = getFirebaseAdminApp();
  if (!app) throw new Error("Firebase Admin is not configured");
  return getAuth(app).verifyIdToken(idToken);
}

export async function createCustomTokenForUid(uid: string): Promise<string | undefined> {
  const app = getFirebaseAdminApp();
  if (!app) return undefined;
  return getAuth(app).createCustomToken(uid);
}
