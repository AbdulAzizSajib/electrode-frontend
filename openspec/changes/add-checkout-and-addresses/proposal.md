## Why

The storefront can now build a real, server-owned cart — and then the journey stops. `/checkout` collects delivery details into inputs that are never read, waits 900ms on a `setTimeout`, and sends the shopper to a success page that says outright "no order was actually processed". The cart is deliberately not cleared, because nothing was ordered. A shopper can fill a cart and has no way to buy anything.

Meanwhile the backend has the whole flow ready: saved delivery addresses, real shipping methods with real prices, and an order endpoint that snapshots line items, validates stock, applies tax and coupons, deducts inventory, and clears the cart in one transaction. None of it is called.

## What Changes

- Replace the mock checkout with a real one: the shopper picks a saved delivery address and a shipping method, adds an optional note, and places an order through `POST /orders`.
- **BREAKING** (internal): `/checkout/success` stops being a static "nothing happened" page. It shows the placed order — order number, line items, and the server's totals.
- Add delivery-address management: shoppers can list, add, edit, set-default, and delete their addresses, both inside checkout and from a new account section.
- Shipping methods are fetched from `GET /shipping-methods` with their real prices and delivery estimates, replacing the hardcoded `SHIPPING_FLAT_RATE = 9.99` / `FREE_SHIPPING_THRESHOLD = 130` constants in the checkout page.
- **BREAKING** (internal): order totals become server-authoritative. The storefront shows an estimate while the shopper chooses, but tax, free-shipping thresholds, and coupon effects are computed by the backend and the order confirmation shows the server's numbers, not the client's.
- Guests are sent to sign in before checkout, returning to `/checkout` afterwards with their cart merged into the account.
- Order failures — an out-of-stock line, an emptied cart, a rejected address — are surfaced to the shopper with the backend's own message, leaving the cart intact so they can fix the problem and retry.

Out of scope: payment capture (the backend's own payment endpoint is gateway-agnostic and records an attempt rather than charging a card), order history and order detail pages under the account area, order cancellation, and returns. Billing addresses are also out of scope — the address API supports a `BILLING` type, but `POST /orders` accepts only `shippingAddressId`.

## Capabilities

### New Capabilities
- `storefront/checkout`: How a shopper turns a cart into a placed order — what must be chosen first, how totals are determined and by whom, what happens to the cart, what the shopper is shown afterwards, and how failures are handled.
- `storefront/delivery-addresses`: How a shopper manages their saved delivery addresses — creating, editing, choosing a default, deleting, and how addresses are scoped to their owner.

### Modified Capabilities
<!-- None. `storefront/shopping-cart` is unchanged: this change reads the cart and relies on the backend clearing it on a successful order, which the existing spec already permits. -->

## Impact

- **Code**: `src/app/checkout/page.tsx` (rewritten), `src/app/checkout/success/page.tsx` (rewritten), `src/app/account/page.tsx` (address section entry point). New: an order service, an address service, address CRUD components, a checkout form, and proxy route handlers for the authenticated order/address calls.
- **APIs consumed**: `POST /orders`, `GET /orders/:id`, `GET /shipping-methods` (public), and the address set `GET|POST /customers/me/addresses`, `GET|PATCH|DELETE /customers/me/addresses/:id`, `PATCH /customers/me/addresses/:id/set-default`.
- **Auth**: verified that `POST /orders` and every address route return **401** for a guest — the cart is guest-friendly but checkout is not. Checkout therefore requires sign-in, reusing the existing `?redirect=` flow and the backend's guest-cart merge.
- **Money**: shipping method `price` arrives as a decimal string (`"80"`), as do all order totals. These parse to numbers at the service boundary, consistent with the existing product and cart handling.
- **Dependencies**: none added. Uses the existing `apiFetch`, cart proxy pattern, and Redux store.

### Blocker: the warehouse stock ledger is empty

`POST /orders` validates every line against the `Stock` warehouse ledger, **not** against the `stockQuantity` shown on the product. That ledger currently holds **zero rows**, so every product fails checkout:

```
409 — Insufficient stock for "JBL Flip 6" — requested 1, available 0
```

Verified against all five products, each of which advertises `stockQuantity` between 20 and 75. This is missing inventory data, not a frontend defect, and it makes checkout impossible until stock exists.

Stock rows are only ever created by receiving a purchase order (`purchase-order.service.ts`) or completing a return — there is no direct "create stock" endpoint. Seeding therefore means running the real procurement path: supplier → purchase order → receive into the existing "Merul Badda Central Warehouse". The user has asked for this to be seeded as part of implementation so a genuine order can be verified end to end; it writes test inventory to their database, adjustable afterwards from the admin panel.

A consequence worth stating: because product `stockQuantity` and the `Stock` ledger are independent, the storefront can show a product as in stock that checkout will reject. The specs require that conflict to be surfaced clearly rather than hidden.
