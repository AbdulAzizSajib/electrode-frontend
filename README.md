# Electrode — Next.js Storefront

A Next.js (App Router + TypeScript + Tailwind CSS v4) rebuild of the
[Electrode Shopify demo store](https://electrode-demo.myshopify.com/) UI.
This is the **frontend only** — every page, component and interaction is
built, but product data, cart persistence, auth, and checkout all use mock
data / local state so the project is ready to wire up to a real backend.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint
```

## What's included

- **Home** (`/`) — hero, promo banners, category carousels, deal-of-the-week
  countdown, testimonials, blog teaser.
- **Product listing** (`/products`) — filters (category, brand, availability),
  sorting, search (`?q=`) and category deep-links (`?category=`).
- **Product detail** (`/products/[handle]`) — image gallery, variant options
  (color/RAM/etc.), quantity, add-to-cart / buy-now, related products.
- **Cart** — drawer (opens from the header) + full `/cart` page, backed by a
  React context (`CartProvider`) persisted to `localStorage`.
- **Checkout** (`/checkout`) — shipping form + order summary UI. Payment
  fields are present but disabled/non-functional by design (see below).
- Header mega menu ("Shop By Categories") and nav dropdowns ("Shop",
  "Headphones"), responsive mobile nav.
- Misc pages: `/contact`, `/blogs`, `/wishlist`, `/account/login`,
  `/track-order`, `/gift-cards`, `/deals`.

## Project structure

```
src/
  app/                 Routes (App Router). Each folder = a URL segment.
  components/          Shared UI (Header, Footer, ProductCard, CartDrawer…)
  components/home/     Homepage-only sections
  data/
    products.ts        Mock product catalog — THE MAIN FILE TO REPLACE
    content.ts          Static marketing copy (hero banners, blog teasers…)
  lib/
    cart-context.tsx   Cart state (React Context + localStorage)
    placeholder.ts      Helper for the local placeholder-image route
    format.ts           Price/discount formatting helpers
  types/product.ts     Shared Product/Cart types
```

## Connecting a real backend

Everything reads product data through the `Product` type in
`src/types/product.ts` and the helpers in `src/data/products.ts`
(`products`, `getProductByHandle`, `getRelatedProducts`, `getFeaturedProducts`).
To go live:

1. **Swap the data source.** Replace the contents of `src/data/products.ts`
   with fetch calls to your API/CMS (or use Next.js `fetch`/server
   components directly inside the page files). Keep the same exported
   shape and the rest of the app keeps working unchanged.
2. **Cart.** `src/lib/cart-context.tsx` currently stores line items in
   `localStorage`. Point `addItem`/`updateQuantity`/`removeItem` at your
   cart API (e.g. Shopify Storefront API, a custom REST/GraphQL backend) if
   you need server-side carts, multi-device sync, or stock validation.
3. **Checkout.** `src/app/checkout/page.tsx`'s `handlePlaceOrder` is a
   stub — it currently just clears the cart and redirects. Replace it with
   a real order-creation call to your backend, then integrate a payment
   provider (Stripe, Shopify Checkout, etc.) for the payment section.
4. **Auth.** `/account/login` is a static form. Wire it to your auth
   provider (NextAuth.js, Clerk, Supabase Auth, your own API, etc.).
5. **Images.** Product photos currently come from `/api/placeholder`
   (`src/app/api/placeholder/route.ts`), a dependency-free SVG generator so
   the project never relies on an external image CDN. Once you have real
   product photos, just point `product.image` / `product.images` at their
   URLs — if they're on an external domain, add it to
   `images.remotePatterns` in `next.config.ts` and remove
   `images.unoptimized` if you want Next's built-in image optimization.

## Notes

- This is a **UI-only clone**: no real payments, auth, or orders happen
  anywhere in the project. Every place that fakes a backend action is
  commented in the source (search for "backend" or "UI-only").
- Styling uses Tailwind CSS v4 with brand colors defined in
  `src/app/globals.css` (`--color-brand`, `--color-accent`, `--color-sale`).
- Icons are from [lucide-react](https://lucide.dev); a few brand/social
  icons (Facebook, Instagram, YouTube, X) are hand-drawn inline SVGs in
  `src/components/SocialIcons.tsx` since lucide no longer ships logo icons.
