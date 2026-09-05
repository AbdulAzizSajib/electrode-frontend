/**
 * Merchant-authored customer testimonials, as served by `GET /testimonials`.
 *
 * Marketing copy the merchant writes, NOT a product `Review`. A Review is tied
 * to a customer and a purchase; these are quotes a merchant chooses to display.
 * The two stay separate so editorial copy is never presented with a review's
 * authority.
 */
export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  /** The line under the name — "Verified Buyer", "CEO, Acme". */
  authorRole: string;
  /** Null renders as the author's initials, never as a gap or a stock silhouette. */
  photoUrl: string | null;
  /** Whole stars, 1–5. Replaces a hardcoded 5. */
  rating: number;
}
