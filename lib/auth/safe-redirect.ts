/** Avoid open redirects: only same-origin relative paths. */
export function safeInternalPath(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}
