import type { Metadata } from "next";
import type { SeoRouteGroup, StoreSettings } from "@/types/store-settings";

/**
 * Builds a page's complete metadata from the store's SEO settings.
 *
 * ONE function for every route, deliberately. The precedence below — the
 * record's own SEO field, then its display title, then the global default — has
 * to hold on roughly eighteen routes. Written once it is one thing to get right;
 * written per page it is eighteen chances to drift, which is exactly how the
 * storefront ended up hardcoding "– Electrode" into a dozen titles while the
 * store's real name sat unused in the settings row.
 *
 * Never throws. It runs inside `generateMetadata` on every page, so a malformed
 * stored value must degrade to a plainer tag rather than take the page down.
 */

/** What a page knows about itself. Every field optional — most pages have none. */
export interface SeoRecord {
  /** The record's own SEO override (`seoTitle`/`metaTitle` in the database). */
  metaTitle?: string | null;
  metaDescription?: string | null;
  /** What the record is called when it has no SEO override. */
  title?: string | null;
  /** Prose to derive a description from when there is no SEO override. */
  description?: string | null;
  /** Absolute or metadataBase-relative image URL. */
  image?: string | null;
}

export interface ResolveMetadataInput {
  settings: StoreSettings;
  routeGroup: SeoRouteGroup;
  /** Storefront path, leading slash, no origin. Omit to skip the canonical. */
  path?: string;
  record?: SeoRecord;
  /** Escape hatch for pages whose title is neither a record's nor a default. */
  fallbackTitle?: string;
}

/**
 * Trimmed, or undefined when absent or blank — `""` means "unset" throughout.
 *
 * The `typeof` guard is what makes this file's never-throw promise true rather
 * than merely intended. Every value here comes from `apiFetch`, which types the
 * settings payload but does not validate it, so a field the API sends as a
 * number or an object arrives as one — and `value?.trim()` throws on those,
 * inside `generateMetadata`, which takes the whole page down. Anything that is
 * not a string is "unset", which is the same answer this already gives for null.
 */
const clean = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

/** The wordmark, joined the way the header renders it. Never empty. */
export const storeTitleOf = (settings: StoreSettings): string =>
  [settings.storeName, settings.siteNameAccent].filter(Boolean).join(" ").trim() ||
  settings.storeName;

/**
 * Applies the merchant's title template.
 *
 * Done here rather than through Next's own `title.template` because that only
 * applies to CHILD segments and never to the segment declaring it — so a page
 * supplying its own title through this resolver would bypass it entirely. The
 * template is applied once, here, and every page emits an already-final title.
 */
const applyTemplate = (title: string, template: string | undefined): string => {
  if (!template) return title;
  // A template without the placeholder is a merchant choosing a fixed title for
  // every page. Unusual, but their call — and honouring it literally beats
  // silently ignoring what they typed.
  return template.includes("%s") ? template.replaceAll("%s", title) : template;
};

/** The icon this app ships with, served from `public/`. Reached when the merchant set none. */
export const DEFAULT_FAVICON_PATH = "/favicon.ico";

/**
 * The browser-tab icon, as Next's `Metadata["icons"]`.
 *
 * Declared ONCE, by the root layout, and inherited by every route beneath it —
 * deliberately not folded into `resolveMetadata` below, which ~18 routes call
 * and which would therefore emit the same icon link eighteen times over.
 *
 * `src/app/favicon.ico` was DELETED to make this authoritative. Next's file
 * convention is not a default that metadata overrides — it prepends its own
 * link (`metadata.icons.icon.unshift(favicon)` in
 * `next/dist/lib/metadata/resolve-metadata.js`), with no way to suppress it —
 * so while that file existed every document carried two competing `rel="icon"`
 * links and which one won was the browser's business. The same artwork now
 * lives at `public/favicon.ico`, which serves it at the identical URL, keeps a
 * bare `GET /favicon.ico` from 404ing, and is the fallback below.
 *
 * Never throws, like everything else in this file: it runs inside
 * `generateMetadata` on every page, so a malformed stored value degrades to the
 * shipped icon rather than taking the page down. A blank or whitespace-only
 * value is "unset" — the same rule `clean` applies everywhere else here.
 *
 * ONE ICON, not a set. No apple-touch icon, no dark-mode variant, no size
 * ladder — see the change's proposal.
 */
export const resolveIcons = (settings: StoreSettings): Metadata["icons"] => ({
  icon: [{ url: clean(settings.faviconUrl) ?? DEFAULT_FAVICON_PATH }],
});

/** `siteUrl` as a URL, or undefined. A malformed stored value is ignored, not thrown on. */
export const metadataBaseOf = (settings: StoreSettings): URL | undefined => {
  if (!settings.siteUrl) return undefined;
  try {
    return new URL(settings.siteUrl);
  } catch {
    return undefined;
  }
};

export function resolveMetadata({
  settings,
  routeGroup,
  path,
  record,
  fallbackTitle,
}: ResolveMetadataInput): Metadata {
  const seo = settings.seoConfig;

  // --- Title: record override → record's own name → caller's fallback → global
  // default → the wordmark. The wordmark last so a title is never empty and
  // never somebody else's brand.
  const baseTitle =
    clean(record?.metaTitle) ??
    clean(record?.title) ??
    clean(fallbackTitle) ??
    clean(seo.defaultMetaTitle) ??
    storeTitleOf(settings);

  const title = applyTemplate(baseTitle, clean(seo.titleTemplate));

  // --- Description: same chain. `metaDescription` on the settings row is the
  // older field and still wins over the newer `seoConfig` default, so a merchant
  // who set it before this menu existed does not silently lose it.
  const description =
    clean(record?.metaDescription) ??
    clean(record?.description) ??
    clean(settings.metaDescription) ??
    clean(seo.defaultMetaDescription);

  const metadataBase = metadataBaseOf(settings);
  const image = clean(record?.image) ?? clean(seo.defaultOgImageUrl);

  /*
   * The global switch overrides every per-group flag. It is the staging-site
   * kill switch, so nothing may quietly re-enable indexing while it is on —
   * which is why it is applied here rather than merged into the group defaults,
   * where a later write could overwrite it.
   */
  const group = seo.robots.groups[routeGroup];
  const noindex = seo.robots.globalNoindex;
  const robots = {
    index: noindex ? false : (group?.index ?? true),
    follow: noindex ? false : (group?.follow ?? true),
  };

  const verification = {
    ...(clean(seo.verification.google) ? { google: seo.verification.google.trim() } : {}),
    ...(clean(seo.verification.bing) ? { other: { "msvalidate.01": seo.verification.bing.trim() } } : {}),
  };

  return {
    title,
    ...(description ? { description } : {}),
    /*
     * Only when the merchant has recorded a usable origin. Guessing one is worse
     * than leaving metadata relative: an absolute URL resolved against the wrong
     * host points canonical links and social previews at somebody else's site.
     */
    ...(metadataBase ? { metadataBase } : {}),
    ...(metadataBase && path ? { alternates: { canonical: path } } : {}),
    robots,
    openGraph: {
      title,
      ...(description ? { description } : {}),
      ...(path ? { url: path } : {}),
      siteName: storeTitleOf(settings),
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: seo.twitterCardType,
      title,
      ...(description ? { description } : {}),
      ...(clean(seo.twitterSite) ? { site: seo.twitterSite.trim() } : {}),
      ...(image ? { images: [image] } : {}),
    },
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
  };
}
