## Why

Pages on the storefront are slow to first byte, and images are heavier than they need to be. An audit found that the server-rendered chrome waits on an uncached `/auth/me` round trip for every signed-in page view. And on any host with three or more labels (`www.shop.com`, `myshop.com.bd`), the cache tags are scoped to the wrong key, so those saves never invalidate anything. On the image side, the Cloudinary loader covers product cards and the gallery, but not thumbnails without `sizes`, logos, landing-page images, rich-text images, video posters or the mobile hero. This is the storefront half of `improve-site-performance` (server) and `improve-site-performance-admin` (admin).

## What Changes

- **Chrome no longer waits for the account lookup.** The shop layout and the product page derive "signed in" and the display name from the access-token claims already in the request's cookies, with no backend call. `/auth/me` is still called on the account pages and checkout, which need the full profile.
- **Multi-demo hosting is removed from the storefront.** The merchant cancelled `add-multi-demo-hosting`. There is no `x-demo-key` and no tag scoping: a tag the server invalidates is exactly the tag the storefront cached. This also fixes tag invalidation on multi-label hostnames. Before, a `.com.bd` storefront cached under `myshop` while the server invalidated `default`.
- **Merchant-configured Iconify icons are resolved on the server** and passed as icon data, so header, perks and mobile-nav icons render in the first paint instead of fetching `api.iconify.design` from the browser after hydration.
- **Image delivery covers every Cloudinary image:**
  - The mobile hero uses art direction (`getImageProps` + `<picture>`) with the first slide eager and high-priority.
  - Fixed-box thumbnails declare `sizes` or their real dimensions.
  - Plain `<img>` logos and landing images go through a `cloudinaryUrl()` helper.
  - Rich-text images are rewritten to a bounded width with lazy loading.
  - Video posters get image transformations, and videos get `q_auto`.

## Capabilities

### New Capabilities
- `storefront/page-delivery`: what a page render may wait on, how cached content is refreshed, and the storefront's cache scope.
- `storefront/image-delivery`: every Cloudinary image and video the storefront renders is requested at a bounded, display-appropriate size and format.

### Modified Capabilities
None. The storefront's main specs have not been synced from earlier changes yet, so both capabilities are introduced here.

## Impact

- **Code**:
  - Pages and session: `src/app/(shop)/layout.tsx`, `src/app/(shop)/products/[handle]/page.tsx`, `src/lib/current-user.ts` (new `getSessionUser`), `src/lib/demo.ts` (deleted), `src/lib/api-client.ts`, `src/lib/api-proxy.ts` and `src/app/api/revalidate/route.ts`.
  - Icons: `src/components/layout/{Header,MobileBottomNav}.tsx`, `src/components/home/PerksBar.tsx`, and a new `src/lib/iconify.ts`.
  - Images: `src/lib/image-loader.ts`, `src/components/home/HeroSlider.tsx`, the thumbnail call sites listed in tasks.md, `RichText.tsx`, `ProductVideo.tsx` and the landing components.
- **Server dependency**: none. Works with the server's list payload before and after `improve-site-performance`.
- **Not in scope**: making shop pages statically rendered (the chrome is cookie-dependent by design), splitting the client `Header`'s props, and lazy-loading Swiper. See design.md.
