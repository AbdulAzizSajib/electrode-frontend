import { afterEach, describe, expect, it, vi } from "vitest";

import { iconFromSet, resolveIcon, resolveIcons } from "@/lib/iconify";

/**
 * Server-side icon resolution: building icon data from the Iconify API's JSON,
 * and never failing a render over an icon. The network is mocked; the shape of
 * the responses is the API's (`/{prefix}.json?icons=name`).
 */

const lucide = {
  prefix: "lucide",
  width: 24,
  height: 24,
  icons: { truck: { body: "<path d='truck'/>" } },
  aliases: { lorry: { parent: "truck", hFlip: true } },
};

const respond = (body: unknown, ok = true) =>
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify(body), { status: ok ? 200 : 404 }),
  );

afterEach(() => vi.restoreAllMocks());

describe("iconFromSet", () => {
  it("takes the set's default size for an icon that has none of its own", () => {
    expect(iconFromSet(lucide, "truck")).toEqual({ width: 24, height: 24, body: "<path d='truck'/>" });
  });

  it("lets an icon's own size win over the set's", () => {
    const set = { ...lucide, icons: { wide: { body: "<g/>", width: 32 } } };
    expect(iconFromSet(set, "wide")).toMatchObject({ width: 32, height: 24 });
  });

  it("resolves an alias to its parent's body with the alias's transforms", () => {
    expect(iconFromSet(lucide, "lorry")).toEqual({
      width: 24,
      height: 24,
      body: "<path d='truck'/>",
      hFlip: true,
    });
  });

  it("is null for a name the set does not contain", () => {
    expect(iconFromSet(lucide, "nope")).toBeNull();
    expect(iconFromSet({ ...lucide, aliases: { orphan: { parent: "missing" } } }, "orphan")).toBeNull();
  });
});

describe("resolveIcon", () => {
  it("fetches the one icon from its set", async () => {
    const fetchSpy = respond(lucide);
    expect(await resolveIcon("lucide:truck")).toMatchObject({ body: "<path d='truck'/>" });
    expect(String(fetchSpy.mock.calls[0]?.[0])).toBe("https://api.iconify.design/lucide.json?icons=truck");
  });

  it("is null, without a request, for something that is not an Iconify name", async () => {
    const fetchSpy = respond(lucide);
    expect(await resolveIcon("truck")).toBeNull();
    expect(await resolveIcon("lucide:../../etc")).toBeNull();
    expect(await resolveIcon(undefined)).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("is null when the API answers with an error", async () => {
    respond({}, false);
    expect(await resolveIcon("nosuchset:icon")).toBeNull();
  });

  it("is null, not a thrown error, when the API is unreachable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("fetch failed"));
    await expect(resolveIcon("lucide:phone")).resolves.toBeNull();
  });
});

describe("resolveIcons", () => {
  it("keys resolved icons by full name and leaves out the rest", async () => {
    respond(lucide);
    const icons = await resolveIcons(["lucide:truck", "lucide:nope", undefined, "lucide:truck"]);
    expect(Object.keys(icons)).toEqual(["lucide:truck"]);
  });
});
