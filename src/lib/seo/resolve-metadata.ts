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

/** Trimmed, or undefined when absent or blank — `""` means "unset" throughout. */
const clean = (value: string | null | undefined): string | undefined => {
  const trimmed = value?.trim();
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
