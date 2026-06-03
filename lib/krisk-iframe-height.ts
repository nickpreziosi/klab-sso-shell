export const KRISK_EMBED_ROOT_ID = "shell-embed-root";
export const SHELL_EMBED_HEIGHT_MESSAGE = "klab-shell-embed-height" as const;
export const SHELL_EMBED_WHEEL_MESSAGE = "klab-shell-embed-wheel" as const;

export type ShellEmbedHeightMessage = {
  type: typeof SHELL_EMBED_HEIGHT_MESSAGE;
  height: number;
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
