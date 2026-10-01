import { describe, expect, it } from "vitest";

import { DEFAULT_DEMO_KEY, demoKeyFromHost, scopeTags } from "@/lib/demo";

/**
 * The two pure halves of demo resolution: which shop a hostname names, and how
 * a cache tag is scoped to it.
 *
 * These are unit-testable because they take their input as arguments. The third
 * half — `demoKey()`, which reads the incoming request — is not, and neither is
 * the end-to-end claim that two demos return different products. Those are
 * covered by `server/scripts/verify-demo-isolation.ts` against real databases,
 * and by the manual walk in the change's task 7.5.
 */

describe("demoKeyFromHost", () => {
  it("takes the first label of a subdomain", () => {
    expect(demoKeyFromHost("fashion.demos.example.com")).toBe("fashion");
    expect(demoKeyFromHost("grocery.demos.example.com")).toBe("grocery");
  });

  it("ignores the port", () => {
    // Without stripping it, `localhost:4000` would become a demo named
    // "localhost:4000" and every local page would ask for a shop that does not exist.
    expect(demoKeyFromHost("fashion.example.com:4000")).toBe("fashion");
  });

  it("folds case, because hostnames are case-insensitive and keys are not", () => {
    expect(demoKeyFromHost("FASHION.example.com")).toBe("fashion");
  });

  it("falls back for an apex domain or a bare hostname", () => {
    // Two labels is the site itself, not a demo of it.
    expect(demoKeyFromHost("example.com")).toBe(DEFAULT_DEMO_KEY);
    expect(demoKeyFromHost("localhost")).toBe(DEFAULT_DEMO_KEY);
    expect(demoKeyFromHost("localhost:4000")).toBe(DEFAULT_DEMO_KEY);
  });

  it("falls back for an IP address rather than reading its first octet", () => {
    // `127.0.0.1` splits on dots like a hostname does; without the guard its
    // "demo" would be `127`.
    expect(demoKeyFromHost("127.0.0.1")).toBe(DEFAULT_DEMO_KEY);
    expect(demoKeyFromHost("192.168.0.100:4000")).toBe(DEFAULT_DEMO_KEY);
  });

  it("falls back for a missing host", () => {
    expect(demoKeyFromHost(null)).toBe(DEFAULT_DEMO_KEY);
    expect(demoKeyFromHost(undefined)).toBe(DEFAULT_DEMO_KEY);
    expect(demoKeyFromHost("")).toBe(DEFAULT_DEMO_KEY);
  });
});

describe("scopeTags", () => {
  it("suffixes every tag with the demo key", () => {
    expect(scopeTags(["products", "categories"], "fashion")).toEqual([
      "products:fashion",
      "categories:fashion",
    ]);
  });

  it("gives two demos different tags for the same content", () => {
    // The whole point: one process caches both, and an unscoped tag would serve
    // the first demo's catalogue to the second.
    const [fashion] = scopeTags(["products"], "fashion") ?? [];
    const [grocery] = scopeTags(["products"], "grocery") ?? [];
    expect(fashion).not.toBe(grocery);
  });

  it("scopes a single-shop installation to a constant rather than to nothing", () => {
    // Always scope, never branch — a single shop is the N=1 case of the same
    // code, not a path that skips it.
    expect(scopeTags(["products"], DEFAULT_DEMO_KEY)).toEqual(["products:default"]);
  });

  it("leaves an absent or empty tag list alone", () => {
    // `apiFetch` passes whatever the caller gave it, and a caller that asked for
    // no tags must not acquire one.
    expect(scopeTags(undefined, "fashion")).toBeUndefined();
    expect(scopeTags([], "fashion")).toEqual([]);
  });
});
