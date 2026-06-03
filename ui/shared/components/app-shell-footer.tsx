"use client";

import { useState } from "react";
import {
  APP_SHELL_FOOTER_URLS,
  shellFooterLegalUrl,
  shellFooterSupportUrl,
  shellFooterWebsiteUrl,
} from "@/lib/app-shell-footer-config";
import { shellFooterText } from "@/lib/app-shell-footer-copy";
import { AppFeedbackModal } from "@/ui/shared/components/app-feedback-modal";
import { useShellFooterLocaleSegment } from "@/ui/shared/hooks/use-shell-footer-locale";
import { Button, cn, Separator } from "@k-lab/components";

function SocialLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden width={18} height={18}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SocialX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden width={18} height={18}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SocialInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden width={18} height={18}>
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.654.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.07 4.859-.07zm0 3.078c-3.076 0-5.569 2.493-5.569 5.569 0 3.076 2.493 5.569 5.569 5.569 3.076 0 5.569-2.493 5.569-5.569 0-3.076-2.493-5.569-5.569-5.569zm0 9.182c-1.983 0-3.591-1.608-3.591-3.591s1.608-3.591 3.591-3.591 3.591 1.608 3.591 3.591-1.607 3.591-3.591 3.591zm5.693-9.387a1.306 1.306 0 1 1 0 2.612 1.306 1.306 0 0 1 0-2.612z" />
    </svg>
  );
}

function SocialTiktok({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden width={18} height={18}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.65 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function SocialYoutube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden width={18} height={18}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function AppShellFooter() {
  const localeSeg = useShellFooterLocaleSegment();
  const year = new Date().getFullYear();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackModalKey, setFeedbackModalKey] = useState(0);
  const websiteHref = shellFooterWebsiteUrl(localeSeg);
  const legalHref = shellFooterLegalUrl(localeSeg);
  const supportHref = shellFooterSupportUrl(localeSeg);

  return (
    <footer data-shell-footer className="shrink-0 border-t border-border bg-background py-1">
      <div className="@container mx-auto w-full max-w-7xl 2xl:max-w-[1800px]">
        <div
          className={cn(
            "grid grid-cols-1 items-start gap-x-4 gap-y-4 px-4 py-3 @md:grid-cols-3 @md:items-center @md:px-6 @lg:px-8",
            "text-xs text-muted-foreground",
          )}
        >
          <div className="min-w-0 justify-self-center text-pretty @md:justify-self-start @md:pe-4">
            <p className="m-0 mx-auto max-w-prose text-center @md:mx-0 @md:max-w-none @md:text-start">
              {shellFooterText("copyright", { year })}
            </p>
          </div>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 justify-self-stretch @sm:gap-y-1 @md:justify-self-center"
            aria-label={shellFooterText("utilityLinksNavLabel")}
          >
            <Button
              href={websiteHref}
              size="sm"
              variant="link"
              className="text-muted-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shellFooterText("website")}
            </Button>
            <Separator orientation="vertical" className="h-4 self-center" />
            <Button
              href={legalHref}
              size="sm"
              variant="link"
              className="text-muted-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shellFooterText("legal")}
            </Button>
            <Separator orientation="vertical" className="h-4 self-center" />
            <Button
              type="button"
              size="sm"
              variant="link"
              className="text-muted-foreground"
              onClick={() => {
                setFeedbackModalKey((k) => k + 1);
                setFeedbackOpen(true);
              }}
            >
              {shellFooterText("feedback")}
            </Button>
            <Separator orientation="vertical" className="h-4 self-center" />
            <Button
              href={supportHref}
              size="sm"
              variant="link"
              className="text-muted-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shellFooterText("support")}
            </Button>
          </nav>

          <nav
            className="flex shrink-0 items-center justify-center gap-1 justify-self-stretch @md:justify-self-end"
            aria-label={shellFooterText("socialNavLabel")}
          >
            <Button
              href={APP_SHELL_FOOTER_URLS.linkedin}
              target="_blank"
              size="icon"
              variant="ghost"
              rel="noopener noreferrer"
              aria-label={shellFooterText("socialLinkedIn")}
            >
              <SocialLinkedIn />
            </Button>
            <Button
              href={APP_SHELL_FOOTER_URLS.x}
              size="icon"
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={shellFooterText("socialX")}
            >
              <SocialX />
            </Button>
            <Button
              href={APP_SHELL_FOOTER_URLS.instagram}
              size="icon"
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={shellFooterText("socialInstagram")}
            >
              <SocialInstagram />
            </Button>
            <Button
              href={APP_SHELL_FOOTER_URLS.tiktok}
              size="icon"
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={shellFooterText("socialTiktok")}
            >
              <SocialTiktok />
            </Button>
            <Button
              href={APP_SHELL_FOOTER_URLS.youtube}
              size="icon"
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={shellFooterText("socialYoutube")}
            >
              <SocialYoutube />
            </Button>
          </nav>
        </div>
      </div>
      <AppFeedbackModal key={feedbackModalKey} open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </footer>
  );
}
