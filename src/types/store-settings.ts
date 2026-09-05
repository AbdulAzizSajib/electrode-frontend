/**
 * The storefront-safe projection served by `GET /settings/public`.
 *
 * These shapes mirror the backend's `store-setting.validation.ts`. The endpoint
 * merges in-code defaults over the stored row, so every field below is present
 * on a successful response — a fresh install with an empty settings table still
 * yields renderable chrome rather than nulls each component has to defend
 * against.
 */

/** Which of the two things the storefront root serves. */
export type SiteMode = "WEBSITE" | "LANDING_PAGE";

/** Enough of the live campaign page to route the root at it. */
export interface ActiveLandingPage {
  slug: string;
  title: string;
}

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem extends NavChild {
  /** One level only — the backend rejects a third structurally. */
  children?: NavChild[];
}

/**
 * Binds an announcement-bar link to the store's contact details. When set, the
 * bar renders the label and href from `contact.phone`/`contact.email` instead
 * of the stored literals, so the header strip and the footer's contact block
 * cannot drift apart.
 */
export type AnnouncementLinkSource = "contactPhone" | "contactEmail";

export interface AnnouncementLink extends NavChild {
  /** An Iconify name, e.g. `akar-icons:whatsapp-fill`. */
  icon?: string;
  source?: AnnouncementLinkSource;
}

export interface AnnouncementBar {
  enabled: boolean;
  text: string;
  links?: AnnouncementLink[];
}

export interface FooterColumn {
  title: string;
  /** Objects, never bare strings — a footer link without a target renders dead. */
  links: NavChild[];
}

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "youtube"
  | "x"
  | "pinterest";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface Newsletter {
  heading: string;
  subtext: string;
  placeholder?: string;
  buttonLabel?: string;
}

/** The six checkout fields a merchant may configure. Keys match the order payload. */
export type CheckoutFieldKey =
  | "fullName"
  | "phone"
  | "addressLine1"
  | "addressLine2"
  | "city"
  | "postalCode";

export interface CheckoutField {
  show: boolean;
  required: boolean;
}

/** Whether an option is delivered to the shopper or collected by them. */
export type DeliveryKind = "DELIVERY" | "PICKUP";

/**
 * One delivery choice the shopper picks at checkout.
 *
 * Nothing here is matched against the address they type — the price is whatever
 * they chose. `key` is what the order carries; `label` is what they read.
 */
export interface DeliveryOption {
  key: string;
  label: string;
  kind: DeliveryKind;
  price: number;
  days: number;
}

export interface DeliverySettings {
  /**
   * Off, the checkout offers the delivery areas alone and shows no
   * delivery-or-collection step, even if pickup options are configured.
   */
  offersPickup: boolean;
  /**
   * Empty only for a store that has never configured delivery. Checkout cannot
   * price an order in that state and says so.
   */
  options: DeliveryOption[];
}

export interface CheckoutConfig {
  fields: Record<CheckoutFieldKey, CheckoutField>;
  /** Governs the coupon box on BOTH the cart and the checkout page. */
  showCouponBox: boolean;
  showOrderNote: boolean;
  allowGuestCheckout: boolean;
  /** Rendered above the Place Order button. Empty means render nothing at all. */
  notice: string;
  delivery: DeliverySettings;
}

export interface ThemeFont {
  family: string;
  /**
   * Always a fonts.googleapis.com stylesheet rebuilt by the backend parser from
   * validated parts — never a string a merchant typed. See the backend's
   * google-font.ts for why that distinction matters here.
   */
  url: string;
}

export interface Theme {
  background: string;
  foreground: string;
  brand: string;
  brandDark: string;
  accent: string;
  sale: string;
  /** Pixels, or `"full"` for an unconstrained content width. */
  maxWidth: number | "full";
  font: ThemeFont;
}

/** Mirrors the backend's `CurrencyPosition` enum. */
export type CurrencyPosition = "BEFORE" | "AFTER";

/**
 * Everything needed to write a monetary amount, as one value.
 *
 * The three travel together because they are only meaningful together — a
 * symbol without its position renders on the wrong side, a decimal count
 * without its symbol renders a bare number.
 */
export interface CurrencyFormat {
  symbol: string;
  position: CurrencyPosition;
  decimals: number;
}

export interface StoreSettings {
  storeName: string;
  /** The second, accent-coloured half of the wordmark. */
  siteNameAccent: string;
  logoUrl: string | null;
  /** Null falls back to `logoUrl`, then to the text wordmark. */
  footerLogoUrl: string | null;
  aboutText: string;
  copyrightText: string;
  /** Canonical origin for absolute metadata URLs. Null leaves them relative. */
  siteUrl: string | null;
  /** Null falls back to the site name, so the document title is never empty. */
  metaTitle: string | null;
  metaDescription: string | null;
  currency: string;
  currencySymbol: string;
  /** Which side of the amount the symbol sits on. */
  currencyPosition: CurrencyPosition;
  /**
   * How many decimal places a price shows.
   *
   * PRESENTATION ONLY. Money is stored and charged to the cent regardless, so a
   * store set to 0 still charges 1200.50 while displaying `৳1,201`.
   */
  currencyDecimals: number;
  contact: {
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  mainNav: NavItem[];
  footerColumns: FooterColumn[];
  socialLinks: SocialLink[];
  announcementBar: AnnouncementBar;
  newsletter: Newsletter;
  checkoutConfig: CheckoutConfig;
  theme: Theme;
  /**
   * Whether the storefront ROOT serves the shop or a campaign landing page.
   *
   * Governs `/` and nothing else. In `LANDING_PAGE` mode every other route —
   * catalogue, cart, checkout, tracking, account, blog, CMS pages — stays live
   * and unchanged, so flipping the toggle breaks no existing link.
   */
  siteMode: SiteMode;
  /**
   * The page `/` serves in `LANDING_PAGE` mode. Null when none is live.
   *
   * The backend reports this only while the selected page is PUBLISHED, so the
   * storefront never checks the status itself — a page pulled down arrives here
   * as null and the root falls back to the homepage.
   */
  activeLandingPage: ActiveLandingPage | null;
}
