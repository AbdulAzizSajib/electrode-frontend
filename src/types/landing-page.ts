/**
 * A single-product campaign landing page, as served by
 * `GET /landing-pages/by-slug/<slug>`.
 *
 * These shapes mirror the backend's `landing-page.interface.ts`. Every string
 * here is merchant-authored content, not a translation key — a page written in
 * Bangla arrives in Bangla and renders in Bangla with nothing else involved.
 */

export type LandingPageMediaType = "IMAGE" | "VIDEO";

export interface LandingPageMedia {
  type: LandingPageMediaType;
  url: string;
  /** Poster frame for a VIDEO; ignored for an IMAGE. */
  thumbnailUrl?: string;
  alt?: string;
}

export interface LandingPageHighlight {
  /** An Iconify name, e.g. `mdi:truck-fast`. */
  icon?: string;
  title: string;
  text?: string;
}

export interface LandingPageFaq {
  question: string;
  answer: string;
}

export interface LandingPageQuote {
  name: string;
  text: string;
  rating?: number;
  photoUrl?: string;
}

export interface LandingPageTrustBadge {
  icon?: string;
  label: string;
}

/**
 * One delivery option the page offers.
 *
 * `price` is what the server CHARGES for that zone — it is displayed, not
 * decided, here. The browser sends back only `key`; the price it happens to
 * hold is never an input to what anything costs.
 */
export interface DeliveryZone {
  key: string;
  label: string;
  price: number;
}

export interface LandingPageFormField {
  label: string;
  placeholder?: string;
  helper?: string;
}

/**
 * The order form's authored copy.
 *
 * Only `fullName` carries a `required` flag. Phone and address have none by
 * construction: the backend's schema has nowhere to spell "hide the phone" or
 * "make the address optional", so the form always renders and always requires
 * both.
 */
export interface LandingPageOrderForm {
  heading?: string;
  subheading?: string;
  fields: {
    fullName: LandingPageFormField & { required: boolean };
    phone: LandingPageFormField;
    address: LandingPageFormField;
  };
  submitLabel: string;
  notice?: string;
}

/**
 * The bound product, resolved server-side.
 *
 * `unitPrice` and `compareAtPrice` are the PRODUCT's — a landing page cannot
 * author a price. `available` is the same stock figure the order endpoint
 * checks against, so the page's out-of-stock state and a rejected submission
 * cannot disagree.
 */
export interface LandingPageProduct {
  id: string;
  name: string;
  slug: string;
  unitPrice: number;
  compareAtPrice: number | null;
  unit: string | null;
  images: { url: string; alt: string | null }[];
  available: number;
  isOrderable: boolean;
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";

  headline: string;
  subheadline: string | null;
  badgeText: string | null;
  /** Merchant-authored HTML. Sanitised at render — see lib/sanitize-html.ts. */
  bodyHtml: string;

  media: LandingPageMedia[] | null;
  highlights: LandingPageHighlight[] | null;
  faqs: LandingPageFaq[] | null;
  quotes: LandingPageQuote[] | null;
  trustBadges: LandingPageTrustBadge[] | null;

  deliveryZones: DeliveryZone[];
  orderForm: LandingPageOrderForm;

  successHeading: string | null;
  successMessage: string | null;

  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  /** Digits only, validated server-side. Rendered as an id, never as markup. */
  facebookPixelId: string | null;

  productSnapshot: LandingPageProduct;
}

/** What `POST /landing-pages/by-slug/<slug>/quote` returns. */
export interface LandingPageQuoteResult {
  quantity: number;
  zoneKey: string;
  zoneLabel: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
}

/** What the order form submits. */
export interface LandingPageOrderInput {
  quantity: number;
  zoneKey: string;
  fullName?: string;
  phone: string;
  address: string;
  notes?: string;
  /** The last confirmed quote's total, checked against the server's own. */
  expectedTotal?: number;
}

/** The confirmation a placed order returns. */
export interface LandingPageOrderResult {
  id: string;
  orderNumber: string;
  totalAmount: number;
}
