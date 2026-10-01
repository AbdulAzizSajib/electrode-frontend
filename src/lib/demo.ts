/**
 * Which demonstration shop this request is for.
 *
 * ── Why the storefront has to care ────────────────────────────────────────
 *
 * The merchant's demo host runs ONE Next.js process serving several
 * demonstration shops, one per subdomain, each backed by its own database. The
 * API cannot work out which is which on its own: cPanel binds one Node app to
 * one Application URL, so every call reaches it at the same hostname. The
 * storefront knows — it is the one being asked for `fashion.demos.example.com`
 * — so it says so, on every call.
 *
 * Every other deployment, including each client's, runs a single shop. There
 * the key resolves to `default`, the API ignores it because no demo map is
 * configured, and nothing about the request differs from before this existed.
 *
 * See server/src/app/lib/tenant.ts and
 * server/openspec/changes/add-multi-demo-hosting/design.md, Decision 2.
 */

/** Must match `DEMO_KEY_HEADER` in server/src/app/lib/tenant.ts. */
export const DEMO_KEY_HEADER = "x-demo-key";

/** Must match `DEFAULT_DEMO_KEY` in server/src/app/lib/tenant.ts. */
export const DEFAULT_DEMO_KEY = "default";

/**
 * Reads the demo key from a hostname: its first label, when there is one.
 *
 * `fashion.demos.example.com` → `fashion`. An apex domain, a bare hostname and
 * an IP address have no demo to name and yield the default.
 *
 * THREE LABELS, not two. `example.com` is an apex domain whose first label is
 * the site itself, not a demo — reading it as one would have every ordinary
 * single-shop deployment announcing a demo key named after its own domain.
 *
 * The rule is deliberately crude beyond that, and it is allowed to be: a
 * hostname like `example.co.uk` yields `example`, which is wrong, and harmless.
 * The server honours a key only if `DEMO_DATABASES` contains it and otherwise
 * serves the default shop, so a wrong guess costs nothing. Getting this exactly
 * right needs a public-suffix list, which is a dependency for no benefit.
 *
 * Split out from `demoKey()` so it can be reasoned about without a request in
 * hand — `proxyRequest` has the `Request` object and uses this directly.
 */
export function demoKeyFromHost(host: string | null | undefined): string {
  if (!host) return DEFAULT_DEMO_KEY;

  // Strip the port before splitting, or `localhost:4000` becomes `localhost:4000`.
  const hostname = host.split(":")[0]?.trim().toLowerCase();
  if (!hostname) return DEFAULT_DEMO_KEY;

  // An IPv4 address splits on dots too, and its first label is a number.
  if (/^\d+(\.\d+)*$/.test(hostname)) return DEFAULT_DEMO_KEY;

  const labels = hostname.split(".");
  if (labels.length < 3 || !labels[0]) return DEFAULT_DEMO_KEY;

  return labels[0];
}

/**
 * The demo key for the request in hand.
 *
 * ── Why `next/headers` is imported here and not at the top ────────────────
 *
 * `next/headers` is server-only, and importing it at module scope makes this
 * whole module server-only with it. That matters because `api-client.ts`
 * imports this one, and `api-client.ts` is reached from client components —
 * they import `ApiError` and the shared types. A static import therefore broke
 * the build with `next/headers` pulled into a Client Component bundle.
 *
 * Loading it inside the function keeps the pure helpers above importable from
 * anywhere, which is what `proxyRequest` and the client bundle both need.
 *
 * Returns the default outside a request — during a static build, for instance,
 * where there is no incoming host to read. `headers()` throws there rather than
 * returning empty, which is why this is wrapped: a build must not fail because
 * a page was prerendered outside any demo.
 */
export async function demoKey(): Promise<string> {
  try {
    const { headers } = await import("next/headers");
    const headerList = await headers();
    return demoKeyFromHost(headerList.get("x-forwarded-host") ?? headerList.get("host"));
  } catch {
    return DEFAULT_DEMO_KEY;
  }
}

/**
 * Suffixes cache tags with the demo they belong to.
 *
 * THIS IS THE FAILURE THIS MODULE EXISTS TO PREVENT. Next's cache is keyed per
 * process, not per hostname. With four demos in one process and an unscoped
 * `products` tag, the first demo to populate the cache serves its catalogue to
 * all four — and it looks like a broken demo rather than a caching subtlety,
 * in front of the person being sold to.
 *
 * Applied centrally in `apiFetch` rather than at the ~17 call sites that pass
 * tags, so a new service cannot forget. On a single-shop installation the
 * suffix is the constant `default`, which is a different string from before but
 * identical behaviour: always scope, never branch.
 */
export function scopeTags(tags: string[] | undefined, key: string): string[] | undefined {
  if (!tags || tags.length === 0) return tags;
  return tags.map((tag) => `${tag}:${key}`);
}
