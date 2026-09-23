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

/**
 * One link action in the header's MAIN row — the one with the brand, the search
 * box and the cart — rendered beside Wishlist, Compare, Cart and Account.
 *
 * NOT an announcement link, and the difference is the point. The announcement
 * strip is for contact details and a promotional message: it is hidden below
 * `md`, and it disappears entirely when the merchant switches it off. An action
 * a returning shopper comes back to perform — Track Order is the one that moved
 * — cannot live somewhere that vanishes with a toggle unrelated to it.
 *
 * No `source` binding for the same reason: a link bound to the store's phone or
 * email IS a contact detail, and belongs in the strip above.
 *
 * DESKTOP ONLY, inherited rather than declared — these render inside the
 * header's action group, which is `hidden md:flex`. The mobile bottom nav and
 * the drawer carry the primary actions on small screens and deliberately do not
 * render these. See server/openspec/changes/add-header-middle-bar-links, design.md
 * Decisions 3 and 4.
 */
export interface MiddleBarLink {
  /** An Iconify name, e.g. `fa-solid:truck`. Optional — a label alone is valid. */
  icon?: string;
  label: string;
  href: string;
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
 * Every section the homepage can be composed from.
 *
 * A CLOSED set mirroring HOME_SECTION_KEYS in the backend's
 * store-setting.constant.ts, which is the authority — these keys are what a
 * stored merchant configuration names, so the two must be kept in step by hand.
 * Adding a section means adding it in all five places: there, here, in
 * `FALLBACK_SETTINGS.homeConfig` (services/store-settings.ts), in the admin's
 * SECTION_REGISTRY, and in the homepage's render map — a key missing from the
 * last of those is a section the storefront cannot map to a component.
 *
 * Only the HOMEPAGE. Header, footer, announcement bar, cart drawer and mobile
 * nav are rendered by the `(shop)` layout on every route and are deliberately
 * not addressable — see server/openspec/changes/add-homepage-section-toggles.
 */
export type HomeSectionKey =
  | "HERO"
  | "BRAND_BAR"
  | "FEATURED_CATEGORIES"
  | "BEST_SELLING"
  | "MID_BANNERS"
  | "FEATURED_PRODUCTS"
  | "PERKS_BAR"
  | "DEAL_OF_WEEK"
  | "NEW_ARRIVALS"
  | "TESTIMONIALS"
  | "BLOG"
  /**
   * The email signup band. It was welded into the FOOTER until
   * add-favicon-and-newsletter-section — on every page, removable only by
   * emptying its heading. It is a home page section now, so it appears here and
   * nowhere in the `(shop)` layout.
   */
  | "NEWSLETTER";

/**
 * The hero's LAYOUT — how its artwork is arranged, as distinct from the artwork
 * itself, which is banners keyed by placement.
 *
 *   SPLIT_THREE   slider left | 2 square tiles + 1 wide tile right  (DEFAULT)
 *   FULL_SLIDER   one wide slider, no tiles
 *   SLIDER_STACK  full-width slider above a row of 3 tiles
 *   SPLIT_TALL    slider left (two thirds) | 1 tall tile right
 *
 * ANOTHER HAND-MAINTAINED MIRROR, alongside `HomeSectionKey` above: the
 * authority is `HERO_VARIANTS` in the backend's store-setting.constant.ts, and
 * the order there is load-bearing because position 0 is the default. Nothing
 * checks the two agree, so a layout added there and not here renders as
 * `SPLIT_THREE` — degraded, but not broken. See `resolveSectionLayout` in
 * `lib/section-layouts.ts`, and openspec/changes/add-hero-section-variants-ui.
 */
export type HeroVariant = "SPLIT_THREE" | "FULL_SLIDER" | "SLIDER_STACK" | "SPLIT_TALL";

/**
 * The featured-categories section's LAYOUT — how its tiles are arranged, as
 * distinct from which categories appear, which the category service decides.
 *
 *   GRID     the tiles in a wrapping grid, seven across at desktop  (DEFAULT)
 *   SLIDER   the same tiles in one horizontal row that scrolls
 *
 * THE SAME HAND-MAINTAINED MIRROR as `HeroVariant` above: the authority is
 * `FEATURED_CATEGORIES_VARIANTS` in the backend's store-setting.constant.ts,
 * position 0 is the default, and nothing checks the two agree. A layout added
 * there and not here renders as `GRID` — degraded, not broken. See
 * `resolveSectionLayout` in `lib/section-layouts.ts`, and
 * server/openspec/changes/add-featured-categories-layout.
 */
export type FeaturedCategoriesLayout = "GRID" | "SLIDER";

/**
 * Every layout any section offers. A section entry carries at most one of
 * these, and which union it belongs to is decided by the entry's `key` — see
 * `SECTION_LAYOUTS` in `lib/section-layouts.ts`.
 */
export type SectionLayout = HeroVariant | FeaturedCategoriesLayout;

/**
 * One homepage section's placement and visibility.
 *
 * `enabled` is the merchant's decision and NOT a promise that the section has
 * anything to show — an enabled section whose data comes back empty still
 * renders nothing. The two conditions are independent; see the homepage route.
 */
export interface HomeSection {
  key: HomeSectionKey;
  enabled: boolean;
  /**
   * The section's layout, present only on sections that offer a choice —
   * `HERO` and `FEATURED_CATEGORIES`. Which values are legal depends on `key`;
   * the type is the union of every section's layouts because one field serves
   * every entry, and `resolveSectionLayout` narrows it per section.
   *
   * OPTIONAL HERE, ALWAYS PRESENT IN PRACTICE. The backend resolves it on every
   * read, so a real payload carries it on those sections even for a store that
   * has never chosen one. It is optional because the settings API may be older
   * than this storefront, and because `FALLBACK_SETTINGS` has to be able to
   * express the same shape.
   */
  variant?: SectionLayout;
}

/**
 * The homepage's sections in render order. ORDER IS THE DATA: position in this
 * array is the order the storefront lays the sections out in.
 *
 * Always complete and always current — the backend reconciles the stored value
 * against its registry before serving it, so every key appears exactly once and
 * a section added in a later release arrives enabled rather than missing. The
 * storefront therefore never has to defend against a gap here.
 */
export type HomeConfig = HomeSection[];

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
/**
 * The shop-wide Meta pixel, as the public settings endpoint reports it.
 *
 * `enabled` is independent of whether an id is set: a merchant can switch
 * tracking off without discarding the id they would have to find again. BOTH are
 * required before anything fires — see `resolvePixelId`.
 *
 * `pixelId` is digits only, bounded 5–20 by the backend. That bound is what makes
 * interpolating it into the pixel bootstrap safe, so it must hold at both ends;
 * mirrors `integrationConfigSchema` in the backend's store-setting.validation.ts.
 */
export interface FacebookPixel {
  enabled: boolean;
  /** `""` means unset. */
  pixelId: string;
}

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
   * The browser-tab icon the merchant chose, or null for "they chose none".
   *
   * Null is NOT a blank icon and is deliberately not a copy of the icon this
   * app ships with — the API answers only what the merchant set, and resolving
   * the fallback is this app's job because this app owns that asset. See
   * `resolveIcons` in `lib/seo/resolve-metadata.ts`.
   */
  faviconUrl: string | null;
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
  /**
   * The header main row's merchant-configurable links. Capped at 4 by the
   * backend — this row runs out of horizontal space before any other.
   */
  middleBarLinks: MiddleBarLink[];
  newsletter: Newsletter;
  checkoutConfig: CheckoutConfig;
  catalogConfig: CatalogConfig;
  /**
   * Which sections the HOMEPAGE is composed of, and in what order.
   *
   * Governs `/` and nothing else — the header, footer, announcement bar, cart
   * drawer and mobile nav are rendered by the shop layout on every route and
   * are deliberately not addressable here.
   */
  homeConfig: HomeConfig;
  theme: Theme;
  /**
   * Everything the SEO menu controls. Always complete — the backend merges it
   * over its own defaults, and `getStoreSettings` repairs a partial payload — so
   * the resolver never has to null-check a nested SEO field.
   */
  seoConfig: SeoConfig;
  /**
   * The shop-wide Meta pixel.
   *
   * ONLY THE PIXEL. The backend's `integrationConfig` column also carries the
   * Conversions API settings, and the CAPI access token is not on that row at
   * all — it is encrypted in the credential store. The public endpoint projects
   * this one named object rather than the whole column, which is what keeps that
   * an allow-list: a field added there later stays private until someone opts it
   * in.
   *
   * A campaign landing page carrying its own pixel uses that one instead; see
   * `resolvePixelId`.
   */
  facebookPixel: FacebookPixel;
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
