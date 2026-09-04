import { apiFetch } from "@/lib/api-client";
import { sanitizeHtml } from "@/lib/sanitize-html";
import type { ApiPage, ContentPage } from "@/types/page";

/**
 * Content pages change rarely — a refund policy is edited a few times a year —
 * but publishing one should feel immediate, so this matches the five-minute
 * window the rest of the storefront's merchant-managed content uses rather
 * than caching indefinitely.
 */
const PAGE_REVALIDATE_SECONDS = 300;

/**
 * A published page by slug, or null.
 *
 * Sanitising happens HERE, in the service, not in the component that renders
 * it. That is deliberate: it makes the safe path the default one, so a future
 * second consumer of a page body cannot forget. The guarantee still holds at
 * the render boundary because nothing else returns a `ContentPage`.
 *
 * Returns null rather than throwing on every failure — a missing slug, an
 * unpublished page, and an unreachable API are all "there is no page here" as
 * far as the route is concerned, and it calls `notFound()` for all three. A
 * draft is therefore indistinguishable from a page that never existed.
 */
export async function getPageBySlug(slug: string): Promise<ContentPage | null> {
  try {
    const { data } = await apiFetch<ApiPage>(`/pages/${encodeURIComponent(slug)}`, {
      revalidate: PAGE_REVALIDATE_SECONDS,
    });

    if (!data || typeof data.body !== "string") return null;

    return {
      title: data.title,
      slug: data.slug,
      body: sanitizeHtml(data.body),
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    };
  } catch {
    return null;
  }
}

/**
 * A plain-text summary of a page body, for the meta description when the
 * merchant has not written one.
 *
 * Runs over the SANITISED body, so markup the storefront would never render
 * cannot leak into a description that search engines do read. Truncates on a
 * word boundary rather than mid-word.
 */
export function excerptFromBody(html: string, maxLength = 160): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;

  const clipped = text.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}
