import { afterEach, describe, expect, it, vi } from "vitest";
import { getPageBySlug } from "@/services/page";
import { getStoreSettings, resolveAnnouncementLink } from "@/services/store-settings";

/**
 * The failure paths, which are the whole point of these two services.
 *
 * `getStoreSettings` is awaited in the root layout and `getPageBySlug` decides
 * whether a route 404s — so neither may ever throw. A backend blip must cost a
 * default header, not every page on the site.
 */

/** Stands in for the backend's `{ success, message, data }` envelope. */
const envelope = (data: unknown) =>
  new Response(JSON.stringify({ success: true, message: "ok", data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getStoreSettings", () => {
  it("returns usable defaults when the API is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

    const settings = await getStoreSettings();

    // Not merely "did not throw": the chrome has to be renderable.
    expect(settings.mainNav.length).toBeGreaterThan(0);
    expect(settings.storeName).toBeTruthy();
    expect(settings.announcementBar).toBeDefined();
    expect(settings.newsletter.heading).toBeTruthy();
  });

  it("returns defaults on a 500", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false, message: "boom" }), { status: 500 }),
      ),
    );

    const settings = await getStoreSettings();
    expect(settings.mainNav.length).toBeGreaterThan(0);
  });

  it("uses the merchant's values when the API answers", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        envelope({
          storeName: "Acme",
          mainNav: [{ label: "Catalogue", href: "/products" }],
        }),
      ),
    );

    const settings = await getStoreSettings();

    expect(settings.storeName).toBe("Acme");
    expect(settings.mainNav).toEqual([{ label: "Catalogue", href: "/products" }]);
    // Keys the response omitted still come back filled, so no component
    // destructures undefined.
    expect(settings.newsletter.heading).toBeTruthy();
    expect(settings.contact).toBeDefined();
  });

  it("preserves an intentionally empty list rather than treating it as missing", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(envelope({ footerColumns: [] })));

    // "No footer columns" is a legitimate merchant choice and must not be
    // silently replaced by the defaults.
    expect((await getStoreSettings()).footerColumns).toEqual([]);
  });

  it("falls back when a list arrives malformed", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(envelope({ mainNav: "not-an-array" })));

    const settings = await getStoreSettings();
    expect(Array.isArray(settings.mainNav)).toBe(true);
    expect(settings.mainNav.length).toBeGreaterThan(0);
  });
});

describe("getPageBySlug", () => {
  it("returns null for an unknown slug", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false, message: "Page not found" }), {
          status: 404,
        }),
      ),
    );

    expect(await getPageBySlug("nope")).toBeNull();
  });

  it("returns null when the API is unreachable, rather than throwing", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

    expect(await getPageBySlug("about")).toBeNull();
  });

  it("sanitises the body before returning it", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        envelope({
          id: "1",
          title: "About",
          slug: "about",
          body: '<p>Hello</p><script>alert("xss")</script>',
          metaTitle: null,
          metaDescription: null,
          status: "PUBLISHED",
        }),
      ),
    );

    const page = await getPageBySlug("about");

    // Sanitising lives in the service so the safe path is the default one — a
    // component cannot forget to do it.
    expect(page?.body).toContain("<p>Hello</p>");
    expect(page?.body).not.toContain("<script");
  });

  it("escapes the slug into the request path", async () => {
    const fetchMock = vi.fn().mockResolvedValue(envelope(null));
    vi.stubGlobal("fetch", fetchMock);

    await getPageBySlug("a b/../c");

    expect(String(fetchMock.mock.calls[0][0])).toContain("a%20b%2F..%2Fc");
  });
});

describe("resolveAnnouncementLink", () => {
  const contact = { email: "hi@shop.com", phone: "+8801700000000", address: null };

  it("leaves an ordinary link alone", () => {
    const link = { label: "Track Order", href: "/track-order" };
    expect(resolveAnnouncementLink(link, contact)).toEqual(link);
  });

  it("renders a phone-bound link from the store contact", () => {
    const resolved = resolveAnnouncementLink(
      { label: "stale", href: "https://wa.me/000", source: "contactPhone" },
      contact,
    );

    expect(resolved.label).toBe("+8801700000000");
    expect(resolved.href).toBe("https://wa.me/8801700000000");
  });

  it("renders an email-bound link from the store contact", () => {
    const resolved = resolveAnnouncementLink(
      { label: "stale@old.com", href: "mailto:stale@old.com", source: "contactEmail" },
      contact,
    );

    expect(resolved).toEqual({ label: "hi@shop.com", href: "mailto:hi@shop.com" });
  });

  it("keeps the stored literals when the bound contact field is empty", () => {
    const link = { label: "+880123", href: "https://wa.me/880123", source: "contactPhone" };
    // A store that has not filled in its phone still gets a rendered row rather
    // than a blank one.
    expect(resolveAnnouncementLink(link, { email: null, phone: null, address: null })).toEqual({
      label: link.label,
      href: link.href,
    });
  });
});
