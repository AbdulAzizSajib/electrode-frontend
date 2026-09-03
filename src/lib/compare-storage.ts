"use client";

/**
 * The compare list, kept in `localStorage`.
 *
 * This is the app's first client-persisted state. Cart and wishlist are both
 * server-owned behind httpOnly cookies; compare is deliberately not, because it
 * is a browsing aid a signed-out shopper must be able to use without being asked
 * to create an account. `localStorage` over `sessionStorage` — a comparison is
 * assembled across visits, not within one tab.
 *
 * Only product slugs are stored. Storing names or prices would render whatever
 * was true when the product was added, and the comparison is required to show
 * current prices.
 *
 * Slugs rather than ids because the public product endpoint resolves by slug
 * only — `GET /products/:id` is a 404 — so a list of ids could not be fetched
 * back. The cost is that renaming a product orphans its stored entry, which
 * fails exactly as a deleted product does and is pruned the same way.
 *
 * Every access is defensive. Storage can be unavailable (private browsing,
 * blocked cookies, quota exhausted) or hold something another version wrote. A
 * failure means "no stored list" and compare degrades to session-only — it must
 * never throw into a render.
 */

const COMPARE_KEY = "compareProductSlugs";

/**
 * How many products can be compared at once. Past this the columns stop being
 * readable on a phone, which is the whole point of the page.
 */
export const COMPARE_LIMIT = 4;

/**
 * The stored slugs, or an empty list.
 *
 * Guards the shape rather than trusting it: anything that is not an array of
 * non-empty strings is discarded wholesale. Duplicates and overflow are trimmed
 * here too, so a hand-edited or older value cannot put the store into a state
 * its own reducer would refuse to create.
 */
export function readCompareSlugs(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(COMPARE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const slugs = parsed.filter(
      (slug): slug is string => typeof slug === "string" && slug.length > 0,
    );

    return [...new Set(slugs)].slice(0, COMPARE_LIMIT);
  } catch {
    return [];
  }
}

export function writeCompareSlugs(slugs: string[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(COMPARE_KEY, JSON.stringify(slugs));
  } catch {
    // Storage full, unavailable, or blocked. The list still works for this
    // session; it simply will not survive a reload.
  }
}
