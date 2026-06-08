"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, ShieldX } from "lucide-react";
import { Button } from "@k-lab/components";
import { useInternationalizationContext } from "@/lib/i18n/use-internationalization-context";

export function UnauthorizedView() {
  const { t } = useInternationalizationContext();
  const router = useRouter();

  return (
    <div className="flex min-h-[50vh] flex-col items-start justify-center gap-6 py-8">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-app-radius bg-destructive/10 text-destructive">
          <ShieldX className="h-7 w-7" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("pageTitle", "unauthorized")}
          </h1>
          <p className="mt-1 max-w-lg text-sm text-muted-foreground">
            {t("pageSubtitle", "unauthorized")}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("goBack", "unauthorized")}
        </Button>
        <Button variant="accent-brand" asChild>
          <Link href="/">
            <Home className="h-4 w-4" aria-hidden />
            {t("goHome", "unauthorized")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
