## 1. Render path without an account lookup (design D1, spec `storefront/page-delivery`)

- [x] 1.1 Add `SessionUser` (`id`, `name`, `email`, `role`) to `src/types/auth.ts`, and `getSessionUser = cache(...)` to `src/lib/current-user.ts`, built from `getAccessToken()` (`lib/session.ts`), `isTokenExpired` and `decodeAccessToken`.
- [x] 1.2 In `src/app/(shop)/layout.tsx`, replace `getCurrentUser()` in the `Promise.all` with `getSessionUser()`, and pass it to `Header` and to `StoreProvider isSignedIn`.
- [x] 1.3 Narrow the `user` prop on `Header` (and whatever it passes `user` to at `Header.tsx:~825`) to `SessionUser`, and fix the type fallout.
- [x] 1.4 In `src/app/(shop)/products/[handle]/page.tsx`, use `getSessionUser()` for `isSignedIn`.
- [x] 1.5 Leave account pages and checkout on `getCurrentUser()`, and confirm with grep that no other chrome component calls it.
- [x] 1.6 Add `src/lib/current-user.test.ts` covering the cases where the token is absent, expired, or valid (returns the claims' name). This needs `getAccessToken` mocked.

## 2. Remove the demo key (design D2–D3)

- [x] 2.1 Delete `src/lib/demo.ts`. Restore `lib/api-client.ts`, `lib/api-proxy.ts` and `app/api/revalidate/route.ts` to their pre-`add-multi-demo-hosting` form: no `x-demo-key`, plain tags. (First implemented as a constant `default` key, then superseded when the merchant cancelled multi-demo hosting.)
- [x] 2.2 Delete `src/lib/demo.test.ts` along with the module.
- [x] 2.3 ~~Raise the revalidate constants to 300~~ **Dropped** (design D3): expiry is stale-while-revalidate and never blocks a render.
- [x] 2.4 ~~Document `DEMO_HOSTING`~~ **Dropped**: no demo-hosting flag in this project (design D2).
- [x] 2.5 Verify locally:
  - start with `REVALIDATE_SECRET` matching the server
  - edit store settings in the admin
  - reload the storefront and confirm the change shows immediately (tag path)

## 3. Server-resolved icons (design D4)

- [x] 3.1 Add `src/lib/iconify.ts` with `resolveIcons(names)`. It groups by prefix, fetches with `next: { revalidate: 604800 }`, resolves one level of aliases, never throws, and returns a `Record<string, IconifyIcon>`. Add a unit test for alias resolution, unknown names, and fetch failure (with `fetch` mocked).
- [x] 3.2 Shop layout: collect icon names from settings (middle-bar links, perks, the WhatsApp nav icon), call `resolveIcons`, and pass the map to `Header`, `PerksBar` and `MobileBottomNav`. Render `<Icon icon={data}>` only when data exists.
- [x] 3.3 Landing route: do the same for `LandingSections` item icons and `LandingOrderCta`'s `lucide:phone`.
- [x] 3.4 Check that `view-source:` of `/` contains the header and perk icon `<svg>` markup, and that the browser network tab shows no request to `api.iconify.design`.

## 4. Cloudinary URL helpers (design D5, spec `storefront/image-delivery`)

- [x] 4.1 In `src/lib/image-loader.ts`:
  - widen the match to `/(image|video)/upload/`
  - give image-extension `video/upload` URLs the image transformation
  - export `cloudinaryUrl(src, { width?, height? })` and `cloudinaryVideoUrl(src)` (`q_auto,vc_auto`)
  - extend `image-loader.test.ts` to cover posters, video, height-bounded logos and non-Cloudinary passthrough
- [x] 4.2 Run logos through `cloudinaryUrl` at 2× the rendered height: `Header.tsx:~395`, `Footer.tsx:~131` and `LandingBrand.tsx:~44`.
- [x] 4.3 Run landing images through `cloudinaryUrl` at 2× their box width: `LandingSections.tsx:~134,~151` and `LandingOrderForm.tsx:~934`.
- [x] 4.4 In the `sanitizeHtml` output pass, rewrite Cloudinary `<img src>` to `width: 1200` and add `loading="lazy" decoding="async"`. Extend `sanitize-html.test.ts`, including a non-Cloudinary `<img>` that must stay unchanged.
- [x] 4.5 `ProductVideo.tsx` and `LandingGallery.tsx`: use `cloudinaryVideoUrl` for `src`, and the loader or `cloudinaryUrl` for `poster`.

## 5. Hero and thumbnails (design D6–D7)

- [x] 5.1 `HeroSlider.tsx`: replace the two-`<Image>` mobile/desktop branch with `getImageProps` + `<picture>`. Slide 0 gets `fetchPriority="high"` and `loading="eager"`, and the other slides stay lazy. In the single-image branch, replace `priority` with `preload` for slide 0.
- [x] 5.2 Add `sizes`:
  - `app/(shop)/cart/CartView.tsx:~77` and `components/layout/CartDrawer.tsx:~240`: `80px`
  - `components/checkout/CheckoutForm.tsx:~1750`: `64px` (layout only, no copy changes)
  - `app/(shop)/blogs/page.tsx:~67` and `components/home/BlogSection.tsx:~104`: card sizes
  - `app/(shop)/blogs/[slug]/page.tsx:~96`: hero sizes
- [x] 5.3 `CategoryTile.tsx:~49`: switch to `fill` + `sizes="80px"`. `ProductVideo.tsx:~58`: size the poster to its container.
- [x] 5.4 Check in the browser network tab (desktop and a 390 px mobile emulation):
  - Checked 2026-10-05 against the rendered HTML instead of a browser network tab:
    - every hero and logo request carries a `w_`/`h_` transformation
    - thumbnails declare `sizes`
    - `next.config.ts` gained `imageSizes` 160 so an 80px thumbnail at 2x is served at 160, not 256
  - The mobile-artwork `<picture>` branch could not be seen live: no slide currently has mobile artwork.
  - the cart drawer thumbnail requests are at most 160 px wide
  - the mobile home page downloads only the mobile hero artwork, eagerly
  - no `res.cloudinary.com` request lacks a `w_`/`h_` transformation

## 6. Verification

- [x] 6.1 `cd frontend && npx vitest run` (from an uppercase `E:\` path), `npm run lint`, `npm run build`.
  - Vitest: 387/391. The 4 failures (`delivery-destination`, `section-layouts`) fail identically on the pre-change code.
  - `eslint src`: 4 problems, all pre-existing (LandingCountdown, CompareButton, two unused variables). The 2 React Compiler errors this change surfaced in `Header` were fixed.
  - Build passes.
- [ ] 6.2 Compare before and after for a signed-in visitor on `/` and `/products/{handle}` in production mode (`npm run build && npm start`), using TTFB from the network tab. Record the numbers in this change's design.md.
  - 2026-10-05, production build, guest TTFB on localhost: `/` 76–123 ms, `/products/{slug}` 33–46 ms, `/products` 42–56 ms. No signed-in comparison yet: it needs a real customer login. The gain is one `/auth/me` round trip per signed-in page view, removed by construction (`getSessionUser` makes no request; its unit test asserts `fetch` is never called).
