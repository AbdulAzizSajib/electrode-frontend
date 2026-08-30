## Context

See proposal.md — Why. What shapes the approach is what already exists here.

**Already built, reusable as-is.** `api-proxy.ts` forwards the `guestToken` cookie and relays `Set-Cookie` back onto the storefront's domain, so guest carts work today and need no plumbing. `makeStore({ isSignedIn })` preloads a session flag into Redux specifically so components can gate on it during the first render — the branch CheckoutForm needs already exists. `CheckoutForm` already handles idempotency keys (including deliberately reusing one on retry), surfaces the backend's own error messages verbatim, and treats a 504 as *indeterminate* rather than failed. None of that is guest-specific and none of it changes.

**The blocker, precisely.** `checkout/page.tsx` calls `getCurrentUser()` and redirects when there is no session. That single redirect is what makes guest checkout unreachable.

**The trap.** `checkout/success/page.tsx` reads the order through `getOrderById`, which sends the auth cookie and hits the session-scoped `GET /orders/:id`. For a guest that returns null, and the page renders "We couldn't find that order" — telling a shopper who just paid that their order does not exist. Fixing the redirect without fixing this would ship a worse bug than the one being fixed.

**Backend contract** (implemented and verified live, `add-guest-cod-checkout`):
- `POST /orders` — guest sends `fullName`, `phone`, `shippingAddress{...}`; optionally `items[]` to bypass the cart. Authenticated sends `shippingAddressId` as before.
- `POST /orders/track` — `{ orderNumber, phone }`. POST, not GET, so the phone stays out of URLs and logs.
- Phone is normalized server-side to E.164; `01712345678` and `+8801712345678` resolve to one customer.
- Guest orders are COD; a non-COD `paymentMethod` is rejected.
- Rate limits return 429 with a human-readable message.

## Goals / Non-Goals

**Goals:**
- One checkout page serving both flows, so pricing display, error handling and idempotency have a single implementation.
- A guest confirmation that survives a reload.
- Storefront validation that accepts exactly what the backend accepts — no more, no less.

**Non-Goals:**
- Any change to the signed-in checkout flow.
- Guest cart plumbing (already works).
- Persisting guest identity beyond what tracking an order needs.

## Decisions

### Branch inside `CheckoutForm`, don't fork the page

The two flows differ only in *how a delivery address is chosen* — pick a saved one, or type one in. Everything else (cart summary, shipping method, notes, totals, error handling, idempotency, the 504 path) is identical. A separate `GuestCheckoutForm` would duplicate ~300 lines of that and then drift: a fix to the stock-conflict message or the indeterminate-outcome copy would land in one and be forgotten in the other, and the guest path is the one carrying ad spend.

So `page.tsx` stops redirecting and passes `isSignedIn` down; `CheckoutForm` renders the address picker or the guest fields from that flag.

`page.tsx` must also stop fetching addresses for guests — `getMyAddresses()` hits a session-scoped endpoint. It is fetched only when signed in, and `initialAddresses` is `[]` otherwise.

**Alternative rejected:** a route group or separate `/checkout/guest` page. Two URLs for one intent, and the cart summary and totals would need duplicating or extracting anyway.

### Confirmation via order number + phone, held in `sessionStorage`

The success page needs to identify a guest's order across a reload, and the two candidate carriers are both wrong on their own:

- **Client state alone** dies on reload — the shopper refreshes and their confirmation is gone.
- **The URL** would put a phone number in browser history, referrer headers and any shared link. The backend deliberately made tracking a POST to keep phones out of URLs; putting one in a query string here would undo that.

So the success page takes `?orderNumber=…` from the URL and reads the phone from `sessionStorage`, written at the moment the order was placed. On reload both are still there. If the phone is missing — a shared link, a new tab, storage cleared — the page falls back to the tracking form pre-filled with the order number, which is the honest outcome rather than a not-found.

This makes the guest confirmation a client component, unlike the signed-in one which stays server-rendered through `getOrderById`. Both paths render the same presentational order summary, extracted so the two cannot drift.

**Alternative rejected:** setting a short-lived cookie. Same information, but it travels on every subsequent request for no reason; `sessionStorage` is scoped to the tab that needs it and dies with it.

### Align phone validation with the backend, in one place

`BD_PHONE_RE` accepts only `01XXXXXXXXX`. The backend also accepts `+880…`, `880…` and `00880…`, and normalizes all of them. Today a shopper typing `+8801712345678` is rejected by the storefront for a number the API would have accepted — a self-inflicted checkout failure.

`isBdPhone` is widened to accept the same set, mirroring the backend's `normalizePhone`. It is widened rather than replaced because it is already used by login (`isLoginIdentifier`) and `AddressForm`; those callers benefit from the same fix and none of them are made more permissive in a way that matters — the backend is the authority either way, and it accepts these forms.

Order matters when stripping prefixes: `00880` must be tested before `880`, which must be tested before a bare leading `0`. Testing them in the wrong order silently converts one valid number into a different one — this exact bug was found and fixed in the backend implementation, and the same shape of code here would reproduce it.

### `PlaceOrderPayload` becomes a discriminated union

Guest and authenticated checkouts send genuinely different bodies. A single interface with everything optional would let "no address at all" and "both an address id and inline fields" typecheck — and the second is a 400 from the backend, which rejects `shippingAddressId` from a guest.

A union keyed on the same session flag the UI branches on makes both invalid states unconstructible, and TypeScript then forces the call site to have decided which flow it is in.

### Direct product ordering goes through checkout, not straight to the API

The backend accepts `items[]` to bypass the cart. The tempting shortcut is to have the product page place the order itself — but the shopper still has to supply a name, phone and address, which is the checkout form. So "Order Now" carries the product and quantity to `/checkout` (via `sessionStorage`, same reasoning as above: no product ids in URLs, no cart mutation), and checkout submits them as `items[]`.

That keeps one checkout implementation and satisfies the requirement that a direct order leaves the cart untouched, since nothing is ever added to it.

## Risks / Trade-offs

**Guest confirmation depends on `sessionStorage`** → Absent or cleared storage falls back to the tracking form pre-filled with the order number, so the shopper is one field away from their order rather than stranded. The order number is also shown in the place-order response, so it can be surfaced even in the fallback.

**Guest checkout renders differently on server and client** → The session flag is preloaded into the store rather than dispatched after mount (the existing `makeStore` contract), so the first render already knows which branch to take and no hydration mismatch is introduced.

**Widening `isBdPhone` affects login and address forms** → Intentional; those callers are validating the same numbers against the same backend. The regex still rejects non-mobile and malformed input, so nothing that was invalid becomes valid.

**A guest could reach checkout with an empty cart and no items** → The existing empty-cart branch already covers it, and it runs before the guest fields render.

**Storefront and backend validation could drift again** → This change aligns them once; keeping them aligned is a standing concern with no shared source of truth across two repos. The backend remains the authority — the storefront's checks exist to give a fast, friendly error, not to be the gate.

## Migration Plan

Frontend-only; no data migration. The backend is already deployed with the endpoints this consumes, so there is no ordering constraint between the two.

**Rollback.** Restoring the `getCurrentUser()` redirect in `checkout/page.tsx` disables guest checkout immediately without touching anything else. Orders already placed by guests remain valid and trackable, since tracking is a backend capability independent of this UI.

## Open Questions

- **Where "Order Now" appears on the product page.** Placement and prominence next to Add to Cart is a visual-design decision that does not affect the specs or the task breakdown; the requirement is only that direct ordering exists and leaves the cart untouched.
