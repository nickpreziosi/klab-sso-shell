/** How the shell composes child apps in this deployment. */
export type PlatformLayoutMode = "subdomain-native" | "iframe-embed";

/**
 * `subdomain-native` (default): shell is login/dashboard only; apps run on their own
 * origins and are linked via external URLs — no iframes or dev proxy rewrites.
 *
 * `iframe-embed`: legacy shell-canonical iframe + `/…-proxy` dev rewrites.
 */
export function getPlatformLayoutMode(): PlatformLayoutMode {
  return process.env.NEXT_PUBLIC_PLATFORM_LAYOUT === "iframe-embed"
    ? "iframe-embed"
    : "subdomain-native";
}

export function isIframeEmbedLayout(): boolean {
  return getPlatformLayoutMode() === "iframe-embed";
}

export function isSubdomainNativeLayout(): boolean {
  return !isIframeEmbedLayout();
}
