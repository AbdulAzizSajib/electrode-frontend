## Context

See proposal.md for motivation. Four facts about the current code determine the approach:

- **`ProductGallery` owns its selection and exposes no way in or out.** It takes `images: string[]` and `title`, holds `active` in internal state, and has no prop or callback for it. Both directions of the sync the spec requires — page drives gallery, gallery informs page — are currently impossible by construction.
- **`Product.images` is `string[]`.** `pickImages` flattens the API's image objects to bare URLs, discarding `id`, `altText`, `sortOrder` and `isPrimary`. A bare URL cannot say which variant it depicts, so this type is the real blocker; the gallery's props are downstream of it.
- **`ProductVariant.image` already exists on the storefront type and is already populated** — the API has always sent it — but nothing on the product page reads it. The only consumer anywhere is `cartApi`'s `toCartLine`, which prefers it over the product's primary image. So the cart already shows the variant photo while the page does not.
- **The gallery has two call sites.** `ProductDetail` and `ProductQuickView` both render it beside their own variant selector, and both have the defect. `ProductQuickView` derives its effective variant with a staleness guard rather than storing it outright — a better pattern than `ProductDetail`'s plain state, and worth converging on.

The API contract this builds on comes from `electrode-server` / `link-product-images-to-variants`: each image in the public product detail carries `variantId`, naming a variant present in the same response, or `null` meaning shared across all variants.

## Goals / Non-Goals

**Goals:**
- One derivation, used by both call sites, that answers "which images for this selection" and "which variant does this image depict".
- Products with no assignments — every product today — take a path that is behaviourally identical to current code, not merely similar.
- The gallery stays a presentational component: it renders what it is given and reports what was clicked, with no knowledge of variants.

**Non-Goals:**
- Not adding zoom, lightbox, or carousel; the gallery stays a thumbnail strip and a main image.
- Not putting the selected variant or image in the URL. Deep-linking to a variant is a separate change with its own SEO and canonical-URL questions.
- Not changing variant pricing, stock, or add-to-cart behaviour — only which images accompany the choice.

## Decisions

**1. `Product.images` becomes a list of image objects, not `string[]`.** This is the change everything else depends on: a URL string has nowhere to carry a variant reference. The view-model image keeps `url` and gains `variantId`, and `pickImages` stops flattening. The existing sort — `isPrimary` first, then `sortOrder` — is preserved, so default ordering is unchanged.
- *Alternative considered*: keep `string[]` and pass a parallel `Map<url, variantId>` alongside it. Rejected — two structures that must stay index-aligned, and it breaks outright if the same URL appears twice.
- *Alternative considered*: match variants to gallery slots by comparing `ProductVariant.image` to each URL string, needing no API change at all. Rejected — string equality across independently-uploaded Cloudinary URLs is fragile, and it cannot express a variant having more than one image, which is the point of the feature.

**2. `ProductGallery` becomes controlled, selecting by image identity rather than by index.** It takes the images to display, the currently-selected one, and a change callback. Identity rather than index because the displayed list is now filtered: an index means a different photo depending on which variant is selected, so any state held across a variant change silently points at the wrong image. Selecting by identity makes "keep showing this photo" and "this photo is no longer in the list" distinguishable states rather than an index that is quietly still in range.
- The component stays presentational — it receives a list and reports a click, and never learns what a variant is. Both call sites do the variant reasoning.

**3. The visible image list is derived, not stored.** From `(images, selectedVariantId)`: the images whose `variantId` matches the selection, plus those with no `variantId`. Deriving rather than storing means there is no second state to invalidate when the variant changes, and no ordering in which the two can disagree — the spec's "the two controls never disagree" holds by construction rather than by careful effect-writing.

**4. The fallback ladder is explicit and ordered: variant images + shared → shared only → all images.** The spec requires a gallery never be empty because of assignment. Implemented as one function returning the first non-empty rung, so "which images" has exactly one answer for any input, including the two degenerate cases (a variant with nothing of its own, and a product where every image belongs to some other variant). Making it a single named function rather than inline conditionals is what keeps the unassigned-product path provably identical to current behaviour: when no image has a `variantId`, the first rung already yields the full list in its original order.

**5. Thumbnail → variant resolution is a lookup on the clicked image's `variantId`.** A click reports the image; the page selects that image's variant if it names one, and leaves the selection alone if it does not. No index arithmetic, no URL matching. The spec's "selecting a shared photo does not change the selection" falls out of the null case rather than needing a special branch.

**6. Selecting a variant resets the displayed image to the first of the newly-visible list, but selecting an image does not re-derive that list mid-click.** Deriving the visible list from the selection while the selection is also driven by clicking within that list is a loop with an obvious failure mode: click a navy thumbnail, the variant changes, the list re-filters, and the image just clicked is displaced by the "first image of the new variant" rule. Resolved by treating the two as one transition — selecting an image sets both the variant and the displayed image together, so the reset rule applies to variant changes originating from the option control, not to those originating from a thumbnail. This is the one place where a naive implementation looks correct and misbehaves, and it needs a comment saying so.

**7. Both call sites converge on `ProductQuickView`'s derived-with-staleness-guard pattern.** It stores only the shopper's explicit choice and derives the effective variant, guarding against a stored id that is no longer valid. `ProductDetail` stores the effective id directly, which is the shape that goes stale when a product's variants change under it. Since both files are being touched for the gallery anyway, converging is cheaper than maintaining two patterns — and the guard matters more now that the image list depends on the selection being valid.

**8. `ProductVariant.image` stays as the cart's input and is not read by the gallery.** The gallery reads `ProductImage.variantId`, which is the richer source; `cartApi`'s `toCartLine` keeps reading `variant.image`. The API change derives `variant.image` from the variant's first linked image, so the two agree without the storefront reconciling them. No change to `cartApi`.

## Risks / Trade-offs

- **[Risk]** `Product.images` changing from `string[]` to objects touches every consumer, and a missed one is a type error at best and a rendered `[object Object]` at worst → **Mitigation**: the change is type-driven — TypeScript flags every site — and the task list enumerates the known consumers rather than relying on the compiler alone. `ProductCard` and listings take the primary image and are the most likely to be forgotten.
- **[Risk]** The thumbnail-click-changes-price behaviour surprises a shopper who thought they were just looking at photos → **Mitigation**: this is the requested behaviour and matches large storefronts; the option control visibly updates in the same interaction, so the change is not silent. No mitigation beyond that.
- **[Risk]** Assignments existing for some variants but not others produces a gallery that shrinks and grows as the shopper switches options → **Mitigation**: the fallback ladder (Decision 4) means it never empties, but a partially-assigned product will legitimately look uneven. That is an admin data-quality matter, surfaced in the admin change's form copy rather than papered over here.
- **[Risk]** `ProductQuickView` is a second call site that can silently keep the old behaviour if only `ProductDetail` is wired up → **Mitigation**: making the gallery's selection a required controlled prop means the quick view cannot compile without being wired; verification covers it explicitly.

## Migration Plan

1. Add `variantId` to `ApiProductImage`; change the view-model image to an object carrying `url` and `variantId`; stop `pickImages` flattening to strings, preserving its existing sort.
2. Fix the consumers TypeScript flags, then the ones it cannot — anywhere `product.images` is indexed or spread.
3. Write the visible-images derivation and the image→variant lookup as shared pure functions, and unit-test the fallback ladder and the unassigned-product case.
4. Make `ProductGallery` controlled by image identity.
5. Wire `ProductDetail`: derive the visible list, handle thumbnail selection as a combined variant+image transition, converge on the staleness-guarded variant pattern, and fix Buy It Now's display image.
6. Wire `ProductQuickView` the same way.

**Rollback**: entirely client-side and additive on the API side. Reverting restores the flat gallery; assignments remain in the database, unread. No data migration either way.
