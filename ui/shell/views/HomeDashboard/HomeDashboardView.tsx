"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  Carousel,
  CarouselContent,
  CarouselItem,
  cn,
  useCarousel,
} from "@k-lab/components";
import {
  HOME_CARD_ENTRIES,
  HOME_CAROUSEL_ENTRIES,
  getHeroSlideBackground,
  getHeroSlideImageClass,
  heroSlideUsesLightForeground,
  type HomeAppEntry,
  type HomeCardEntry,
} from "@/config/dashboard/home-apps";
import { appShowsBrandLogo } from "@/config/apps/registry";
import { appDefaultHref } from "@/lib/navigation/resolve-nav";
import { useInternationalizationContext } from "@/lib/i18n/use-internationalization-context";

function HeroCarouselInner() {
  const { selectedIndex, scrollPrev, scrollNext, scrollTo } = useCarousel();
  const { t } = useInternationalizationContext();

  return (
    <>
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
                isActive ? "z-0 opacity-100" : "pointer-events-none z-0 opacity-0"
              )}
            >
              <Image
                src={bgSrc}
                alt=""
                fill
                className={getHeroSlideImageClass(bgSrc)}
                priority={idx === 0}
                sizes="100vw"
              />
              {isLightSlide && !bgSrc.includes("bg-wave") && (
                <div
                  className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/25"
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>

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
                  aria-hidden={HOME_CAROUSEL_ENTRIES[selectedIndex]?.app.id !== entry.app.id}
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
                          isLightSlide ? "text-white" : "text-black/70"
                        )}
                      >
                        {t(`${entry.app.id}.description`, "apps") || entry.app.description}
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
                            {t("exploreCta", "home", { name: t(`${entry.app.id}.name`, "apps") || entry.app.name })}
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

        <div className="flex shrink-0 items-center justify-center gap-4 px-6 pb-10 sm:justify-between sm:px-8 sm:pb-8 lg:px-12 lg:pb-12">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label={t("prevSlide", "home")}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-app-radius text-white transition-colors hover:bg-accent/20 active:scale-95 sm:flex"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>
          <div
            className="flex flex-1 items-center justify-center gap-4 sm:flex-initial"
            role="tablist"
            aria-label={t("carouselSlides", "home")}
          >
            {HOME_CAROUSEL_ENTRIES.map((entry, idx) => (
              <button
                key={entry.app.id}
                type="button"
                role="tab"
                aria-label={t("goToSlide", "home", { name: t(`${entry.app.id}.name`, "apps") || entry.app.name })}
                aria-selected={idx === selectedIndex}
                onClick={() => scrollTo(idx)}
                className={cn(
                  "rounded-full transition-colors",
                  idx === selectedIndex ? "h-2 w-12 bg-white" : "h-2 w-6 bg-white/50 hover:bg-white/70"
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={scrollNext}
            aria-label={t("nextSlide", "home")}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-app-radius text-white transition-colors hover:bg-accent/20 active:scale-95 sm:flex"
          >
            <ChevronRight className="h-10 w-10" />
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

function AppCard({ entry }: { entry: HomeCardEntry }) {
  const Logo = entry.app.logo;
  const href = appDefaultHref(entry.app);
  const isComingSoon = entry.app.comingSoon === true;
  const { t } = useInternationalizationContext();
  const appName = t(`${entry.app.id}.name`, "apps") || entry.app.name;
  const appDesc = t(`${entry.app.id}.description`, "apps") || entry.app.description;

  const cardInner = (
    <Card
      className={cn(
        "flex h-full w-full flex-col transition-all duration-200",
        isComingSoon
          ? "cursor-default opacity-55"
          : "hover:border-accent-brand/30 hover:shadow-[0_4px_24px_-6px_hsl(var(--accent-brand)/0.12)]",
      )}
    >
      <CardHeader className="flex flex-col gap-4 space-y-0">
        {Logo && (
          <>
            <div className="flex items-start">
              <Logo className="h-7 w-auto max-w-[120px]" variant="color" aria-hidden />
            </div>
            <span className="sr-only">{appName}</span>
          </>
        )}
        <CardDescription className="leading-relaxed">{appDesc}</CardDescription>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-0 border-t border-border p-4">
        {isComingSoon ? (
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {t("comingSoon", "home")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-brand group-hover:underline">
            {t("open", "home")}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        )}
      </CardFooter>
    </Card>
  );

  if (isComingSoon) {
    return <div className="group relative h-full">{cardInner}</div>;
  }

  return (
    <div className="group relative h-full">
      <Link href={href} className="block h-full">
        {cardInner}
      </Link>
    </div>
  );
}

export function HomeDashboardView() {
  const { t } = useInternationalizationContext();

  return (
    <div className="flex w-full flex-col gap-10">
      <HeroCarousel />

      <section>
        <div className="mb-5">
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <LayoutDashboard className="h-5 w-5 text-muted-foreground" aria-hidden />
            {t("applicationsTitle", "home")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("applicationsSubtitle", "home")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @xl:grid-cols-4">
          {HOME_CARD_ENTRIES.map((entry) => (
            <AppCard key={entry.app.id} entry={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}
