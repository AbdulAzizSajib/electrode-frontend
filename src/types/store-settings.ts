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

/**
 * How one brand slot — the header or the footer — presents the shop.
 *
 * THE MODE DECIDES, not whether a logo happens to be uploaded. A slot set to
 * `"TEXT"` renders the wordmark even with artwork on file, which is what lets a
 * shop show its logo on the brand-colour header and its wordmark on the dark
 * footer without deleting either image. Mirrors the backend's
 * `BrandDisplayMode`.
 */
export type BrandDisplayMode = "TEXT" | "LOGO";

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

/**
 * Which of the optional catalog features this shop offers.
 *
 * Shop-wide, not per-product: a business either compares products or it does
 * not. Each is independent — a wholesale catalogue may want comparison and no
 * wishlist. All three default to `true` wherever they are absent, so a store
 * that has never configured them, and a settings read that fails, both leave
 * every feature offered. Withdrawing a feature is a presentation decision only;
 * it never deletes what a shopper has already saved under it.
 */
export interface CatalogConfig {
  showWishlist: boolean;
  showCompare: boolean;
  /**
   * Off, a product with variants goes to its own page from a listing rather
   * than opening a preview over it. A product without variants is unaffected
   * and still adds to the cart directly.
   */
  showQuickView: boolean;
}

/**
 * The route groups a page can belong to, for per-group robots directives.
 *
 * A CLOSED set mirroring SEO_ROUTE_GROUPS in the backend's
 * store-setting.constant.ts. Every route declares which group it is in, and the
 * metadata resolver reads its index/follow flags from here — so "should this
 * page be indexed" is answered by a merchant's checklist rather than by each
 * page deciding for itself.
 */
export type SeoRouteGroup =
  | "home"
  | "product"
  | "category"
  | "blog"
  | "page"
  | "landingPage"
  | "account"
  | "cart"
  | "checkout"
  | "wishlist"
  | "compare"
  | "search";

/** The content types the sitemap can list. Mirrors the backend's SEO_CONTENT_TYPES. */
export type SeoContentType = "product" | "category" | "page" | "blogPost" | "landingPage";

export interface SeoRobotsGroup {
  index: boolean;
  follow: boolean;
}

export interface SeoOrganization {
  legalName: string;
  logoUrl: string;
  email: string;
  phone: string;
  /** Social profile URLs, emitted as schema.org `sameAs`. */
  sameAs: string[];
}

/**
 * Everything the SEO menu owns beyond `siteUrl`/`metaTitle`/`metaDescription`,
 * which stay as fields of their own on StoreSettings.
 *
 * `""` means "unset" for every text field — the resolver treats it as absent and
 * falls through to its next fallback, so a merchant clearing a field gets the
 * default back rather than an empty tag.
 */
export interface SeoConfig {
  /** `%s` is replaced by the page's resolved title. `""` means no template. */
  titleTemplate: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultOgImageUrl: string;
  twitterCardType: "summary" | "summary_large_image";
  twitterSite: string;
  robots: {
    /** Overrides every group below, and empties the sitemap. */
    globalNoindex: boolean;
    groups: Record<SeoRouteGroup, SeoRobotsGroup>;
    /** Appended verbatim to the generated robots.txt. */
    customRules: string;
  };
  sitemap: Record<SeoContentType, boolean>;
  structuredData: {
    enableOrganization: boolean;
    enableProduct: boolean;
    enableArticle: boolean;
    enableBreadcrumb: boolean;
    organization: SeoOrganization;
  };
  /** `""` means emit no tag — an empty verification tag is a failed one. */
  verification: {
    google: string;
    bing: string;
    other: string;
  };
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
  /** The storefront's typeface — the one this app renders in. */
  font: ThemeFont;
  /**
   * The ADMIN PANEL's typeface.
   *
   * Carried, never applied. It travels in the same theme blob and is typed
   * here so the mapper can repair it like every other key, but nothing in the
   * storefront reads it — the admin is a separate deployment that reads this
   * same payload for itself. Deliberately not stripped from the type: a value
   * the storefront silently dropped would be one the admin could not explain
   * the absence of.
   */
  adminFont: ThemeFont;
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
  /** Artwork for the header slot. Shown only when `headerBrandMode` is `"LOGO"`. */
  logoUrl: string | null;
  /** Null falls back to `logoUrl`, then to the text wordmark. */
  footerLogoUrl: string | null;
  /**
   * Which of the two things each brand slot shows, decided independently.
   *
   * A slot in `"LOGO"` mode whose artwork cannot be resolved renders the
   * wordmark rather than an empty box — the brand block is on every page, so a
   * blank one is worse than the text it replaced. `resolveBrandSlot` in
   * `src/lib/brand-slot.ts` applies that, and both the header and the footer go
   * through it so the two cannot drift apart.
   */
  headerBrandMode: BrandDisplayMode;
  footerBrandMode: BrandDisplayMode;
  /**
   * Displayed logo height in pixels; width follows the image's proportions.
   *
   * Reserved before the image loads, which is what stops a late logo shifting
   * the page. Bounded 24-96 by the backend — mirrored in the admin, not here,
   * since the storefront only ever renders what was already validated.
   */
  headerLogoHeight: number;
  footerLogoHeight: number;
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
  catalogConfig: CatalogConfig;
  theme: Theme;
  /**
   * Everything the SEO menu controls. Always complete — the backend merges it
   * over its own defaults, and `getStoreSettings` repairs a partial payload — so
   * the resolver never has to null-check a nested SEO field.
   */
  seoConfig: SeoConfig;
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
