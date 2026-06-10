import { notFound } from "next/navigation";
import { getAppBySlug, isZoneApp } from "@/config/apps/registry";
import { resolvePageTitle } from "@/lib/navigation/resolve-nav";
import { PlaceholderView } from "@/ui/shell/views/Placeholder/PlaceholderView";

export default async function AppCatchAllPage({
  params,
}: {
  params: Promise<{ appSlug: string; path?: string[] }>;
}) {
  const { appSlug, path } = await params;
  const app = getAppBySlug(appSlug);
  // Zone apps are served by their own deployment via multi-zone rewrites
  // (beforeFiles), so requests for them never reach this route. If one does,
  // the zone isn't configured — treat it as missing rather than render shell UI.
  if (!app || isZoneApp(app)) notFound();

  const segment = (path ?? []).join("/");
  const pageTitle = resolvePageTitle(app, segment);
  const fullPath = segment ? `/${app.slug}/${segment}` : `/${app.slug}`;

  return <PlaceholderView appName={app.name} pageTitle={pageTitle} path={fullPath} />;
}
