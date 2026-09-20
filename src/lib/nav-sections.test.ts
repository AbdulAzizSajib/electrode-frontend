import { afterEach, describe, expect, it, vi } from "vitest";
import {
  SECTION_LINKED_ROUTES,
  filterNavForSections,
  isNavHrefVisible,
} from "@/lib/nav-sections";
import { getStoreSettings } from "@/services/store-settings";
import type { HomeConfig, HomeSectionKey, NavItem } from "@/types/store-settings";

/**
 * Every homepage section key, written out.
 *
 * `HomeSectionKey` is a type union with no runtime form, and the one runtime list that exists —
 * `FALLBACK_SETTINGS.homeConfig` — is deliberately module-private. Annotating this as
 * `HomeSectionKey[]` is what makes it self-checking anyway: a key renamed or removed in
 * `types/store-settings.ts` fails to compile here, which is the drift this file is guarding
 * against in the first place.
 */
const ALL_SECTION_KEYS: HomeSectionKey[] = [
  "HERO",
  "BRAND_BAR",
  "FEATURED_CATEGORIES",
  "BEST_SELLING",
  "MID_BANNERS",
  "FEATURED_PRODUCTS",
  "PERKS_BAR",
  "DEAL_OF_WEEK",
  "NEW_ARRIVALS",
  "TESTIMONIALS",
  "BLOG",
  "NEWSLETTER",
];

/** Every section on, which is what a shop that has configured nothing looks like. */
const ALL_ENABLED: HomeConfig = ALL_SECTION_KEYS.map((key) => ({ key, enabled: true }));

/** The same list with the named sections switched off. */
const withDisabled = (...keys: HomeSectionKey[]): HomeConfig =>
  ALL_ENABLED.map((section) =>
    keys.includes(section.key) ? { ...section, enabled: false } : section,
  );

const labels = (items: NavItem[]) => items.map((item) => item.label);

describe("isNavHrefVisible — only a governed target can be hidden", () => {
  it("hides a governed target whose section is off", () => {
    expect(isNavHrefVisible("/blogs", withDisabled("BLOG"))).toBe(false);
  });

  it("shows a governed target whose section is on", () => {
    expect(isNavHrefVisible("/blogs", ALL_ENABLED)).toBe(true);
  });

  it("always shows an ungoverned target, whatever is switched off", () => {
    // A custom path, an external URL and a category are all the merchant's own
    // business — nothing in the homepage config may touch them.
    const everythingOff: HomeConfig = ALL_ENABLED.map((s) => ({ ...s, enabled: false }));

    expect(isNavHrefVisible("/our-story", everythingOff)).toBe(true);
    expect(isNavHrefVisible("https://example.com", everythingOff)).toBe(true);
    expect(isNavHrefVisible("/categories/shoes", everythingOff)).toBe(true);
  });

  it("matches the whole string, so a deeper path under a governed route is untouched", () => {
    // The merchant featured one article deliberately. Turning the blog section
    // off is not a reason to delete that decision.
    expect(isNavHrefVisible("/blogs/how-we-source-our-coffee", withDisabled("BLOG"))).toBe(true);
  });

  it("does not treat a near-miss target as governed", () => {
    // Every ambiguous case resolves toward rendering: failing to hide a link
    // leaves the merchant where they already were, hiding one they wrote
    // destroys work they cannot see or undo.
    expect(isNavHrefVisible("/blogs/", withDisabled("BLOG"))).toBe(true);
    expect(isNavHrefVisible("/products?sort=newest", withDisabled("NEW_ARRIVALS"))).toBe(true);
    expect(isNavHrefVisible("/products?sort=new&page=1", withDisabled("NEW_ARRIVALS"))).toBe(true);
  });

  it("distinguishes two targets that differ only by query string", () => {
    // The reason this module cannot share `catalog-features.ts`'s matcher,
    // which strips the query before comparing.
    const config = withDisabled("NEW_ARRIVALS");

    expect(isNavHrefVisible("/products?sort=new", config)).toBe(false);
    expect(isNavHrefVisible("/products?sort=best", config)).toBe(true);
    expect(isNavHrefVisible("/products", config)).toBe(true);
  });

  it("treats a section missing from the config as enabled", () => {
    // The backend reconciles the stored list before serving it, so a gap is not
    // a merchant's "off" — reading it as one would hide links during exactly the
    // degraded read where the page is already in trouble.
    expect(isNavHrefVisible("/blogs", [])).toBe(true);
  });
});

describe("filterNavForSections — top-level items", () => {
  const nav: NavItem[] = [
    { label: "Shop", href: "/products" },
    { label: "Blog", href: "/blogs" },
    { label: "Contact", href: "/contact" },
  ];

  it("drops only the governed item whose section is off", () => {
    expect(labels(filterNavForSections(nav, withDisabled("BLOG")))).toEqual(["Shop", "Contact"]);
  });

  it("hides nothing when every section is enabled", () => {
    expect(filterNavForSections(nav, ALL_ENABLED)).toEqual(nav);
  });

  it("leaves the stored items untouched", () => {
    // Render-time only. The caller's array is the merchant's saved
    // configuration; mutating it would turn a display rule into data loss.
    const stored: NavItem[] = [{ label: "Blog", href: "/blogs" }];
    filterNavForSections(stored, withDisabled("BLOG"));

    expect(stored).toEqual([{ label: "Blog", href: "/blogs" }]);
  });

  it("restores a link when its section comes back on", () => {
    const off = filterNavForSections(nav, withDisabled("BLOG"));
    const on = filterNavForSections(nav, ALL_ENABLED);

    expect(labels(off)).not.toContain("Blog");
    // Back in its original position, not appended.
    expect(labels(on)).toEqual(["Shop", "Blog", "Contact"]);
  });
});

describe("filterNavForSections — dropdown children", () => {
  it("drops one child of several and keeps the rest", () => {
    const nav: NavItem[] = [
      {
        label: "More",
        href: "/more",
        children: [
          { label: "Blog", href: "/blogs" },
          { label: "Contact", href: "/contact" },
          { label: "About", href: "/about" },
        ],
      },
    ];

    const [item] = filterNavForSections(nav, withDisabled("BLOG"));
    expect(item.children?.map((c) => c.label)).toEqual(["Contact", "About"]);
  });

  it("keeps a parent with its own ungoverned target when every child is dropped", () => {
    // The parent still leads somewhere real, so it renders as a plain link.
    const nav: NavItem[] = [
      {
        label: "Shop",
        href: "/products",
        children: [{ label: "New arrivals", href: "/products?sort=new" }],
      },
    ];

    const filtered = filterNavForSections(nav, withDisabled("NEW_ARRIVALS"));
    expect(labels(filtered)).toEqual(["Shop"]);
    expect(filtered[0].children).toEqual([]);
  });

  it("drops a parent when its own target is governed-and-disabled and no child survives", () => {
    const nav: NavItem[] = [
      {
        label: "Offers",
        href: "/deals",
        children: [{ label: "Best selling", href: "/products?sort=best" }],
      },
    ];

    expect(filterNavForSections(nav, withDisabled("DEAL_OF_WEEK", "BEST_SELLING"))).toEqual([]);
  });

  it("keeps a parent whose own target is governed-and-disabled while a child survives", () => {
    // Something is still worth opening the menu for.
    const nav: NavItem[] = [
      {
        label: "Offers",
        href: "/deals",
        children: [{ label: "Contact", href: "/contact" }],
      },
    ];

    expect(labels(filterNavForSections(nav, withDisabled("DEAL_OF_WEEK")))).toEqual(["Offers"]);
  });

  it("drops a targetless parent once its last child goes", () => {
    // It would otherwise render as a dropdown trigger that opens nothing.
    const nav: NavItem[] = [
      { label: "Reading", href: "", children: [{ label: "Blog", href: "/blogs" }] },
    ];

    expect(filterNavForSections(nav, withDisabled("BLOG"))).toEqual([]);
  });
});

describe("a degraded settings read hides nothing", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps every link when the backend is unreachable", async () => {
    /*
     * The one failure mode worth pinning end-to-end. `getStoreSettings` falls back to a complete
     * all-enabled `homeConfig` on a failed read, so this filter hides nothing — a shopper cannot
     * tell a stripped menu from a merchant's deliberate one, so an outage must not quietly edit
     * the navigation. Asserted against the real service rather than a hand-built config,
     * because the property depends on what that fallback actually contains.
     */
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

    const settings = await getStoreSettings();
    const nav: NavItem[] = [
      { label: "Blog", href: "/blogs" },
      { label: "Offers", href: "/deals" },
      { label: "New arrivals", href: "/products?sort=new" },
    ];

    expect(filterNavForSections(nav, settings.homeConfig)).toEqual(nav);
  });
});

describe("SECTION_LINKED_ROUTES — the map cannot name a section that does not exist", () => {
  it("maps every route to a key the storefront's section registry knows", () => {
    // A renamed or removed section would otherwise leave a dangling mapping:
    // a link nothing can ever hide, and an admin notice that never fires.
    const known = new Set<string>(ALL_SECTION_KEYS);

    for (const [href, key] of Object.entries(SECTION_LINKED_ROUTES)) {
      expect(known, `${href} maps to unknown section ${key}`).toContain(key);
    }
  });
});
