import { getAppById, type ShellAppConfig, type ShellAppId } from "@/config/apps/registry";
import type { KriskBrandId } from "@/lib/krisk-brand";

/** Home carousel order: K Hub (shell home) first, then child applications. */
const HOME_APP_ORDER: ShellAppId[] = ["shell", "kbpm", "krisk", "kleads"];

const HOME_CARD_ORDER = ["kbpm", "krisk", "kleads", "krails"] as const satisfies readonly ShellAppId[];

export type HomeAppEntry = {
  app: ShellAppConfig;
};

export type HomeCardEntry = HomeAppEntry;

/** K Rails brand description — re-exported for the auth brand panel. */
export const K_RAILS_BRAND_DESCRIPTION = getAppById("krails")!.description!;

/** Carousel slides (includes K Hub shell home). */
export const HOME_CAROUSEL_ENTRIES: HomeAppEntry[] = HOME_APP_ORDER.map((id) => ({
  app: getAppById(id)!,
}));

/** Dashboard cards for all featured applications. */
export const HOME_CARD_ENTRIES: HomeCardEntry[] = HOME_CARD_ORDER.map((id) => ({
  app: getAppById(id)!,
}));

/** K Risk orange hero background — default carousel backdrop. */
export const HERO_BACKGROUND =
  "/assets/bg-orange-31e3a085-52b5-479d-8fd6-4b2189602639.png";

/** KEO Capital green hero — same composition as the K Risk banner. */
export const HERO_BACKGROUND_KEO_CAPITAL = "/assets/bg-green-keo-capital.png";

export const HERO_BACKGROUND_IMAGE_CLASS = "object-cover object-right-bottom";

export function getHeroBackground(brandId: KriskBrandId): string {
  return brandId === "keo-capital" ? HERO_BACKGROUND_KEO_CAPITAL : HERO_BACKGROUND;
}
