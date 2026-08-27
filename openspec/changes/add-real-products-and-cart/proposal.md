## Why

Every product on the storefront is fictional. Cards render from a hardcoded `src/data/products.ts` array, so shoppers browse products the merchant does not sell, at prices that do not exist, with placeholder images — while the real catalog (5 active products with Cloudinary photos, real prices, stock counts, brands and variants) sits behind an API the storefront never calls.

The cart has the same problem one layer deeper: it lives only in `localStorage` and resolves its lines against that same fictional array. Adding to cart writes a product id the backend has never heard of. The cart is lost when the shopper changes device, it cannot survive login, and checkout has nothing real to submit. The backend already ships a complete cart API that works for guests and merges a guest cart into the customer's account on login — none of it is wired up.

## What Changes

- Product cards, the product listing, and the homepage sections render from the live catalog (`GET /products`) instead of `src/data/products.ts`: real names, prices, compare-at prices, Cloudinary images, brand, category, and stock.
- The product detail page renders from `GET /products/:slug`, including its variants and attributes.
- **BREAKING** (internal): the `Product` type is replaced by the API's shape. Prices arrive as decimal *strings* (`"79.99"`) and must be parsed; `handle` becomes `slug`; `vendor` becomes `brand.name`; `image` becomes `images[]` with an `isPrimary` flag.
- Cards for `VARIABLE` products show **Options** and link to the detail page, where the shopper picks a variant before adding. Only `SIMPLE` products get a direct Add to cart. This prevents silently charging the base price for a variant the shopper never chose — all 5 current products are VARIABLE with variants priced differently from the base (e.g. Xiaomi Hub base $79.99, Standard $79.99, Pro $109.99).
- **BREAKING** (internal): the cart moves from `localStorage` to the backend cart API as the single source of truth. Guests keep a cart via the backend's `guestToken` cookie; on login the backend merges it into the customer's account.
- Cart state is managed with Redux Toolkit, replacing the current React Context. RTK Query (bundled with Redux Toolkit) handles the cart's server-state caching and invalidation.
- Coupons: a shopper can apply a coupon code to the cart and remove it again, with the resulting discount reflected in the cart summary.
- Removals: `src/data/products.ts` and `src/contexts/cart-context.tsx` are deleted once their consumers are migrated.

Out of scope: checkout/order placement, wishlist, product reviews, and pagination/filter UI beyond preserving what exists. Also out of scope: the homepage `CategoryGrid` item counts, which no endpoint currently provides. Wishlist is deliberately excluded — unlike the cart it requires authentication (no guest wishlist), so it carries its own signed-out UX that belongs in a separate change.

## Capabilities

### New Capabilities
- `storefront/product-catalog`: How the storefront presents real catalog products to shoppers — the information a product must display, how variable products are distinguished from simple ones, image and pricing presentation, and behavior when the catalog is unavailable.
- `storefront/shopping-cart`: How a shopper's cart is held and modified — server-side ownership, guest carts and their merge on login, adding/updating/removing lines, variant-aware line identity, and totals.

### Modified Capabilities
<!-- None. `storefront/category-navigation` (from add-dynamic-category-menu) is unaffected: this change does not alter category menu behavior. -->

## Impact

- **Code**: `src/components/product/ProductCard.tsx`, `ProductListing.tsx`, `ProductFilters.tsx`, `src/app/products/[handle]/page.tsx`, `src/app/page.tsx`, `src/app/deals/page.tsx`, `src/components/layout/CartDrawer.tsx`, `src/app/cart/page.tsx`, `src/app/layout.tsx`. New: product/cart types, a product service, a Redux store with a cart slice, and cart Server Actions. Deleted: `src/data/products.ts`, `src/contexts/cart-context.tsx`.
- **APIs consumed**: `GET /products` (public, paginated, supports `searchTerm`/`category`/`brand`/`minPrice`/`maxPrice`), `GET /products/:slug` (public, includes `variants` and `attributes`), the cart set `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:itemId`, `DELETE /cart/items/:itemId`, and the coupon pair `POST /cart/apply-coupon`, `DELETE /cart/coupon` — the full Cart folder of the Postman collection. All cart routes are guest-or-customer via the backend's `optionalAuth`.
- **Cookies**: the backend issues `guestToken` (guest cart identity) and `appliedCoupon` (persisted coupon), both httpOnly on *its* domain. As with auth, the storefront must proxy cart calls server-side and re-issue these on its own domain, or they will not survive across requests.
- **Dependencies**: adds `@reduxjs/toolkit` and `react-redux`. Also removes the erroneous `"root": "git+https://github.com/tanstack/react-query.git"` entry currently in `package.json`, which installs the entire react-query repository under the name `root` and is unused.
- **Images**: product photos are Cloudinary URLs. `next.config.ts` currently sets `images.unoptimized: true`, so they render without configuration, but the remote host should be allowlisted if optimization is re-enabled later.
- **Risk — cart totals**: cart responses contain no price or total fields (verified against the live API); only nested `product` and `variant` objects. The storefront must compute line and cart totals itself, and must price a line from its `variant` when one is set, not from the product's base price.
- **Risk — stock is not enforced on add**: the API accepts a quantity far above `stockQuantity` (verified: adding 999 of a 30-stock item returns 201). The storefront must not present stock as guaranteed; overselling is ultimately caught at checkout, which is outside this change.
