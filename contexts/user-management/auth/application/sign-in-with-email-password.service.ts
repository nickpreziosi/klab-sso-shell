import type { AuthGatewayPort } from "@/contexts/user-management/auth/domain/auth-gateway.port";

export class SignInWithEmailPasswordService {
  constructor(
    private readonly gateway: AuthGatewayPort,
    private readonly setPresenceSession: () => Promise<void>
  ) {}

  async signInWithPresenceSession(email: string, password: string): Promise<void> {
    await this.gateway.signInWithEmailAndPassword(email, password);
    try {
      await this.setPresenceSession();
    } catch (e) {
      await this.gateway.signOut();
      throw new Error(
        e instanceof Error ? e.message : "Could not start session. Check server configuration."
      );
    }
  }
}
