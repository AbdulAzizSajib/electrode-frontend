import { apiFetch } from "@/lib/api-client";
import type { Testimonial } from "@/types/testimonial";

/** Same window as the blog and the banners — merchant content, not catalog. */
const TESTIMONIALS_REVALIDATE_SECONDS = 300;

/** The cache tag the backend invalidates after a testimonial is created, edited or deleted. */
export const TESTIMONIALS_CACHE_TAG = "testimonials";

/**
 * Published testimonials, in the merchant's own order, bounded by the endpoint
 * to what the homepage section renders.
 *
 * Returns an empty array rather than throwing on failure: the homepage renders
 * several independent sections, and one outage must shorten the page rather
 * than fail it. Empty is also the specified behaviour for a shop with nothing
 * published — the section is omitted entirely.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data } = await apiFetch<Testimonial[]>("/testimonials", {
      revalidate: TESTIMONIALS_REVALIDATE_SECONDS,
      tags: [TESTIMONIALS_CACHE_TAG],
    });

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * The author's initials, for a testimonial with no photo.
 *
 * At most two, from the first and last word — "Rahim Ahmed" gives "RA". A card
 * without a photo then occupies the same footprint as one with a photo, so a
 * mixed row does not stagger.
 */
export function authorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return (parts[0][0] ?? "").toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}
