"use client";

import { firebaseAuthGateway } from "@/contexts/user-management/auth/infrastructure/firebase-auth-gateway";
import { AuthSessionService } from "@/contexts/user-management/auth/application/auth-session.service";
import { SignInWithEmailPasswordService } from "@/contexts/user-management/auth/application/sign-in-with-email-password.service";
import { clearPresenceSession, setPresenceSession } from "@/lib/auth/presence-session-client";

export function createAuthSessionService(): AuthSessionService {
  return new AuthSessionService(firebaseAuthGateway, clearPresenceSession);
}

export function createSignInService(): SignInWithEmailPasswordService {
  return new SignInWithEmailPasswordService(firebaseAuthGateway, setPresenceSession);
}
