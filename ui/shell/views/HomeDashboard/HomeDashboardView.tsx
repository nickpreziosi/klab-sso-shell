"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
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
  CardTitle,
  CardDescription,
  Carousel,
  CarouselContent,
  CarouselItem,
  Separator,
  cn,
  useCarousel,
} from "@k-lab/components";
import {
  HOME_CARD_ENTRIES,
  HOME_CAROUSEL_ENTRIES,
  getHeroSlideBackground,
  heroSlideUsesLightForeground,
  type HomeCardEntry,
} from "@/config/dashboard/home-apps";
import { appShowsBrandLogo } from "@/config/apps/registry";
import { appDefaultHref } from "@/lib/navigation/resolve-nav";
import { useInternationalizationContext } from "@/lib/i18n/use-internationalization-context";
import type { LucideIcon } from "lucide-react";

// ─── Hero Carousel ────────────────────────────────────────────────────────────

function HeroCarouselInner() {
  const { selectedIndex, scrollPrev, scrollNext, scrollTo } = useCarousel();
  const { t } = useInternationalizationContext();

  return (
    <>
      {/* Background image layer */}
      <div className="absolute inset-0" aria-hidden>
        {HOME_CAROUSEL_ENTRIES.map((entry, idx) => {
          const isActive = idx === selectedIndex;
          const bgSrc = getHeroSlideBackground(idx);
          const isLightSlide = heroSlideUsesLightForeground(bgSrc);

          return (
            <div
              key={entry.app.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 ease-in-out",
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              )}
            >
              <Image
                src={bgSrc}
                alt=""
                fill
                className="object-cover object-center"
                priority={idx === 0}
                sizes="(max-width: 768px) 100vw, 80vw"
              />
              {/* Scrim: always darken light slides; wave uses its own dark bg */}
              {isLightSlide && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
              )}
            </div>
          );
        })}
        {/* Bottom gradient so nav controls always have contrast */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Slide content layer */}
      <div className="absolute inset-0 z-10 flex min-h-0 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-hidden">
          <CarouselContent className="ml-0 flex h-full">
            {HOME_CAROUSEL_ENTRIES.map((entry, idx) => {
              const Logo = entry.app.logo;
              const showsLogo = appShowsBrandLogo(entry.app);
              const bgSrc = getHeroSlideBackground(idx);
              const isLightSlide = heroSlideUsesLightForeground(bgSrc);
              const slideLogoVariant = isLightSlide ? "light" : "dark";
              const href = appDefaultHref(entry.app);
              const isShellSlide = entry.app.id === "shell";

              return (
                <CarouselItem
                  key={entry.app.id}
                  className="min-w-full max-w-full basis-full pl-0"
                  aria-hidden={
                    HOME_CAROUSEL_ENTRIES[selectedIndex]?.app.id !== entry.app.id
                  }
                >
                  <div className="flex h-full w-full flex-col justify-start overflow-hidden px-6 py-12 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
                    <div className="flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col gap-6 overflow-x-hidden overflow-y-auto sm:gap-4">
                      <div className="flex h-12 shrink-0 items-center sm:h-16">
                        {showsLogo ? (
                          <Logo
                            className="h-8 w-auto max-w-[120px] origin-left scale-[1.25] sm:h-10 sm:max-w-[160px] lg:h-12"
                            variant={slideLogoVariant}
                            preserveAspectRatio="xMidYMid meet"
                          />
                        ) : (
                          <h2
                            className={cn(
                              "text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl",
                              isLightSlide ? "text-white" : "text-black/80"
                            )}
                          >
                            {entry.app.name}
                          </h2>
                        )}
                      </div>
                      <p
                        className={cn(
                          "w-full min-w-0 max-w-xl break-words text-sm sm:text-base lg:text-lg",
                          isLightSlide ? "text-white/90" : "text-black/70"
                        )}
                      >
                        {t(`${entry.app.id}.description`, "apps") ||
                          entry.app.description}
                      </p>
                      {!isShellSlide && (
                        <Button
                          asChild
                          size="lg"
                          className={cn(
                            "w-fit transition-colors",
                            isLightSlide
                              ? "bg-white text-black hover:bg-white/80"
                              : "bg-black text-white hover:bg-black/80"
                          )}
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

        {/* Navigation bar — always legible over the bottom gradient scrim */}
        <div className="flex shrink-0 items-center gap-3 px-6 pb-6 sm:px-8 lg:px-12">
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
            {HOME_CAROUSEL_ENTRIES.map((entry, idx) => (
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
                    : "h-2.5 w-2.5 bg-white/50 hover:bg-white/75"
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

function HeroCarousel() {
  return (
    <div data-swipe-ignore className="w-full">
      <Carousel
        opts={{ loop: true, align: "start", skipSnaps: false }}
        className="relative min-h-[400px] w-full overflow-hidden rounded-app-radius sm:min-h-[500px]"
      >
        <HeroCarouselInner />
      </Carousel>
    </div>
  );
}

// ─── Product Cards ────────────────────────────────────────────────────────────

type AppAction = {
  labelKey: string;
  fallback: string;
  href: string;
};

type AppCardMeta = {
  actions: AppAction[];
};

const APP_CARD_META: Record<string, AppCardMeta> = {
  kbpm: {
    actions: [{ labelKey: "launch", fallback: "Launch", href: "/kbpm" }],
  },
  krisk: {
    actions: [{ labelKey: "launch", fallback: "Launch", href: "/krisk" }],
  },
  kleads: {
    actions: [{ labelKey: "launch", fallback: "Launch", href: "/kleads" }],
  },
  krails: {
    actions: [],
  },
};

function ProductCard({ entry }: { entry: HomeCardEntry }) {
  const { t } = useInternationalizationContext();
  const { app } = entry;
  const meta = APP_CARD_META[app.id];
  const isComingSoon = app.comingSoon === true;
  const appName = t(`${app.id}.name`, "apps") || app.name;
  const appDesc = t(`${app.id}.description`, "apps") || app.description;
  const DashboardIcon = app.dashboardIcon;

  if (!meta) return null;

  return (
    <Card
      className={cn(
        "flex flex-col transition-all duration-200",
        isComingSoon
          ? "opacity-60"
          : "hover:border-accent-brand/30 hover:shadow-[0_4px_24px_-6px_hsl(var(--accent-brand)/0.1)]"
      )}
    >
      {/* Header: icon + title */}
      <CardHeader className="pb-3">
        <div className="flex min-w-0 items-center gap-3">
          {DashboardIcon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-brand/10">
              <DashboardIcon className="h-4 w-4 text-accent-brand" />
            </div>
          )}
          <CardTitle className="truncate text-sm font-semibold">
            {appName}
          </CardTitle>
        </div>
      </CardHeader>

      {/* Description */}
      <CardContent className="flex-1 px-4 pt-3 pb-2">
        <CardDescription className="line-clamp-3 text-xs leading-relaxed">
          {appDesc}
        </CardDescription>
      </CardContent>

      <Separator />

      {/* Footer: Launch button pinned to bottom-right */}
      <div className="px-4 py-3 flex justify-end">
        {isComingSoon ? (
          <span className="text-xs text-muted-foreground">
            {t("comingSoon", "home")}
          </span>
        ) : (
          <>
            {meta.actions.map((action) => (
              <Button
                key={action.labelKey}
                asChild
                variant="outline"
                size="sm"
                className="h-7 px-3 text-[11px] font-semibold uppercase tracking-wide"
              >
                <Link href={action.href}>
                  {t(action.labelKey, "home") || action.fallback}
                </Link>
              </Button>
            ))}
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
  const totalApps = HOME_CARD_ENTRIES.length;

  return (
    <div className="flex w-full flex-col gap-6">
      <HeroCarousel />

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
            {HOME_CARD_ENTRIES.map((entry) => (
              <ProductCard key={entry.app.id} entry={entry} />
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
