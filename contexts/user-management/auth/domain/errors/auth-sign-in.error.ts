import { DomainError } from "@/contexts/shared/domain/error/domain.error";

export class AuthSignInError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
