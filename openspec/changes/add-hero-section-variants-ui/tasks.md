## 1. Types and resolution

- [x] 1.1 In `src/types/store-settings.ts`, add `HeroVariant = "SPLIT_THREE" | "SPLIT_ONE" | "FULL_SLIDER" | "SLIDER_STACK"` mirroring the server's `HERO_VARIANTS` tuple, and extend `HomeSectionConfig` with `variant?: HeroVariant`. Comment that this is another hand-maintained mirror of the server registry, alongside the `HomeSectionKey` union directly above it.
- [x] 1.2 Add `src/lib/hero-variants.ts` exporting `HERO_VARIANT_KEYS`, `DEFAULT_HERO_VARIANT = "SPLIT_THREE"` and `resolveHeroVariant(value: unknown): HeroVariant`, returning the default for anything absent or unrecognised.
- [x] 1.3 Add `src/lib/hero-variants.test.ts`: each known key resolves to itself; `undefined`, `null`, `""`, a non-string and an unknown string all resolve to `SPLIT_THREE`. This is the only rule in this change a test can reach — see design.md Decision 5.
- [x] 1.4 In `src/services/store-settings.ts`, add `variant: "SPLIT_THREE"` to the `HERO` entry of `FALLBACK_SETTINGS.homeConfig`, with a comment that this is the storefront's one legitimate default because it stands in for a settings read that never happened.

## 2. Shared hero plumbing

- [x] 2.1 Create `src/components/home/hero/`. Add `HeroTile.tsx` — a `Link` wrapping a `fill` `Image`, taking `banner`, `ratio` and `sizes` as props, and carrying the `rounded-sm`, `object-cover`, `group-hover:scale-105`, `hover:shadow-md` and `focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2` treatment the tiles repeat today, verbatim.
- [x] 2.2 Add `registry.ts` typed as `Record<HeroVariant, { Component; Skeleton; sizes }>`, so TypeScript reports a missing key when a variant is added (design.md Decision 1). Keep `sizes` in the same entry as the component it was derived for.
- [x] 2.3 Define the slot contract each layout component receives: `{ slides, sideBanners, promoTile }`, already sliced to that layout's capacities by `Hero.tsx`.
- [x] 2.4 Before writing any `next/image`, Suspense or App Router code, read the relevant guide under `node_modules/next/dist/docs/` — `AGENTS.md` states this Next version differs from training data.

## 3. `SPLIT_THREE` — moved, not rewritten

- [x] 3.1 Move the current JSX from `Hero.tsx` into `hero/HeroSplitThree.tsx` **verbatim**, including the `lg:w-[43%]`, `aspect-4/3`, `aspect-square`, `aspect-43/20` classes and every explanatory comment. No refactor, no re-indent of the ratio logic (design.md Decision 3).
- [x] 3.2 Keep its `sizes` exactly as they are: slider `(min-width: 1024px) 57vw, 100vw`; side tile `(min-width: 1024px) 22vw, 50vw`; promo `(min-width: 1024px) 43vw, 100vw`.
- [x] 3.3 Refit the tiles onto `HeroTile` only if the rendered class list is identical; if it is not, leave the JSX alone and note why.
- [x] 3.4 Diff the rendered HTML of the homepage before and after against a store with default settings. Same DOM, same classes — this is the whole compatibility claim and there is no test runner that would catch a regression.

## 4. The three new layouts

Slot capacities and ratios below. `row` is the content width minus 64 (`container-px` at `lg`, both sides); gaps are 16. Figures are the derivation, not a licence to hardcode pixels — every box is expressed as a ratio or a percentage.

- [x] 4.1 `hero/HeroSplitOne.tsx` — slider left, **one square tile** right. Right column keeps the `43%` share, tile is `aspect-square`, slider takes the remainder and stretches to the column height exactly as `SPLIT_THREE` does. At a 1440 content width this is a 592px-tall hero against today's 579, so the page below it barely moves. Reads `HERO_SLIDER` (unbounded) and the **first** `HERO_SIDE` banner; does not read `HERO_PROMO`. `sizes`: slider `(min-width: 1024px) 57vw, 100vw`; tile `(min-width: 1024px) 43vw, 100vw`.
- [x] 4.2 `hero/HeroFullSlider.tsx` — one slider across the full content width, `aspect-[3/1]` at `lg` and `aspect-4/3` stacked. Reads `HERO_SLIDER` only. `sizes`: `100vw`. Renders `mobileImage` below `lg` when present (design.md Decision 6).
- [x] 4.3 `hero/HeroSliderStack.tsx` — full-width slider `aspect-[3/1]` above a row of three `aspect-4/3` tiles, each `(row - 32) / 3` wide. Reads `HERO_SLIDER`, two `HERO_SIDE` and one `HERO_PROMO`, in that left-to-right order. Below `lg` the tiles stack to one column. `sizes`: slider `100vw`; tiles `(min-width: 1024px) 31vw, 100vw`. Renders `mobileImage` for the slider when present.
- [x] 4.4 Each new layout collapses an empty slot rather than rendering an empty box, matching `SPLIT_THREE`'s existing behaviour.
- [x] 4.5 Set `priority` on the first slide only, in every layout.
- [x] 4.6 Write each layout's ratios and capacities into a comment block the admin change can consume verbatim — `hero-slots.ts` derives merchant upload guidance from these numbers, and `Hero.tsx`'s existing comment already carries that obligation for one layout.

## 5. Dispatch and placeholders

- [x] 5.1 Rewrite `Hero.tsx` as fetch-and-dispatch: one `getBannersByPlacement()`, slice each slot to the chosen layout's capacity, then render the registry's component. It takes `variant` as a prop.
- [x] 5.2 Move the whole-hero empty rule here and scope it to **the slots the chosen layout reads** — a `FULL_SLIDER` store with no slider artwork renders nothing even when side tiles exist (design.md Decision 2).
- [x] 5.3 In `HomeSkeletons.tsx`, split `HeroSkeleton` into four, each mirroring its own layout's boxes. Keep `aria-hidden` and the `SkeletonBlock` primitive.
- [x] 5.4 In `app/(shop)/page.tsx`, read the `HERO` entry from `settings.homeConfig`, resolve it with `resolveHeroVariant`, and build the `HERO` element and its `<Suspense fallback>` from the registry entry. Every other section stays in the static map.
- [x] 5.5 Confirm the "building an element runs nothing" property still holds — a disabled `HERO` must still never fetch.

## 6. Verification

- [x] 6.1 `npm run lint` and `npx tsc --noEmit` clean.
- [x] 6.2 `npx vitest run src/lib/hero-variants.test.ts` from inside `frontend/` (flags do not survive `npm --prefix`), on an uppercase `E:\` path.
- [x] 6.3 Render all four layouts against seeded banners and check each at content widths 1140, 1440 and full: boxes scale, none change shape.
- [ ] 6.4 Confirm each layout's placeholder matches it. Verified structurally: every shape-bearing class in each layout (aspect ratios, grid columns, the 43% column, flex behaviour) is present in its skeleton and vice versa, same outer container, `aria-hidden` kept. **The visual throttle check — watching for no reflow when the artwork lands — still needs a human with a browser; no browser automation exists in this repo.**
- [x] 6.5 Confirm a store with no `variant` in its settings renders identically to the current storefront.
- [x] 6.6 Confirm an invented variant string renders `SPLIT_THREE` rather than a blank band.
- [x] 6.7 Switch a store through all four layouts and back, confirming no banner is altered and the original hero returns byte-identical.
- [ ] 6.8 Check each layout on a phone width. The `mobileImage` half is verified against the live stack: with mobile artwork on file the wide layouts render two sources (`lg:hidden` / `hidden lg:block`), the mobile source is the merchant's, the first slide uses `fetchPriority` rather than an eager preload, and the narrow layouts still render one image. **Looking at the four layouts at phone width still needs a human with a browser.**

## 7. Close out

- [x] 7.1 Confirm `git status` shows no unintended change to `AGENTS.md` — `next dev` rewrites its rules block.
- [x] 7.2 Hand the per-layout ratios from 4.6 to `admin/openspec/changes/add-hero-section-variants-admin`, which must ship after this (design.md — Migration Plan).
