# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

[Existing codebase: Next.js 16 App Router + React 19, TypeScript, Tailwind CSS v4, Redux Toolkit for client state, Swiper + lenis + react-fast-marquee for storefront motion, Lucide/Iconify icons, Vitest; deployed as a Vercel app on port 4000 in dev.]

## Users

Shoppers buying electronics/gadgets online in Bangladesh. Two populations: (1) visitors browsing the catalog and checking out as guests (no login required), paying by COD, bKash, Nagad, Rocket, card, or other BD methods in BDT; and (2) visitors arriving from paid ads (Meta, etc.) on campaign landing pages — single-purpose pages with one offer and one order form, tracked against a canonical URL.

## Product Purpose

The customer storefront of a single BD electronics/gadgets e-commerce business: browse a catalog with variants/SKUs and specs, add to cart/wishlist, check out, and track an order; and convert paid ad spend through standalone campaign landing pages that funnel a visitor straight to an order form for one specific offer.

## Positioning

Not a generic storefront template: it is the buyer-facing half of a one-product system whose backend (`server/`) and admin panel it shares a contract with, and whose paid-campaign funnel is a first-class surface — when the store runs in LANDING_PAGE mode the shop root redirects to `/lp/<slug>` so an advertised page keeps a single canonical URL and never competes with the catalog.

## Operating Context

- Bangladesh market reality: checkout expresses BDT (৳), payment methods include COD, bKash, Nagad and Rocket, and shipping is handled through an integrated courier (Steadfast) the shop dispatches via the admin.
- Reads all data from the backend over `apiFetch` (Server Components) with per-resource revalidate windows; the backend pings `/api/revalidate` on save so a merchant's edit shows up on the next request, not at the end of the window. `cache` and `revalidate` are mutually exclusive, and cache tags only work with a revalidate window.
- Browser-initiated calls to the backend go through `src/lib/api/` proxy routes because the backend's httpOnly cookies live on its own domain; the proxy is not an authorization boundary (Edge-safe, optimistic JWT decode).
- Theme, fonts, brand, nav, footer, announcement bar and checkout fields are all merchant-configured via store settings served from the backend; the storefront degrades to a complete `FALLBACK_SETTINGS` merge when unreachable so the header/footer and catalog never render blank.

## Capabilities and Constraints

- Guest checkout and order tracking are deliberately unprotected — visitors can order and track without an account.
- Responsive, mobile-first storefront; desktop and mobile are both first-class.
- `(shop)` route group carries all chrome (header, footer, cart drawer, providers) and fetches user + categories + settings concurrently in its layout; `(landing)` is deliberately bare — one visitor, one ad, one order form.
- A paid campaign page must never render degraded: 404 maps to null, but other failures rethrow (an empty campaign would take ad money and show nothing).
- This is Next.js 16 with changed conventions (e.g. `src/proxy.ts` exporting `proxy()`, layouts typed via `LayoutProps`, `revalidateTag` options object); `node_modules/next/dist/docs/` is the authoritative API guide.

## Brand Commitments

- Storefront brand is merchant-configured through store settings (store name + accent, logo images and heights, fonts incl. Outfit default, colors, announcement bar, copyright line). The current seeded identity is "Gadgets Mart" (`Gadgets` + accent `Mart`) as a text wordmark, with Outfit as the fallback font.
- No outside-of-settings brand lock-in: nothing about the storefront's identity is hardcoded beyond the fallback fixtures.

## Evidence on Hand

- Seed imagery in `public/` (product, category, and brand fixtures) driving the pre-launch catalog.
- No real shopper data, orders, or testimonials exist — all content is seeded fixture data; future work must not present it as real.

## Product Principles

1. The backend is the source of truth: the storefront only renders what the API returns, mapped per-resource with its own revalidation window.
2. A paid campaign page is a revenue surface, not a catalog decoration — it must never render empty or stale on failure.
3. Cached rendering is acceptable only because the backend invalidates deterministically; a misconfigured deployment must be visible, never silently correct.
4. Degrade only where a degraded render stays truthful (chrome, listings); never on something the business is paying to show.
5. Guests are first-class: the entire checkout and order-tracking journey works with no account.