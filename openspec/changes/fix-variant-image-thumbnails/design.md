## Context

See proposal.md — Why. The design-relevant facts, verified in the code:

- `visibleImages` (`src/lib/variant-gallery.ts:27-49`) returns, for a selected variant, "that variant's images plus the shared ones", with a three-rung fallback ladder guarding against an *empty* result.
- `ProductGallery.tsx:36` hides the entire thumbnail column behind `images.length > 1`.
- `ProductDetail.tsx:61-62` auto-selects a variant on first render (`find(v => v.inStock) ?? variants[0]`), so the page **never** renders the unselected state.

Composed: a product with one image per variant and no shared images opens filtered to one image, and the `> 1` guard then removes the strip. Both rules are individually reasonable; their intersection deletes three quarters of the photography. The fallback ladder does not fire, because one image is not zero images — it was built for the wrong failure.

This change reverses a decision made deliberately in `sync-product-gallery-with-variant`, whose design.md:33-35 documents the filtering as intended behaviour. The reversal is warranted because that design assumed shared images would carry the gallery, and the common authoring shape has none.

## Goals / Non-Goals

**Goals:**
- Every image reachable regardless of selection.
- Keep the variant↔image link doing useful work — leading and ordering rather than filtering.
- Preserve the reciprocal behaviour (thumbnail selects its variant) intact.

**Non-Goals:**
- Changing image authoring, upload, or assignment.
- Zoom, lightbox, carousel (proposal — Not in scope).
- Making the backend surface `variant.image` as gallery images — see Risks.

## Decisions

### Replace filtering with ordering

`visibleImages` is replaced by a function that returns the **full** image set reordered so the selected variant's images lead, followed by shared images, followed by the rest in their existing primary-then-`sortOrder` sequence.

This satisfies both spec requirements with one function: everything stays reachable, and the selected variant's photo is both the lead image and adjacent to the option control.

The three-rung fallback ladder is deleted rather than adapted. Its entire purpose was to rescue filtering from emptiness; an unfiltered list is empty only when the product has no images, which `ProductGallery.tsx:30` already handles by returning `null`.

- **Alternative — keep filtering, drop the `> 1` guard**: rejected. It would show a lone thumbnail beside a single image and still hide the other three photos. It treats the symptom.
- **Alternative — filter only when the product has shared images**: rejected. Behaviour that depends on whether an admin happened to upload a packaging shot is unpredictable for both merchant and shopper.

### The lead image changes on selection; it does not reset

Selecting a variant moves the displayed image to that variant's first image. When the selected variant has no image of its own, the displayed image is **left alone** rather than reset to the list's first — spec requirement, and it avoids yanking the shopper away from a packaging shot they deliberately opened.

This means the displayed image cannot be derived purely from the selected variant; it is state that a variant change *nudges*. The existing controlled `activeUrl` + `onSelect` interface on `ProductGallery` already supports this and needs no change.

### Stable thumbnail keys

`key={img.url}` (`ProductGallery.tsx:40`) collides if one file is assigned to two variants. Filtering made that unreachable; an unfiltered list makes it reachable, and React key collisions produce silent wrong-element reuse. The key becomes url + variant, which is unique per row by construction.

### Rewrite the tests, do not extend them

`variant-gallery.test.ts` asserts the filtering contract directly, including "shows the shared images when nothing is selected yet". Those assertions encode behaviour this change removes; leaving them would either fail or, if adapted piecemeal, preserve the old contract in fragments. The suite is rewritten against ordering, with explicit cases for the shape that caused the bug: N variants, one image each, zero shared.

## Risks / Trade-offs

- **The strip gets longer on products with many variants** → it is a horizontally/vertically scrollable strip of 64px thumbnails; this is the ordinary shape of a product gallery and the alternative is hiding photos.
- **Reverses a shipped, documented decision** → the reversal is recorded here and in the spec delta's REMOVED reasons, so the history is legible rather than looking like drift.
- **If the four photos actually live on `variant.image`, this change surfaces nothing** → this is the real uncertainty. `variant.image` is derived backend-side from the variant's linked images, and the storefront deliberately does not read it (matching images to variants by url string was rejected in the prior design). **Verify against the real product before implementing**: if `product.images` carries four entries with distinct `variantId`s, this change is sufficient; if it carries one, the defect is in authoring or the backend link, and no storefront change fixes it. Task 1 exists for this.
- **`ProductQuickView` must change with `ProductDetail`** → the spec requires them indistinguishable; fixing one is a half-fix that a shopper hits by opening the same product two ways.

## Migration Plan

Frontend-only, no data or API change, no migration. Deploys as one unit — `variant-gallery.ts` and both call sites must move together, since the module's contract changes. Rollback is a revert.

Verification is visual on the product in the report: four thumbnails present, selecting each swaps the main image and updates price and SKU, selecting a variant button moves the main image and reorders the strip.
