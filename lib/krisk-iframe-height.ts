export const KRISK_EMBED_ROOT_ID = "shell-embed-root";
export const SHELL_EMBED_HEIGHT_MESSAGE = "klab-shell-embed-height" as const;
export const SHELL_EMBED_WHEEL_MESSAGE = "klab-shell-embed-wheel" as const;
export const SHELL_EMBED_NAVIGATE_MESSAGE = "klab-shell-embed-navigate" as const;
export const SHELL_EMBED_SET_LANGUAGE_MESSAGE = "klab-shell-embed-set-language" as const;

export type ShellEmbedHeightMessage = {
  type: typeof SHELL_EMBED_HEIGHT_MESSAGE;
  height: number;
};

export type ShellEmbedNavigateMessage = {
  type: typeof SHELL_EMBED_NAVIGATE_MESSAGE;
  /** App-relative path without base path, e.g. "/financial-summary/groups/edit". */
  path: string;
};

export function isShellEmbedHeightMessage(data: unknown): data is ShellEmbedHeightMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as ShellEmbedHeightMessage).type === SHELL_EMBED_HEIGHT_MESSAGE &&
    typeof (data as ShellEmbedHeightMessage).height === "number" &&
    Number.isFinite((data as ShellEmbedHeightMessage).height)
  );
}

export function isShellEmbedNavigateMessage(data: unknown): data is ShellEmbedNavigateMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as ShellEmbedNavigateMessage).type === SHELL_EMBED_NAVIGATE_MESSAGE &&
    typeof (data as ShellEmbedNavigateMessage).path === "string"
  );
}

export type ShellEmbedSetLanguageMessage = {
  type: typeof SHELL_EMBED_SET_LANGUAGE_MESSAGE;
  language: string;
};

export function isShellEmbedSetLanguageMessage(
  data: unknown,
): data is ShellEmbedSetLanguageMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as ShellEmbedSetLanguageMessage).type === SHELL_EMBED_SET_LANGUAGE_MESSAGE &&
    typeof (data as ShellEmbedSetLanguageMessage).language === "string"
  );
}
