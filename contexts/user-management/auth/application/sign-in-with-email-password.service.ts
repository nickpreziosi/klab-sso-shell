import type { AuthGatewayPort } from "@/contexts/user-management/auth/domain/auth-gateway.port";
import { Result } from "@/contexts/shared/domain/result";

export class SignInWithEmailPasswordService {
  constructor(
    private readonly gateway: AuthGatewayPort,
    private readonly setPresenceSession: () => Promise<void>
  ) {}

  async signInWithPresenceSession(email: string, password: string): Promise<Result<void>> {
    const result = new Result<void>();
    try {
      await this.gateway.signInWithEmailAndPassword(email, password);
    } catch (e) {
      return result
        .addError(e instanceof Error ? e.message : "Sign in failed.")
        .setStatusCode(401);
    }
    try {
      await this.setPresenceSession();
    } catch (e) {
      await this.gateway.signOut();
      return result
        .addError(e instanceof Error ? e.message : "Could not start session. Check server configuration.")
        .setStatusCode(500);
    }
    return result.setStatusCode(200).addMessage("auth.signIn.success");
  }
}
