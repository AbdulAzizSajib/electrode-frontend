/**
 * A single-product campaign landing page, as served by
 * `GET /landing-pages/by-slug/<slug>`.
 *
 * These shapes mirror the backend's `landing-page.interface.ts`. Every string
 * here is merchant-authored content, not a translation key — a page written in
 * Bangla arrives in Bangla and renders in Bangla with nothing else involved.
 */

import type { AdvancePaymentConfig, DeliveryOption } from "@/types/store-settings";

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
  /**
   * Optional, because a review may be a SCREENSHOT instead — the message a
   * customer actually sent. A quote always carries text or an image; the
   * backend rejects one with neither.
   */
  text?: string;
  rating?: number;
  /** The reviewer's own avatar. */
  photoUrl?: string;
  /** The review itself as an image. */
  imageUrl?: string;
}

/**
 * One tier the campaign offers — a size, a bundle, a quantity.
 *
 * `price` is what the server CHARGES for that tier, displayed here and decided
 * there: the browser sends back only `key`. A page with no packages sells its
 * bound product at the product's own price, exactly as before packages existed.
 */
export interface LandingPagePackage {
  key: string;
  label: string;
  /**
   * Which catalogue product this tier ships.
   *
   * Declared because the payload carries it — an undeclared field that arrives
   * anyway is exactly the drift `verify-landing-page-shapes` exists to catch.
   * Nothing on the storefront reads it: what a tier costs is decided by the
   * server from `key`, never from anything the browser holds.
   */
  productId: string;
  price: number;
  /** The struck-through "was" figure. Always above `price`. */
  compareAtPrice?: number;
  /** e.g. "+ ফ্রি ১ কেজি চিনিগুঁড়া চাল" */
  freeGiftText?: string;
  /** A short highlight ribbon, e.g. "হট অফার". */
  badge?: string;
  preselected?: boolean;
}

/** One numbered "why we are different" reason. */
export interface LandingPageWhyUs {
  title: string;
  text?: string;
}

/** One "what would I do with this" idea. `icon` is an Iconify name. */
export interface LandingPageUsageIdea {
  label: string;
  icon?: string;
}

/**
 * The campaign's own look — every colour the page draws, as named tokens.
 *
 * All optional. An unset token simply does not appear in the page's style
 * attribute, so the CSS default in globals.css applies — which is what makes a
 * page that sets nothing identical to one written before tokens existed.
 */
export interface LandingPageTheme {
  /** The campaign's colour: buttons, badges, active states. */
  accent?: string;
  /** A wash of it — band backgrounds and selected-card fills. */
  accentSoft?: string;
  /** What is legible ON the accent, usually white. */
  accentContrast?: string;
  /** The primary content background. */
  surface?: string;
  /** The alternating band background. */
  surfaceAlt?: string;
  /** Body and heading colour. */
  text?: string;
  /** Secondary copy. One muted weight; a second is opacity on this. */
  textMuted?: string;
  /** Every rule and card edge. */
  border?: string;
  displayFont?: { family: string; url: string };
}

/**
 * Progress toward a limited run, or null when the merchant declared none.
 *
 * COUNTED by the server from real orders — there is no way for a merchant to
 * seed or offset it. `remaining` is clamped at zero, so a run past its target
 * reports `met` rather than a negative number.
 */
export interface LandingPageScarcity {
  target: number;
  taken: number;
  remaining: number;
  met: boolean;
}

export interface LandingPageTrustBadge {
  icon?: string;
  label: string;
}

/**
 * Where the order is going, as the shopper chose it.
 *
 * The same pair the shop's checkout captures. The browser resolves it to one of
 * the shop's delivery options and submits that key; this travels alongside so
 * the order records the place, not just the band it fell into.
 */
export interface LandingDestination {
  district: string;
  area: string;
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
 * `unitPrice` and `sellingPrice` are the PRODUCT's — a landing page cannot
 * author a price. `available` is the same stock figure the order endpoint
 * checks against, so the page's out-of-stock state and a rejected submission
 * cannot disagree.
 */
export interface LandingPageProduct {
  id: string;
  name: string;
  slug: string;
  unitPrice: number;
  sellingPrice: number | null;
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

  /**
   * THE SHOP'S delivery options, not the campaign's own.
   *
   * A campaign no longer authors delivery prices — the charge is derived from
   * the shopper's district against this list, exactly as at the shop's
   * checkout, so the same address costs the same through either path. Pickup
   * options are excluded server-side: collection is somewhere a shopper goes,
   * not somewhere an address resolves to.
   *
   * Also the fallback: where a district resolves to nothing configured, these
   * are what the shopper is asked to choose from.
   */
  deliveryOptions: DeliveryOption[];
  orderForm: LandingPageOrderForm;

  /*
   * Offer mechanics. All absent on a page that configures none, which renders
   * exactly as landing pages did before this existed.
   */
  packages: LandingPagePackage[] | null;
  whyUs: LandingPageWhyUs[] | null;
  usageIdeas: LandingPageUsageIdea[] | null;
  /**
   * An ABSOLUTE INSTANT (ISO), never a remaining duration.
   *
   * The page is cached, so a server-computed "6 days left" would be wrong the
   * moment it was stored. The countdown is computed in the browser from this,
   * which is also what makes every visitor count down to the same moment
   * instead of to their own arrival.
   */
  offerEndsAt: string | null;
  /** When true, passing `offerEndsAt` also stops the server accepting orders. */
  stopOrdersAtDeadline: boolean;
  orderPhone: string | null;
  /**
   * Whether this campaign asks for money before it ships.
   *
   * The switch alone. What the form actually renders comes from
   * `advancePayment` below, which the server resolves against the shop's own
   * settings — so a campaign whose switch is on but whose shop has no accounts
   * arrives here as `true` with no config, and asks for nothing.
   */
  requiresAdvancePayment: boolean;
  /**
   * The accounts this campaign actually offers, or null when it offers none.
   *
   * RESOLVED SERVER-SIDE against the shop's own settings, so this is already
   * the answer rather than something to compute: a campaign whose switch is on
   * but whose shop has removed its accounts arrives here as null, and the form
   * asks for nothing. Read this, never `requiresAdvancePayment`, to decide
   * whether to render the payment section.
   */
  advancePayment: AdvancePaymentConfig | null;
  theme: LandingPageTheme | null;
  /**
   * The SIZE of the limited run, as the merchant configured it.
   *
   * Declared because it is served. Prefer `scarcity` below for anything that
   * renders: it carries the target alongside the counted progress, so a reader
   * cannot accidentally show a target with a figure it does not belong to.
   */
  scarcityTarget: number | null;
  /** Null when no limited run is declared. */
  scarcity: LandingPageScarcity | null;

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
/** What one advance-payment choice costs: sent now, and left for the door. */
export interface AdvanceSplit {
  advanceAmount: number;
  balanceAmount: number;
}

export interface LandingPageQuoteResult {
  quantity: number;
  /** The SHOP's delivery option this order is priced by. */
  deliveryOptionKey: string;
  deliveryOptionLabel: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  /**
   * What each advance-payment choice costs.
   *
   * Always present, even on a campaign that does not ask for an advance — it
   * derives from `totalAmount`, and omitting it would force a re-fetch the
   * moment a merchant flipped the switch.
   */
  advanceOptions: Record<"DELIVERY_CHARGE" | "FULL", AdvanceSplit>;
}

/** What the order form submits. */
export interface LandingPageOrderInput {
  quantity: number;
  /** One of the shop's delivery options, resolved from the destination. */
  deliveryOptionKey: string;
  destination?: LandingDestination;
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
