## Why

The header's "Shop By Categories" menu is hardcoded in `src/data/content.ts` and lists categories that do not exist in the backend (Smart Watch, Apple iPad, Smartphone, Game Console). Every entry links to `/products?category=<label>`, so shoppers who use the menu land on empty result pages. Meanwhile the real catalog — four parent categories with ten children — is already served by the API and is invisible to customers. Merchandisers who add or rename a category in the admin panel currently have no way to surface it on the storefront without a code change and redeploy.

## What Changes

- Fetch the storefront category tree from the public `GET /categories` endpoint and render it in the header's "Shop By Categories" dropdown (desktop) and the mobile menu, replacing the hardcoded `categoriesMenu` array.
- Parent categories with children expand to reveal their children; parents without children navigate directly, preserving the existing interaction model.
- **BREAKING** (internal, no public API): category links change from `/products?category=<display name>` to `/products?category=<slug>`. The products page resolves the slug to a category id before querying the API, so filtering works against real catalog data instead of matching on a display string.
- When the categories request fails or returns an empty tree, the categories menu is omitted rather than falling back to fictional categories that lead to empty product pages.
- Remove the now-unused hardcoded `categoriesMenu` export from `src/data/content.ts`.

Explicitly out of scope: the homepage `CategoryGrid` component and the `categoryTabs` product-section tabs remain on static data. They carry per-category item counts and images that `GET /categories` does not currently provide (every `image` in the live tree is `null`), so making them dynamic is a separate change.

## Capabilities

### New Capabilities
- `storefront/category-navigation`: How the storefront sources, renders, and links the shopper-facing category menu, including hierarchy, ordering, failure behavior, and the slug-based link contract between the menu and the products listing.

### Modified Capabilities
<!-- None. This is the first spec in the project; no existing capability's requirements change. -->

## Impact

- **Code**: `src/components/layout/Header.tsx` (consumes categories via props instead of the static import), `src/app/layout.tsx` (fetches the tree server-side and passes it down, alongside the existing `user` prop), `src/data/content.ts` (drop `categoriesMenu`), `src/app/products/page.tsx` (resolve `?category=` slug to an id when filtering). New: a category service module and category types.
- **APIs consumed**: `GET /categories` (public, no auth, ACTIVE-only, one level of children nested). Chosen over `GET /categories/admin/tree`, which is gated to OWNER/ADMIN and returns 401 for guests and 403 for customer sessions — unusable from the storefront — and which would also expose INACTIVE categories to shoppers.
- **Dependencies**: none added. Uses the existing `apiFetch` helper in `src/lib/api-client.ts`.
- **Performance**: adds one server-side API call to the shared layout. Mitigated by caching the tree with a short revalidation window rather than fetching per request; categories change rarely.
- **Risk**: the header is on every page, so a slow or hanging categories request would delay all navigation. The failure path must degrade to hiding the menu, never block rendering.
