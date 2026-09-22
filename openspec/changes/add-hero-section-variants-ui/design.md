## Context

See proposal.md — Why. What shapes the approach is how the hero is built today.

`Hero.tsx` is a Server Component that fetches all hero banners with one cached `getBannersByPlacement()` call, then lays out three slots. Its own comment records the rule everything here has to preserve: **nothing is a pixel.** The right column takes 43% of the row (what 570px came to at the 1384px width the storefront shipped with), each tile carries a fixed aspect ratio, and the slider stretches to whatever height that column computes to. That was introduced because a merchant who changed their content width previously changed the slider's *shape*, letterboxing artwork cut for the old one.

Three other things are welded to that single layout:

- `HomeSkeletons.tsx`'s `HeroSkeleton` restates the same boxes so the placeholder does not reflow.
- Every `sizes` attribute is arithmetic from the 43/57 split — `57vw`, `22vw`, `43vw`.
- `admin`'s `hero-slots.ts` derives merchant upload guidance from the same ratios, and `Hero.tsx` says in so many words: "Change one here and change it there."

`app/(shop)/page.tsx` builds `rendered: Record<HomeSectionKey, ReactNode>` **before** walking the enabled list, then looks sections up by key. Building an element runs nothing, so a disabled section never fetches — that property has to survive.

This repo's Vitest suite is `node`-environment and covers `src/**/*.test.ts` over pure `src/lib` modules only. There is no DOM and no React renderer, so a component cannot be tested here.

Finally: this is Next.js 16 and `AGENTS.md` is explicit that its conventions differ from training data. Anything touching `next/image`, Suspense or the App Router is checked against `node_modules/next/dist/docs/` rather than recalled.

## Goals / Non-Goals

**Goals:**

- Four arrangements that share one fetch, one empty-state rule and one set of slot primitives.
- A default-layout store that renders the same DOM it renders today, so the change is provably invisible until a merchant asks for something else.
- Make the per-layout facts that are easy to forget — placeholder shape, `sizes`, which slots are read — structurally impossible to forget.

**Non-Goals:**

- Text, buttons or colour overlays on hero artwork. See proposal.md.
- Changing `HeroSlider`. It fills whatever box it is given; that is exactly what four layouts need.
- Upload guidance and the "this slot is unused" warning. Admin-facing, and `add-hero-section-variants-admin` owns them.
- Animating or transitioning between layouts. A layout change is a settings save, not an interaction.

## Decisions

### 1. One registry entry per variant, carrying component, skeleton and image sizes together

**Chosen:** `HERO_VARIANTS: Record<HeroVariant, { Component, Skeleton, sizes }>` in `src/components/home/hero/registry.ts`.

The alternative — a `switch` in `Hero.tsx` for the component and a second `switch` in `page.tsx` for the skeleton — is how the placeholder ends up mismatched. They are edited months apart, nothing links them, and the failure is a layout shift on first paint that only shows on a slow connection. One record with three fields makes adding a layout a single exhaustive-checked edit: TypeScript reports a missing key on `Record<HeroVariant, …>`, so a new variant cannot ship with its skeleton forgotten.

`sizes` lives in the same entry for the same reason. The current `57vw` / `22vw` / `43vw` are correct only for `SPLIT_THREE`; a full-width slider told `57vw` fetches an image roughly half the width it paints at and renders soft on exactly the largest element on the page. Keeping the figures beside the layout they were derived from is what makes them reviewable.

### 2. `Hero.tsx` keeps the fetch and the empty-state rule; only arrangement moves out

`Hero.tsx` stays the Server Component that calls `getBannersByPlacement()` and stays the only place that decides the hero renders nothing. Each layout component receives already-fetched banners as props and renders markup.

Four components each doing their own fetch would be four cache reads and four copies of the "slice side tiles to 2, destructure one promo" logic, and the capacity rules would drift apart the first time one was edited. Keeping the fetch in one place also keeps the layout components pure enough to reason about without a DOM.

The empty-state rule moves from "no slides and no side and no promo" to **"nothing in the slots this layout reads"**, which is the subtle part. A store on `FULL_SLIDER` with no slider artwork but two side tiles on file renders nothing, because those tiles are not part of this arrangement. Falling back to a slot the merchant's chosen layout excludes would render a hero they explicitly arranged away.

### 3. `SPLIT_THREE` is moved, not rewritten

Its JSX, classes, ratios and comments come across verbatim into `hero/HeroSplitThree.tsx`. The 43% share, the `aspect-4/3` stacked slider, the `aspect-43/20` promo and the `sizes` values are carried as they are, with their existing explanatory comments.

Every store that exists today renders this. Rewriting it "while we are in here" would put a visual regression in a change whose entire compatibility claim is that the default is untouched — and there is no test runner that could catch it, since components are outside this repo's Vitest scope.

### 4. The variant is read from the config entry, not fetched separately

`page.tsx` already has the section list; the `HERO` entry carries the variant. So the `HERO` element is built from that entry rather than from the static map.

The map stays for every other section — `Record<HomeSectionKey, ReactNode>` is still how order-preserving lookup works — but the `HERO` value is computed from the config entry the page already holds. No second settings read, and the "building an element runs nothing" property is unaffected: it is still a disabled section's component never being rendered that prevents its fetch.

Rejected: passing the whole settings object into `Hero`. The dispatch decision belongs where the Suspense boundary is, because the fallback has to match — see Decision 1.

### 5. Resolution lives in `src/lib/`, so the one rule with a failure mode is testable

`resolveHeroVariant(value): HeroVariant` goes in `src/lib/hero-variants.ts` with `src/lib/hero-variants.test.ts` beside it.

This repo's Vitest suite cannot render a component, so anything that must be proven has to be a pure module. "An unknown variant renders the default" is exactly such a rule: it is the difference between a blank band above the fold and a working hero when the server is ahead of the storefront, and it is unreachable by any normal manual test. The registry itself stays in `components/`, since a `Record` of components is not something a `node`-environment test can meaningfully assert on.

### 6. `mobileImage` is used by the wide layouts only

`FULL_SLIDER` and `SLIDER_STACK` paint their panel at roughly 3:1. Stacked into a phone-width column that is a 120px-tall strip, and `object-cover` on a 3:1 source in a taller box crops to the middle of the artwork — which is where a product usually is not.

`Banner.mobileImage` already exists and today's hero ignores it entirely. These two layouts render it when present via `<picture>`-equivalent sizing and fall back to `image` when not, so a merchant who uploads nothing extra still gets a working hero, and one who does gets a good one. `SPLIT_THREE` and `SPLIT_ONE` keep ignoring it: their slider is 4:3 when stacked, which needs no separate crop.

### 7. Shared tile primitive

`HeroTile` absorbs the `Link` + `fill` `Image` + `group-hover:scale-105` + `focus-visible:ring` treatment the tiles repeat today, taking its aspect ratio and `sizes` as props. Four layouts times up to three tiles is twelve copies of a focus ring otherwise, and a focus ring is precisely the detail that gets dropped from the twelfth copy.

## Risks / Trade-offs

- **Placeholder and layout drift apart**, reflowing the page on first paint for anyone on a slow connection — invisible on a fast local machine. → Decision 1 keeps them in one exhaustive-checked record.
- **`sizes` copied from `SPLIT_THREE` into a new layout**, silently degrading the largest image on the page. Wrong `sizes` produces no error, no warning and no failing test. → Same record; and the per-layout figures are stated in tasks.md with the arithmetic they come from.
- **Ratio drift with the admin.** `hero-slots.ts` derives upload guidance from this file's numbers, and once there are four layouts there are four sets. A merchant told to upload 1720×1290 for a layout that paints 21:9 will export artwork that is cropped to a band. → Out of scope here but the direct consequence of this change; the tasks list requires each layout's ratios to be written down where the admin change can consume them verbatim.
- **A store on a non-default layout looks like it lost artwork.** Uploads are on file and unrendered, which is indistinguishable from deleted until something says otherwise. → Guaranteed here (the spec requires artwork be kept and re-render on return); surfaced in the admin change.
- **Next 16 assumptions.** `sizes`, `fill`, `priority` and Suspense fallbacks all behave in ways this version may have changed. → `AGENTS.md` is explicit: read `node_modules/next/dist/docs/` rather than recall.
- **Trade-off accepted:** four layouts mean four sets of ratios, skeletons and `sizes` — more surface than one hero. That is the cost of not forking the storefront per vertical, and it is bounded by the shared fetch, the shared tile primitive and the single empty-state rule.

## Migration Plan

Ships **after** `server/openspec/changes/add-hero-section-variants` and **before** `admin/openspec/changes/add-hero-section-variants-admin`.

Safe against an older server: one that does not send `variant` leaves the field absent, `resolveHeroVariant` returns `SPLIT_THREE`, and the hero renders exactly as it does today. So this can ship first in practice, though there is no reason to.

Rollback is reverting this change alone. Stored variants stay in the database, the storefront ignores them, and every store returns to the default hero. Nothing to clean up.
