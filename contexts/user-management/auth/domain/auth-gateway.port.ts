import type { AuthTokenClaims } from "./token-claims";

/** Signed-in user as seen by the app (no Firebase types). */
export interface AuthenticatedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
}

export interface AuthSessionState {
  user: AuthenticatedUser | null;
  claims: AuthTokenClaims | null;
}

/**
 * Auth boundary for the user-management context. Infrastructure (e.g. Firebase) implements this.
 */
export interface AuthGatewayPort {
  signInWithEmailAndPassword(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  subscribe(listener: (state: AuthSessionState) => void): () => void;
  refreshSessionClaims(): Promise<AuthSessionState>;
  /** Current Firebase ID token for `Authorization: Bearer`, or null if signed out. */
  getIdToken(): Promise<string | null>;
}
