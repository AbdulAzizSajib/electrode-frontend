import type { CSSProperties } from "react";
import type { Theme } from "@/types/store-settings";

/**
 * Turns the merchant's stored theme into custom properties for the storefront's
 * `<html>` element.
 *
 * Why an inline style attribute and not a `<style>` block: an element's inline
 * style beats any stylesheet rule regardless of cascade layer or source order.
 * That removes the question of where Next and React hoist an injected `<style>`
 * relative to the Tailwind stylesheet — a question whose answer could change
 * with a framework upgrade and whose failure mode is a silently un-themed site.
 * It is server-rendered in the layout's own response, so the merchant's colours
 * are present on the first painted frame with no flash of the defaults.
 *
 * Every value is re-validated here, immediately before interpolation, even
 * though the API validated it on the way in. These strings go into a style
 * attribute; the column they come from is a JSONB blob Postgres does not
 * constrain, so a row edited outside the API is the one case where "reads are
 * trusted" would be trusting the wrong thing.
 */

/** Same pattern the backend's hexColorSchema uses. */
const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** Matches the backend's FAMILY_PATTERN — letters, digits, spaces, hyphens. */
const FAMILY = /^[A-Za-z0-9][A-Za-z0-9 -]{0,63}$/;

/**
 * The content widths the admin offers, mirroring the backend's
 * `SITE_CONTENT_WIDTHS`. A stored width that is not one of these — a legacy
 * 1384, or a row edited outside the API — snaps to the nearest one rather than
 * rendering as itself: the homepage hero is proportioned from this value, and
 * an unvetted width is exactly what used to reshape the slider's box out from
 * under the merchant's artwork.
 */
const CONTENT_WIDTHS = [1140, 1280, 1440, 1600] as const;

const DEFAULT_WIDTH = 1440;

/**
 * The stack behind the merchant's family, kept from the original `globals.css`
 * so text stays readable if the Google Fonts stylesheet never loads.
 */
const FALLBACK_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const colour = (value: string | undefined, fallback: string): string =>
  typeof value === "string" && HEX.test(value) ? value : fallback;

/**
 * `--site-max-width` as a CSS length. `"full"` becomes `100%`, which is what
 * lets `.site-container` have one code path for both modes rather than the
 * storefront switching classes.
 */
export function resolveMaxWidth(maxWidth: Theme["maxWidth"]): string {
  if (maxWidth === "full") return "100%";
  if (typeof maxWidth === "number" && Number.isFinite(maxWidth)) {
    const nearest = CONTENT_WIDTHS.reduce((best, width) =>
      Math.abs(width - maxWidth) < Math.abs(best - maxWidth) ? width : best,
    );
    return `${nearest}px`;
  }
  return `${DEFAULT_WIDTH}px`;
}

/** The merchant's family, quoted, ahead of the fallback stack. */
export function resolveFontStack(family: string | undefined): string {
  if (typeof family !== "string" || !FAMILY.test(family)) return `"Outfit", ${FALLBACK_STACK}`;
  return `"${family}", ${FALLBACK_STACK}`;
}

/**
 * Only a rebuilt Google Fonts stylesheet URL is worth emitting a `<link>` for.
 * Re-checked here rather than trusted, for the same reason the colours are.
 */
export function resolveFontHref(url: string | undefined): string | null {
  if (typeof url !== "string") return null;
  try {
    const parsed = new URL(url);
    const ok =
      parsed.protocol === "https:" &&
      parsed.hostname === "fonts.googleapis.com" &&
      (parsed.pathname === "/css2" || parsed.pathname === "/css");
    return ok ? parsed.toString() : null;
  } catch {
    return null;
  }
}

/**
 * The custom properties the storefront reads.
 *
 * The names are exactly those already declared in `globals.css`, which is what
 * makes this work without touching a single call site: Tailwind emits every
 * utility as `var(--color-brand)` and `body` reads `var(--font-sans)`, so
 * overriding the properties here reaches all 239 of them at once.
 */
export function themeStyle(theme: Theme | undefined): CSSProperties {
  const t = theme ?? ({} as Theme);
  return {
    "--background": colour(t.background, "#ffffff"),
    "--foreground": colour(t.foreground, "#1a1a1a"),
    "--color-brand": colour(t.brand, "#0f63b3"),
    "--color-brand-dark": colour(t.brandDark, "#133f9e"),
    "--color-accent": colour(t.accent, "#f5b301"),
    "--color-sale": colour(t.sale, "#e02020"),
    "--font-sans": resolveFontStack(t.font?.family),
    "--site-max-width": resolveMaxWidth(t.maxWidth),
  } as CSSProperties;
}
