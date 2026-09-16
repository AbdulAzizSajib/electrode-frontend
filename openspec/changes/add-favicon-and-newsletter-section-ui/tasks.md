## 1. Settings payload

- [x] 1.1 Add `faviconUrl: string | null` to the `StoreSettings` interface in `src/types/store-settings.ts`, beside `logoUrl`/`footerLogoUrl`, with a comment that null means "no icon chosen" and the storefront owns the fallback.
- [x] 1.2 Add `"NEWSLETTER"` to the `HomeSectionKey` union in the same file, last, matching the server's registry order. Keep the union's comment naming the two mirrors accurate.
- [x] 1.3 Add `faviconUrl: null` to `FALLBACK_SETTINGS` and `faviconUrl: data.faviconUrl ?? FALLBACK_SETTINGS.faviconUrl` to the mapping in `src/services/store-settings.ts`, so a backend that predates the server change reads as unconfigured rather than `undefined`.
- [x] 1.4 Append `{ key: "NEWSLETTER", enabled: true }` to `FALLBACK_SETTINGS.homeConfig`. This is the outage path — see design.md Decision 6 — so it must be last and enabled, matching the server registry.

## 2. Favicon

- [x] 2.1 Add a `resolveIcons(settings)` helper to `src/lib/seo/resolve-metadata.ts` returning `Metadata["icons"]` as `{ icon: [{ url }] }`: the merchant's `faviconUrl` through the module's existing `clean` helper, falling back to `/favicon.ico`. It must never throw — same obligation as everything else in that file.
- [x] 2.2 Do NOT add the icons to `resolveMetadata`'s return value. It is called by ~18 routes and every one of them would emit a duplicate link; the icon is declared once, in the root layout, and inherited (design.md Decision 2).
- [x] 2.3 Call it from `generateMetadata` in `src/app/layout.tsx` and spread the result into the returned metadata, so both the shop and campaign landing pages are covered from the one place above both shells.
- [x] 2.4 Move `src/app/favicon.ico` to `public/favicon.ico` — **one commit, both halves.** Deleting it stops Next prepending its own `<link>` (`metadata.icons.icon.unshift(favicon)` in `next/dist/lib/metadata/resolve-metadata.js`); the public copy keeps a bare `GET /favicon.ico` resolving and is the fallback value used in 2.1.
- [x] 2.5 Verify in the browser, on a page of each shell: with no `faviconUrl` configured the head carries exactly one icon link, pointing at `/favicon.ico`, and that URL loads; with one configured it carries exactly one, pointing at the merchant's URL. Two links means `src/app/favicon.ico` is still there.

  Verified by rendering pages from a running dev server and inspecting the served `<head>` (no browser automation is available here, but the head is plain HTML, so nothing is lost by reading it directly).

  - **Unconfigured:** exactly one link, `<link rel="icon" href="/favicon.ico"/>`, and `GET /favicon.ico` returns 200 `image/x-icon` from its new home in `public/`.
  - **Configured:** exactly one link, pointing at the merchant's Cloudinary URL.
  - **Inherited by every route checked**, not just `/`: `/products`, `/cart`, `/checkout` and a product page each carry exactly one link. Those routes all define their own `generateMetadata`; the root layout's `icons` survives because Next merges metadata per key and none of them sets `icons`.

  **The landing shell was not exercised** — this database has no landing pages, so there is no `/lp/<slug>` to render. It is covered structurally rather than by observation: the icon is declared in `app/layout.tsx`, which is the one layout above both `(shop)` and `(landing)`.

  **Two things that cost time here and will again:**
  1. `frontend/.env.local` points `NEXT_PUBLIC_API_BASE_URL` at the **deployed** API (`https://ecomsite-server.vercel.app/api/v1`), not the local one. That server predates the server change — it sends no `faviconUrl` and no `NEWSLETTER`. Verification had to run with the variable overridden to `http://localhost:5000/api/v1`. See the note under 6.1: this is more than an inconvenience.
  2. A stale `.next` cache served the previous metadata (the fallback icon) after the favicon was set, while the page body rendered fresh settings. Restarting the dev server was not enough — only `rm -rf .next` cleared it. Not a code defect; worth knowing before concluding one.

## 3. Newsletter section

- [x] 3.1 Create `src/components/home/Newsletter.tsx` as a **server** component taking the merchant's newsletter content as a prop and rendering the existing `NewsletterForm` inside it. Do not fetch settings in it — the page already has them (design.md Decision 3).
- [x] 3.2 Give it its own full-bleed `bg-brand text-white` band with the container inside, matching how `PerksBar` and the other self-styling bands work. Drop the `border-b border-white/10` divider — it separated the block from the footer's columns and now separates nothing (design.md Decision 5).
- [x] 3.3 Render the heading and subtext only when present; the form always renders. Enabled is the only switch — no `heading &&` guard around the block (design.md Decision 4).
- [x] 3.4 Add `NEWSLETTER: <Newsletter newsletter={settings.newsletter} />` to the `rendered` map in `src/app/(shop)/page.tsx`. It fetches nothing, so add nothing to the `Promise.all` query set — like `BRAND_BAR` and `PERKS_BAR`. Note in the surrounding comment that it is one of the sections that fetch nothing.
- [x] 3.5 Update `NewsletterForm.tsx`'s doc-comment: it is no longer "the footer's signup form". Keep the component itself unchanged, including the `preventDefault` no-op and the note that there is no subscriber endpoint.

## 4. Remove the newsletter from the footer

- [x] 4.1 Delete the newsletter block from `src/components/layout/Footer.tsx`, along with `newsletter` from the destructured settings and the `NewsletterForm` import.
- [x] 4.2 Check the footer still reads correctly with its first child gone — the removed block carried the top padding and the divider that separated it from the link columns, so the columns may now sit flush against whatever is above.
- [x] 4.3 Confirm no other surface renders the newsletter: grep for `NewsletterForm` and `newsletter` across `src/` and check the campaign landing pages under `app/(landing)/` in particular.

## 5. Tests

Node-environment unit tests over `src/lib` only — this repository has no DOM and no React renderer, so the components above are verified by hand in the browser (tasks 2.5 and 6.1).

- [x] 5.1 Extend `src/lib/seo/resolve-metadata.test.ts`: a configured `faviconUrl` resolves to it; null, an empty string and a whitespace-only value all resolve to `/favicon.ico`; nothing throws on any of them.
- [x] 5.2 Extend `src/lib/chrome-services.test.ts`: the fallback settings carry `NEWSLETTER` in `homeConfig`, and a response omitting `faviconUrl` reads back as null rather than `undefined`. Fix the two existing assertions that require `newsletter.heading` to be truthy for the *footer* to be renderable — that is no longer what makes the footer renderable.
- [x] 5.3 Run `cd frontend && npx vitest run` and confirm the suite passes. (Flags do not survive `npm --prefix`; and the drive letter must be uppercase `E:\` or every test fails at `describe()`.)

## 6. Verification

All three were run against the local API (which has the server change), with the settings changed through `PATCH /settings` as the seeded super admin and the storefront HTML read back after each change. Settings were restored afterwards and confirmed: 11 stored `homeConfig` keys, `faviconUrl` null, the original heading.

- [x] 6.1 With the server change deployed, switch the newsletter section off in the admin and confirm it disappears from the home page and appears nowhere else; switch it back on and confirm the merchant's wording is unchanged; drag it above another section and confirm the order.

  Storefront side verified; the settings were changed through the API rather than by clicking the admin, which is the admin change's own concern.

  - **Off:** the home page renders no newsletter band (`>Subscribe<` count 0).
  - **Back on:** the band renders, and its `<h2>` reads exactly the stored heading — `Join Our Newsletter For ৳10 Off`.
  - **Reorder:** with `NEWSLETTER` last it rendered below the perks bar; moved directly above `PERKS_BAR` in the config, it rendered above it. The perks bar was used as the marker because it renders from local constants — the blog and testimonials sections render nothing in this database (no posts), and their emptiness guards correctly suppress them.

  **Found while verifying, and the most important thing in this file:** against the DEPLOYED API that `.env.local` points at, the newsletter renders **nowhere** — not on the home page, because that server's `homeConfig` has no `NEWSLETTER`, and not in the footer, because this change removed it. That is the exact regression the design's Migration Plan warns about when the storefront ships before the server. It is not a bug in this change; it is a live demonstration that **this change must not be deployed until the server change is.**

- [x] 6.2 Confirm the newsletter is absent from a product page, a category page, the cart, the checkout and a campaign landing page.

  Absent from `/products`, `/cart`, `/checkout` and `/products/hi-fi-earbud-premium` — newsletter band count 0 on each, while the home page rendered it.

  Not observed on a campaign landing page, because none exists in this database. Covered by the code instead: `NewsletterForm`'s only consumer is `components/home/Newsletter.tsx`, nothing under `app/(landing)/` references the newsletter, and the `(landing)` shell never rendered the footer in the first place.

- [x] 6.3 Confirm the home page still renders the newsletter when the settings API is unreachable — the fallback path from task 1.4. Simulate by pointing the API base at a dead port.

  With `NEXT_PUBLIC_API_BASE_URL` pointed at `http://localhost:59999` (nothing listening), `/` still returned a full page and rendered the newsletter band, from `FALLBACK_SETTINGS.homeConfig`. The icon degraded to exactly one link at `/favicon.ico`. This is the path task 1.4 exists for, and it is the only one where omitting `NEWSLETTER` from the fallback would have shown.
