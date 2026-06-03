"use client";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseWebApp } from "@/contexts/shared/firebase/web-app";
import type {
  AuthGatewayPort,
  AuthSessionState,
  AuthenticatedUser,
} from "@/contexts/user-management/auth/domain/auth-gateway.port";
import { normalizeClaims } from "@/contexts/user-management/auth/domain/token-claims";
import { mapFirebaseAuthErrorToMessage } from "@/contexts/user-management/auth/infrastructure/map-firebase-auth-error";

function toAuthenticatedUser(u: User | null): AuthenticatedUser | null {
  if (!u) return null;
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoUrl: u.photoURL,
  };
}

async function sessionStateFromUser(u: User | null): Promise<AuthSessionState> {
  const user = toAuthenticatedUser(u);
  if (!u) {
    return { user: null, claims: null };
  }
  const result = await u.getIdTokenResult();
  return {
    user,
    claims: normalizeClaims(result.claims as Record<string, unknown>),
  };
}

class FirebaseAuthGateway implements AuthGatewayPort {
  private get auth() {
    return getAuth(getFirebaseWebApp());
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<void> {
    try {
      await firebaseSignInWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      throw new Error(mapFirebaseAuthErrorToMessage(e));
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(this.auth);
  }

  subscribe(listener: (state: AuthSessionState) => void): () => void {
    return onAuthStateChanged(this.auth, async (u) => {
      listener(await sessionStateFromUser(u));
    });
  }

  async refreshSessionClaims(): Promise<AuthSessionState> {
    return sessionStateFromUser(this.auth.currentUser);
  }

  async getIdToken(): Promise<string | null> {
    const u = this.auth.currentUser;
    if (!u) return null;
    return u.getIdToken();
  }
}

export const firebaseAuthGateway: AuthGatewayPort = new FirebaseAuthGateway();
