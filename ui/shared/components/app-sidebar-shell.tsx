"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useInternationalizationContext } from "@/lib/i18n/use-internationalization-context";
import {
  cn,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  Button,
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Separator,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@k-lab/components";
import {
  MobileSidebarPanel,
  ProfileBottomDrawer,
} from "@/ui/shared/components/mobile-sidebar-panel";
import { GlobalNavLogo } from "@/ui/shared/components/global-nav-logo";
import { User, Settings, LogOut } from "lucide-react";
import { getAppById, type ShellAppId } from "@/config/apps/registry";

const linkButtonClass = "w-full h-10 px-4 justify-start gap-3 text-sm";

export type { ShellAppId };

export type AppSidebarNavLink = {
  href: string;
  label: string;
  i18nKey?: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel?: string;
};

export type AppSidebarAccordion = {
  id: string;
  label: string;
  i18nKey?: string;
  icon: React.ComponentType<{ className?: string }>;
  items: AppSidebarNavLink[];
};

export interface AppSidebarShellProps {
  appId: ShellAppId;
  currentPath: string;

  open: boolean;
  onOpenChange: (open: boolean) => void;
  mobilePanelRef?: React.RefObject<HTMLDivElement | null>;
  collapsed: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;

  mobileTitle: string;
  mobileHeader?: React.ReactNode;

  primaryNav: AppSidebarNavLink[];
  accordions?: AppSidebarAccordion[];

  user: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

interface InternalSidebarContentProps {
  appId: ShellAppId;
  currentPath: string;
  collapsed: boolean;
  hideHeader: boolean;
  hideThemeToggle: boolean;
  primaryNav: AppSidebarNavLink[];
  accordions?: AppSidebarAccordion[];
  user: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onOpenChange?: (open: boolean) => void;
}

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function InternalSidebarContent({
  appId,
  currentPath,
  collapsed,
  hideHeader,
  hideThemeToggle,
  primaryNav,
  accordions,
  user,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  onOpenChange,
}: InternalSidebarContentProps) {
  const [logoContainerCollapsed, setLogoContainerCollapsed] = React.useState(collapsed);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const [mobileProfileDropdownOpen, setMobileProfileDropdownOpen] = React.useState(false);

  const router = useRouter();
  const { t } = useInternationalizationContext();

  // Navigate client-side: the nav items render as `<a href>` (for accessibility
  // and modifier-click), but a plain anchor triggers a full-page reload that
  // re-mounts the shell + iframe. Intercept normal clicks and use the router so
  // only the active highlight updates.
  const handleNavigate = React.useCallback(
    (href: string) => (event: React.MouseEvent) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      onOpenChange?.(false);
      router.push(href);
    },
    [router, onOpenChange],
  );

  const isFirstRenderRef = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      setLogoContainerCollapsed(collapsed);
      return;
    }
    const t = setTimeout(() => setLogoContainerCollapsed(collapsed), 0);
    return () => clearTimeout(t);
  }, [collapsed]);

  const appName = getAppById(appId)?.name ?? "K-Lab";

  const renderNavLink = (link: AppSidebarNavLink) => {
    const Icon = link.icon;
    const normalizedPath = currentPath.endsWith("/") ? currentPath.slice(0, -1) : currentPath;
    const normalizedHref = link.href.endsWith("/") ? link.href.slice(0, -1) : link.href;
    const isActive = normalizedPath === normalizedHref;

    const displayLabel = link.i18nKey ? t(link.i18nKey, "nav") : link.label;

    if (collapsed) {
      return (
        <SidebarMenuItem key={link.href}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-9 w-9", isActive && "bg-accent text-accent-foreground")}
                href={link.href}
                onClick={handleNavigate(link.href)}
                aria-label={link.ariaLabel ?? displayLabel}
              >
                <Icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{displayLabel}</p>
            </TooltipContent>
          </Tooltip>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={link.href}>
        <Button
          variant="ghost"
          size="md"
          className={cn(
            linkButtonClass,
            hideThemeToggle && "text-base",
            isActive && "bg-accent text-accent-foreground"
          )}
          href={link.href}
          onClick={handleNavigate(link.href)}
        >
          <Icon className="h-5 w-5" />
          <span>{displayLabel}</span>
        </Button>
      </SidebarMenuItem>
    );
  };

  const renderAccordion = (accordion: AppSidebarAccordion) => {
    const AccordionIcon = accordion.icon;
    const isActive = accordion.items.some((item) => {
      const exact = currentPath === item.href || currentPath === item.href + "/";
      const nested = currentPath.startsWith(item.href + "/");
      return exact || nested;
    });
    const accordionLabel = accordion.i18nKey ? t(accordion.i18nKey, "nav") : accordion.label;

    if (collapsed) {
      return (
        <SidebarMenuItem key={accordion.id}>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-9 w-9", isActive && "bg-accent text-accent-foreground")}
                    aria-label={accordionLabel}
                  >
                    <AccordionIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{accordionLabel}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="start" className="w-48">
              {accordion.items.map((item) => {
                const ItemIcon = item.icon;
                const isItemActive =
                  currentPath === item.href ||
                  currentPath === item.href + "/" ||
                  currentPath.startsWith(item.href + "/");
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start gap-3",
                        isItemActive && "bg-accent text-accent-foreground"
                      )}
                      href={item.href}
                      onClick={handleNavigate(item.href)}
                    >
                      <ItemIcon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={accordion.id}>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={accordion.id} className="border-none">
            <AccordionTrigger
              className={cn(
                "text-nowrap hover:no-underline font-medium",
                "hover:bg-accent [&[data-state=open]]:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground",
                isActive &&
                  "[&[data-state=open]]:bg-transparent [&[data-state=open]]:text-foreground",
                linkButtonClass,
                hideThemeToggle && "text-base"
              )}
              aria-label={accordionLabel}
            >
              <span className="shrink-0 [&>svg]:rotate-0">
                <AccordionIcon className="h-5 w-5" />
              </span>
              <span className="flex-1 text-left">{accordionLabel}</span>
            </AccordionTrigger>
            <AccordionContent className="pb-1 pt-2">
              <div className="flex flex-col gap-2 pl-5">
                {accordion.items.map((item) => {
                  const ItemIcon = item.icon;
                  const isItemActive =
                    currentPath === item.href ||
                    currentPath === item.href + "/" ||
                    currentPath.startsWith(item.href + "/");
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      size="md"
                      className={cn(
                        "-ml-2",
                        linkButtonClass,
                        isItemActive && "bg-accent text-accent-foreground",
                        hideThemeToggle && "text-base [&>svg]:h-5 [&>svg]:w-5"
                      )}
                      href={item.href}
                      onClick={handleNavigate(item.href)}
                    >
                      <ItemIcon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarMenuItem>
    );
  };

  const sidebarHeader = (
    <SidebarHeader
      className={cn("justify-start", hideThemeToggle ? "!h-20" : "!h-16")}
      showCollapseButton={false}
    >
      <div
        className={cn(
          "flex w-full items-center",
          logoContainerCollapsed ? "justify-center" : "justify-start"
        )}
      >
        <GlobalNavLogo
          currentAppId={appId}
          collapsed={collapsed}
          logoContainerCollapsed={logoContainerCollapsed}
          alt={appName}
        />
      </div>
    </SidebarHeader>
  );

  return (
    <TooltipProvider delayDuration={0}>
      {!hideHeader && sidebarHeader}
      <SidebarContent className={cn("flex flex-col", hideThemeToggle && "pt-2")}>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(hideThemeToggle && "text-sm")}>
            {t("navigation", "nav")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-1">
              {primaryNav.map((link) => renderNavLink(link))}
              {accordions?.map((acc) => renderAccordion(acc))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {collapsed && !hideThemeToggle ? (
          <DropdownMenu open={profileDropdownOpen} onOpenChange={setProfileDropdownOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 avatar-trigger-btn"
                    aria-label={t("account", "nav")}
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-accent">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{t("account", "nav")}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="center" className="!w-56 !p-2 glass-morphism">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs">{t("myAccount", "nav")}</DropdownMenuLabel>
              <Separator className="my-1" />
              <DropdownMenuItem
                onClick={onProfileClick}
                className="min-h-11 px-3 py-2.5 cursor-pointer"
              >
                <User className="mr-3 h-5 w-5" />
                <span>{t("profile", "nav")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onSettingsClick}
                className="min-h-11 px-3 py-2.5 cursor-pointer"
              >
                <Settings className="mr-3 h-5 w-5" />
                <span>{t("settings", "nav")}</span>
              </DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem
                onClick={onLogoutClick}
                className="min-h-11 px-3 py-2.5 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>{t("logout", "nav")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : hideThemeToggle ? (
          <ProfileBottomDrawer
            open={mobileProfileDropdownOpen}
            onOpenChange={setMobileProfileDropdownOpen}
            trigger={
              <Button
                variant="ghost"
                size="md"
                className="w-full justify-start gap-3 h-auto py-3 hover:bg-accent"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-accent">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left flex-1 min-w-0">
                  <span className="text-sm font-medium truncate w-full">{user.name || "User"}</span>
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {user.email || "user@example.com"}
                  </span>
                </div>
              </Button>
            }
            user={user}
            onProfileClick={onProfileClick}
            onSettingsClick={onSettingsClick}
            onLogoutClick={onLogoutClick}
          />
        ) : (
          <DropdownMenu open={profileDropdownOpen} onOpenChange={setProfileDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="md"
                className="w-full justify-start gap-3 h-auto py-3 hover:bg-accent"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-accent">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left flex-1 min-w-0">
                  <span className="text-sm font-medium truncate w-full">{user.name || "User"}</span>
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {user.email || "user@example.com"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="!w-64 lg:!w-56 !p-2 glass-morphism">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs">{t("myAccount", "nav")}</DropdownMenuLabel>
              <Separator className="my-1" />
              <DropdownMenuItem
                onClick={onProfileClick}
                className="min-h-11 px-3 py-2.5 cursor-pointer"
              >
                <User className="mr-3 h-5 w-5" />
                <span>{t("profile", "nav")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onSettingsClick}
                className="min-h-11 px-3 py-2.5 cursor-pointer"
              >
                <Settings className="mr-3 h-5 w-5" />
                <span>{t("settings", "nav")}</span>
              </DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem
                onClick={onLogoutClick}
                className="min-h-11 px-3 py-2.5 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>{t("logout", "nav")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </TooltipProvider>
  );
}

export function AppSidebarShell({
  appId,
  currentPath,
  open,
  onOpenChange,
  mobilePanelRef,
  collapsed,
  onCollapsedChange,
  mobileTitle,
  mobileHeader,
  primaryNav,
  accordions,
  user,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
}: AppSidebarShellProps) {
  const desktopContent = (
    <InternalSidebarContent
      appId={appId}
      currentPath={currentPath}
      collapsed={collapsed}
      hideHeader={false}
      hideThemeToggle={false}
      primaryNav={primaryNav}
      accordions={accordions}
      user={user}
      onProfileClick={onProfileClick}
      onSettingsClick={onSettingsClick}
      onLogoutClick={onLogoutClick}
      onOpenChange={onOpenChange}
    />
  );

  const mobileContent = (
    <InternalSidebarContent
      appId={appId}
      currentPath={currentPath}
      collapsed={false}
      hideHeader
      hideThemeToggle
      primaryNav={primaryNav}
      accordions={accordions}
      user={user}
      onProfileClick={onProfileClick}
      onSettingsClick={onSettingsClick}
      onLogoutClick={onLogoutClick}
      onOpenChange={onOpenChange}
    />
  );

  return (
    <>
      <div className="hidden md:block shrink-0">
        <Sidebar collapsible="icon" collapsed={collapsed} onCollapsedChange={onCollapsedChange}>
          {desktopContent}
        </Sidebar>
      </div>

      <MobileSidebarPanel
        open={!!open}
        onOpenChange={onOpenChange}
        panelRef={mobilePanelRef}
        title={mobileTitle}
        header={mobileHeader}
      >
        <Sidebar className="w-full" collapsible={false} collapsed={false}>
          {mobileContent}
        </Sidebar>
      </MobileSidebarPanel>
    </>
  );
}
