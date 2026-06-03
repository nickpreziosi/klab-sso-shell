import { FirebaseError } from "firebase/app";

/** Maps Firebase Auth errors to user-facing messages (infra-specific). */
export function mapFirebaseAuthErrorToMessage(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email or password.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later.";
      case "auth/network-request-failed":
        return "Network error. Check your connection.";
      default:
        return err.message || "Sign in failed.";
    }
  }
  return err instanceof Error ? err.message : "Sign in failed.";
}
