import { KRailsLogo } from "@k-lab/components";
import { K_RAILS_BRAND_DESCRIPTION } from "@/config/dashboard/home-apps";
import type { ProductLoginConfig } from "@/ui/user-management/views/ProductLogin/ProductLoginView";

/** Wave background used on login / forgot / reset (matches keo-core-admin-web-ui). */
export const SHELL_AUTH_BRAND_BACKGROUND = "/bg-wave.png";

export const SHELL_AUTH_DESCRIPTION = K_RAILS_BRAND_DESCRIPTION;

/** Shared paths and brand visuals for all shell auth screens. */
export const SHELL_AUTH_BRAND_BASE: Omit<
  ProductLoginConfig,
  "welcomeText" | "signInWithEmailAndPassword"
> = {
  name: "K Rails",
  description: SHELL_AUTH_DESCRIPTION,
  Logo: KRailsLogo as ProductLoginConfig["Logo"],
  brandPanelBackground: SHELL_AUTH_BRAND_BACKGROUND,
  brandPanelLogoVariant: "light",
  loginPath: "/login",
  forgotPasswordPath: "/forgot-password",
  resetPasswordPath: "/reset-password",
};
