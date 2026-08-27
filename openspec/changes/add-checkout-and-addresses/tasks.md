## 1. Types and proxy plumbing

- [x] 1.1 Add `src/types/address.ts`: `ApiCustomerAddress` (with `type: "SHIPPING" | "BILLING" | "BOTH"`, nullable `addressLine2`/`state`/`postalCode`), the `Address` view model, and the create/update payload shapes
- [x] 1.2 Add `src/types/order.ts`: `ApiShippingMethod` (money as `string`), `ApiOrder` / `ApiOrderItem` (all totals as strings), and their view models with money parsed to `number`
- [x] 1.3 Generalise `src/lib/cart-proxy.ts` into a shared `proxyRequest(request, path, method)` in `src/lib/api-proxy.ts`; keep the cart's route handlers calling it so cart behavior is unchanged (design D1)
- [x] 1.4 Add `src/app/api/addresses/route.ts` (`GET`, `POST`) and `src/app/api/addresses/[addressId]/route.ts` (`GET`, `PATCH`, `DELETE`) forwarding to `/customers/me/addresses`
- [x] 1.5 Add `src/app/api/addresses/[addressId]/set-default/route.ts` (`PATCH`) forwarding to the backend's `set-default` route
- [x] 1.6 Add `src/app/api/orders/route.ts` (`POST` → `/orders`); relay the backend's status and message unchanged so a 409 stock conflict reaches the client intact (design D5)

## 2. Services

- [x] 2.1 Add `src/services/shipping.ts` with `getShippingMethods()` calling the public `GET /shipping-methods`, filtering to active methods and parsing `price` to a number
- [x] 2.2 Add `src/services/order.ts` with `getOrderById(id)` calling `GET /orders/:id` with auth cookies, mapping all string totals to numbers; return `null` on 404 so the confirmation page can render not-found (design D4)
- [x] 2.3 Add `src/services/address.ts` with a server-side `getMyAddresses()` for pre-rendering checkout, returning `[]` on failure
- [x] 2.4 Verify against the live backend that shipping methods parse correctly (2 active methods, prices 80 and 160 as numbers)

## 3. Address management

- [x] 3.1 Add `src/store/addressApi.ts` via `createApi` with an `Address` tag and `baseUrl: "/api/addresses"`; endpoints `getAddresses`, `createAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress` (design D2)
- [x] 3.2 Register `addressApi` in the store reducer and middleware
- [x] 3.3 Invalidate the `Address` tag from every mutation so the checkout selector and the account list cannot disagree (spec: "One address is the default")
- [x] 3.4 Add `src/components/account/AddressForm.tsx`: name, phone, address line 1 required; line 2, state, postal code, country optional. Validate client-side and name the offending field (spec: "A required field is missing"); reuse the existing `Field`/`FormAlert`/`SubmitButton` controls
- [x] 3.5 Preserve entered values when a save is rejected so the shopper can retry without re-typing (spec: "The service rejects the address")
- [x] 3.6 Add `src/components/account/AddressList.tsx`: lists addresses, marks the default, and offers edit / delete / set-default
- [x] 3.7 Require confirmation before deleting (spec: "Deletion is confirmed first")
- [x] 3.8 Show an explicit empty state with an add action, and a distinct "could not load" state (spec: "The address list communicates its state")
- [x] 3.9 Disable mutating controls while their mutation is in flight (spec: "Feedback while saving")
- [x] 3.10 Add `src/app/account/addresses/page.tsx` and link it from the account page

## 4. Checkout

- [x] 4.1 Convert `src/app/checkout/page.tsx` to a Server Component that fetches shipping methods and the shopper's addresses, redirecting to `/account/login?redirect=/checkout` when not signed in (spec: "Checkout requires a signed-in shopper")
- [x] 4.2 Add `src/components/checkout/CheckoutForm.tsx` as the client component owning selection state
- [x] 4.3 Address selector: list saved addresses, pre-select the default, and allow adding a new one inline without leaving checkout (spec: "Shopper has no saved address")
- [x] 4.4 Shipping method selector showing each method's price and estimated delivery days (spec: "Shipping options show cost and timing")
- [x] 4.5 Optional order note field, mapped to the request's `notes`
- [x] 4.6 Show a total labelled as an estimate — cart subtotal minus discount plus the selected shipping price — never as the final amount (design D3; spec: "Estimate before ordering")
- [x] 4.7 Block ordering until both an address and a shipping method are chosen, and indicate what is still required (spec: "Nothing chosen yet")
- [x] 4.8 Render the empty-cart state with a route back to browsing (spec: "Empty cart"). Added `src/services/cart.ts` (`getServerCart`) so the page knows server-side whether the cart is empty — otherwise checkout flashed a spinner on every load while the client fetched
- [x] 4.9 Add a `placeOrder` mutation — placed in a new `src/store/orderApi.ts` rather than `cartApi`, because RTK Query joins a relative url onto its api's `baseUrl` and `/api/orders` is unreachable from an api rooted at `/api/cart`; it invalidates `cartApi`'s `Cart` tag on success so the emptied cart is refetched. Originally specified as a `cartApi` mutation posting `{ shippingAddressId, shippingMethodId, notes }`, invalidating the `Cart` tag; do NOT send `expectedTotal` (design D2, D3)
- [x] 4.10 On success, navigate to `/checkout/success?orderId=<id>`
- [x] 4.11 On failure, show the backend's message verbatim, keep the shopper on checkout with selections intact, and leave the cart untouched (design D5; spec: "A rejected order is explained and recoverable")
- [x] 4.12 Disable the order control while an attempt is in flight (spec: "Double submission is prevented")

## 5. Order confirmation

- [x] 5.1 Rewrite `src/app/checkout/success/page.tsx` to read `?orderId=` and fetch the order server-side (design D4)
- [x] 5.2 Show the order number prominently as the identifier the shopper can quote (spec: "Order confirmation")
- [x] 5.3 List the ordered items with their names, quantities, and unit prices from the order's own snapshot
- [x] 5.4 Itemise subtotal, shipping, tax, discount, and total from the recorded order (spec: "Charges are itemised")
- [x] 5.5 Render a not-found state for a missing, unreadable, or absent `orderId` rather than claiming an order was placed (spec: "The confirmation MUST NOT claim an order was placed when none was")
- [x] 5.6 Remove the "no order was actually processed" copy and the `SHIPPING_FLAT_RATE` / `FREE_SHIPPING_THRESHOLD` constants from the old checkout

## 6. Seed inventory

- [x] 6.0 **Backend fix (added during apply — see note below).** `PurchaseOrderItem` had no `variantId`, so receiving a PO always created stock with `variantId: null`, which customer orders (deducting by the variant bought) could never match. Every VARIABLE product was therefore unorderable. Added `variantId` to the schema, validation, interface, create and receive paths; stock, stock movements, and the denormalized counter now all follow the line's variant. Verified: a real order for "Pro Edition" now succeeds at $109.99
- [x] 6.1 With an admin session, create a supplier if none exists — an existing supplier ("Mustak") was reused
- [x] 6.2 Create a purchase order covering the 5 products' variants, then receive it into the existing "Merul Badda Central Warehouse" so `Stock` rows are created through the real procurement path (design D6) — `PO-20260827-AS8C83`, 11 variant lines × 25 units. Received in batches of 2: the backend's interactive transaction budget is 5s and all 11 lines at once exceeded it (5576ms)
- [x] 6.3 Confirm `GET /stock` returns rows and that available quantity is positive for the seeded products — 12 rows, 11 of them variant-scoped
- [x] 6.4 Report to the user exactly what inventory was created, so they can adjust or remove it from the admin panel

## 7. Verify

- [x] 7.1 Confirm a guest clicking Checkout is sent to login and returns to `/checkout` with their cart merged and intact (spec: "Guest cart survives sign-in at checkout")
- [x] 7.2 Create, edit, set-default, and delete an address; confirm exactly one default at a time and that the checkout selector pre-selects it
- [x] 7.3 Place a real order with a chosen address and shipping method; confirm a 201, an order number, and that the cart is emptied afterwards (spec: "Cart is emptied on success")
- [x] 7.4 Confirm the order's recorded totals include the chosen shipping price and that the confirmation page shows the server's figures, not the estimate (spec: "Confirmed order shows recorded amounts")
- [x] 7.5 Force a stock conflict (order more than available) and confirm the backend's message is shown verbatim and the cart is unchanged (spec: "An item is out of stock")
- [x] 7.6 Attempt checkout with an empty cart and confirm the empty state rather than an error
- [x] 7.7 Confirm another shopper's order id on the confirmation page yields not-found rather than exposing the order (design D4)
- [x] 7.8 Re-run the existing cart verifications to confirm the proxy refactor did not regress cart behavior (design, Risks)
- [x] 7.9 Run `npx next build`, `npx eslint src --max-warnings=0`, and `npx tsc --noEmit` clean
