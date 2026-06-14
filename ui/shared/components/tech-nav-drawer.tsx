"use client";

import * as React from "react";
import { PlatformApplicationMenuDrawer } from "@/ui/shared/components/platform-application-menu";
import type { ShellAppId } from "@/config/apps/registry";

export interface TechNavDrawerProps {
  currentAppId: ShellAppId;
  className?: string;
  /** Optional - called when the user selects an app (e.g. to close the sidebar). */
  onAppSelect?: () => void;
}

/** Mobile app switcher backed by `@k-lab/components` ApplicationMenuDrawer. */
export function TechNavDrawer({ currentAppId, className, onAppSelect }: TechNavDrawerProps) {
  return (
    <PlatformApplicationMenuDrawer
      currentAppId={currentAppId}
      onAppSelect={onAppSelect}
      className={className}
    />
  );
}
