import type { Product } from "@/types/product";
import type { StoreSettings } from "@/types/store-settings";
import { metadataBaseOf, storeTitleOf } from "./resolve-metadata";

/**
 * schema.org payloads for the storefront's JSON-LD.
 *
 * Every builder returns `null` when its toggle is off, so a page can mount
 * `<JsonLd data={build...()} />` unconditionally and the "switched off" case
 * stays a single early return rather than a conditional at four call sites.
 *
 * None of them throw. They run inside page renders, and a malformed value in
 * one optional field must cost a missing rich result, never a broken page.
 */

/** Absolute URL against the store's canonical origin, or undefined without one. */
const absolute = (settings: StoreSettings, path: string): string | undefined => {
  const base = metadataBaseOf(settings);
  if (!base) return undefined;
  try {
    return new URL(path, base).toString();
  } catch {
    return undefined;
  }
};

const clean = (value: string | null | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

/**
 * The store itself. Emitted on every page, which is what lets a search engine
 * attach a knowledge panel to the brand rather than to one product.
 */
export function buildOrganizationSchema(settings: StoreSettings): object | null {
  const { structuredData } = settings.seoConfig;
  if (!structuredData.enableOrganization) return null;

  const org = structuredData.organization;
  const url = absolute(settings, "/");

  // `sameAs` only when there is something in it: an empty array is a claim of
  // no social presence rather than an absence of information.
  const sameAs = org.sameAs.filter((entry) => clean(entry));

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: clean(org.legalName) ?? storeTitleOf(settings),
    ...(url ? { url } : {}),
    ...(clean(org.logoUrl) ? { logo: org.logoUrl.trim() } : {}),
    ...(clean(org.email) || clean(org.phone)
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            ...(clean(org.email) ? { email: org.email.trim() } : {}),
            ...(clean(org.phone) ? { telephone: org.phone.trim() } : {}),
          },
        }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/**
 * A single product, with the offer attached.
 *
 * `price` is the effective price a shopper pays — `offerPrice` — not the struck
 * -through comparison price. Advertising the higher one is the kind of mismatch
 * that gets rich results suppressed.
 */
export function buildProductSchema(
  settings: StoreSettings,
  product: Product,
): object | null {
  if (!settings.seoConfig.structuredData.enableProduct) return null;

  const url = absolute(settings, `/products/${product.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(clean(product.description) ? { description: product.description!.trim() } : {}),
    ...(product.image ? { image: product.image } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(clean(product.brand) ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    offers: {
      "@type": "Offer",
      price: product.offerPrice,
      priceCurrency: settings.currency,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      ...(url ? { url } : {}),
    },
  };
}

export interface ArticleInput {
  title: string;
  description?: string | null;
  image?: string | null;
  publishedAt?: string | Date | null;
  updatedAt?: string | Date | null;
  slug: string;
}

/** A blog post. */
export function buildArticleSchema(
  settings: StoreSettings,
  post: ArticleInput,
): object | null {
  if (!settings.seoConfig.structuredData.enableArticle) return null;

  const url = absolute(settings, `/blogs/${post.slug}`);

  // A date that will not parse is left out rather than emitted as "Invalid
  // Date", which would invalidate the whole block.
  const iso = (value: string | Date | null | undefined): string | undefined => {
    if (!value) return undefined;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
  };

  const published = iso(post.publishedAt);
  const modified = iso(post.updatedAt);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    ...(clean(post.description) ? { description: post.description!.trim() } : {}),
    ...(post.image ? { image: post.image } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(modified ?? published ? { dateModified: modified ?? published } : {}),
    ...(url ? { mainEntityOfPage: url } : {}),
    publisher: {
      "@type": "Organization",
      name: storeTitleOf(settings),
    },
  };
}

/** One step of a breadcrumb trail. `path` is storefront-relative. */
export interface BreadcrumbStep {
  name: string;
  path: string;
}

/**
 * The trail from the site root to the current page. Always built with Home
 * first, so callers pass only the steps below it.
 */
export function buildBreadcrumbSchema(
  settings: StoreSettings,
  steps: BreadcrumbStep[],
): object | null {
  if (!settings.seoConfig.structuredData.enableBreadcrumb) return null;
  if (steps.length === 0) return null;

  const all = [{ name: "Home", path: "/" }, ...steps];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      ...(absolute(settings, step.path) ? { item: absolute(settings, step.path) } : {}),
    })),
  };
}
