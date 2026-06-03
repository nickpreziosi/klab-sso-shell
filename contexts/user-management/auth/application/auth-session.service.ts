import type {
  AuthGatewayPort,
  AuthSessionState,
} from "@/contexts/user-management/auth/domain/auth-gateway.port";

export class AuthSessionService {
  constructor(
    private readonly gateway: AuthGatewayPort,
    private readonly clearPresenceSession: () => Promise<void>
  ) {}

  subscribe(listener: (state: AuthSessionState) => void): () => void {
    return this.gateway.subscribe(listener);
  }

  async signOutAndClearPresence(): Promise<void> {
    await this.gateway.signOut();
    await this.clearPresenceSession();
  }

  refreshSessionClaims(): Promise<AuthSessionState> {
    return this.gateway.refreshSessionClaims();
  }

  getIdToken(): Promise<string | null> {
    return this.gateway.getIdToken();
  }
}
