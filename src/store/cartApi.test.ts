import { configureStore } from "@reduxjs/toolkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cartApi } from "@/store/cartApi";
import type { ApiCart, CartSummary } from "@/types/cart";

/**
 * Regression cover for the optimistic cart patches.
 *
 * The case that broke: `GET /cart` fails, so the `getCart` entry exists with no
 * data, and every mutation's recipe was then handed `undefined` — throwing out
 * of `dispatch` before the caller could revert. See `onCachedCart`.
 */

/** One line, quantity 2 at 700 — so `itemCount` 2 and `subtotal` 1400. */
const CART = {
  id: "cart-1",
  items: [
    {
      id: "line-1",
      cartId: "cart-1",
      productId: "p1",
      variantId: null,
      quantity: 2,
      effectiveUnitPrice: 700,
      campaignUnitPrice: null,
      product: { id: "p1", name: "Earbud", slug: "earbud", offerPrice: "700" },
      variant: null,
    },
  ],
  discount: null,
} as unknown as ApiCart;

/**
 * `fetchBaseQuery` builds a `new Request(url)` from the app-relative `/api/cart`
 * base, which node cannot parse — the browser resolves it against the page's
 * origin. Give it one.
 */
const ORIGIN = "http://storefront.test";

function stubRequest() {
  const Native = globalThis.Request;
  vi.stubGlobal(
    "Request",
    class extends Native {
      constructor(input: RequestInfo | URL, init?: RequestInit) {
        super(typeof input === "string" ? new URL(input, ORIGIN) : input, init);
      }
    },
  );
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

/**
 * Writes always succeed and echo the whole cart back, the way the API does.
 * `cartLoads: false` fails the read the way the proxy reports an unreachable
 * backend.
 */
function stubFetch({ cartLoads }: { cartLoads: boolean }) {
  stubRequest();
  vi.stubGlobal(
    "fetch",
    vi.fn((request: Request) =>
      Promise.resolve(
        request.method === "GET"
          ? cartLoads
            ? json({ success: true, message: "Cart", data: CART }, 200)
            : json({ success: false, message: "Unable to reach the server." }, 503)
          : json({ success: true, message: "Done", data: CART }, 201),
      ),
    ),
  );
}

const makeStore = () =>
  configureStore({
    reducer: { [cartApi.reducerPath]: cartApi.reducer },
    middleware: (getDefault) => getDefault().concat(cartApi.middleware),
  });

type Store = ReturnType<typeof makeStore>;

const selectCart = (store: Store) =>
  cartApi.endpoints.getCart.select()(store.getState()).data;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("cartApi optimistic patches", () => {
  it("adds an item after the cart failed to load, without throwing", async () => {
    stubFetch({ cartLoads: false });
    const store = makeStore();

    await store.dispatch(cartApi.endpoints.getCart.initiate());
    expect(selectCart(store)).toBeUndefined();

    await expect(
      store.dispatch(cartApi.endpoints.addItem.initiate({ productId: "p1" })),
    ).resolves.toMatchObject({ data: { success: true } });

    // The response reseeds the whole cart, so a failed read repairs itself.
    expect(selectCart(store)).toMatchObject({ itemCount: 2, subtotal: 1400 });
  });

  it("removes an item after the cart failed to load, without throwing", async () => {
    stubFetch({ cartLoads: false });
    const store = makeStore();

    await store.dispatch(cartApi.endpoints.getCart.initiate());

    await expect(
      store.dispatch(cartApi.endpoints.removeItem.initiate("line-1")),
    ).resolves.toMatchObject({ data: { success: true } });
  });

  it("skips the patch when the cache entry holds no cart", async () => {
    stubFetch({ cartLoads: true });
    const store = makeStore();

    await store.dispatch(cartApi.endpoints.getCart.initiate());
    // An entry whose `data` key exists but holds nothing patchable —
    // `updateQueryData` hands that straight to the recipe instead of a draft.
    await store.dispatch(
      cartApi.util.upsertQueryData(
        "getCart",
        undefined,
        undefined as unknown as CartSummary,
      ),
    );

    expect(() =>
      store.dispatch(
        cartApi.endpoints.addItem.initiate({ productId: "p1", quantity: 1 }),
      ),
    ).not.toThrow();

    await vi.waitFor(() => expect(selectCart(store)?.itemCount).toBe(2));
  });

  it("patches a cached cart optimistically, then takes the server's", async () => {
    stubFetch({ cartLoads: true });
    const store = makeStore();

    await store.dispatch(cartApi.endpoints.getCart.initiate());
    expect(selectCart(store)?.itemCount).toBe(2);

    await store.dispatch(
      cartApi.endpoints.addItem.initiate({ productId: "p1", quantity: 3 }),
    );
    // The guess is still on screen when the mutation resolves.
    expect(selectCart(store)?.itemCount).toBe(5);

    // Then the mutation's own response replaces it — no second GET.
    await vi.waitFor(() => expect(selectCart(store)?.itemCount).toBe(2));
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
