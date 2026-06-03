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

export type ShellAppId = "shell" | "krisk" | "invoice" | "kbpm" | "kleads";

/** Theme-aware logo component as exported by `@k-lab/components`. */
export type LogoComponent = React.ComponentType<
  { variant?: "dark" | "light"; className?: string } & Record<string, unknown>
>;

export type NavItemConfig = {
  /** App-relative path. "" maps to the app's dashboard (`/{slug}`). */
  segment: string;
  label: string;
  icon: LucideIcon;
  /** Phase 2: hide unless the user holds one of these roles/claims. Unused in Phase 1. */
  requiredRoles?: string[];
};

export type NavAccordionConfig = {
  id: string;
  label: string;
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
  primaryNav: NavItemConfig[];
  accordions?: NavAccordionConfig[];
  /**
   * Future-only: how the shell should mount this app's content. Unused in Phase 1
   * (placeholder pages render instead). Adding remotes here requires no layout changes.
   */
  mount?: {
    type: "module-federation" | "iframe" | "proxy";
    remoteEntry?: string;
    scope?: string;
    module?: string;
    devOrigin?: string;
  };
};

export const SHELL_APP: ShellAppConfig = {
  id: "shell",
  slug: "",
  name: "K Rails",
  logo: KRailsLogo,
  showBrandLogo: true,
  defaultSegment: "",
  primaryNav: [{ segment: "", label: "Dashboard", icon: LayoutDashboard }],
};

export function appShowsBrandLogo(app: ShellAppConfig): boolean {
  return app.showBrandLogo === true;
}

export const APPS: ShellAppConfig[] = [
  SHELL_APP,
  {
    id: "krisk",
    slug: "krisk",
    name: "Risk Analysis",
    logo: KRiskLogo,
    defaultSegment: "",
    mount: {
      type: "proxy",
    },
    primaryNav: [
      { segment: "", label: "Dashboard", icon: LayoutDashboard },
      { segment: "data-entry", label: "Data Entry", icon: FilePlus },
      { segment: "quick-assessment", label: "Quick Assessment", icon: Calculator },
      { segment: "financial-summary", label: "Financial Summary", icon: TrendingUp },
      { segment: "benchmarks", label: "Benchmarks", icon: Target },
      { segment: "monitoring", label: "Monitoring", icon: Monitor },
      { segment: "segmentation", label: "Segmentation", icon: ChartPie },
      { segment: "data-validation", label: "Data Validation", icon: ShieldCheck },
    ],
    accordions: [
      {
        id: "more",
        label: "More",
        icon: MoreHorizontal,
        items: [
          { segment: "sat", label: "SAT Summary", icon: FileText },
          { segment: "bureau", label: "Bureau", icon: Database },
          { segment: "credit-lines", label: "Credit Lines", icon: CreditCard },
          { segment: "k-behavior", label: "K Behavior", icon: Activity },
          { segment: "k-scoring", label: "K Scoring", icon: ChartColumn },
          { segment: "write-up", label: "Write-up", icon: FilePen },
          { segment: "configuration", label: "Configuration", icon: Settings },
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
    primaryNav: [
      { segment: "", label: "Invoice Dashboard", icon: LayoutDashboard },
      { segment: "create", label: "Create New Invoice", icon: FilePlus },
      { segment: "create-multiple", label: "Create Multiple Invoices", icon: Files },
    ],
  },
  {
    id: "kbpm",
    slug: "kbpm",
    name: "Admin Portal",
    logo: KBpmLogo,
    defaultSegment: "",
    primaryNav: [
      { segment: "", label: "Dashboard", icon: LayoutDashboard },
      { segment: "issuers", label: "Issuers", icon: Building2 },
      { segment: "acquirers", label: "Acquirers", icon: Banknote },
      { segment: "buyers", label: "Buyers", icon: Users },
      { segment: "suppliers", label: "Suppliers", icon: Factory },
      { segment: "transactions", label: "Transactions", icon: ArrowLeftRight },
      { segment: "access", label: "Access", icon: Lock },
    ],
  },
  {
    id: "kleads",
    slug: "kleads",
    name: "Lead Generation",
    logo: KLeadsLogo,
    defaultSegment: "",
    primaryNav: [
      { segment: "", label: "Dashboard", icon: LayoutDashboard },
      { segment: "network-map", label: "Network Map", icon: Network },
      { segment: "lead-ranking", label: "Lead Ranking", icon: ListOrdered },
      { segment: "model-performance", label: "Model Performance", icon: Activity },
      { segment: "methodology", label: "Methodology", icon: BookOpen },
    ],
    accordions: [
      {
        id: "segmentation",
        label: "Segmentation",
        icon: Layers,
        items: [
          { segment: "segmentation/global-analysis", label: "Global Analysis", icon: Globe },
          { segment: "segmentation/portfolio", label: "Individual Portfolio", icon: Briefcase },
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
