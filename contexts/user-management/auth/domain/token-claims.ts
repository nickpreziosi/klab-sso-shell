/**
 * Custom claims expected on the Firebase ID token (names may vary; normalize when reading).
 * `internal_profile_id` exists for future use.
 */
export interface AuthTokenClaims {
  tenantId?: string;
  roles?: string[];
  internal_profile_id?: string;
}

export function normalizeClaims(raw: Record<string, unknown>): AuthTokenClaims {
  const tenantId =
    (typeof raw.tenantId === "string" && raw.tenantId) ||
    (typeof raw.tenant_id === "string" && raw.tenant_id) ||
    undefined;
  const roles = Array.isArray(raw.roles)
    ? raw.roles.filter((r): r is string => typeof r === "string")
    : undefined;
  const internal_profile_id =
    typeof raw.internal_profile_id === "string" ? raw.internal_profile_id : undefined;
  return { tenantId, roles, internal_profile_id };
}
