import type { ProductGridColumns } from "@/types/store-settings";

/**
 * Everything that changes with the merchant's large-screen product grid column
 * count (`catalogConfig.productGridColumns`), in one place.
 *
 * The count drives five things that must agree: the grid's `lg:` columns, the
 * slider's `slidesPerView` at `lg`, the loading skeletons, how many products a
 * row asks for, and the image `sizes` a card declares. Each reads its figure
 * from here, so a grid and its skeleton — or a grid and the slider beside it —
 * cannot disagree about how wide a card is.
 *
 * Applies to the FULL-WIDTH product grids only: the homepage's product rows and
 * a product page's related products. `/products`, `/deals`, wishlist, compare and
 * Deal of the Week keep their own grids.
 *
 * See server/openspec/changes/add-product-grid-columns-setting, design.md.
 */

/** Every count a merchant may choose. Mirrors the backend's `PRODUCT_GRID_COLUMNS`, in its order. */
export const PRODUCT_GRID_COLUMNS = [4, 5, 6] as const satisfies readonly ProductGridColumns[];

/** What the storefront renders when it has no valid count: the grid every shop had before. */
export const DEFAULT_GRID_COLUMNS: ProductGridColumns = 6;

/**
 * A stored value as a count this module can render.
 *
 * Anything not exactly 4, 5 or 6 — absent, `"5"`, 7, a hand-edited row — is 6.
 * The backend refuses such values on write; this is the read side's guarantee
 * that no component is handed a count with no class behind it.
 */
export function resolveGridColumns(value: unknown): ProductGridColumns {
  return (PRODUCT_GRID_COLUMNS as readonly unknown[]).includes(value)
    ? (value as ProductGridColumns)
    : DEFAULT_GRID_COLUMNS;
}

/**
 * The grid's full class list, per count.
 *
 * ── Written out in full, NEVER interpolated ──────────────────────────────
 *
 * `lg:grid-cols-${n}` does not work: Tailwind emits only the complete class
 * strings it finds in source, so an assembled one would silently leave the grid
 * with no `lg:` columns. See `components/home/promo/layouts.ts` for the same
 * rule. Only the last class differs between the three.
 *
 * The rest is the grid these sections have always used — two across with a
 * 12px gap on a phone, three across with 20px from `sm`. The gap is the same at
 * every count, so fewer columns means wider cards rather than wider gaps.
 */
export const PRODUCT_GRID_CLASS: Record<ProductGridColumns, string> = {
  4: "grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-5 sm:gap-y-8 sm:grid-cols-3 lg:grid-cols-4",
  5: "grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-5 sm:gap-y-8 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-5 sm:gap-y-8 sm:grid-cols-3 lg:grid-cols-6",
};

/**
 * One card's width in the SLIDER skeleton, per count — literal for the same
 * reason as the grid above.
 *
 * Each `calc` is `(100% - (n - 1) x gap) / n`: the slider's `slidesPerView` with
 * its 20px (1.25rem) gap from `sm` up and 12px below it, so the placeholder is
 * exactly the card it is replaced by. 3.75rem is three gaps, 5rem four, 6.25rem five.
 */
export const PRODUCT_SLIDER_SKELETON_CARD_CLASS: Record<ProductGridColumns, string> = {
  4: "w-[calc((100%-0.75rem)/2)] shrink-0 sm:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]",
  5: "w-[calc((100%-0.75rem)/2)] shrink-0 sm:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-5rem)/5)]",
  6: "w-[calc((100%-0.75rem)/2)] shrink-0 sm:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-6.25rem)/6)]",
};

/**
 * The `sizes` a card's image declares inside one of these grids.
 *
 * From `lg` up a card is at most the viewport divided by the column count —
 * less once the content width is capped — so `100/n vw` is an upper bound that
 * never asks for an image narrower than the card is drawn. Below `lg` it is the
 * card's own default (three and two across).
 */
export function productCardSizes(columns: ProductGridColumns): string {
  return `(min-width: 1024px) ${Math.ceil(100 / columns)}vw, (min-width: 640px) 33vw, 50vw`;
}

/** Most products a homepage row has ever shown. A row never asks for more than this. */
const HOME_ROW_MAX = 12;

/**
 * How many products a homepage product row asks for: the most whole rows at
 * this count that fit in twelve — 12, 10, 12 for 6, 5, 4 — so the grid's last
 * line on a large screen is never a lone card because of the count chosen.
 */
export function homeRowSize(columns: ProductGridColumns): number {
  return Math.floor(HOME_ROW_MAX / columns) * columns;
}

/**
 * How many related products a product page shows: one full row.
 *
 * The page still FETCHES six — its request runs in parallel with the settings
 * read and must not wait on it — and renders the first this-many of them.
 */
export function relatedCount(columns: ProductGridColumns): number {
  return columns;
}
