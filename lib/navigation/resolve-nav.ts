import {
  APPS,
  SHELL_APP,
  getAppBySlug,
  type NavItemConfig,
  type ShellAppConfig,
} from "@/config/apps/registry";
import type {
  AppSidebarNavLink,
  AppSidebarAccordion,
} from "@/ui/shared/components/app-sidebar-shell";

/**
 * Builds the absolute (shell-rooted) URL for an app-relative segment.
 *
 * - Shell host (`slug === ""`): `""` -> `/`, otherwise `/{segment}`.
 * - Child apps: `""` -> `/{slug}` (the app dashboard), otherwise `/{slug}/{segment}`.
 *
 * Segments are stored app-relative so the same config can later target a remote
 * micro-frontend without rewriting every link.
 */
export function resolveHref(app: ShellAppConfig, segment: string): string {
  if (app.slug === "") {
    return segment === "" ? "/" : `/${segment}`;
  }
  return segment === "" ? `/${app.slug}` : `/${app.slug}/${segment}`;
}

/** The landing URL for an app when selected from the switcher. */
export function appDefaultHref(app: ShellAppConfig): string {
  return resolveHref(app, app.defaultSegment);
}

function toNavLink(app: ShellAppConfig, item: NavItemConfig): AppSidebarNavLink {
  return {
    href: resolveHref(app, item.segment),
    label: item.label,
    i18nKey: item.i18nKey,
    icon: item.icon,
  };
}

export function getPrimaryNav(app: ShellAppConfig): AppSidebarNavLink[] {
  return app.primaryNav.map((item) => toNavLink(app, item));
}

export function getAccordions(app: ShellAppConfig): AppSidebarAccordion[] {
  return (app.accordions ?? []).map((acc) => ({
    id: acc.id,
    label: acc.label,
    i18nKey: acc.i18nKey,
    icon: acc.icon,
    items: acc.items.map((item) => toNavLink(app, item)),
  }));
}

/** Human-readable title for an app-relative segment, preferring its nav label. */
export function resolvePageTitle(app: ShellAppConfig, segment: string): string {
  if (segment === "") {
    return app.primaryNav[0]?.label ?? "Dashboard";
  }
  const fromPrimary = app.primaryNav.find((item) => item.segment === segment);
  if (fromPrimary) return fromPrimary.label;
  for (const acc of app.accordions ?? []) {
    const fromAccordion = acc.items.find((item) => item.segment === segment);
    if (fromAccordion) return fromAccordion.label;
  }
  // Fallback: humanize the last path part (e.g. "credit-lines" -> "Credit Lines").
  const last = segment.split("/").filter(Boolean).pop() ?? segment;
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Resolves which app owns the given pathname based on its first path segment. */
export function resolveActiveApp(pathname: string): ShellAppConfig {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (!firstSegment) return SHELL_APP;
  return getAppBySlug(firstSegment) ?? SHELL_APP;
}

export { APPS };
