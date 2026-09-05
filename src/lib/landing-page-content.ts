import type { LandingPage } from "@/types/landing-page";

/**
 * Small helpers shared by the landing page's route and its components.
 *
 * Separate from the components so the route (a server component) and the view
 * (which has client children) can both use them without either importing the
 * other's module graph.
 */

/** Roughly one line of a search-result or link-preview description. */
const EXCERPT_LENGTH = 155;

/**
 * Plain-text opening of a merchant's rich-text body, for metadata.
 *
 * Tags are stripped rather than rendered — this ends up in a `<meta>`
 * attribute, where markup would be either escaped noise or, worse, a way for
 * authored content to break out of the attribute. Entities the editor commonly
 * emits are decoded so a description does not read "&amp;nbsp;".
 */
export function excerptFromHtml(html: string): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= EXCERPT_LENGTH) return text;

  // Cut at a word boundary so the excerpt does not end mid-word.
  const cut = text.slice(0, EXCERPT_LENGTH);
  const lastSpace = cut.lastIndexOf(" ");

  return `${lastSpace > 40 ? cut.slice(0, lastSpace) : cut}…`;
}

/**
 * Whether a section has anything to render.
 *
 * A section with no content is omitted from the page entirely rather than
 * rendered as an empty heading — the spec's requirement, and the reason every
 * list on a landing page is nullable rather than defaulted to `[]`.
 */
export function hasItems<T>(list: T[] | null | undefined): list is T[] {
  return Array.isArray(list) && list.length > 0;
}

/**
 * The gallery a landing page shows.
 *
 * Falls back to the bound product's own images when the merchant has not
 * uploaded campaign media. A landing page with no picture at all is worse than
 * one showing the product photos the shop already has — and a merchant who
 * wants different imagery uploads it, which then wins outright.
 */
export function galleryOf(page: LandingPage) {
  if (hasItems(page.media)) return page.media;

  return page.productSnapshot.images.map((image) => ({
    type: "IMAGE" as const,
    url: image.url,
    alt: image.alt ?? page.productSnapshot.name,
  }));
}

/**
 * The percentage off, when the product carries a compare-at price above its
 * current one.
 *
 * Null when there is no discount to state — a "0% off" badge is worse than no
 * badge, and a compare-at price BELOW the current price is a merchant data
 * error that must not render as a negative discount.
 */
export function discountPercent(unitPrice: number, compareAtPrice: number | null): number | null {
  if (compareAtPrice === null || compareAtPrice <= unitPrice) return null;

  return Math.round(((compareAtPrice - unitPrice) / compareAtPrice) * 100);
}
