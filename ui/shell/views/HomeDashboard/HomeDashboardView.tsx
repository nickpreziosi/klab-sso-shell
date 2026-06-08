"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Activity,
  FileText,
  Inbox,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  Carousel,
  CarouselContent,
  CarouselItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Separator,
  cn,
  useCarousel,
} from "@k-lab/components";
import {
  getHeroBackground,
  HOME_CARD_ENTRIES,
  HOME_CAROUSEL_ENTRIES,
  HERO_BACKGROUND_IMAGE_CLASS,
  type HomeAppEntry,
  type HomeCardEntry,
} from "@/config/dashboard/home-apps";
import { useKriskBrand } from "@/ui/shell/hooks/use-krisk-brand";
import { useShellRole } from "@/ui/shell/providers/shell-role-provider";
import { appShowsBrandLogo } from "@/config/apps/registry";
import { ThemeAwareLogo } from "@/ui/shared/components/theme-aware-logo";
import {
  appDefaultHref,
  getAccordions,
  getPrimaryNav,
} from "@/lib/navigation/resolve-nav";
import type { ShellAppConfig, ShellAppId } from "@/config/apps/registry";
import { useInternationalizationContext } from "@/lib/i18n/use-internationalization-context";
import type { LucideIcon } from "lucide-react";

// ─── Hero Carousel ────────────────────────────────────────────────────────────

function HeroCarouselInner({
  entries,
  onActiveAppChange,
  requestedAppId,
}: {
  entries: HomeAppEntry[];
  onActiveAppChange?: (appId: ShellAppId) => void;
  requestedAppId?: ShellAppId | null;
}) {
  const { selectedIndex, scrollPrev, scrollNext, scrollTo } = useCarousel();
  const { t } = useInternationalizationContext();
  const kriskBrand = useKriskBrand();
  const heroBackground = getHeroBackground(kriskBrand);

  React.useEffect(() => {
    const entry = entries[selectedIndex];
    if (entry) onActiveAppChange?.(entry.app.id);
  }, [entries, onActiveAppChange, selectedIndex]);

  React.useEffect(() => {
    if (!requestedAppId) return;
    const idx = entries.findIndex((e) => e.app.id === requestedAppId);
    if (idx >= 0) scrollTo(idx);
  }, [requestedAppId, entries, scrollTo]);

  if (entries.length === 0) return null;

  return (
    <>
      {/* Background image layer — brand-aware (K Risk orange / KEO Capital green) */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={heroBackground}
          alt=""
          fill
          className={HERO_BACKGROUND_IMAGE_CLASS}
          priority
          sizes="(max-width: 768px) 100vw, 80vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Slide content layer */}
      <div className="absolute inset-0 z-10 flex min-h-0 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-hidden">
          <CarouselContent className="ml-0 flex h-full">
            {entries.map((entry, idx) => {
              const Logo = entry.app.logo;
              const showsLogo = appShowsBrandLogo(entry.app);
              const href = appDefaultHref(entry.app);
              const isShellSlide = entry.app.id === "shell";

              return (
                <CarouselItem
                  key={entry.app.id}
                  className="min-w-full max-w-full basis-full pl-0"
                  aria-hidden={entries[selectedIndex]?.app.id !== entry.app.id}
                >
                  <div className="flex h-full w-full flex-col justify-start overflow-hidden px-6 py-8 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
                    <div className="flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto sm:gap-3">
                      <div className="flex h-12 shrink-0 items-center sm:h-16">
                        {showsLogo ? (
                          <Logo
                            className="h-8 w-auto max-w-[120px] origin-left scale-[1.25] sm:h-10 sm:max-w-[160px] lg:h-12"
                            variant="light"
                            preserveAspectRatio="xMidYMid meet"
                          />
                        ) : (
                          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                            {entry.app.name}
                          </h2>
                        )}
                      </div>
                      <p className="w-full min-w-0 max-w-xl break-words text-sm text-white/90 sm:text-base lg:text-lg">
                        {t(`${entry.app.id}.description`, "apps") ||
                          entry.app.description}
                      </p>
                      {!isShellSlide && (
                        <Button
                          asChild
                          size="lg"
                          className="w-fit bg-white text-black transition-colors hover:bg-white/80"
                        >
                          <Link href={href}>
                            {t("exploreCta", "home", {
                              name:
                                t(`${entry.app.id}.name`, "apps") ||
                                entry.app.name,
                            })}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </div>

        <div className="flex shrink-0 items-center gap-3 px-6 pb-4 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label={t("prevSlide", "home")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/35 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            className="flex flex-1 items-center justify-center gap-2"
            role="tablist"
            aria-label={t("carouselSlides", "home")}
          >
            {entries.map((entry, idx) => (
              <button
                key={entry.app.id}
                type="button"
                role="tab"
                aria-label={t("goToSlide", "home", {
                  name: t(`${entry.app.id}.name`, "apps") || entry.app.name,
                })}
                aria-selected={idx === selectedIndex}
                onClick={() => scrollTo(idx)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  idx === selectedIndex
                    ? "h-2.5 w-8 bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                    : "h-2.5 w-2.5 bg-white/50 hover:bg-white/75",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={scrollNext}
            aria-label={t("nextSlide", "home")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/35 active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

function HeroCarousel({
  entries,
  onActiveAppChange,
  requestedAppId,
}: {
  entries: HomeAppEntry[];
  onActiveAppChange?: (appId: ShellAppId) => void;
  requestedAppId?: ShellAppId | null;
}) {
  if (entries.length === 0) return null;

  return (
    <div
      data-swipe-ignore
      className="relative h-[360px] w-full overflow-hidden rounded-app-radius sm:h-[440px]"
    >
      <Carousel
        opts={{ loop: true, align: "start", skipSnaps: false }}
        className="absolute inset-0"
      >
        <HeroCarouselInner
          entries={entries}
          onActiveAppChange={onActiveAppChange}
          requestedAppId={requestedAppId}
        />
      </Carousel>
    </div>
  );
}

// ─── Product Cards ────────────────────────────────────────────────────────────

/** KBPM's SVG viewBox is taller than sibling logos, so it renders smaller at equal height. */
const PRODUCT_CARD_LOGO_CLASS: Partial<Record<ShellAppId, string>> = {
  kbpm: "h-[2.125rem] w-auto max-w-[155px]",
};

const DEFAULT_PRODUCT_CARD_LOGO_CLASS = "h-7 w-auto max-w-[140px]";

function GoToNavDropdown({ app }: { app: ShellAppConfig }) {
  const { t } = useInternationalizationContext();
  const primaryNav = getPrimaryNav(app);
  const accordions = getAccordions(app);
  const hasNavItems =
    primaryNav.length > 0 ||
    accordions.some((accordion) => accordion.items.length > 0);

  if (!hasNavItems) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1 px-3 text-[11px] font-semibold uppercase tracking-wide"
        >
          {t("goTo", "home") || "Go to"}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-72 w-56 overflow-y-auto"
      >
        {primaryNav.map((item) => {
          const ItemIcon = item.icon;
          const label = item.i18nKey
            ? t(item.i18nKey, "nav") || item.label
            : item.label;

          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} className="flex items-center gap-2">
                <ItemIcon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
        {accordions.map((accordion) => {
          const accordionLabel = accordion.i18nKey
            ? t(accordion.i18nKey, "nav") || accordion.label
            : accordion.label;

          return (
            <React.Fragment key={accordion.id}>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {accordionLabel}
              </DropdownMenuLabel>
              {accordion.items.map((item) => {
                const ItemIcon = item.icon;
                const label = item.i18nKey
                  ? t(item.i18nKey, "nav") || item.label
                  : item.label;

                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <ItemIcon className="h-4 w-4 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProductCard({
  entry,
  isHighlighted,
  onCardClick,
}: {
  entry: HomeCardEntry;
  isHighlighted?: boolean;
  onCardClick?: () => void;
}) {
  const { t } = useInternationalizationContext();
  const { app } = entry;
  const isComingSoon = app.comingSoon === true;
  const appName = t(`${app.id}.name`, "apps") || app.name;
  const appDesc = t(`${app.id}.description`, "apps") || app.description;
  const defaultHref = appDefaultHref(app);

  return (
    <Card
      onClick={onCardClick}
      className={cn(
        "flex flex-col transition-all duration-300",
        onCardClick && "cursor-pointer",
        isComingSoon && "opacity-60",
        isHighlighted &&
          "border-accent-brand ring-2 ring-accent-brand/40",
      )}
    >
      {/* Header: brand logo */}
      <CardHeader className="pb-0">
        <div className="flex h-8 min-w-0 items-center">
          <ThemeAwareLogo
            Logo={app.logo}
            className={PRODUCT_CARD_LOGO_CLASS[app.id] ?? DEFAULT_PRODUCT_CARD_LOGO_CLASS}
            preserveAspectRatio="xMidYMid meet"
          />
          <span className="sr-only">{appName}</span>
        </div>
      </CardHeader>

      {/* Description */}
      <CardContent className="flex-1 px-4 pt-1 pb-2">
        <CardDescription className="line-clamp-3 text-xs leading-relaxed">
          {appDesc}
        </CardDescription>
      </CardContent>

      <Separator />

      {/* Footer: Go to + Launch */}
      <div className="flex justify-end gap-2 px-4 py-3">
        {isComingSoon ? (
          <span className="text-xs text-muted-foreground">
            {t("comingSoon", "home")}
          </span>
        ) : (
          <>
            <GoToNavDropdown app={app} />
            <Button
              asChild
              variant="accent-brand"
              size="sm"
              className="h-7 px-3 text-[11px] font-semibold uppercase tracking-wide"
            >
              <Link href={defaultHref}>
                {t("launch", "home") || "Launch"}
              </Link>
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

// ─── Quick Links ──────────────────────────────────────────────────────────────

type QuickLink = {
  id: string;
  icon: LucideIcon;
  labelKey: string;
  fallback: string;
  meta: string;
  metaType: "badge" | "text";
  href: string;
};

const QUICK_LINKS: QuickLink[] = [
  {
    id: "status",
    icon: Activity,
    labelKey: "systemStatus",
    fallback: "System Status",
    meta: "Operational",
    metaType: "text",
    href: "#",
  },
  {
    id: "docs",
    icon: FileText,
    labelKey: "documentation",
    fallback: "Documentation",
    meta: "Updated",
    metaType: "text",
    href: "#",
  },
  {
    id: "inbox",
    icon: Inbox,
    labelKey: "supportInbox",
    fallback: "Support Inbox",
    meta: "3",
    metaType: "badge",
    href: "#",
  },
];

function QuickLinksCard({ className }: { className?: string }) {
  const { t } = useInternationalizationContext();

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          {t("quickLinksTitle", "home")}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-4 pb-4 pt-0">
        <div className="flex flex-col divide-y divide-border">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.id}
                href={link.href}
                className="flex items-center gap-3 py-3 transition-colors hover:text-accent-brand"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium">
                  {t(link.labelKey, "home") || link.fallback}
                </span>
                {link.metaType === "badge" ? (
                  <Badge
                    variant="accent-brand"
                    className="h-5 min-w-[20px] px-1.5 text-[11px]"
                  >
                    {link.meta}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {link.meta}
                  </span>
                )}
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function HomeDashboardView() {
  const { t } = useInternationalizationContext();
  const { initialized, canAccessApp } = useShellRole();
  const [highlightedAppId, setHighlightedAppId] = React.useState<ShellAppId | null>(
    null,
  );
  const [requestedAppId, setRequestedAppId] = React.useState<ShellAppId | null>(null);

  const carouselEntries = React.useMemo(() => {
    if (!initialized) return HOME_CAROUSEL_ENTRIES;
    return HOME_CAROUSEL_ENTRIES.filter((entry) => canAccessApp(entry.app.id));
  }, [canAccessApp, initialized]);

  const cardEntries = React.useMemo(() => {
    if (!initialized) return HOME_CARD_ENTRIES;
    return HOME_CARD_ENTRIES.filter((entry) => canAccessApp(entry.app.id));
  }, [canAccessApp, initialized]);

  const totalApps = cardEntries.length;

  return (
    <div className="flex w-full flex-col gap-6">
      <HeroCarousel
        entries={carouselEntries}
        onActiveAppChange={setHighlightedAppId}
        requestedAppId={requestedAppId}
      />

      <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-stretch">
        {/* Main — Product Grid */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t("ecosystemTitle", "home")}
            </p>
            <Link
              href="#"
              className="flex items-center gap-1 text-xs font-semibold text-accent-brand transition-opacity hover:opacity-75"
            >
              {t("viewAll", "home", { count: String(totalApps) })}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
            {cardEntries.map((entry) => (
              <ProductCard
                key={entry.app.id}
                entry={entry}
                isHighlighted={highlightedAppId === entry.app.id}
                onCardClick={() => setRequestedAppId(entry.app.id)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar — Quick Links */}
        <div className="flex w-full flex-col lg:w-72 xl:w-80">
          <QuickLinksCard className="flex-1" />
        </div>
      </div>
    </div>
  );
}
