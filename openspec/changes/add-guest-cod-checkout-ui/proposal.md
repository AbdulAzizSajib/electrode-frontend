## Why

The backend now accepts orders without a session (`add-guest-cod-checkout`, implemented and verified against the live API). The storefront does not: `/checkout` calls `getCurrentUser()` and redirects anyone without a session to `/account/login?redirect=/checkout`. So a shopper arriving from a paid ad, ready to buy, still hits a registration wall at the moment intent is highest — the exact conversion loss the backend work was done to remove.

Nothing in this change is speculative: every endpoint it consumes exists and has been exercised end to end.

## What Changes

- **`/checkout` stops redirecting guests.** The page renders for everyone. A signed-in shopper keeps the saved-address flow unchanged; a guest gets contact and address fields inline, with a "Already have an account? Sign in" link that preserves the return path. Guest is the default state, not a second choice behind a chooser — an extra click here costs ad-driven conversions.
- **Checkout collects name, phone and address for guests.** A guest has nothing saved. Phone doubles as the backend's customer merge key, so a repeat buyer accumulates one customer record.
- **Guest orders are cash-on-delivery.** COD is stated plainly at checkout rather than implied; the backend rejects any other method for a guest.
- **Order confirmation works without a session.** The success page currently reads the order via `getOrderById`, which is session-scoped and returns null for a guest — so a guest who just ordered would be told "We couldn't find that order". Guests are instead confirmed via order number + phone, which survives a reload rather than living in client state.
- **`/track-order` becomes real.** It is a stub today ("Order tracking isn't connected yet") whose form asks for an *email*, which the backend cannot match on. It is rewired to order number + phone against `POST /orders/track`.
- **A guest checkout button on the product page** so a campaign landing page can go from product to order without a cart detour. The backend accepts checkout lines directly in the payload for exactly this.

## Capabilities

### New Capabilities
- `storefront/guest-checkout`: Placing and tracking an order without an account — who may reach checkout, what a guest must supply, how a guest order is confirmed, and how a guest retrieves an order afterwards.

### Modified Capabilities
<!-- None. openspec/specs/ is empty in this repo, so there is no existing capability to amend; the checkout behavior this change alters has never been captured as a spec. -->

## Impact

**Pages**
- `src/app/checkout/page.tsx` — remove the guest redirect; fetch addresses only when signed in (the address endpoint rejects guests).
- `src/app/checkout/success/page.tsx` — support confirming a guest order.
- `src/app/track-order/page.tsx` — replace the stub with a working lookup.

**Components**
- `src/components/checkout/CheckoutForm.tsx` — branch on session: saved-address picker, or inline guest contact + address fields. The existing idempotency-key handling, error surfacing and 504 "indeterminate" treatment stay as they are; they apply equally to guests.

**Data layer**
- `src/store/orderApi.ts` — extend the place-order mutation for the guest payload; add the tracking query.
- `src/types/order.ts` — `PlaceOrderPayload` becomes a union of the authenticated and guest shapes; `ApiOrder` gains the backend's new `isGuestOrder` field and its `payments` relation.
- `src/app/api/orders/track/route.ts` — new proxy route. The existing proxy already forwards the `guestToken` cookie and relays `Set-Cookie`, so guest carts need no plumbing work.

**Already correct, deliberately untouched**
- Guest carts. `guestToken` is forwarded by `api-proxy.ts` and the cart works for guests today; the merge on sign-in is a backend concern already handled.
- The idempotency-key lifecycle in `CheckoutForm`, including deliberately reusing the key on retry.

**Out of scope**
- Converting a guest into a registered account after ordering.
- Online payment for guests; COD only, matching the backend.
- Any change to how a signed-in shopper checks out.

**Known mismatch to resolve**
- `BD_PHONE_RE` in `src/lib/validation.ts` accepts only `01XXXXXXXXX`, while the backend also accepts `+880…` and `880…` forms and normalizes all three. A shopper typing `+8801712345678` would be rejected by the storefront and accepted by the API.
