"use client";

import * as React from "react";
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@k-lab/components";
import { Layers, Check } from "lucide-react";
import { useInternationalizationContext } from "@/lib/i18n/use-internationalization-context";

const BRAND_COOKIE_NAME = "brand";

const KRISK_BRANDS = [
  { id: "krisk", labelKey: "brandKrisk" },
  { id: "keo-capital", labelKey: "brandKeoCapital" },
] as const;

type KriskBrandId = (typeof KRISK_BRANDS)[number]["id"];

function readBrandCookie(): KriskBrandId {
  if (typeof document === "undefined") return "krisk";
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${BRAND_COOKIE_NAME}=([^;]+)`));
  const value = match?.[1];
  if (value && KRISK_BRANDS.some((b) => b.id === value)) return value as KriskBrandId;
  return "krisk";
}

function setBrandCookie(brandId: KriskBrandId) {
  document.cookie = `${BRAND_COOKIE_NAME}=${brandId}; path=/; max-age=31536000; samesite=lax`;
}

function notifyIframes(brandId: KriskBrandId) {
  const iframes = document.querySelectorAll<HTMLIFrameElement>("iframe");
  iframes.forEach((iframe) => {
    try {
      iframe.contentWindow?.postMessage(
        { type: "shell:preference-change", key: "brand", value: brandId },
        window.location.origin,
      );
    } catch {
      // cross-origin iframe — skip
    }
  });
}

export function KriskBrandSelector() {
  const { t } = useInternationalizationContext();
  const [activeBrand, setActiveBrand] = React.useState<KriskBrandId>("krisk");

  React.useEffect(() => {
    setActiveBrand(readBrandCookie());
  }, []);

  const handleSelect = React.useCallback((brandId: KriskBrandId) => {
    setActiveBrand(brandId);
    setBrandCookie(brandId);
    notifyIframes(brandId);
  }, []);

  const activeEntry = KRISK_BRANDS.find((b) => b.id === activeBrand);

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-9 w-9")}
              aria-label={t("brandTooltip", "preferences")}
            >
              <Layers className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="left" align="center">
          <p>
            {t("brandTooltipWithValue", "preferences", {
              brand: activeEntry ? t(activeEntry.labelKey, "preferences") : activeBrand,
            })}
          </p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side="left" align="start" className="w-44">
        <DropdownMenuLabel>{t("brandLabel", "preferences")}</DropdownMenuLabel>
        {KRISK_BRANDS.map((brand) => (
          <DropdownMenuItem
            key={brand.id}
            onClick={() => handleSelect(brand.id)}
            className="flex items-center justify-between"
          >
            {t(brand.labelKey, "preferences")}
            {activeBrand === brand.id && <Check className="size-3.5 text-muted-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
