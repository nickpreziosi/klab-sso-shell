# K-Lab Platform Architecture — Evaluation & Direction

**Audience:** Dev team  
**Purpose:** Evaluate deployment models, routing, auth, shared platform concerns, and implementation backlog for the K-Lab shell and child apps (KBPM, K Risk, K Leads, K Rails).

---

## Executive summary

We need **two deployment modes** from the same app codebases:

1. **Platform instance** — full K-Lab suite (shell + multiple apps, app switcher, SSO).
2. **Isolated instance** — white-label, single-technology deploy (no shell, no switcher, no sibling apps).

For **platform** deployments there are **three viable composition options**, each with real trade-offs:

| Option | Composition | Canonical URL |
|---|---|---|
| **A — Iframe embed** | Subdomains; shell frames each app | `app.k-lab.ai/kbpm/...` (shell) |
| **B — Subdomain-native** | Subdomains; shared library app switcher | `kbpm.k-lab.ai/...` (app) |
| **C — Multi-zones** | Single origin; path-routed to separate apps | `app.k-lab.ai/kbpm/...` (one origin) |

All three keep apps as **separate deployments** and share one **versioned shell ↔ app contract + `PlatformContext` resolver**. They differ mainly in where chrome lives, how routing/assets work, how auth flows, and how a shared AI agent can reach app content. The current **same-origin dev proxy** (`/kbpm-proxy` on `127.0.0.1:3000`) should be retired regardless of choice.

**Hosting:** We deploy on **Google Cloud** (Cloud Run + HTTPS load balancer). Vercel-managed multi-zones (`@vercel/microfrontends`) is therefore not available; Option C means building path/asset routing at the load balancer ourselves.

**Auth:** Options A/B cross origins → **hybrid** auth (`postMessage` token for client calls + httpOnly cookie exchange for SSR). Option C is same-origin → simpler shared cookie/session. See [Authentication](#authentication).

**Decision drivers to weigh:** routing/asset complexity, performance, auth/preferences centralization, and **AI agent placement** (a shell-hosted, DOM-aware agent interacts differently with each option — see [AI agent](#ai-agent-placement)).

---

## Current state & problems

The SSO shell embeds four child apps (KBPM, K Risk, K Leads, K Rails) as iframes. Dev serves everything from one origin (`127.0.0.1:3000`) via proxy prefixes (`/kbpm-proxy`, etc.) and `basePath` glue; prod already iframes cross-origin from each app's `prodUrl`, so dev masks prod-class bugs. That setup breaks root-relative links (they resolve on the shell origin), requires heavy `basePath`/middleware/fetch patching (dev ≠ prod), only half-centralizes auth (shell `postMessage` token + per-app Firebase), and hides token-bridge failures behind a shared local Firebase session.

---

## Deployment modes (two)

### Layout chrome by mode

Who renders sidebar, navbar, footer, and app switcher depends on mode and (for platform) which option.

| Chrome element | A — Iframe | B — Subdomain-native | C — Multi-zones | Isolated |
|---|---|---|---|---|
| **Shell sidebar** (app nav from registry) | Shell | Not used | Shell | N/A |
| **Shell header / navbar** | Shell | Not used | Shell | N/A |
| **App switcher** | Shell only | `@k-lab/components` per app | Shell | **None** |
| **App sidebar** (Buyers, …) | **Hidden** — shell replaces | **Shown** | **Hidden** — shell replaces | **Shown** |
| **App navbar / footer** | **Hidden** | **Shown** | **Hidden** | **Shown** |
| **Login UI** | Shell only | Shell entry; app login on direct visit | Shell | App only |

**A** = one chrome layer (shell); iframe shows **content only**.  
**B** = full app chrome on each subdomain; shell is login/dashboard.  
**C** = single origin, no iframe; same shell-chrome UX as A (app content only, app sidebar hidden). Difference: the shell layout is rendered by each zone (no persistent parent), so chrome re-mounts on cross-zone navigation.  
**Isolated** = full app chrome; no K-Lab platform elements.

---

### 1. Platform instance

Full K-Lab product: multiple apps, shared SSO, cohesive navigation.

| Aspect | Detail |
|---|---|
| **Shell** | Deployed at `app.k-lab.ai` (login, home, app switcher, layout chrome) |
| **Child apps** | Separate deployments: `kbpm.k-lab.ai`, `krisk.k-lab.ai`, `kleads.k-lab.ai`, `krails.k-lab.ai` |
| **App switcher** | Required (see platform options below) |
| **Auth** | Shell owns login; token bridge to embedded apps |
| **User expectation** | One K-Lab suite; switch between products without re-login |
| **Layout** | See table above — Option A hides app chrome when embedded |

### 2. Isolated instance

White-label / single-technology deploy for one customer or product. **Not** the same as visiting `kbpm.k-lab.ai` in the suite — isolated means no K-Lab platform at all.

| Aspect | Detail |
|---|---|
| **Shell** | Not deployed (or not used) |
| **App** | Single app on customer domain (e.g. `krisk.client.com`) |
| **App switcher** | **None** |
| **Auth** | App-only (own Firebase / tenant) |
| **Branding** | Customer brand; no K-Lab platform chrome |
| **Layout** | Full app chrome (sidebar, navbar, footer) — see table above |
| **Platform code** | Embed receivers, shell redirect, bridge — **disabled** via deploy profile |

**Same codebase, different deploy profile** — not necessarily different builds.

```env
# Platform
NEXT_PUBLIC_DEPLOYMENT_PROFILE=platform
NEXT_PUBLIC_SHELL_ORIGIN=https://app.k-lab.ai

# Isolated (white-label)
NEXT_PUBLIC_DEPLOYMENT_PROFILE=isolated
# No NEXT_PUBLIC_SHELL_ORIGIN; no platform redirect
```

---

## Platform instance — three options to evaluate

All three use **separate deployments per app** and the **shared contract**. Options A/B use **subdomains + auth bridge**; Option C uses a **single origin + path routing**. They differ in canonical URL, chrome, routing/assets, auth, and AI-agent access. None is strictly best — pick per the decision drivers and [comparison](#platform-option-comparison).

### Option A: Shell-canonical URL + iframe embed

**Canonical user URL is always the shell:** `app.k-lab.ai/kbpm/buyers/123`

```
User → app.k-lab.ai/kbpm/buyers/123
         ├─ Shell renders sidebar, header, app switcher, footer
         └─ iframe src="https://kbpm.k-lab.ai/buyers/123"
                └─ KBPM content only (no app sidebar / navbar / footer)
```

**Child subdomain redirect (top-level only):**

- User visits `kbpm.k-lab.ai/buyers/123` directly → **redirect** to `app.k-lab.ai/kbpm/buyers/123`
- iframe requests / API / `_next/*` → **no redirect** (serve KBPM content for embed)

**Detecting embedded mode**

Iframe URLs are clean app paths (e.g. `https://kbpm.k-lab.ai/buyers/123`) — no query-param flags. Embed vs top-level visit is determined by layered signals:

| Layer | Signal | Use |
|---|---|---|
| **Server (middleware)** | `Sec-Fetch-Dest: iframe` | Skip top-level redirect; allow embed document through |
| **Server (middleware)** | `Sec-Fetch-Site: cross-site` + known shell `Referer` | Additional confidence for redirect vs embed |
| **Client (hydration)** | `window.parent !== window` | Bare layout, enable embed receivers |
| **Client (handshake)** | App posts `klab-shell-request-handshake`; shell replies `klab-shell-embed-hello` with contract version | Confirm trusted parent before accepting token / context |
| **Server (optional SSR)** | `Domain=.k-lab.ai` cookie e.g. `klab_embed_context=platform` set at shell login | Child SSR can render correct theme, locale/i18n, and `dir` before handshake (prod) |
| **Security** | `Content-Security-Policy: frame-ancestors https://app.k-lab.ai` on child apps | Only the shell can frame the app |

**App switcher:** Shell only (`GlobalNavLogo` / `TechNavDrawer` today). No switcher in child apps when embedded.

| Pros | Cons |
|---|---|
| Single cohesive UX; one URL space | Address bar never shows `kbpm.k-lab.ai` in suite |
| One switcher to maintain | Child subdomain exists mainly for iframe origin + redirect entry |
| Fixes routing leaks; simple GCP host routing | iframe + postMessage sync must stay solid |
| **Persistent shell** — chrome and a shell-hosted agent survive app switches | Cross-origin iframe **blocks DOM access** to app content (postMessage contract only) |
| | Higher overhead: a second document boots its own framework/bundle, plus memory and the postMessage layer |

**Sidebar links:** Shell paths from registry — `/kbpm/buyers`, `/krisk/data-entry`. Click → shell router → `postMessage` navigate inside iframe (no full reload).

**In-app navigation:** Child reports path via `klab-shell-embed-navigate` → shell updates URL to `/kbpm/buyers/123`.

---

### Option B: Subdomain-native URL + shared library switcher

**Canonical user URL is the app subdomain:** `kbpm.k-lab.ai/buyers/123`

```
User → kbpm.k-lab.ai/buyers/123
         ├─ Full app layout (sidebar includes KLabAppSwitcher)
         └─ Switcher links to krisk.k-lab.ai, app.k-lab.ai, etc. (top-level navigation)
```

**App switcher:** Extract to `@k-lab/components` (`KLabAppSwitcher`); mount in each platform app’s sidebar + mobile nav. Shared app manifest (id, name, logo, URL, permissions).

**Shell role:** Login hub + optional dashboard; selecting an app may **navigate top-level** to `kbpm.k-lab.ai` rather than iframe embed.

| Pros | Cons |
|---|---|
| Subdomain visible in URL bar | Full page load on app switch |
| Each app feels like its own product | Switcher + manifest in every app repo |
| No iframe routing leaks | Harder to keep “one app” feel |
| | Duplication risk if not single-sourced |
| | **Harder to centralize auth, theme, and preferences** (see below) |

**Why centralization is harder:** In Option A the session lives on the shell origin and the iframe is a controlled child that receives everything via postMessage + optional `.k-lab.ai` cookies — the shell is always in the loop. In Option B the user lives on the child origin with no persistent parent, so auth, token refresh, theme/language, logout, and preference broadcasts all depend on `.k-lab.ai` cookies synced and re-read on every full page load — **cookie-dependent and eventual**, not immediate. Real-time cross-app sync (theme, logout) is still achievable via a shared backend channel (e.g. a **Firestore `onSnapshot` listener** in each app), at the cost of more per-app code.

---

### Option C: Multi-zones (single origin, path-routed)

**Canonical user URL is one origin:** `app.k-lab.ai/kbpm/buyers/123` — no iframe. A load balancer routes paths to separate Next.js deployments.

```
User → app.k-lab.ai/kbpm/buyers/123
         └─ GCP LB: /kbpm/* → KBPM deployment (renders inline, same origin)
```

**Routing:** Each app sets `basePath`/`assetPrefix` (e.g. `/kbpm`) so pages, `_next/*`, API, and `public/` assets stay scoped; LB has one rule per app. This re-introduces the prefix glue Options A/B remove — the cost moves from iframe sync to asset/path correctness.

**Navigation:** Within a zone = Next.js **soft navigation** (no reload). Across zones (`/kbpm` → `/krisk`) = **hard navigation** (full document load) — a layout-level component, including a shell-hosted agent, **re-mounts**. ([Next.js multi-zones docs](https://nextjs.org/docs/app/guides/multi-zones).)

**AI agent / DOM:** Same origin → an agent can **read and act on the current app's DOM directly** (no cross-origin wall). But it re-mounts on zone switch; continuity needs persisted state (draft, thread) + server-side/resumable runs.

| Pros | Cons |
|---|---|
| Native single-app performance in-zone (no iframe, like B) | Cross-zone switch is a hard navigation (re-mount) |
| Same-origin → simpler auth + native preference sync | `basePath`/`assetPrefix` + LB asset routing to build on GCP |
| **Same-origin agent can access app DOM** | No `@vercel/microfrontends` on GCP — custom routing |
| Soft navigation within a zone | Local dev still needs a proxy to mimic LB |

---

### Can these coexist?

**Technically yes; operationally costly.** Maintaining more than one means parallel navigation models, switchers, auth paths, layout modes, and test matrices — plus an ambiguous product story. **Pick one primary** and implement it fully; allow secondary **entry URLs** only as thin redirects (e.g. `kbpm.k-lab.ai/*` → the primary), not a parallel full-chrome experience.

---

### Platform option comparison

| | A — Iframe | B — Subdomain-native | C — Multi-zones |
|---|---|---|---|
| User URL | `app.k-lab.ai/kbpm/...` | `kbpm.k-lab.ai/...` | `app.k-lab.ai/kbpm/...` |
| Origins | Separate (cross-origin) | Separate (cross-origin) | Single origin |
| Routing / assets | Simple (app at `/`) | Simple (app at `/`) | `basePath`/`assetPrefix` + LB rules |
| App switcher | Shell only | `@k-lab/components` per app | Shell |
| Performance | iframe overhead (two documents); warm app-switch via pool | Native single-app; full load on app switch | Native single-app; soft nav in-zone, hard nav across zones |
| Auth | Hybrid (bridge + cookie) | Hybrid; weaker centralization | Same-origin (simplest) |
| Preferences sync | Shell push (immediate) | Cookies / Firestore listener | Same-origin (native) |
| **Shell agent persists across apps** | ✅ Yes (persistent shell) | ❌ Re-mount | ❌ Re-mount across zones |
| **Agent can access app DOM** | ❌ Cross-origin wall | ✅ Within each app | ✅ Same origin |
| Cohesion | Strongest | Good if chrome consistent | Strong (one document) |
| Implementation | Extend current iframe pool | Shared switcher + manifest | LB routing + per-app `basePath` |

**No single winner.** Roughly: **A** maximizes a persistent, cohesive shell (and a persistent agent) but walls off app DOM and adds iframe overhead; **B** gives subdomain-native URLs and per-app independence but distributes auth/prefs; **C** matches B's native in-app performance while adding simplest same-origin auth and direct agent DOM access, but re-introduces prefix/asset routing and re-mounts on zone switch. The **AI-agent requirements (persistence vs DOM access)** and the **GCP routing cost** are the sharpest differentiators.

---

## Deployment topology

```
Production (platform)
├── app.k-lab.ai      → klab-sso-shell
├── kbpm.k-lab.ai     → keo-core-admin-web-ui
├── krisk.k-lab.ai    → ux-krisk
├── kleads.k-lab.ai   → klab-gbl-kleads-portal-web-ui
└── krails.k-lab.ai   → keo-gbl-invoice-portal-web-ui

Isolated
└── admin.client.com  → keo-core-admin-web-ui (isolated profile only)
```

- **5 repos → 5 platform deployments** (+ additional isolated deploys per customer as needed).
- Shell **does not** contain child app code; it **iframes** (A), **links to** (B), or is **path-routed to** (C) child deployments.
- **Options A/B:** each app on its own subdomain; LB routes by host. **Option C:** one origin (`app.k-lab.ai`); GCP LB routes `/kbpm/*`, `/krisk/*`, … to each deployment.
- Registry `prodUrl` (or env) tells the shell each app's origin/path.

---

## Authentication

<table>
  <tr>
    <td style="padding: 12px 16px; margin: 16px 0; border-left: 4px solid hsl(23, 90%, 54%); background-color: hsla(23, 90%, 54%, 0.05); border-radius: 4px;">
      <strong style="color: hsl(23, 90%, 50%);">Applies to Options A/B (cross-origin).</strong>
      <span style="color: hsl(23, 25%, 22%);"> Option C is single-origin, so a normal same-origin session cookie covers client calls, SSR, and server actions — no postMessage token bridge or cookie exchange needed. The hybrid model below is the cross-origin case.</span>
    </td>
  </tr>
</table>

### Hybrid model

`postMessage` is **client-only** — the child app's server never sees it. SSR, middleware, and server actions need credentials on the **child's own origin**. So we use both channels together:

| Channel | Purpose | When |
|---|---|---|
| **postMessage** (`klab-shell-send-token`) | In-memory Bearer for client API calls; live refresh from shell | After iframe load; on 401 / `klab-shell-request-token` |
| **httpOnly session cookie** (child origin) | SSR, middleware, server actions | Planted immediately after token received, via token exchange |

**Embedded flow (platform):**

1. Shell sends the Firebase ID JWT via `klab-shell-send-token`.
2. Child client calls `POST /api/auth/session` on **its own origin** with the token.
3. Child server verifies the JWT → sets an `httpOnly` session cookie on `kbpm.k-lab.ai` (or `Domain=.k-lab.ai` in prod).
4. Subsequent requests — including SSR and server actions — include the cookie; the child server attaches Bearer to upstream API calls.
5. Shell refreshes the token (~1h expiry) and re-pushes; child re-exchanges / updates the session.
6. Logout: shell sends `token: null`; child clears its cookie + client session; propagate across origins.

**Why both:** Without the cookie exchange, the first iframe request and any hard refresh hit child middleware/SSR with no auth — producing login HTML inside the iframe, empty server-rendered data, then a client refetch. Presence-only cookies (`KLabShellPresence`) gate shell middleware but are **not** sufficient for child API auth.

### Platform instance

| Concern | Approach |
|---|---|
| **Login** | User signs in once at `app.k-lab.ai` |
| **Token delivery** | Shell `postMessage` `klab-shell-send-token` with Firebase ID JWT |
| **Client API calls** | `Authorization: Bearer <token>` from the delivered token (target state — not only presence) |
| **SSR / server actions** | Child-origin `httpOnly` session cookie from the token exchange |
| **Refresh** | Shell refreshes token (~1h); re-push on timer, 401, or `klab-shell-request-token` |
| **Logout** | Shell clears session; send `token: null` to children; clear child cookies |
| **Parent-domain cookies (prod)** | `Domain=.k-lab.ai` for presence/theme (supplement, not replace bridge) |

### Isolated instance

| Concern | Approach |
|---|---|
| **Login** | App’s own `/login` |
| **Token** | App’s own Firebase SDK |
| **Bridge / shell origin** | Disabled |
| **Firebase config** | Per deploy (may differ per customer/tenant) |

**Security:** Client roles are never authoritative; APIs enforce permissions from verified JWT. CSRF protection on the session POST; `Secure`/`HttpOnly`/`SameSite` on cookies.

### Local vs production (platform, after subdomain cutover)

| | **Local** | **Production** |
|---|---|---|
| Hosts | `app.localhost:3000`, `kbpm.localhost:3002`, … | `app.k-lab.ai`, `kbpm.k-lab.ai`, … |
| Mechanism | Same: cross-origin iframe + token bridge + cookie exchange | Same |
| Shared cookies | Unreliable on `localhost` → bridge is primary | `Domain=.k-lab.ai` can help SSR |
| `Secure` cookies | Off (HTTP) | On (HTTPS) |
| **Important** | Local must mirror prod auth; no shared-origin Firebase shortcut | |

Only env values and infra differ — not the auth model.

---

## Navigation & URLs

### Option A (shell-canonical)

| Action | URL bar | Mechanism |
|---|---|---|
| Open KBPM from switcher | `app.k-lab.ai/kbpm` | Shell route + iframe |
| Sidebar “Buyers” | `app.k-lab.ai/kbpm/buyers` | Shell route → postMessage `/buyers` |
| Click buyer in app | `app.k-lab.ai/kbpm/buyers/123` | Child postMessage → shell `router.push` |
| Bookmark / refresh | `app.k-lab.ai/kbpm/buyers/123` | Shell loads → sync iframe via postMessage |
| Direct `kbpm.k-lab.ai/...` | Redirects to `app.k-lab.ai/kbpm/...` | Middleware (not iframe) |

### Option B (subdomain-native)

| Action | URL bar | Mechanism |
|---|---|---|
| Open K Risk from switcher | `krisk.k-lab.ai` | `window.location.href` (full navigation) |
| In-app navigation | `kbpm.k-lab.ai/buyers/123` | App router only |

### Option C (multi-zones)

| Action | URL bar | Mechanism |
|---|---|---|
| In-zone navigation | `app.k-lab.ai/kbpm/buyers/123` | Next.js soft navigation (no reload) |
| Switch zone (KBPM → K Risk) | `app.k-lab.ai/krisk` | Hard navigation (`<a>`; full load) |

---

## AI agent placement

We want a **shell-hosted AI agent** available across all apps (rather than re-built per app). It has two needs that pull against each other:

1. **Persistence** — the panel stays mounted (conversation, socket) as the user switches apps.
2. **App access** — it can read/act on the **current app's DOM/context**.

| | A — Iframe | B — Subdomain-native | C — Multi-zones |
|---|---|---|---|
| Lives in one place (shell) | ✅ | ❌ per app | ✅ |
| Survives app switch | ✅ persistent shell | ❌ | ❌ (hard nav across zones) |
| Reads app DOM | ❌ cross-origin wall (postMessage contract only) | ✅ within app | ✅ same origin |

**The tension:** persistence wants a non-reloading container (persistent shell or single app); DOM access wants the agent in the **same document** as the app. Only same-origin composition gives both — so:

- **Need direct DOM access** → favors **C** (same origin) or a same-origin shell; cross-origin **A** can't do it without a per-capability postMessage protocol.
- **Need an always-mounted agent** → favors **A** (persistent shell). For **B/C**, re-mount is solvable: persist draft/thread (same-origin storage for C, Firestore for B) and run the agent **server-side / resumable** so navigation doesn't kill in-flight work — at the cost of reconnect latency and more code.

---

## Configuration: how apps support both modes

**Do not** use a single `NEXT_PUBLIC_MODE=embedded` build flag as the primary mechanism. Use two layers:

1. **Deploy profile** (env at deploy) — `platform` or `isolated`
2. **Chrome mode** (runtime) — `bare` (embedded) or `full` (standalone top-level)

| Scenario | Deploy profile | How we detect it | What the app does |
|---|---|---|---|
| User inside shell iframe (Option A) | `platform` | Middleware: `Sec-Fetch-Dest: iframe`. Client: `window.parent !== window` + handshake | Bare layout (no app sidebar/navbar); auth bridge; embed receivers |
| User opens child subdomain in a tab (Option A) | `platform` | Top-level request — `Sec-Fetch-Dest` is **not** `iframe` | Redirect to `app.k-lab.ai/{slug}{path}` |
| User on child subdomain (Option B) | `platform` | Top-level; Option B chosen | Full layout; `@k-lab/components` switcher |
| White-label customer domain | `isolated` | `DEPLOYMENT_PROFILE=isolated` | Full layout; standalone auth; no bridge, redirect, or platform receivers |

**Single abstraction** (recommended):

```ts
interface PlatformContext {
  profile: "platform" | "isolated";
  chrome: "bare" | "full";           // bare = iframe; full = isolated or Option B
  showAppSwitcher: boolean;          // shell or library; false when embedded or isolated
  shellOrigin?: string;
  auth: "bridge" | "standalone";
  theme: string;
  language: string;
  brand: string;
  country: string;
  roles: string[];                   // UI gating only
}
```

**Precedence:** shell-provided (embedded) → deploy env / config → app default.

Every centralized capability needs a **two-path resolver**: “context from shell” vs “context from app's own env.” Build once; platform and isolated both use it.

---

## Centralized platform context (platform instance)

Shell and apps share a **versioned payload** (delivered via postMessage + optional `.k-lab.ai` cookies), resolved into `PlatformContext`. Transport is an implementation detail — spec the wire protocol in code / a separate integration doc.

```ts
{
  version: "1",
  token: string | null,
  theme: string,
  language: string,
  brand: string,
  country: string,
  roles: string[],
  featureFlags?: Record<string, boolean>,
  navigation?: { path: string }
}
```

Shell and apps deploy independently; the schema must stay backward compatible.

| Capability | Shell provides | App fallback (isolated) | Notes |
|---|---|---|---|
| **Theme** | Cookie + contract; blocking init script | App env / default | No-flicker: resolve before first paint; children need SSR cookie or blocking init like `shell-document-init.js` |
| **Language** | Cookie + contract; blocking init script | App env / default | No-flicker: resolve locale (i18n messages), `lang`, and `dir` before first paint; children need SSR cookie or blocking init (extend `shell-document-init.js`) |
| **Brand** | Shell / platform config | App `config/brands` | K Risk has own brand system — define precedence (shell > app default) |
| **Country** | Shell config | App env | |
| **Roles** | `claims.roles` from the shell's Firebase JWT; pushed via contract | App reads `claims.roles` from its own Firebase JWT | **UI gating only**; APIs enforce from verified JWT |
| **Feature flags** | Platform config map (e.g. `{ "aiAgent": true }`); pushed via contract | App env / deploy config | Toggle UI features (beta modules, experiments); not security boundaries |

**Security:** Client roles are never authoritative; APIs enforce permissions from verified JWT.

---

## Cross-cutting considerations

| Area | Notes |
|---|---|
| **Session lifecycle** | Logout propagation to all apps; token refresh before expiry; idle/session timeout; 401 → re-request token; cross-subdomain cookie clearing |
| **Security** | `frame-ancestors` CSP (only shell frames apps); postMessage origin allowlist (exists); cookie flags (`Secure`/`HttpOnly`/`SameSite`); CSRF on the session exchange |
| **Observability** | Correlation IDs shell ↔ apps; shared telemetry/Sentry; per-app iframe error/timeout UI (partially exists in `ProxyIframePool`) |
| **Design system** | Align `@k-lab/components` versions across repos (currently drifting, e.g. `0.7.2` vs `0.8.0`) |
| **Independent deploys** | 5 platform projects; isolated deploys additional; contract versioning handles skew |
| **AI agent** | Shell-hosted, cross-app; placement constrained by option (see [AI agent](#ai-agent-placement)) |
| **Performance** | A: two documents + warm iframe pool; C: one document (best in-app) but hard nav across zones; B: full load per switch |
| **GCP routing** | A/B: host-based LB rules; C: path rules + per-app `basePath`/`assetPrefix` (no Vercel multi-zones tooling) |
| **Testing matrix** | Chosen option (embedded A / subdomain B / multi-zones C) + isolated — per app; contract tests for postMessage protocol (A/B) |

---

## Open decisions for team

1. **Primary platform UX:** Option A (iframe), B (subdomain-native), or C (multi-zones)? This drives Phases 1–2.
2. **AI agent requirements:** Must it reference app DOM? (rules out cross-origin A) Must it be always-mounted? (favors A, or persist+resume for B/C)
3. **GCP routing appetite:** Willing to build path + `basePath`/asset routing for Option C, or prefer host-based subdomain routing (A/B)?
4. **Firebase in platform children:** remove SDK in embedded mode, or keep as refresh fallback?
5. **Embed detection (A/B):** Confirm handshake + `Sec-Fetch-Dest` approach?

---

## Summary — choosing an option

No option is strictly best; the choice hinges on the decision drivers above. Summary of when each fits:

| Option | Choose when |
|---|---|
| **A — Iframe** | Cohesive single-URL suite and an **always-mounted shell agent** matter most; accept cross-origin auth + iframe overhead, and the agent acts via a postMessage contract (no direct DOM) |
| **B — Subdomain-native** | Subdomain-visible URLs and per-app independence matter; accept distributed auth/prefs (cookies + Firestore listener) and full-page app switches |
| **C — Multi-zones** | Simplest same-origin auth and **direct agent DOM access** matter most (with native in-app performance, like B); accept building `basePath`/asset + LB path routing on GCP and re-mount on zone switch |