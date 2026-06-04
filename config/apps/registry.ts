import type * as React from "react";
import {
  KLabLogo,
  KRiskLogo,
  KRailsLogo,
  KBpmLogo,
  KLeadsLogo,
} from "@k-lab/components";
import {
  LayoutDashboard,
  FilePlus,
  Calculator,
  TrendingUp,
  Target,
  Monitor,
  ChartPie,
  ShieldCheck,
  MoreHorizontal,
  FileText,
  Database,
  CreditCard,
  Activity,
  ChartColumn,
  FilePen,
  Settings,
  Files,
  Building2,
  Banknote,
  Users,
  Factory,
  ArrowLeftRight,
  Lock,
  Network,
  ListOrdered,
  BookOpen,
  Layers,
  Globe,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { getProxiedApp } from "./proxy-config";

export type ShellAppId = "shell" | "krisk" | "invoice" | "kbpm" | "kleads";

/** Theme-aware logo component as exported by `@k-lab/components`. */
export type LogoComponent = React.ComponentType<
  { variant?: "dark" | "light"; className?: string } & Record<string, unknown>
>;

export type NavItemConfig = {
  /** App-relative path. "" maps to the app's dashboard (`/{slug}`). */
  segment: string;
  label: string;
  /** Key inside the "nav" translation namespace (e.g. "dashboard"). Falls back to `label`. */
  i18nKey?: string;
  icon: LucideIcon;
  /** Phase 2: hide unless the user holds one of these roles/claims. Unused in Phase 1. */
  requiredRoles?: string[];
};

export type NavAccordionConfig = {
  id: string;
  label: string;
  /** Key inside the "nav" translation namespace. Falls back to `label`. */
  i18nKey?: string;
  icon: LucideIcon;
  items: NavItemConfig[];
};

export type ShellAppConfig = {
  id: ShellAppId;
  /** URL prefix. The shell host uses "" (its routes live at the root). */
  slug: string;
  name: string;
  logo: LogoComponent;
  /** When true, the app switcher and home dashboard show the brand logo; otherwise the name as text. */
  showBrandLogo?: boolean;
  /** App-relative path used when the app is selected from the switcher. */
  defaultSegment: string;
  /** Short marketing description used on the home dashboard carousel and cards. */
  description?: string;
  /** Icon shown on the home dashboard app card (distinct from nav item icons). */
  dashboardIcon?: LucideIcon;
  /**
   * Permission keys a user must hold to access this app.
   * Empty or undefined = no restriction (available to all authenticated users).
   * Enforced by middleware and nav gating (Phase 2).
   */
  permissions?: string[];
  /**
   * Local dev port the app's standalone server listens on.
   * Derived from proxy-config.ts for proxied apps; drives Next.js rewrites in dev.
   */
  devPort?: number;
  /** Production base URL (used for iframe src, Module Federation remoteEntry in Phase 2). */
  prodUrl?: string;
  primaryNav: NavItemConfig[];
  accordions?: NavAccordionConfig[];
  /**
   * How the shell should mount this app's content.
   * Unused in Phase 1 (placeholder pages render instead).
   * Adding remotes here requires no layout changes.
   */
  mount?: {
    type: "module-federation" | "iframe" | "proxy";
    remoteEntry?: string;
    scope?: string;
    module?: string;
  };
};

export const SHELL_APP: ShellAppConfig = {
  id: "shell",
  slug: "",
  name: "K Rails",
  logo: KRailsLogo,
  showBrandLogo: true,
  defaultSegment: "",
  description:
    "K Rails is a programmable trust and execution layer for institutional money movement—determining not only how money moves, but whether it should, with defensible proof.",
  primaryNav: [{ segment: "", label: "Dashboard", i18nKey: "dashboard", icon: LayoutDashboard }],
};

export function appShowsBrandLogo(app: ShellAppConfig): boolean {
  return app.showBrandLogo === true;
}

/**
 * Dev-time base URL for a proxied app.
 * Returns undefined if the app has no devPort.
 */
export function getAppDevOrigin(app: ShellAppConfig): string | undefined {
  return app.devPort != null ? `http://127.0.0.1:${app.devPort}` : undefined;
}

/**
 * Resolved base URL for an app's content.
 * Returns the dev origin in development, prodUrl in production.
 */
export function getAppBaseUrl(app: ShellAppConfig): string | undefined {
  if (process.env.NODE_ENV === "development") return getAppDevOrigin(app);
  return app.prodUrl;
}

const _kriskProxy = getProxiedApp("krisk")!;
const _kbpmProxy = getProxiedApp("kbpm")!;

export const APPS: ShellAppConfig[] = [
  SHELL_APP,
  {
    id: "krisk",
    slug: "krisk",
    name: "Risk Analysis",
    logo: KRiskLogo,
    defaultSegment: "",
    description:
      "Comprehensive intelligence engine that integrates internal history and external data sources to fortify underwriting and protect the portfolio.",
    dashboardIcon: ShieldCheck,
    permissions: ["krisk:view"],
    devPort: _kriskProxy.devPort,
    prodUrl: "https://krisk.klab.com",
    mount: {
      type: "proxy",
    },
    primaryNav: [
      { segment: "", label: "Dashboard", i18nKey: "dashboard", icon: LayoutDashboard },
      { segment: "data-entry", label: "Data Entry", i18nKey: "dataEntry", icon: FilePlus },
      { segment: "quick-assessment", label: "Quick Assessment", i18nKey: "quickAssessment", icon: Calculator },
      { segment: "financial-summary", label: "Financial Summary", i18nKey: "financialSummary", icon: TrendingUp },
      { segment: "benchmarks", label: "Benchmarks", i18nKey: "benchmarks", icon: Target },
      { segment: "monitoring", label: "Monitoring", i18nKey: "monitoring", icon: Monitor },
      { segment: "segmentation", label: "Segmentation", i18nKey: "segmentation", icon: ChartPie },
      { segment: "data-validation", label: "Data Validation", i18nKey: "dataValidation", icon: ShieldCheck },
    ],
    accordions: [
      {
        id: "more",
        label: "More",
        i18nKey: "more",
        icon: MoreHorizontal,
        items: [
          { segment: "sat", label: "SAT Summary", i18nKey: "satSummary", icon: FileText },
          { segment: "bureau", label: "Bureau", i18nKey: "bureau", icon: Database },
          { segment: "credit-lines", label: "Credit Lines", i18nKey: "creditLines", icon: CreditCard },
          { segment: "k-behavior", label: "K Behavior", i18nKey: "kBehavior", icon: Activity },
          { segment: "k-scoring", label: "K Scoring", i18nKey: "kScoring", icon: ChartColumn },
          { segment: "write-up", label: "Write-up", i18nKey: "writeUp", icon: FilePen },
          { segment: "configuration", label: "Configuration", i18nKey: "configuration", icon: Settings },
        ],
      },
    ],
  },
  {
    id: "invoice",
    slug: "invoice",
    name: "Invoice Manager",
    logo: KLabLogo,
    defaultSegment: "",
    description:
      "Create, manage, and track invoices across your organization with streamlined workflows and real-time visibility.",
    dashboardIcon: Files,
    permissions: ["invoice:view"],
    prodUrl: "https://invoice.klab.com",
    primaryNav: [
      { segment: "", label: "Invoice Dashboard", i18nKey: "invoiceDashboard", icon: LayoutDashboard },
      { segment: "create", label: "Create New Invoice", i18nKey: "createInvoice", icon: FilePlus },
      { segment: "create-multiple", label: "Create Multiple Invoices", i18nKey: "createMultipleInvoices", icon: Files },
    ],
  },
  {
    id: "kbpm",
    slug: "kbpm",
    name: "Admin Portal",
    logo: KBpmLogo,
    defaultSegment: "",
    description:
      "Regulatory compliance and business process automation for onboarding, routing, card issuance, and unified workflows.",
    dashboardIcon: Settings,
    permissions: ["kbpm:view"],
    devPort: _kbpmProxy.devPort,
    prodUrl: "https://admin.klab.com",
    mount: {
      type: "proxy",
    },
    primaryNav: [
      { segment: "", label: "Dashboard", i18nKey: "dashboard", icon: LayoutDashboard },
      { segment: "issuers", label: "Issuers", i18nKey: "issuers", icon: Building2 },
      { segment: "acquirers", label: "Acquirers", i18nKey: "acquirers", icon: Banknote },
      { segment: "buyers", label: "Buyers", i18nKey: "buyers", icon: Users },
      { segment: "suppliers", label: "Suppliers", i18nKey: "suppliers", icon: Factory },
      { segment: "transactions", label: "Transactions", i18nKey: "transactions", icon: ArrowLeftRight },
      { segment: "access", label: "Access", i18nKey: "access", icon: Lock },
    ],
  },
  {
    id: "kleads",
    slug: "kleads",
    name: "Lead Generation",
    logo: KLeadsLogo,
    defaultSegment: "",
    description:
      "Lead generation that drives higher prospect conversion, maximizes commercial efficiency, and accelerates growth.",
    dashboardIcon: TrendingUp,
    permissions: ["kleads:view"],
    prodUrl: "https://leads.klab.com",
    primaryNav: [
      { segment: "", label: "Dashboard", i18nKey: "dashboard", icon: LayoutDashboard },
      { segment: "network-map", label: "Network Map", i18nKey: "networkMap", icon: Network },
      { segment: "lead-ranking", label: "Lead Ranking", i18nKey: "leadRanking", icon: ListOrdered },
      { segment: "model-performance", label: "Model Performance", i18nKey: "modelPerformance", icon: Activity },
      { segment: "methodology", label: "Methodology", i18nKey: "methodology", icon: BookOpen },
    ],
    accordions: [
      {
        id: "segmentation",
        label: "Segmentation",
        i18nKey: "segmentation",
        icon: Layers,
        items: [
          { segment: "segmentation/global-analysis", label: "Global Analysis", i18nKey: "globalAnalysis", icon: Globe },
          { segment: "segmentation/portfolio", label: "Individual Portfolio", i18nKey: "individualPortfolio", icon: Briefcase },
        ],
      },
    ],
  },
];

/** All apps shown in the global switcher (includes the shell home). */
export const SWITCHER_APPS = APPS;

/** Child apps only (everything except the shell host). */
export const CHILD_APPS = APPS.filter((a) => a.id !== "shell");

export function getAppById(id: ShellAppId): ShellAppConfig | undefined {
  return APPS.find((a) => a.id === id);
}

export function getAppBySlug(slug: string): ShellAppConfig | undefined {
  return APPS.find((a) => a.slug === slug && a.slug !== "");
}
