## Context

See `proposal.md` — Why. The constraints that shape the approach, all verified against the running backend:

- **Checkout is auth-only, the cart is not.** `POST /orders` and every `/customers/me/addresses` route return **401** to a guest. The cart deliberately works for guests, so the boundary between "can build a cart" and "can order" falls exactly at checkout.
- **`placeOrder` finds the cart by `customerId`.** A guest cart is keyed by `guestToken` and is invisible to it, so there is no server-side path to a guest order even if auth were relaxed.
- **The server computes the total, and it is not reproducible client-side.** Tax rate and free-shipping threshold live in `StoreSetting`, which has **no public endpoint** (verified: `GET /store-settings` → 404). The storefront cannot know the tax rate.
- **`expectedTotal` is an optional guard.** If sent and it disagrees with the server by more than a cent, the order is refused with a price-mismatch conflict.
- **Money is decimal strings** — shipping `price: "80"`, and every order total. Same handling as products and cart.
- **The `Stock` ledger is empty** (0 rows) while `Product.stockQuantity` reads 20–75. Checkout validates against the ledger, so every product currently 409s. Stock rows are created only by receiving a purchase order or completing a return — there is no create-stock endpoint.
- **Existing patterns to reuse:** the cart proxy (`src/lib/cart-proxy.ts`) already solves forwarding auth cookies to the backend; `?redirect=` login already works; `apiFetch` supports `revalidate` and timeouts.

## Goals / Non-Goals

**Goals:**

- A shopper can complete the journey from cart to a real, recorded order.
- Every amount the shopper is shown after ordering comes from the order the server recorded.
- Failures — especially the stock conflict — are legible and recoverable, not dead ends.

**Non-Goals:**

- Payment capture. The backend's payment endpoint records an attempt rather than charging; wiring a gateway is separate.
- Order history / order detail pages under the account area, cancellation, and returns.
- Billing addresses. The address API has a `BILLING` type, but `POST /orders` accepts only `shippingAddressId`, so a billing selector would collect data nothing consumes.
- Reproducing the server's tax and free-shipping arithmetic client-side. D3 explains why.

## Decisions

### D1: Route handlers proxy the authenticated order and address calls

Orders and addresses go through `/api/orders/*` and `/api/addresses/*` route handlers that forward to the backend with the auth cookies attached, mirroring `cart-proxy.ts`.

*Why:* the backend authenticates by cookie, and those cookies are httpOnly on the API's domain. This is the same problem auth and the cart already solved; solving it a third way would leave three patterns to maintain.

*Refactor:* generalise `cart-proxy.ts` into a shared `proxyRequest(request, path, method)` — it already forwards `accessToken` / `refreshToken` / session cookies, which is exactly what these routes need. `cart-proxy` becomes a thin caller so cart behavior is unchanged.

### D2: Address state in RTK Query; the order is a one-shot mutation

Addresses become an `addressApi` with an `Address` tag — a list read many times and mutated from several places (checkout, account), which is precisely the shape RTK Query handles well. Mutations invalidate the tag so the checkout selector and the account list never disagree.

Placing an order is a `cartApi` mutation that **invalidates `Cart`**, so the cart the server emptied is refetched rather than assumed. The order result itself is not cached — it is navigated to by id.

*Why put placeOrder in `cartApi`:* it is the one mutation whose side effect is on the cart. Keeping it there means the invalidation is declared where the affected cache lives.

### D3: The server owns the total; the client shows a labelled estimate

Before ordering, the storefront shows `cart subtotal − discount + selected shipping price` and labels it an estimate. After ordering, it shows the amounts recorded on the order.

*Why not compute the real total:* tax rate and free-shipping threshold are not readable by the storefront (no public settings endpoint). Any "final" figure the client rendered would be wrong the moment a tax rate is non-zero — worse than an honest estimate.

*Why not send `expectedTotal`:* it exists to catch client/server drift, but the client cannot compute the server's total, so sending our estimate would reject valid orders as price mismatches whenever tax applies. Deliberately omitted. If a public settings endpoint is added later, sending it becomes worthwhile.

### D4: Confirmation reads the order back by id

On success the shopper is sent to `/checkout/success?orderId=…`, which fetches the order via `GET /orders/:id` and renders it server-side.

*Why not pass the order through client state:* a confirmation is a page shoppers reload, bookmark, and return to. Reading it back by id means it survives all three, and it shows what the server recorded rather than what the client happened to receive.

*Guard:* the endpoint is customer-scoped, so another shopper's order id yields not-found rather than a leak.

### D5: The stock conflict is surfaced verbatim

The backend's 409 message already names the item and the numbers — *"Insufficient stock for 'JBL Flip 6' — requested 2, available 0"*. It is shown to the shopper as-is, on checkout, with the cart untouched.

*Why verbatim:* a generic "something went wrong" would leave the shopper unable to act. Rewriting it would mean re-deriving which line failed from a message the server already formatted correctly.

*Consequence:* until the ledger is seeded, this is the *normal* outcome of every checkout. That makes this path the most important one to get right, not an edge case.

### D6: Seed stock through the real procurement flow

There is no create-stock endpoint, so seeding runs the path the system actually uses: supplier → purchase order → receive into the existing "Merul Badda Central Warehouse". Done once with an admin session during implementation, at the user's request.

*Why not write to the database directly:* stock movements are ledgered, and inserting rows behind the service would produce inventory with no movement history — inconsistent with what every other stock change looks like.

*Note:* this writes real inventory data to the user's database. It is test data and adjustable from the admin panel afterwards.

## Risks / Trade-offs

- **The estimate and the final total can differ** → Mitigated by labelling it an estimate and itemising the recorded amounts on the confirmation. The gap is exactly the tax and free-shipping logic the storefront cannot see; it disappears if a public settings endpoint appears.
- **A shopper can reach checkout with catalog stock that checkout rejects** → Unavoidable while `Product.stockQuantity` and the `Stock` ledger are independent. D5 makes the failure legible; the spec forbids presenting stock as reserved.
- **Seeding writes to the user's database** → Explicitly requested. Uses the real procurement flow so the data is well-formed, and quantities stay small and adjustable.
- **A partial checkout can leave an address created but no order** → Acceptable: a saved address is useful on its own and appears in the shopper's address list. No cleanup needed.
- **Generalising `cart-proxy.ts` touches working cart code** → The cart's own route handlers keep calling through a thin wrapper with unchanged behavior, and the existing cart verifications re-run to confirm no regression.

## Migration Plan

No schema change and no new dependency. One frontend release, plus a one-time inventory seed.

1. Generalise the proxy helper; add order/address route handlers.
2. Add address + order types and services; add `addressApi`.
3. Build address management (shared between checkout and account).
4. Rewrite checkout, then the confirmation page.
5. Seed stock via the procurement flow, then verify a real order.

**Rollback:** revert the release. Orders already placed remain valid in the backend — reverting only removes the storefront's ability to place new ones. Seeded stock is real inventory and stays; adjust it in the admin panel if unwanted.

## Open Questions

- Should the confirmation page offer "cancel this order"? The backend supports customer cancellation while an order is `PENDING` or `CONFIRMED`. Left out because it belongs with order history, which is out of scope; adding it later changes neither these specs nor this design.
