"use client";

import { firebaseAuthGateway } from "@/contexts/user-management/auth/infrastructure/firebase-auth-gateway";
import { AuthSessionService } from "@/contexts/user-management/auth/application/auth-session.service";
import { SignInWithEmailPasswordService } from "@/contexts/user-management/auth/application/sign-in-with-email-password.service";
import { clearPresenceSession, setPresenceSession } from "@/lib/auth/presence-session-client";

export const authSessionService = new AuthSessionService(firebaseAuthGateway, clearPresenceSession);

export const signInWithEmailPasswordService = new SignInWithEmailPasswordService(
  firebaseAuthGateway,
  setPresenceSession
);
