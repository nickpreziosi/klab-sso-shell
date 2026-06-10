"use client";

import * as React from "react";
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@k-lab/components";
import { Check, Palette } from "lucide-react";
import { useInternationalizationContext } from "@/lib/i18n/use-internationalization-context";
import {
  dispatchKriskBrandChange,
  KRISK_BRAND_IDS,
  readKriskBrandCookie,
  setKriskBrandCookie,
  type KriskBrandId,
} from "@/lib/krisk-brand";

const KRISK_BRANDS = [
  { id: "krisk" as const, labelKey: "brandKrisk" },
  { id: "keo-capital" as const, labelKey: "brandKeoCapital" },
] as const;

export function KriskBrandSelector() {
  const { t } = useInternationalizationContext();
  const [open, setOpen] = React.useState(false);
  const [activeBrand, setActiveBrand] = React.useState<KriskBrandId>("krisk");

  React.useEffect(() => {
    setActiveBrand(readKriskBrandCookie());
  }, []);

  const handleSelect = React.useCallback(
    (brandId: KriskBrandId) => {
      if (brandId === activeBrand) {
        setOpen(false);
        return;
      }
      // The cookie is shared with the K Risk zone (same origin); the zone picks
      // it up on its next document load.
      setActiveBrand(brandId);
      setKriskBrandCookie(brandId);
      dispatchKriskBrandChange(brandId);
      setOpen(false);
    },
    [activeBrand],
  );

  const activeEntry = KRISK_BRANDS.find((b) => b.id === activeBrand);
  const activeBrandName = activeEntry
    ? t(activeEntry.labelKey, "preferences")
    : activeBrand;

  return (
    <TooltipProvider>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-9 w-9 rounded-full")}
                aria-label={t("brandTooltipWithValue", "preferences", { brand: activeBrandName })}
                aria-haspopup="listbox"
                aria-expanded={open}
              >
                <Palette className="h-4 w-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent className="text-background" side="left" align="center">
            <p>{t("brandTooltipWithValue", "preferences", { brand: activeBrandName })}</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent side="left" align="start" className="!w-52 !px-1 py-1">
          <div className="border-b border-border px-3 py-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("brandLabel", "preferences")}
            </p>
          </div>

          {KRISK_BRAND_IDS.map((brandId) => {
            const entry = KRISK_BRANDS.find((b) => b.id === brandId);
            const name = entry ? t(entry.labelKey, "preferences") : brandId;
            return (
              <DropdownMenuItem
                key={brandId}
                onSelect={(event) => {
                  event.preventDefault();
                  handleSelect(brandId);
                }}
                className={cn(
                  "flex cursor-pointer items-center gap-2 px-3 py-2",
                  brandId === activeBrand && "bg-accent/50",
                )}
                aria-selected={brandId === activeBrand}
              >
                <span className="flex-1 text-sm">{name}</span>
                {brandId === activeBrand && (
                  <Check className="ms-1 h-4 w-4 shrink-0 text-accent-brand" aria-hidden />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
