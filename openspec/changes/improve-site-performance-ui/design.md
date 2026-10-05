## Context

See proposal.md for why. The facts that shape the approach:

- **Every shop page is dynamic, and stays dynamic.** `(shop)/layout.tsx` reads cookies to know who is signed in, so every route under it renders per request. That is by design: the header is personal. What makes a dynamic render fast is that nothing in it waits on the network. Public reads already go through `apiFetch` with `revalidate` + `tags`, so they come from the Data Cache. The one blocking network call left is `getCurrentUser()` → `/auth/me` (`services/auth.ts:320`, `no-store`), awaited in the layout's `Promise.all` and again on the product page.
- **What the chrome needs from the user.** `Header` reads `user` only as a truthy check and `user.name` for the first name. `StoreProvider` takes `isSignedIn`. The product page takes `isSignedIn`. The access token's claims already carry `userId`, `role`, `name`, `email` and `exp` (`types/auth.ts:40`), and `lib/jwt.ts` decodes them without verification. That is safe for display, because the backend re-verifies on every customer call. `src/proxy.ts` renews an expiring token before render and writes the renewed cookies onto the request (`proxy.ts:75`), so the layout sees the fresh one.
- **Demo key.** `demoKey()` (`lib/demo.ts:81`) always reads `headers()` and derives a key from the hostname's first label whenever there are three or more labels. The server sent revalidations scoped to its own demo key, `default` on every single-shop install, and the revalidate route scoped the tag with the `x-demo-key` it received. So a storefront at `www.x.com` or `x.com.bd` cached under `www`/`x` and was invalidated under `default`: merchant saves only showed after the time-based expiry. All of this came from `add-multi-demo-hosting`.
- **Revalidate windows.** `store-settings` 30 s, `review` 30 s, `landing-page` 30 s, `product` 60 s. The rest are 300 s. Time-based revalidation is stale-while-revalidate: an expired entry is served at once and refreshed in the background (`node_modules/next/dist/docs/01-app/02-guides/how-revalidation-works.md:22`). A short window therefore costs a background request, not a slower render.
- **Icons.** `@iconify/react`'s `<Icon icon="prefix:name">` fetches icon data from `api.iconify.design` in the browser after mount. The names come from store settings (header links, perks) and landing-page data, so they cannot be bundled at build time. `<Icon>` also accepts an icon-data object and then renders synchronously, including during SSR.
- **Images.** `lib/image-loader.ts` rewrites `…/image/upload/…` to `f_auto,c_limit,w_N,q_auto`. Next 16 deprecates `priority` in favour of `preload`, and for art direction recommends `getImageProps` + `<picture>` with `fetchPriority="high"`, because `preload`/`loading="eager"` on two `<Image>`s would download both (`node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md:1288-1321`).

## Goals / Non-Goals

**Goals:**
- No network wait in the render path of shop chrome or the product page.
- A merchant save is visible on the next request on every hostname shape.
- No Cloudinary original reaches a browser.

**Non-Goals:**
- **Static or ISR shop pages.** That would need signed-in state moved entirely client-side (a flash of signed-out chrome) or Cache Components (`cacheComponents`/`"use cache"`) adopted across the app. Both are larger than this change. Once nothing in the render waits on the network, a dynamic render is cheap.
- **Narrowing `Header`'s props or lazy-loading Swiper/Lenis.** These are real but smaller wins with more regression surface. They are better as their own change.
- **Removing `getPriceBounds`' two extra listing calls.** They are `revalidate` fetches served from the Data Cache.
- **Changing revalidate windows.** Because expiry is stale-while-revalidate (Context), lengthening them would not speed up any render. It would only make data staler when tag invalidation fails, and the short settings and product windows exist on purpose: the settings window is the documented safety net when revalidation is misconfigured, and the product window bounds how late a campaign's start or end shows, since nothing saves at that moment.

## Decisions

### D1. `getSessionUser()`: claims, not a profile
`lib/current-user.ts` gains `getSessionUser = cache(async () => …)`. It reads the access token via the existing `getAccessToken()`, returns `null` if the token is absent or `isTokenExpired`, and otherwise returns `{ id, name, email, role }` from `decodeAccessToken`. The shop layout passes it to `Header` and `StoreProvider`, and the product page uses it for `isSignedIn`. `Header`'s `user` prop type narrows from `AuthUser` to that `SessionUser` shape. `getCurrentUser()` (full profile via `/auth/me`) is unchanged and stays on account pages and checkout.

*Alternative considered:* keep `/auth/me`, but stream it behind `<Suspense>` with a promise passed to the client header. It was rejected because it still costs a backend round trip per signed-in page view and adds a visible pop-in of the account label. The claims are already in hand.

*Trade-off:* a name change shows in the header only once the access token is reissued. The token is reissued on renewal or sign-in. Display names change rarely, and the account page itself reads the profile fresh.

### D2. No demo key: cache tags are the server's tags, unscoped
The merchant cancelled `add-multi-demo-hosting` (2026-10-05) and asked for it removed. So the storefront's half is gone:

- `lib/demo.ts` and its tests are deleted.
- `apiFetch` sends no `x-demo-key` and tags its fetches with the plain tag.
- `proxyRequest` sends no demo key.
- The revalidate route expires the tag it is given.

Those three files are back to their exact pre-demo form. The server's half (`tenant.ts`, the scope middleware and the header on revalidation) is removed in `server/`, and the admin's in `admin/`.

This also fixes the invalidation bug above by construction. The tag the server names is the tag the storefront wrote, whatever the hostname.

*History:* a `DEMO_HOSTING` flag was proposed first and declined, and then a constant `default` key was implemented. Both were superseded by removing the mechanism.

### D3. Revalidate windows are left as they are
The change first proposed raising the 30 s and 60 s windows to 300 s. Implementation showed that this buys nothing: expiry never blocks a render (Context). So the windows stay, and the speed comes from D1, while the freshness comes from D2.

### D4. Icons resolved on the server, once, cached for a week
A new `lib/iconify.ts` exports `resolveIcons(names: string[]): Promise<Record<string, IconifyIcon>>`. It works as follows:

- Group names by prefix.
- Fetch `https://api.iconify.design/{prefix}.json?icons=a,b` through plain `fetch` with `next: { revalidate: 604800 }`. Icon data is immutable per name, so a week-long cache is safe.
- Resolve one level of `aliases`.
- Drop unknown names.
- Never throw: a failed fetch yields an empty map, and the icon simply does not render.

The shop layout collects names from settings (middle-bar links, perks, the fixed `akar-icons:whatsapp-fill`) and passes the map down. The landing page route does the same for its sections and `lucide:phone`. Components render `<Icon icon={icons[name]}>` only when the entry exists.

*Alternative considered:* switch to `lucide-react`. It was rejected because merchants already store names from several Iconify sets (`akar-icons`, `lucide`, …) and the admin's icon picker is Iconify.

### D5. One URL helper for everything `next/image` doesn't cover
`lib/image-loader.ts` gains an exported `cloudinaryUrl(src, { width?, height? })`. It applies the same `f_auto,q_auto,c_limit` plus `w_`/`h_` rewrite and returns non-Cloudinary `src` unchanged. The loader's regex widens to `/(image|video)/upload/`. A `video/upload` URL ending in an image extension (a generated poster) gets image transformations. A `video/upload` URL with a video extension gets `q_auto,vc_auto` via a separate `cloudinaryVideoUrl(src)`.

Call sites:

- **Logo**: `Header`, `Footer` and `LandingBrand` use `cloudinaryUrl(src, { height: 2 * renderedHeight })`.
- **Landing images**: `LandingSections` and `LandingOrderForm` use `cloudinaryUrl(src, { width: 2 * box })`.
- **Rich text**: `RichText` rewrites `<img src>` that match Cloudinary to `width: 1200` and adds `loading="lazy" decoding="async"`, inside `sanitizeHtml`'s output pass, so it happens exactly once and on the sanitised tree.
- **Video**: `ProductVideo` and `LandingGallery` use `cloudinaryVideoUrl`, with posters through `next/image` or `cloudinaryUrl`.

### D6. Hero art direction with `getImageProps`
When a slide has mobile artwork, `HeroSlider` calls `getImageProps` for both sources with the same `alt`/`fill`/`sizes`, and renders `<picture><source media="(min-width:1024px)" srcSet={desktop.srcSet}/><img {...mobile} /></picture>`. Slide 0 gets `fetchPriority="high"` and `loading="eager"`, and the others keep `loading="lazy"`. The browser then downloads exactly one artwork per screen. The single-image branch replaces deprecated `priority` with `preload` for slide 0. `HeroFullSlider` and `HeroSliderStack` inherit this through `HeroSlider`.

### D7. Thumbnails state their size
Fixed boxes declare `sizes` matching the box: cart page and cart drawer 80 px, checkout 64 px. Blog cards declare `(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw`, and the blog hero `(min-width:1024px) 768px, 100vw`. `CategoryTile` stops claiming 500×400 for an 80 px box and uses `fill` with `sizes="80px"`. `ProductVideo`'s poster is sized to its container. `next.config.ts` adds 160 to Next's default `imageSizes`, because without it an 80px box at 2x jumps from 128 to 256.

## Risks / Trade-offs

- **[A revoked or deactivated account still shows "Hello, Name" until its token expires]** → Display only. Every customer action re-authenticates server-side and fails, and the token lifetime is short. This is the same trust level `proxy.ts` already applies.
- **[Several shops served by one storefront process would share one cache]** → Not a configuration this project supports any more (D2). Each shop is its own install.
- **[api.iconify.design is unreachable at render time]** → `resolveIcons` returns what it has and never throws. Icons are decorative and the text stands alone. Successful lookups are cached for a week.
- **[Rich-text rewrite touches merchant HTML]** → Only `src` on Cloudinary-matching `<img>` plus two loading attributes change. The sanitiser's allowlist is unchanged, and `lib/sanitize-html` gets unit tests for it.

## Migration Plan

Deploy independently of the server change. Rollback is a code revert. There is no data or cache migration: tags are re-scoped on the first request after deploy.
