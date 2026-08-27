/**
 * Sanitizes a `?redirect=` value before we navigate to it.
 *
 * Only same-site absolute paths are allowed — anything else (an absolute URL,
 * a protocol-relative `//evil.com`, or a backslash variant some browsers
 * normalize to `//`) would let a crafted login link bounce the user off-site
 * after signing in.
 */
export const DEFAULT_REDIRECT = "/account";

export function safeRedirect(
  value: string | undefined | null,
  fallback: string = DEFAULT_REDIRECT,
): string {
  if (!value) return fallback;

  const path = value.trim();
  if (!path.startsWith("/")) return fallback;
  if (path.startsWith("//") || path.startsWith("/\\")) return fallback;

  return path;
}
