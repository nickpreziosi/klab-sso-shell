import { notFound } from "next/navigation";
import { getAppBySlug } from "@/config/apps/registry";
import { resolvePageTitle } from "@/lib/navigation/resolve-nav";
import { PlaceholderView } from "@/ui/shell/views/Placeholder/PlaceholderView";

export default async function AppCatchAllPage({
  params,
}: {
  params: Promise<{ appSlug: string; path?: string[] }>;
}) {
  const { appSlug, path } = await params;
  const app = getAppBySlug(appSlug);
  if (!app) {
    notFound();
  }

  const segment = (path ?? []).join("/");
  const pageTitle = resolvePageTitle(app, segment);
  const fullPath = segment ? `/${app.slug}/${segment}` : `/${app.slug}`;

  return <PlaceholderView appName={app.name} pageTitle={pageTitle} path={fullPath} />;
}
