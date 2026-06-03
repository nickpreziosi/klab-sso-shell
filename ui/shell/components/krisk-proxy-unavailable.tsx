export function KriskProxyUnavailable() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center">
      <p className="text-lg font-medium text-foreground">K Risk dev server not configured</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Start{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">ux-krisk</code> on port{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">3001</code>, then set{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">KRISK_DEV_ORIGIN=http://127.0.0.1:3001</code>{" "}
        in this shell&apos;s <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.env</code> and restart{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">npm run dev</code>.
      </p>
    </div>
  );
}
