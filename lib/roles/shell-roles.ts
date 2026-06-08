import type { ShellAppConfig, ShellAppId } from "@/config/apps/registry";

export const SHELL_ROLES = {
  ROLE_1: "ROLE_1",
  ROLE_2: "ROLE_2",
  ROLE_3: "ROLE_3",
} as const;

export type ShellRole = (typeof SHELL_ROLES)[keyof typeof SHELL_ROLES];

export const ALL_SHELL_ROLES = Object.values(SHELL_ROLES) as ShellRole[];

export const DEFAULT_SHELL_ROLE: ShellRole = SHELL_ROLES.ROLE_1;

export const SHELL_ROLE_STORAGE_KEY = "shell-dev-role-session";

/** Which apps each dev role can access. Shell home is always reachable. */
export const ROLE_APP_ACCESS: Record<ShellRole, readonly ShellAppId[]> = {
  [SHELL_ROLES.ROLE_1]: ["shell", "kbpm", "krisk", "kleads", "krails"],
  [SHELL_ROLES.ROLE_2]: ["shell", "kbpm", "krisk"],
  [SHELL_ROLES.ROLE_3]: ["shell", "kleads"],
};

export function canRoleAccessApp(role: ShellRole, appId: ShellAppId): boolean {
  return ROLE_APP_ACCESS[role].includes(appId);
}

export function filterAppsByRole<T extends { id: ShellAppId }>(
  apps: readonly T[],
  role: ShellRole,
): T[] {
  return apps.filter((app) => canRoleAccessApp(role, app.id));
}

export function isShellRole(value: string): value is ShellRole {
  return ALL_SHELL_ROLES.includes(value as ShellRole);
}

export const SHELL_ROLE_OPTIONS = [
  { id: SHELL_ROLES.ROLE_1, labelKey: "shellRole1" },
  { id: SHELL_ROLES.ROLE_2, labelKey: "shellRole2" },
  { id: SHELL_ROLES.ROLE_3, labelKey: "shellRole3" },
] as const satisfies ReadonlyArray<{ id: ShellRole; labelKey: string }>;

export type ShellAppLike = Pick<ShellAppConfig, "id">;
