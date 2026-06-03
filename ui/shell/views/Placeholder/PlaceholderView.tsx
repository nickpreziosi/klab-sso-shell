import * as React from "react";

interface PlaceholderViewProps {
  appName: string;
  pageTitle: string;
  /** Shell-rooted path being rendered, shown as a breadcrumb-style hint. */
  path: string;
}

/**
 * Generic placeholder rendered for every Phase 1 route. In a later phase the
 * `AppContentSlot` will replace this with the actual (remote) application.
 */
export function PlaceholderView({ appName, pageTitle, path }: PlaceholderViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-accent-brand">{appName}</span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{pageTitle}</h1>
        <p className="text-sm text-muted-foreground">
          <code className="rounded bg-accent px-1.5 py-0.5">{path}</code>
        </p>
      </div>
      <div className="rounded-app-radius border border-dashed border-border bg-card/40 p-8">
        <p className="text-muted-foreground">
          This is a placeholder for the <span className="font-medium text-foreground">{pageTitle}</span>{" "}
          view of {appName}. Navigation and the shared shell layout are wired up; the application
          content will be mounted here in a later phase.
        </p>
      </div>
    </div>
  );
}
