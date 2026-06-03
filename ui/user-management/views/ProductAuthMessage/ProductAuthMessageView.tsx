"use client";

import Link from "next/link";
import { Button, PageThemeSetter, cn } from "@k-lab/components";
import type { ProductLoginConfig } from "@/ui/user-management/views/ProductLogin/ProductLoginView";
import {
  getAuthBrandPanelLayerStyle,
  resolveAuthBrandPanel,
} from "@/ui/shared/utils/auth-brand-panel";

interface ProductAuthMessageViewProps {
  config: Pick<ProductLoginConfig, "description" | "Logo" | "loginPath"> &
    Parameters<typeof resolveAuthBrandPanel>[0];
  title: string;
  message: string;
}

/**
 * Split-panel auth screen for forgot/reset placeholders — same brand panel as login.
 */
export function ProductAuthMessageView({
  config,
  title,
  message,
}: ProductAuthMessageViewProps) {
  const {
    isLightBrand,
    brandBg,
    isGradient,
    useOverlay,
    darkLogoVariantDesktop,
    darkLogoVariantMobile,
  } = resolveAuthBrandPanel(config);

  const { Logo } = config;

  return (
    <>
      <PageThemeSetter theme="light" />
      <div className="flex h-screen w-full overflow-hidden !bg-white">
        <div
          className={cn(
            "relative hidden h-screen w-1/2 flex-col overflow-y-auto p-8 text-start lg:flex",
            isLightBrand ? "bg-white" : "bg-black"
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={getAuthBrandPanelLayerStyle(
              brandBg,
              isLightBrand,
              isGradient,
              useOverlay,
              "desktop"
            )}
          />
          <div
            className={cn(
              "relative z-10 mx-auto flex min-h-full max-w-md flex-col justify-center",
              isLightBrand ? "text-black" : "text-white"
            )}
          >
            <div className="mb-4 flex w-full items-center justify-center gap-4">
              <Logo
                variant={isLightBrand ? "dark" : darkLogoVariantDesktop}
                className="h-24 w-auto"
                aria-hidden
              />
            </div>
            <p
              className={cn(
                "text-lg leading-relaxed",
                isLightBrand ? "text-gray-700" : "text-white/90"
              )}
            >
              {config.description}
            </p>
          </div>
        </div>

        <div className="relative flex h-screen w-full flex-col items-center overflow-y-auto bg-white lg:w-1/2 lg:p-8 lg:pb-8">
          <div className="flex min-h-full w-full flex-col justify-start lg:justify-center">
            <div className={cn("relative h-64 lg:hidden", isLightBrand ? "bg-white" : "bg-black")}>
              <div
                className="pointer-events-none absolute inset-0 z-[1]"
                style={getAuthBrandPanelLayerStyle(
                  brandBg,
                  isLightBrand,
                  isGradient,
                  useOverlay,
                  "mobile"
                )}
              />
              <div className="relative z-10 flex h-64 flex-col items-center justify-center gap-4 px-4">
                <Logo
                  variant={isLightBrand ? "dark" : darkLogoVariantMobile}
                  className="h-16 w-auto"
                  aria-hidden
                />
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-md flex-col justify-center gap-6 px-6 py-16 lg:px-0">
              <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-bold text-foreground lg:text-4xl">{title}</h1>
                <p className="text-muted-foreground">{message}</p>
              </div>
              <Button asChild variant="accent-brand" size="lg" className="w-full">
                <Link href={config.loginPath}>Back to sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
