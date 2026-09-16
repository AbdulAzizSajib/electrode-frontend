import { describe, expect, it } from "vitest";
import { DEFAULT_FAVICON_PATH, resolveIcons, resolveMetadata } from "./resolve-metadata";
import type { SeoConfig, StoreSettings } from "@/types/store-settings";

/**
 * The precedence chain, which is the whole point of this module.
 *
 * Every storefront route resolves its metadata through this one function, so a
 * mistake here is a mistake on eighteen pages at once — and the specific failure
 * it prevents (a page falling back past the merchant's own SEO title) is
 * invisible in the browser and only shows up in search results weeks later.
 */

const seoConfig: SeoConfig = {
  titleTemplate: "",
  defaultMetaTitle: "",
  defaultMetaDescription: "",
  defaultOgImageUrl: "",
  twitterCardType: "summary_large_image",
  twitterSite: "",
  robots: {
    globalNoindex: false,
    groups: {
      home: { index: true, follow: true },
      product: { index: true, follow: true },
      category: { index: true, follow: true },
      blog: { index: true, follow: true },
      page: { index: true, follow: true },
      landingPage: { index: true, follow: true },
      account: { index: false, follow: false },
      cart: { index: false, follow: false },
      checkout: { index: false, follow: false },
      wishlist: { index: false, follow: false },
      compare: { index: false, follow: false },
      search: { index: false, follow: false },
    },
    customRules: "",
  },
  sitemap: { product: true, category: true, page: true, blogPost: true, landingPage: true },
  structuredData: {
    enableOrganization: true,
    enableProduct: true,
    enableArticle: true,
    enableBreadcrumb: true,
    organization: { legalName: "", logoUrl: "", email: "", phone: "", sameAs: [] },
  },
  verification: { google: "", bing: "", other: "" },
};

/** Only the fields the resolver reads — it never touches the rest of the payload. */
const settings = (overrides: Partial<StoreSettings> = {}) =>
  ({
    storeName: "Gadgets",
    siteNameAccent: "Mart",
    siteUrl: null,
    metaTitle: null,
    metaDescription: null,
    seoConfig,
    ...overrides,
  }) as StoreSettings;

const withSeo = (overrides: Partial<SeoConfig>) =>
  settings({ seoConfig: { ...seoConfig, ...overrides } });

describe("resolveMetadata precedence", () => {
  it("prefers the record's own SEO title", () => {
    const meta = resolveMetadata({
      settings: settings(),
      routeGroup: "product",
      record: { metaTitle: "Best Laptop Deal", title: "Laptop" },
    });

    expect(meta.title).toBe("Best Laptop Deal");
  });

  it("falls back to the record's display title when it has no SEO title", () => {
    const meta = resolveMetadata({
      settings: settings(),
      routeGroup: "product",
      record: { metaTitle: "  ", title: "Laptop" },
    });

    // Whitespace counts as unset, not as a title — otherwise a merchant who
    // clears the field gets a blank tab rather than the product's name.
    expect(meta.title).toBe("Laptop");
  });

  it("falls back to the global default when the record has neither", () => {
    const meta = resolveMetadata({
      settings: withSeo({ defaultMetaTitle: "Shop Electronics" }),
      routeGroup: "page",
    });

    expect(meta.title).toBe("Shop Electronics");
  });

  it("falls back to the wordmark when nothing else is set", () => {
    const meta = resolveMetadata({ settings: settings(), routeGroup: "home" });

    expect(meta.title).toBe("Gadgets Mart");
  });

  it("applies the title template to the resolved title", () => {
    const meta = resolveMetadata({
      settings: withSeo({ titleTemplate: "%s | Acme" }),
      routeGroup: "product",
      record: { title: "Laptop" },
    });

    expect(meta.title).toBe("Laptop | Acme");
  });
});

describe("resolveMetadata robots and canonical", () => {
  it("marks private route groups noindex by default", () => {
    const meta = resolveMetadata({ settings: settings(), routeGroup: "cart" });

    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });

  it("lets globalNoindex override an indexable group", () => {
    const meta = resolveMetadata({
      settings: withSeo({ robots: { ...seoConfig.robots, globalNoindex: true } }),
      routeGroup: "product",
      record: { title: "Laptop" },
    });

    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });

  it("emits a canonical only when siteUrl is set", () => {
    const without = resolveMetadata({
      settings: settings(),
      routeGroup: "product",
      path: "/products/laptop",
    });
    expect(without.alternates?.canonical).toBeUndefined();

    const withUrl = resolveMetadata({
      settings: settings({ siteUrl: "https://shop.example.com" }),
      routeGroup: "product",
      path: "/products/laptop",
    });
    expect(withUrl.alternates?.canonical).toBe("/products/laptop");
    expect(String(withUrl.metadataBase)).toBe("https://shop.example.com/");
  });

  it("ignores a malformed siteUrl rather than throwing", () => {
    const meta = resolveMetadata({
      settings: settings({ siteUrl: "not a url" }),
      routeGroup: "home",
      path: "/",
    });

    expect(meta.metadataBase).toBeUndefined();
    expect(meta.alternates?.canonical).toBeUndefined();
  });
});

/**
 * The browser-tab icon.
 *
 * Small surface, but every one of these degrades to the shipped icon rather
 * than to nothing: the root layout declares this on every page of both shells,
 * and a thrown error inside `generateMetadata` would take the page down with
 * it. A blank tab is the acceptable failure; a blank page is not.
 */
describe("resolveIcons", () => {
  /** The single declared icon URL, which is the only shape this ever returns. */
  const iconUrl = (s: Parameters<typeof resolveIcons>[0]) => {
    const icons = resolveIcons(s);
    const list = (icons as { icon: { url: string }[] }).icon;
    expect(list).toHaveLength(1);
    return list[0].url;
  };

  it("uses the merchant's icon when they have set one", () => {
    expect(iconUrl(settings({ faviconUrl: "https://cdn.example.com/icon.png" }))).toBe(
      "https://cdn.example.com/icon.png",
    );
  });

  it("falls back to the shipped icon when the merchant has set none", () => {
    expect(iconUrl(settings({ faviconUrl: null }))).toBe(DEFAULT_FAVICON_PATH);
  });

  /*
   * "" and "   " are both reachable: the admin sends `null` for an empty field,
   * but a row written by hand or by an older client can carry either, and an
   * empty `href` resolves to the current page — so the tab would try to render
   * the HTML document as its icon.
   */
  it("treats an empty or whitespace-only value as unset", () => {
    expect(iconUrl(settings({ faviconUrl: "" }))).toBe(DEFAULT_FAVICON_PATH);
    expect(iconUrl(settings({ faviconUrl: "   " }))).toBe(DEFAULT_FAVICON_PATH);
  });

  it("declares exactly one icon, so nothing competes with the merchant's", () => {
    const icons = resolveIcons(settings({ faviconUrl: "https://cdn.example.com/icon.png" }));
    expect((icons as { icon: unknown[] }).icon).toHaveLength(1);
    expect(icons).not.toHaveProperty("apple");
    expect(icons).not.toHaveProperty("shortcut");
  });

  it("never throws, whatever the stored value is", () => {
    for (const value of [undefined, null, "", "not a url", 42, {}] as unknown[]) {
      expect(() => resolveIcons(settings({ faviconUrl: value as string | null }))).not.toThrow();
    }
  });
});
