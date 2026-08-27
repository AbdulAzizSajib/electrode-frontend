## Why

Three changes so far have made the transactional core real — catalog, cart, checkout, addresses, auth. Everything around that core is still fiction. `src/data/content.ts` hardcodes the hero, banners, brand bar, category grid, testimonials, blog posts, footer links, and nav; `/wishlist` renders a permanent empty state; `/track-order` and `/gift-cards` are stubs whose forms call `preventDefault()` and do nothing; the header shows a literal `0 Reorder`; every testimonial repeats the same Lorem Ipsum under a hardcoded 5 stars. A merchant cannot run a promotion, publish a post, change their phone number, or answer "where is my order?" without a developer editing a TypeScript file and redeploying.

Some of this is already fixable with endpoints that exist and are simply not called — `GET /brands` and `GET /categories` both ship today while the homepage renders a frozen string array beside them. The rest needs backend work that does not exist yet. This change plans that work as a sequenced roadmap rather than one undifferentiated push, so each phase ships something a merchant can use.

## What Changes

Work is grouped into five phases. Each phase is independently shippable and ordered so that the cheapest merchant-visible wins land first. **Within every phase the backend endpoint is built and verified before the storefront consumes it** — the storefront is never wired against an endpoint that does not yet answer.

### Phase 1 — Store settings, and wiring up what already exists

- Add a public `GET /settings` returning merchant-owned presentation values: store name, contact address, email, phone, social links, announcement-bar text, currency, free-shipping threshold, return window, and footer link columns.
- Replace the duplicated contact details in `Footer.tsx` and `contact/page.tsx`, the announcement bar and currency/language labels in `Header.tsx`, the `$130` free-shipping threshold that appears in both `content.ts` and `ProductDetail.tsx`, and the 18 dead `href="#"` footer links.
- Wire the existing `GET /brands` into the homepage brand bar, replacing the hardcoded six-name string array.
- Wire the existing `GET /categories` into the homepage category grid and the category tab row. This also fixes a live defect: the grid links by display title where the listing expects a slug, so those filters silently resolve to nothing and return an unfiltered list.
- Extend the category payload with a product count per category, which the grid displays today as a hardcoded number.
- Make the category tabs actually filter; they currently have no click handler and only style the first tab as active.

### Phase 2 — Merchant-managed banners and blog

- Add banner storage and a public `GET /banners`, with placement (hero, side, promo, mid), ordering, active flag, and a scheduling window so a promotion can start and end on its own.
- Replace the four hardcoded banner datasets in `content.ts` with live banners; the hero becomes a real carousel rather than an array whose second slide is never rendered.
- Add a blog: public list and per-post detail, with slug, excerpt, body, cover image, author, tags, and publish date.
- Add the `/blogs/[slug]` detail route, which does not exist. The current `/blogs` page pads its grid by duplicating the first two of four posts.
- Add merchant CRUD for both banners and posts, including draft/publish so an unpublished post is invisible to shoppers.

### Phase 3 — Wishlist, order history, and order tracking

- Add a wishlist: list, add, remove, clear, available to guests via the same token the cart already uses, and merged into the account on sign-in.
- Replace the permanent empty state at `/wishlist`, the hardcoded `0 Reorder` counter, and the wishlist button on the product page that has no click handler.
- Add `GET /orders` so a customer can see their own past orders, and an order history page under the account area. `POST /orders` and `GET /orders/:id` already exist; only listing is missing.
- Add order tracking: a status timeline on an order, plus a guest lookup by order number and email so the `/track-order` form works without sign-in.

### Phase 4 — Reviews, contact and newsletter, catalog sorting

- Add product reviews: list, submit, edit, delete, mark helpful, restricted to verified purchasers, with merchant moderation before a review is publicly visible.
- Include an aggregate rating and review count on product list and detail payloads, so a listing page does not need one request per product to show stars.
- Replace the four identical Lorem Ipsum testimonials with merchant-curated ones.
- Add contact-form and newsletter-subscription endpoints with spam protection; both forms currently discard their input.
- Add `sort`, price range, minimum rating, in-stock, and on-sale parameters to `GET /products`. **BREAKING** (internal): sorting stops being client-side. Today "price, low to high" reorders only the twelve items on the current page, which misrepresents the result to the shopper. `/deals` likewise fetches everything and filters in the browser.

### Phase 5 — Gift cards

- Add gift cards: purchasable denominations, issuance with a delivery date and recipient message, balance lookup by code, and redemption against a cart.
- Replace the `/gift-cards` stub, which is eleven lines of placeholder text linked from the header.

### Explicitly out of scope

Payment capture; product comparison (the compare button stays inert); a full CMS page builder; internationalization and multi-currency, beyond displaying the merchant's configured currency; returns and cancellations; and the two cosmetic fabrications on the product page — the random "8–27 people are viewing this" counter and the deal countdown that resets to seven days on every page load. Both need real analytics and real campaign end dates; this change flags them for the merchant to decide on rather than dressing them up.

## Capabilities

### New Capabilities
- `storefront/store-settings`: How merchant-owned presentation values — contact details, announcement, currency, policy thresholds, footer navigation — reach the storefront from one authoritative source instead of being duplicated in code.
- `storefront/homepage-merchandising`: How the homepage's promotional surfaces — hero, banners, brand bar, category grid and tabs — are populated from the live catalog and from scheduled merchant-managed banners.
- `storefront/blog`: How a merchant publishes posts and how shoppers list and read them, including draft visibility.
- `storefront/wishlist`: How a shopper saves products for later, as a guest or signed in, and what happens to a guest's saved items when they sign in.
- `storefront/order-history`: How a customer sees their past orders, and how anyone — signed in or not — tracks an order's progress.
- `storefront/product-reviews`: How shoppers rate and review products, who is allowed to, how ratings aggregate onto the catalog, and how a merchant moderates.
- `storefront/customer-messaging`: How contact-form submissions and newsletter subscriptions are captured and acknowledged.
- `storefront/gift-cards`: How gift cards are purchased, delivered, checked, and redeemed.

### Modified Capabilities
- `storefront/product-catalog`: Result ordering and filtering become server-authoritative across the whole result set rather than client-side within the current page; product payloads gain an aggregate rating and review count.
- `storefront/category-navigation`: Categories gain a product count for display, and category links are required to resolve by slug — closing the defect where the homepage grid links by display title and silently returns an unfiltered listing.

## Impact

- **Backend** (`electrode-server`, Express + Prisma): new models for settings, banners, blog posts, wishlist items, reviews, testimonials, contact messages, newsletter subscribers, and gift cards. New public routes for each, plus merchant CRUD. Modifies the product query handler for sorting and filtering, the product serializer for rating aggregates, the category serializer for product counts, and adds order listing and tracking. This repo is the storefront only; backend work happens in its own repository and is sequenced first in each phase.
- **Storefront**: `src/data/content.ts` shrinks to near-empty as each dataset moves to an API. New services alongside the existing ones in `src/services/`. New RTK Query slices for wishlist and reviews, following the established proxy pattern for anything cookie-authenticated. New routes: `/blogs/[slug]`, `/account/orders`. Rewritten: `/wishlist`, `/track-order`, `/gift-cards`, `/contact`, and the homepage sections.
- **Auth**: wishlist and reviews are cookie-authenticated and therefore go through `/api/*` proxy handlers, matching cart and addresses. Settings, banners, blog, and guest order tracking are public and read server-side via `apiFetch`.
- **Caching**: settings, banners, categories, and brands are merchant-scale data that changes rarely and is read on every page. They take a revalidation window rather than `no-store`, consistent with the existing 300-second category and brand caching. A merchant edit is therefore visible within that window, not instantly — an accepted tradeoff recorded in the design.
- **Dead code removed**: `collectionTiles` and `PinterestIcon` are exported and never imported.
- **Dependencies**: none expected to be added on the storefront side.

### Sequencing note

The phases are ordered by merchant value per unit of work, not by technical dependency. Phase 1 needs no new storefront patterns and is mostly deletion. Phases 2–5 are mutually independent and may be reordered or dropped without stranding earlier work; only the catalog changes in Phase 4 touch a capability that earlier phases rely on, and they extend it rather than replace it.
