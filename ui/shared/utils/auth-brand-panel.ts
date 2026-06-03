import type { CSSProperties } from "react";

export type AuthBrandPanelConfig = {
  brandPanelVariant?: "dark" | "light";
  brandPanelBackground?: string;
  brandPanelLogoVariant?: "light" | "white";
};

export function resolveAuthBrandPanel(config: AuthBrandPanelConfig) {
  const isLightBrand = config.brandPanelVariant === "light";
  const brandBg =
    config.brandPanelBackground ?? (isLightBrand ? "/bg-gradient.png" : "/bg-orange.png");
  const isGradient = brandBg.startsWith("linear-gradient");
  const useOverlay = !isGradient && brandBg !== "/bg-wave.png";
  const darkLogoVariantDesktop: "light" | "white" = config.brandPanelLogoVariant ?? "white";
  const darkLogoVariantMobile: "light" | "white" =
    config.brandPanelLogoVariant === "light" ? "white" : (config.brandPanelLogoVariant ?? "light");

  return {
    isLightBrand,
    brandBg,
    isGradient,
    useOverlay,
    darkLogoVariantDesktop,
    darkLogoVariantMobile,
  };
}

export function getAuthBrandPanelLayerStyle(
  brandBg: string,
  isLightBrand: boolean,
  isGradient: boolean,
  useOverlay: boolean,
  placement: "desktop" | "mobile"
): CSSProperties {
  return {
    backgroundImage: isGradient ? brandBg : `url(${brandBg})`,
    backgroundSize: isGradient ? "auto" : "cover",
    backgroundPosition:
      brandBg === "/bg-wave.png"
        ? placement === "desktop"
          ? "center bottom"
          : "center bottom"
        : isLightBrand
          ? "center"
          : placement === "desktop"
            ? "bottom right"
            : "bottom",
    opacity: isLightBrand || !useOverlay ? 1 : 0.4,
    backgroundColor: isLightBrand || !useOverlay ? "transparent" : "#1A1A1C",
    boxShadow: useOverlay ? "inset -12px 0 12px -12px rgba(0,0,0,0.15)" : "none",
  };
}
