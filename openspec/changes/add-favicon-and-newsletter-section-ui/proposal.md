## Why

Two pieces of the storefront still ignore the merchant, and the server change `add-favicon-and-newsletter-section` (in `server/`) has just made both of them configurable. This change is the storefront half.

**The browser-tab icon is `src/app/favicon.ico`, a file in this repository.** Every deployment of this platform shows the same mark in a tab, a bookmark and a search result, no matter whose shop it is. Every other piece of brand artwork — the header logo, the footer logo, the organisation logo in the structured data — already comes from the settings payload this storefront fetches in its root layout on every page. The favicon is the only one that needs a developer and a redeploy.

**The newsletter block is welded into `Footer.tsx`.** It renders above the footer's link columns on every page of the site, and the only way a merchant can remove it is to clear its heading — an accident of `{newsletter.heading && ...}`, not a switch anyone designed. Meanwhile `homeConfig` already expresses exactly the control they want: switch a home-page section on, switch it off, drag it up or down. The server has added `NEWSLETTER` to that list; this change makes the storefront honour it.

## What Changes

- The root layout emits the merchant's favicon from `settings.faviconUrl`, so it covers both shells — the shop and campaign landing pages — from the one place they share.
- `src/app/favicon.ico` is **deleted as a Next.js file convention** and the same artwork is served from `public/favicon.ico` instead. The file convention emits its own `<link rel="icon">` unconditionally and cannot be overridden by metadata, so leaving it in place would put two competing icon links in every document head. The public copy keeps a bare `/favicon.ico` request resolving, and becomes the fallback for a shop that has not chosen an icon.
- A new `Newsletter` home section renders the signup block as a full-bleed band of its own, styled to stand on the page rather than inside the footer's brand-coloured slab. It reuses the existing `NewsletterForm` client component unchanged.
- `NEWSLETTER` joins the `HomeSectionKey` union, the `rendered` map in `app/(shop)/page.tsx`, and `FALLBACK_SETTINGS.homeConfig` — the hand-maintained mirror of the server's registry, which must carry the section or a settings outage would serve a page without it.
- **The newsletter block is removed from `Footer.tsx`**, along with its props and its `NewsletterForm` import. The footer keeps its link columns, social links, brand block and contact details.
- **BREAKING for merchants in one visible way:** the newsletter moves from inside the footer to just above it, on the home page only. It no longer appears on product, category, cart, checkout or any other route. That is the point of the change — it is now a home-page section, and a merchant who wants it back on every page does not have that option any more.

Stated because its absence is deliberate: **the signup form stays a no-op.** There is no subscriber endpoint to POST to and nothing storing subscribers; `NewsletterForm` still calls `preventDefault` and does nothing else. Moving the block does not make it work, and a form that looked like it worked would be worse than the honest no-op. Capturing subscribers is its own change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `storefront/store-settings`: adds a requirement that the browser-tab icon is merchant-owned and reaches the document head of every page, with a defined fallback when the merchant has chosen none.
- `storefront/homepage-merchandising`: adds a requirement that the newsletter signup is a home-page section governed by the merchant's section configuration, and is no longer part of the site chrome.

## Impact

- `src/app/layout.tsx` — `generateMetadata` gains the resolved icons.
- `src/lib/seo/resolve-metadata.ts` — a resolver for the icon, so the fallback rule is one testable function rather than a ternary in a layout. Covered by the existing `resolve-metadata.test.ts`.
- `src/app/favicon.ico` — **deleted**; the same bytes land at `public/favicon.ico`.
- `src/components/home/Newsletter.tsx` — new, a server component wrapping the existing `NewsletterForm`.
- `src/components/layout/Footer.tsx` — the newsletter block, its destructured prop and its import removed.
- `src/components/layout/NewsletterForm.tsx` — unchanged apart from its doc-comment, which currently calls it "the footer's signup form".
- `src/app/(shop)/page.tsx` — `NEWSLETTER` in the `rendered` map. It fetches nothing, so it adds no query.
- `src/types/store-settings.ts` — `faviconUrl` on `StoreSettings`, `NEWSLETTER` in the `HomeSectionKey` union.
- `src/services/store-settings.ts` — `faviconUrl` and the `NEWSLETTER` entry in `FALLBACK_SETTINGS`.
- `src/lib/chrome-services.test.ts` — the footer no longer needs a newsletter heading to be renderable; the fallback home config must carry the new section.
- **Depends on** `server/openspec/changes/add-favicon-and-newsletter-section`, which must be deployed first. Independent of the admin change — neither blocks the other.
