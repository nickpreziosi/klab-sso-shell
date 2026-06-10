import type * as React from "react";
import {
  KRiskLogo,
  KBpmLogo,
  KLeadsLogo,
  KRailsLogo,
} from "@k-lab/components";
import { KHubLogo } from "@/ui/shared/components/k-hub-logo";
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
import { getZoneApp } from "./zones";

export type ShellAppId = "shell" | "krisk" | "kbpm" | "kleads" | "krails";

/** Theme-aware logo component as exported by `@k-lab/components`. */
export type LogoComponent = React.ComponentType<
  { variant?: "dark" | "light" | "color" | "white" | "black"; className?: string } & Record<string, unknown>
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
  /** Height class for the logo in the switcher (e.g. "h-[30px]"). Set when a logo's viewBox is taller than average, causing it to render visually smaller at the standard height. Defaults to "h-6" in the trigger and "h-7" in the dropdown. */
  logoSizeClass?: string;
  /** App-relative path used when the app is selected from the switcher. */
  defaultSegment: string;
  /** Short marketing description used on the home dashboard carousel and cards. */
  description?: string;
  /** Icon shown on the home dashboard app card (distinct from nav item icons). */
  dashboardIcon?: LucideIcon;
  /** When true, the app is not yet available — hidden from the switcher and shown as "Coming Soon" on the dashboard. */
  comingSoon?: boolean;
  /**
   * Permission keys a user must hold to access this app.
   * Empty or undefined = no restriction (available to all authenticated users).
   * Enforced by middleware and nav gating (Phase 2).
   */
  permissions?: string[];
  primaryNav: NavItemConfig[];
  accordions?: NavAccordionConfig[];
};

export const SHELL_APP: ShellAppConfig = {
  id: "shell",
  slug: "",
  name: "K Hub",
  logo: KHubLogo,
  showBrandLogo: true,
  defaultSegment: "",
  description:
    "Your central hub for accessing and managing all K-Lab products and services.",
  primaryNav: [{ segment: "", label: "Dashboard", i18nKey: "dashboard", icon: LayoutDashboard }],
};

export function appShowsBrandLogo(app: ShellAppConfig): boolean {
  return app.showBrandLogo === true;
}

/**
 * True when the app is served as an independent multi-zone deployment.
 * Navigation into a zone must be a hard navigation (`<a>` / window.location),
 * never a Next.js soft navigation — see https://nextjs.org/docs/pages/guides/multi-zones.
 */
export function isZoneApp(app: ShellAppConfig): boolean {
  return getZoneApp(app.id) !== undefined;
}

export const APPS: ShellAppConfig[] = [
  SHELL_APP,
  {
    id: "krisk",
    slug: "krisk",
    name: "K Risk",
    logo: KRiskLogo,
    showBrandLogo: true,
    defaultSegment: "",
    description:
      "Comprehensive intelligence engine that integrates internal history and external data sources to fortify underwriting and protect the portfolio.",
    dashboardIcon: ShieldCheck,
    permissions: ["krisk:view"],
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
    id: "kbpm",
    slug: "kbpm",
    name: "KBPM",
    logo: KBpmLogo,
    showBrandLogo: true,
    logoSizeClass: "h-[34px]",
    defaultSegment: "",
    description:
      "Regulatory compliance and business process automation for onboarding, routing, card issuance, and unified workflows.",
    dashboardIcon: Settings,
    permissions: ["kbpm:view"],
    primaryNav: [
      { segment: "", label: "Dashboard", i18nKey: "dashboard", icon: LayoutDashboard },
      { segment: "buyers", label: "Buyers", i18nKey: "buyers", icon: Users },
      { segment: "suppliers", label: "Suppliers", i18nKey: "suppliers", icon: Factory },
      { segment: "transactions", label: "Transactions", i18nKey: "transactions", icon: ArrowLeftRight },
      { segment: "access", label: "Access", i18nKey: "access", icon: Lock },
    ],
  },
  {
    id: "kleads",
    slug: "kleads",
    name: "K Leads",
    logo: KLeadsLogo,
    showBrandLogo: true,
    defaultSegment: "",
    description:
      "Lead generation that drives higher prospect conversion, maximizes commercial efficiency, and accelerates growth.",
    dashboardIcon: TrendingUp,
    permissions: ["kleads:view"],
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
  {
    id: "krails",
    slug: "krails",
    name: "K Rails",
    logo: KRailsLogo,
    comingSoon: true,
    defaultSegment: "",
    description:
      "A programmable trust and execution layer for institutional money movement—determining not only how money moves, but whether it should, with defensible proof.",
    primaryNav: [],
  },
];

/** Apps shown in the global switcher — excludes coming-soon products. */
export const SWITCHER_APPS = APPS.filter((a) => !a.comingSoon);

/** Child apps only (everything except the shell host). */
export const CHILD_APPS = APPS.filter((a) => a.id !== "shell" && !a.comingSoon);

export function getAppById(id: ShellAppId): ShellAppConfig | undefined {
  return APPS.find((a) => a.id === id);
}

export function getAppBySlug(slug: string): ShellAppConfig | undefined {
  return APPS.find((a) => a.slug === slug && a.slug !== "");
}
