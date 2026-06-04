import { getAppById, type ShellAppConfig, type ShellAppId } from "@/config/apps/registry";

/** Home carousel order: K Rails (shell home) first, then child applications. */
const HOME_APP_ORDER: ShellAppId[] = ["shell", "invoice", "kbpm", "krisk", "kleads"];

const HOME_CARD_ORDER = ["kbpm", "krisk", "kleads"] as const satisfies readonly Exclude<
  ShellAppId,
  "shell"
>[];

export type HomeAppEntry = {
  app: ShellAppConfig;
};

export type HomeCardEntry = HomeAppEntry;

/** K Rails hero copy — re-exported for the auth brand panel. */
export const K_RAILS_BRAND_DESCRIPTION = getAppById("shell")!.description!;

/** Carousel slides (includes K Rails shell home). */
export const HOME_CAROUSEL_ENTRIES: HomeAppEntry[] = HOME_APP_ORDER.map((id) => ({
  app: getAppById(id)!,
}));

/** Dashboard cards for child applications only (excludes K Rails home). */
export const HOME_CARD_ENTRIES: HomeCardEntry[] = HOME_CARD_ORDER.map((id) => ({
  app: getAppById(id)!,
}));

const HERO_BG_ORANGE =
  "/assets/bg-orange-31e3a085-52b5-479d-8fd6-4b2189602639.png";
const HERO_BG_GRADIENT =
  "/assets/bg-gradient-a8d6fe36-6a6e-41fd-9e60-14c91240e210.png";
const HERO_BG_WAVE = "/assets/bg-wave-752a21dd-5ebb-4598-ab10-89967ce4def7.png";

/** Cycles wave → orange → gradient across carousel slides (K Rails starts on wave). */
const HERO_BACKGROUND_CYCLE = [HERO_BG_WAVE, HERO_BG_ORANGE, HERO_BG_GRADIENT] as const;

export function getHeroSlideBackground(slideIndex: number): string {
  return HERO_BACKGROUND_CYCLE[slideIndex % HERO_BACKGROUND_CYCLE.length];
}

/** Orange and wave slides use a dark scrim and light foreground text. */
export function heroSlideUsesLightForeground(backgroundSrc: string): boolean {
  return backgroundSrc === HERO_BG_ORANGE || backgroundSrc === HERO_BG_WAVE;
}

export function getHeroSlideImageClass(backgroundSrc: string): string {
  return backgroundSrc === HERO_BG_ORANGE
    ? "object-cover object-right-bottom"
    : "object-cover object-bottom";
}
