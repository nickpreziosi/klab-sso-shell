# K-Lab SSO Application Shell

A host application that provides single sign-on, a shared layout (sidebar, header, content area), and routing between multiple independent K-Lab applications.

This is **Phase 1**: the shell handles authentication and renders a configuration-driven, dynamic sidebar that changes based on the selected application. Child applications are not yet loaded or embedded — every app route renders a placeholder page. The architecture is designed so those placeholders can later be replaced by Module Federation remotes, micro-frontends, or proxied local dev servers without changing the shell.

## What the shell does

- **Authentication & SSO** — Firebase email/password sign-in plus an httpOnly presence cookie (`KLabShellPresence`) that middleware uses to gate every page and API route. Ported from `ux-krisk`.
- **Global layout** — Sidebar, mobile navbar, theme toggle, and content area ported from `klab-prototypes` (`@k-lab/components`).
- **Shared session context** — `ShellSessionProvider` exposes `{ user, claims, getIdToken }` for future child apps.
- **App switching** — A global switcher (`GlobalNavLogo` on desktop, `TechNavDrawer` on mobile) lists all apps from the registry. Selecting one swaps the sidebar's links.
- **Routing** — Each app owns a URL prefix (`/krisk`, `/invoice`, `/kbpm`, `/kleads`); the shell home is `/`.

## Applications

| App | Slug | URL prefix |
| --- | --- | --- |
| K Rails (shell home) | — | `/` |
| Risk Analysis | `krisk` | `/krisk` |
| Invoice Manager | `invoice` | `/invoice` |
| Admin Portal | `kbpm` | `/kbpm` |
| Lead Generation | `kleads` | `/kleads` |

By default the shell sidebar shows only **Dashboard**. The global switcher contains every application. Selecting an app replaces the sidebar with that app's navigation.

## Architecture

Layering follows [docs/architecture.md](docs/architecture.md) (also enforced via `.cursor/rules/frontend-architecture.mdc`).

```
URL  ──▶  ActiveAppProvider  ──▶  AppSidebarShell (registry nav)
                 │
                 └──▶  AppContentSlot  ──▶  placeholder views (Phase 1)
                                          └─▶  remote / iframe / proxy (Phase 2)
```

- `config/apps/registry.ts` — single source of truth: each app declares its name, logo, slug, sidebar links, and (future) `mount` metadata.
- `lib/navigation/resolve-nav.ts` — turns app-relative segments into shell-rooted hrefs (`/{slug}/{segment}`) and resolves the active app from the pathname.
- `ui/shell/providers/active-app-provider.tsx` — tracks the selected app; the URL stays authoritative.
- `ui/shell/components/app-content-slot.tsx` — the single seam where Phase 2 will mount real apps.
- `contexts/` — auth and shared domain logic only (no React).

### Adding or changing navigation

Edit `config/apps/registry.ts`. Sidebar links and switcher entries both derive from it.

### Future-proofing (Phase 2)

Each app config supports an optional `mount` field (`module-federation` | `iframe` | `proxy`). When ready, branch on `app.mount.type` inside `AppContentSlot` to load a remote. Because all sidebar links already point at `/{slug}/...`, no layout, sidebar, or switcher changes are needed.

## Getting started

This project depends on the private `@k-lab/components` package, served from an Azure DevOps npm feed. Copy the auth config from another K-Lab repo:

```bash
cp ../ux-krisk/.npmrc .npmrc   # private registry auth (gitignored)
npm install
```

Create `.env.local` from the template and fill in the Firebase web config:

```bash
cp .env.example .env.local
```

Run the dev server:

```bash
npm run dev
```

The app starts on http://127.0.0.1:3000. Unauthenticated visits redirect to `/login`.

### Child apps (multi-zones)

Child apps are independent Next.js deployments ("zones") served under a path
prefix on the shell origin, per the
[Next.js multi-zones guide](https://nextjs.org/docs/pages/guides/multi-zones).
The shell rewrites `/{slug}/*` to each zone's origin (see `config/apps/zones.ts`
and `next.config.ts`).

To run the full platform locally:

| App | Repo | Port | basePath |
| --- | --- | --- | --- |
| Shell | this repo | 3000 | — |
| K Risk | `ux-krisk` | 3001 | `/krisk` |
| KBPM | `keo-core-admin-web-ui` | 3002 | `/kbpm` |
| K Leads | `klab-gbl-kleads-portal-web-ui` | 3003 | `/kleads` |

1. In each child repo, set `NEXT_PUBLIC_BASE_PATH=/{slug}` in `.env` and run `npm run dev` on its port.
2. Run `npm run dev` here and browse everything through http://127.0.0.1:3000.

Because every zone is served from the same origin, auth (Firebase session +
`KLabShellPresence` cookie), theme, language, and brand preferences are shared
automatically — no iframes or postMessage bridge.

Navigation within an app is a normal soft navigation; switching apps is a hard
navigation (`<a>` / `window.location`), as required by multi-zones.

## Out of scope for Phase 1

- Loading or embedding child apps (Module Federation, iframe, proxy)
- Cross-application messaging (`postMessage`, shared workers)
- Role-based navigation filtering
- Password reset (the forgot/reset pages are placeholders)
- Server-side Firebase token verification for APIs
