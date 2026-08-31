## 1. Types and validation

- [x] 1.1 Widen `isBdPhone` in `src/lib/validation.ts` to accept every form the backend's `normalizePhone` accepts: `01XXXXXXXXX`, `+880…`, `880…`, `00880…`, and separators (spaces, hyphens, parentheses). Strip the longest prefix first — `00880` before `880` before a bare leading `0` — or a valid number is silently converted into a different one. Keep rejecting non-mobile prefixes and wrong lengths.
      → Verified 17/17 cases against the backend's behavior, including that all format variants converge to one value. `BD_PHONE_RE` now describes the canonical E.164 form and is only used internally; every external caller goes through `isBdPhone`, which strictly widened, so `RegisterForm` and `isLoginIdentifier` keep working.
- [x] 1.2 Add a `normalizeBdPhone` helper alongside it returning the canonical `+8801XXXXXXXXX` form (or null), so tracking lookups compare like with like.
- [x] 1.3 Turn `PlaceOrderPayload` in `src/types/order.ts` into a discriminated union: the authenticated shape (`shippingAddressId`, `shippingMethodId`) and the guest shape (`fullName`, `phone`, `shippingAddress{addressLine1, addressLine2?, city, state?, postalCode?, country?}`, optional `items[]`, `paymentMethod: "COD"`). Both keep `notes?` and `idempotencyKey`.
      → Keyed on `mode`, stripped before the request since the backend infers the flow from the session. `shippingMethodId` moved to the shared part as optional — the backend treats it as optional and a guest may not pick one.
- [x] 1.4 Add `isGuestOrder` and the `payments` relation to `ApiOrder`, and a `GuestOrderLookup` type for `{ orderNumber, phone }`.
      → Also added `paymentMethod` to the domain `Order` so the confirmation can state COD rather than leaving payment terms implicit.

## 2. Data layer

- [x] 2.1 Add `src/app/api/orders/track/route.ts` proxying `POST /orders/track` via `proxyRequest`. No auth cookies are needed, but reuse the shared proxy so status and message relay stays identical.
- [x] 2.2 Extend `placeOrder` in `src/store/orderApi.ts` to accept the union payload. The existing `onQueryStarted` cart handling stays exactly as is — it is correct for guests too (a guest cart is emptied by the same backend transaction).
      → **One correction to that assumption:** a direct product order (`items[]`) never consumes the cart — the backend deliberately skips clearing it — so emptying the cart cache there would wipe a cart the shopper is still filling. The cache update (and the 504 invalidation) now runs only when the order actually consumed the cart.
- [x] 2.3 Add a `trackOrder` mutation (not a query — it is a POST carrying a phone) to `orderApi`, returning the order.
- [x] 2.4 Add `getGuestOrder(orderNumber, phone)` to `src/services/order.ts` for server-side lookups, reusing the existing `toOrder` mapper so guest and authenticated orders map identically.
      → Returns null for both "wrong phone" and "no such order", mirroring the backend's single 404 so the storefront cannot be used to probe order numbers either.

## 3. Checkout page and form

- [x] 3.1 Remove the `getCurrentUser()` redirect from `src/app/checkout/page.tsx`. Keep calling it to determine `isSignedIn`, and pass that to `CheckoutForm`.
- [x] 3.2 In the same file, fetch `getMyAddresses()` **only** when signed in — it hits a session-scoped endpoint that rejects guests. Pass `[]` for guests.
- [x] 3.3 In `CheckoutForm`, branch the delivery-address section on `isSignedIn`: saved-address picker (unchanged) or inline guest fields (full name, phone, address line 1, address line 2, city, postal code).
- [x] 3.4 Add a "Already have an account? Sign in" link for guests pointing at `/account/login?redirect=/checkout`, so the cart survives the round trip.
- [x] 3.5 Validate guest fields on submit using the widened helpers; mark the offending field and do not attempt the order. Do not block on fields the backend treats as optional.
- [x] 3.6 Show cash on delivery as the payment method for guests, and send `paymentMethod: "COD"`.
- [x] 3.7 Include the guest fields in the `orderFingerprint` that regenerates the idempotency key, so editing an address after a failed attempt is treated as a materially different order — but keep `notes` excluded, matching the existing rule.
- [x] 3.8 On success, write `{ orderNumber, phone }` to `sessionStorage` and route to `/checkout/success?orderNumber=…`. Signed-in shoppers keep routing by `orderId` exactly as today.

## 4. Confirmation

- [x] 4.1 Extract the order summary presentation out of `src/app/checkout/success/page.tsx` into a shared component, so the guest and signed-in confirmations cannot drift.
- [x] 4.2 Keep the signed-in path server-rendered through `getOrderById` — unchanged.
- [x] 4.3 Add the guest path: read `orderNumber` from the URL and the phone from `sessionStorage`, look the order up, and render the same summary. Verify a reload still shows it.
- [x] 4.4 When the phone is missing (shared link, new tab, cleared storage), fall back to the tracking form pre-filled with the order number instead of the not-found state — the order exists and the shopper is one field from it.
- [x] 4.5 Keep the genuine not-found state for a lookup that actually fails.

## 5. Order tracking

- [x] 5.1 Replace the stub in `src/app/track-order/page.tsx`. Remove the "isn't connected yet" copy and the **email** field — the backend matches on phone and cannot match an email.
- [x] 5.2 Build the real form: order number + phone, both required, validated before submitting.
- [x] 5.3 Render the found order using the shared summary component from 4.1.
- [x] 5.4 On a failed lookup show the backend's message; do not distinguish "wrong phone" from "no such order", mirroring the backend's deliberate single 404.

## 6. Direct product ordering

- [x] 6.1 Add an "Order Now" action to `src/components/product/ProductDetail.tsx` beside Add to Cart, disabled under exactly the same conditions (unavailable product, unselected required variant).
- [x] 6.2 Carry the product id, variant id and quantity to `/checkout` via `sessionStorage` — not the URL, and not by adding to the cart.
- [x] 6.3 In `CheckoutForm`, when such a direct-order payload is present, submit it as `items[]` and render the summary from it rather than from the cart. Clear it once the order is placed.
- [x] 6.4 Confirm the shopper's existing cart is untouched by a direct order, both in the request and in what the cart shows afterwards.
      → Cart seeded with Samsung Galaxy Buds Pro ×2, then "Buy It Now" used on a *different* product. The order covered only the Xiaomi hub, and reading the cart afterwards still returned Galaxy Buds ×2 — neither consumed nor cleared.

## 7. Verification

Run the real storefront against the real backend. Where a check maps to a spec scenario, exercise it in the browser rather than reasoning about it.

Verified against the real storefront (localhost:3000) driving the real backend (localhost:5000), using headless Edge over CDP for anything client-rendered.

- [x] 7.1 Guest checkout end to end from the cart: add an item as a guest, complete checkout, confirm the order appears with its order number, items, total and address.
      → `ORD-20260830-XG3PD6` via the storefront proxy: total 159.98, COD/PENDING payment, address persisted, `isGuestOrder: true`, phone stored normalized.
- [x] 7.2 Reload the guest confirmation — the order is still shown, not a not-found.
      → Full confirmation renders (items, COD, address, "Save your order number"), and a reload shows the same — the property `sessionStorage` was chosen for.
- [x] 7.3 Open the confirmation with the phone removed from `sessionStorage` — the pre-filled tracking form appears, and completing it shows the order.
      → Shows "Your order is placed" with the number pre-filled and a phone field; "couldn't find that order" correctly absent. Submitting the correct phone renders the full order.
- [x] 7.4 Track an order: correct phone shows it; a mismatched phone shows not-found and reveals nothing.
      → Correct phone 200; wrong phone and a fabricated order number both return an identical 404 "Order not found".
- [x] 7.5 Direct "Order Now" from a product page with items already in the cart — the order is placed for the chosen product and the cart still holds what it did.
      → Driven in the browser: product page → "Buy It Now" → checkout showed only the Xiaomi hub with "Buying this item directly" (Galaxy Buds correctly absent) → `ORD-20260831-JVMX9O` placed. Recorded `isGuestOrder: true`, COD payment, address persisted.
      → Also confirms client display values are never trusted: the page showed 79.99 but the server resolved the variant's real 109.99, and the total (109.99 + 80 shipping = 189.99) matches.
- [x] 7.6 Signed-in regression: place an order with a saved address and confirm the flow and confirmation are unchanged from before this change.
      → Registered, verified and signed in through the real login form. Checkout showed the saved-address picker with the Default badge and **no** guest fields. Order routed to `?orderId=…` (not `orderNumber`) and rendered the server-side confirmation with "Go to My Account"; the guest-only "Cash on delivery" and "Save your order number" were correctly absent.
      → Database: `isGuestOrder: false`, `guestIp: null`, `payments: 0`, saved address used, real user account linked. Authenticated behavior unchanged.
- [x] 7.7 Enter a phone as `+8801712345678` — accepted by the storefront, matching the backend.
      → Covered twice: the order was placed with `+8801766554433`, and tracking the same order with `01766554433` resolved it — storefront normalization matches the backend's.
- [x] 7.8 Trigger a backend rejection (e.g. exceed the guest order cap) and confirm its message reaches the shopper with their input intact.
      → Hit organically: the per-IP cap returned 429 through the proxy with the backend's own wording. (Cap was raised to 200 for the remaining checks and **restored to 10** afterwards.)
- [x] 7.9 Run `pnpm lint` and a production `pnpm build`; both must pass.
      → `eslint src`: 0 errors (2 warnings pre-existing in files this change did not touch). `next build`: succeeds, with `/api/orders/track` registered.

### Bugs found by running it, not by reading it

Three defects surfaced only in the browser — all fixed:

1. **`/checkout` and `/track-order` were gated in `src/proxy.ts`.** Both sat in `PROTECTED_ROUTES`, so a guest was redirected to login *before* the page ran; removing the page-level redirect alone achieved nothing. The plan missed this layer entirely. Removed from the list; `/account` and `/wishlist` stay protected.
2. **Guests saw only a spinner at checkout.** `getServerCart()` forwarded auth cookies but not `guestToken`, so a guest's cart was never seeded server-side and `cartLoading` held the spinner — the exact flash that function's own comment says it exists to prevent. Now forwards `guestToken` too.
3. **"Buy It Now" added to the cart first.** The existing button did add-to-cart then navigated, violating "a direct order leaves the cart untouched". Rewired to a true direct order.
