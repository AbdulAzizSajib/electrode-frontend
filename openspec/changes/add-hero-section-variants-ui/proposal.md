## Why

`src/components/home/Hero.tsx` renders one arrangement and only one: a slider on the left at 57% of the row, two square tiles at the top right, a 43:20 promo tile beneath them, right column pinned at 43%. `HomeSkeletons.tsx` hardcodes the same shape a second time so the placeholder matches. A merchant can change the artwork in those three slots; the arrangement is a decision this repository made once for every store it will ever serve.

The server change `add-hero-section-variants` (in `server/`) has just made that arrangement a setting: a store's `homeConfig` `HERO` entry now carries a resolved `variant`, one of four. This change is the storefront half — the half that turns that string into a different hero.

Without it the setting is inert: a merchant picks a layout, the save succeeds, and the page renders exactly what it rendered before.

## What Changes

- `Hero.tsx` stops being a layout and becomes a **dispatcher**: it fetches the hero banners once, then hands them to the component for the store's chosen variant. The fetch, the empty-state rule and the slot semantics stay in one place; only the arrangement moves out.
- Four layout components under `src/components/home/hero/`:
  - `HeroSplitThree` — slider left, two square tiles and one wide tile right. **Byte-for-byte the hero that ships today**, moved rather than rewritten, so the default store renders the same DOM and the same classes as before.
  - `HeroSplitOne` — slider left, one large square tile right.
  - `HeroFullSlider` — one wide slider across the content width, no tiles.
  - `HeroSliderStack` — a full-width slider with a row of three tiles beneath it.
- A registry maps variant → `{ component, skeleton, sizes }`. **The skeleton is part of the registry, not an afterthought**: `HeroSkeleton` currently hardcodes the default layout's boxes, and a `SLIDER_STACK` store showing a `SPLIT_THREE` skeleton would visibly reflow the moment the banners arrive — the exact layout shift the ratio-based sizing was introduced to eliminate.
- `app/(shop)/page.tsx` — the `rendered` map is keyed by section key alone and is built before the enabled list is walked, so it cannot express "this section, with this variant". The `HERO` entry is built from the `HERO` config entry instead, which also means its `<Suspense fallback>` gets the matching skeleton.
- **Per-variant `sizes` on every `next/image`.** The current values (`57vw` for the slider, `22vw` for a side tile, `43vw` for the promo) are arithmetic from the 43%/57% split and are simply wrong for the other three layouts — a full-width slider told it will paint at `57vw` downloads a file half the width it needs and renders soft. Each variant declares its own.
- `HomeSectionConfig` in `src/types/store-settings.ts` gains optional `variant`, and a `HeroVariant` union mirrors the server's registry — the hand-maintained mirror the `HOME_SECTION_KEYS` comment already warns about, now with one more thing in it.
- `FALLBACK_SETTINGS.homeConfig` in `src/services/store-settings.ts` carries `variant: "SPLIT_THREE"` on its `HERO` entry. This is the **one place the storefront defaults the value itself**, and legitimately: it stands in when the settings API could not be reached at all, so there is no server answer to resolve.
- An unrecognised variant renders the **default layout**, not nothing. A storefront deployed behind a server that has learned a fifth layout degrades to the hero it has always had rather than to a blank band above the fold.
- **`mobileImage` is used where a layout needs it.** Banners already carry one and today's hero ignores it. The layouts whose desktop artwork is wide — `FULL_SLIDER` and `SLIDER_STACK` — cannot stack a 3:1 image into a phone-width slot without it becoming a strip, so they render `mobileImage` when present and fall back to `image`.
- Every existing invariant is kept, per variant rather than globally: shapes are ratios and never pixels, an empty slot collapses instead of rendering an empty box, `priority` is set on the first slide only, and the whole hero returns `null` when the chosen layout has nothing to show.
- **BREAKING for a merchant in one way, and only on a non-default layout:** which uploaded banners appear depends on the layout now. A store on `FULL_SLIDER` keeps its side tiles on file but does not render them. Nothing is deleted; the admin change is responsible for saying so on the upload screen.

Stated because its absence is deliberate: **no text overlay, no per-layout copy.** `Banner` carries `title`, `subtitle`, `buttonText`, `bgColor` and `textColor`, and none of the four layouts render them. They are artwork arrangements. A layout that painted a heading over a merchant's image would need contrast, position and length controls the settings do not have, and an unreadable headline over a busy photo is worse than no headline.

Also deliberate: **`HeroSlider` is not touched.** It already fills whatever box it is given at any ratio, which is precisely what four layouts need.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `storefront/homepage-merchandising`: extends the hero requirement so the arrangement of the hero's artwork is governed by the merchant's stored layout choice rather than fixed, with defined behaviour for a layout the storefront does not recognise, and a guarantee that artwork belonging to an unrendered slot is hidden rather than lost.

## Impact

- `src/components/home/Hero.tsx` — becomes the fetch-and-dispatch shell; the current JSX moves out to `hero/HeroSplitThree.tsx` unchanged.
- `src/components/home/hero/` — new directory: four layout components, the registry, and the shared slot primitives (`HeroTile`, the `Link` + `Image` + hover-and-focus treatment the tiles all repeat today).
- `src/components/home/HomeSkeletons.tsx` — `HeroSkeleton` becomes four skeletons, one per layout, each mirroring its own boxes.
- `src/app/(shop)/page.tsx` — the `HERO` entry of the `rendered` map, and its Suspense fallback, are derived from the config entry.
- `src/types/store-settings.ts` — `HeroVariant`; `HomeSectionConfig` gains optional `variant`.
- `src/services/store-settings.ts` — `FALLBACK_SETTINGS.homeConfig`'s `HERO` entry.
- `src/components/home/HeroSlider.tsx` — unchanged.
- Tests: `src/lib` is the only place this repo's Vitest suite runs (`node` environment, no DOM), so the registry's resolution rule moves into `src/lib/hero-variants.ts` and is tested there. The layout components themselves have no test runner and are verified by eye.
- **Depends on** `server/openspec/changes/add-hero-section-variants` being deployed first. **Blocks** `admin/openspec/changes/add-hero-section-variants-admin`, which must not ship before a merchant's choice can be rendered.
