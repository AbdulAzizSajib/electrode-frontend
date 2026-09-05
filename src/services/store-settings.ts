import { apiFetch } from "@/lib/api-client";
import type { StoreSettings } from "@/types/store-settings";

/**
 * How stale this payload may get in the WORST case — when the backend's
 * revalidation ping below never arrives.
 *
 * Deliberately much shorter than the category tree's and the banners' five
 * minutes, despite this changing just as rarely. The difference is who notices:
 * a merchant edits their own theme and immediately reloads to check it. Five
 * minutes of "did my save work?" is indistinguishable from a broken feature,
 * and that is a worse failure than a small amount of extra traffic.
 *
 * This is the floor of correctness, not the expected behaviour: a correctly
 * configured deployment invalidates the tag on save and updates instantly. This
 * bound is what keeps the feature usable when that is misconfigured, pointed at
 * the wrong origin, or blocked between the two services.
 *
 * The cost is one small request per 30s ACROSS ALL TRAFFIC, not per visitor —
 * it is a single shared cache entry over a singleton row read by primary key.
 */
const SETTINGS_REVALIDATE_SECONDS = 30;

/**
 * The cache tag the backend invalidates after a merchant saves their settings.
 *
 * Without it the five minutes above are a floor, not a ceiling: a merchant
 * changes a colour, reloads, sees the old one, and cannot tell "saved but
 * cached" from "broken". With it, the window only ever governs how stale an
 * UNEDITED store gets — a save takes effect on the next request.
 */
export const STORE_SETTINGS_CACHE_TAG = "store-settings";

/**
 * What the storefront renders when the API cannot be reached.
 *
 * Not a blank object: the header and footer are on EVERY page, so a failed read
 * has to leave a usable site rather than a stripped one. These mirror the
 * backend's own `DEFAULT_PUBLIC_SETTINGS`, which is what a healthy response
 * would have merged in anyway.
 */
const FALLBACK_SETTINGS: StoreSettings = {
  storeName: "Gadgets",
  siteNameAccent: "Mart",
  logoUrl: null,
  footerLogoUrl: null,
  aboutText:
    "Welcome to our store, where we pride ourselves on providing exceptional products and unparalleled customer service, style and innovation.",
  copyrightText: "Gadgets Mart - Electronics Store. Built with Next.js.",
  siteUrl: null,
  metaTitle: null,
  metaDescription: null,
  currency: "BDT",
  currencySymbol: "৳",
  /*
   * Reproduce the storefront's pre-configuration rendering — `formatPrice` was
   * the literal `` `৳${value.toFixed(2)}` `` — so a failed settings read leaves
   * prices looking as they always have rather than symbol-less. Mirrors the
   * backend's DEFAULT_PUBLIC_SETTINGS.
   */
  currencyPosition: "BEFORE",
  currencyDecimals: 2,
  contact: {
    email: "contact@sheisite.com",
    phone: "+8801782521705",
    address: "Electrode - Electronics Store, 507 Union Trade, Ipsum Dolor Centre",
  },
  mainNav: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: "Best Selling", href: "/products?sort=best" },
    { label: "New Arrivals", href: "/products?sort=new" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact", href: "/contact" },
  ],
  footerColumns: [],
  socialLinks: [],
  announcementBar: {
    enabled: true,
    text: "Free delivery & 40% discount for next 3 orders! Place your 1st order in.",
    links: [
      {
        icon: "akar-icons:whatsapp-fill",
        label: "+8801782521705",
        href: "https://wa.me/8801782521705",
        source: "contactPhone",
      },
      {
        icon: "garden:email-stroke-16",
        label: "contact@sheisite.com",
        href: "mailto:contact@sheisite.com",
        source: "contactEmail",
      },
      { icon: "fa-solid:truck", label: "Track Order", href: "/track-order" },
    ],
  },
  newsletter: {
    heading: "Join Our Newsletter For ৳10 Off",
    subtext:
      "Subscribe to our latest newsletter to get news about special discounts and upcoming sales.",
    placeholder: "Email",
    buttonLabel: "Subscribe",
  },
  /*
   * Mirrors the backend's DEFAULT_CHECKOUT_CONFIG, which in turn reproduces the
   * checkout this storefront had before it was configurable. A settings outage
   * therefore degrades checkout to its old behaviour, never to an unusable one.
   */
  checkoutConfig: {
    fields: {
      fullName: { show: true, required: true },
      phone: { show: true, required: true },
      addressLine1: { show: true, required: true },
      addressLine2: { show: true, required: false },
      city: { show: true, required: true },
      postalCode: { show: true, required: false },
    },
    showCouponBox: true,
    showOrderNote: true,
    allowGuestCheckout: true,
    notice: "",
    /*
     * No options, which is the honest fallback rather than a safe-looking one.
     * Delivery prices are merchant money; inventing an area and a charge to
     * degrade gracefully would mean charging a shopper an amount nobody chose.
     * Checkout refuses to price an order against an empty list and says the
     * store has not set delivery up.
     */
    delivery: { offersPickup: false, options: [] },
  },
  /*
   * Mirrors the backend's DEFAULT_THEME, which mirrors globals.css. These are
   * the same values the stylesheet already carries, so a failed settings read
   * paints the site exactly as the stylesheet alone would.
   */
  /*
   * WEBSITE and null, so a storefront that cannot reach the settings API
   * renders the normal shop. This is the only safe direction to fail in:
   * falling back to LANDING_PAGE would replace the home page with a redirect to
   * a page whose slug we do not know. Mirrors the backend's own default.
   */
  siteMode: "WEBSITE",
  activeLandingPage: null,
  theme: {
    background: "#ffffff",
    foreground: "#1a1a1a",
    brand: "#0f63b3",
    brandDark: "#133f9e",
    accent: "#f5b301",
    sale: "#e02020",
    maxWidth: 1440,
    font: {
      family: "Outfit",
      url: "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap",
    },
  },
};

/**
 * The merchant-managed header and footer content.
 *
 * Never throws — this is awaited in the root layout, so an unhandled error
 * would take down every page on the site. Any failure yields the defaults
 * above and the chrome still renders.
 *
 * Individual fields are backfilled too, not just the whole payload: an older
 * API that predates one of these keys, or a partial response, must not leave a
 * component destructuring `undefined`.
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const { data } = await apiFetch<Partial<StoreSettings>>("/settings/public", {
      revalidate: SETTINGS_REVALIDATE_SECONDS,
      tags: [STORE_SETTINGS_CACHE_TAG],
    });

    if (!data || typeof data !== "object") return FALLBACK_SETTINGS;

    return {
      ...FALLBACK_SETTINGS,
      ...data,
      /*
       * Backfilled individually because a spread would carry through an
       * explicit `null` or a missing key from an older API, and `formatPrice`
       * would then interpolate `undefined` into every price on the site.
       */
      currencyPosition: data.currencyPosition ?? FALLBACK_SETTINGS.currencyPosition,
      currencyDecimals:
        typeof data.currencyDecimals === "number"
          ? data.currencyDecimals
          : FALLBACK_SETTINGS.currencyDecimals,
      contact: { ...FALLBACK_SETTINGS.contact, ...(data.contact ?? {}) },
      announcementBar: data.announcementBar ?? FALLBACK_SETTINGS.announcementBar,
      newsletter: data.newsletter ?? FALLBACK_SETTINGS.newsletter,
      /*
       * Backfilled per-field, not just per-block: an older API that predates one
       * of these keys, or a row missing a colour, must not leave checkout
       * without a field map or the layout interpolating `undefined` into a
       * style attribute.
       */
      checkoutConfig: {
        ...FALLBACK_SETTINGS.checkoutConfig,
        ...(data.checkoutConfig ?? {}),
        fields: {
          ...FALLBACK_SETTINGS.checkoutConfig.fields,
          ...(data.checkoutConfig?.fields ?? {}),
        },
        delivery: {
          ...FALLBACK_SETTINGS.checkoutConfig.delivery,
          ...(data.checkoutConfig?.delivery ?? {}),
        },
      },
      theme: {
        ...FALLBACK_SETTINGS.theme,
        ...(data.theme ?? {}),
        font: { ...FALLBACK_SETTINGS.theme.font, ...(data.theme?.font ?? {}) },
      },
      /*
       * Backfilled together and defensively. An older API that predates these
       * keys reports neither, and a spread would leave `siteMode` undefined —
       * which is falsy, so the root would render the homepage, but only by
       * accident. Saying WEBSITE explicitly makes that the decision it is.
       *
       * The pair is also cross-checked: LANDING_PAGE mode with no page to serve
       * is not a state the root can act on, so it degrades to WEBSITE rather
       * than redirecting to `/lp/undefined`.
       */
      siteMode:
        data.siteMode === "LANDING_PAGE" && data.activeLandingPage?.slug
          ? "LANDING_PAGE"
          : "WEBSITE",
      activeLandingPage: data.activeLandingPage?.slug ? data.activeLandingPage : null,
      // Arrays are taken only when they really are arrays. An empty list is a
      // legitimate merchant choice ("no footer columns") and is preserved; a
      // malformed value falls back rather than reaching `.map()`.
      mainNav: Array.isArray(data.mainNav) ? data.mainNav : FALLBACK_SETTINGS.mainNav,
      footerColumns: Array.isArray(data.footerColumns)
        ? data.footerColumns
        : FALLBACK_SETTINGS.footerColumns,
      socialLinks: Array.isArray(data.socialLinks)
        ? data.socialLinks
        : FALLBACK_SETTINGS.socialLinks,
    };
  } catch {
    return FALLBACK_SETTINGS;
  }
}

/**
 * Resolves an announcement link against the store's contact details.
 *
 * A link with `source` set follows the store's phone or email; one without it
 * is a plain merchant-authored link and passes through untouched. When the
 * bound contact column is empty the stored literals are used, so a bar row
 * never renders blank.
 */
export function resolveAnnouncementLink(
  link: { label: string; href: string; source?: string },
  contact: StoreSettings["contact"],
): { label: string; href: string } {
  if (link.source === "contactPhone" && contact.phone) {
    return {
      label: contact.phone,
      href: `https://wa.me/${contact.phone.replace(/\D/g, "")}`,
    };
  }
  if (link.source === "contactEmail" && contact.email) {
    return { label: contact.email, href: `mailto:${contact.email}` };
  }
  return { label: link.label, href: link.href };
}
