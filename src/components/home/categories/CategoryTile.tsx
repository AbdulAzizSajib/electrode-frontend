import Image from "next/image";
import Link from "next/link";
import type { CategoryGridItem } from "@/types/category";

/**
 * One category tile — the image over the name, linking to that category's
 * product list.
 *
 * Shared by both featured-categories layouts, which is the whole point of it:
 * the grid and the slider are the SAME tiles in different arrangements, so a
 * tile must not know which one it is in. Nothing here is a position; the
 * layout decides how many sit across and whether they wrap or scroll.
 *
 * ── Every tile is the same height, by construction ───────────────────────
 *
 * Two things inside a tile vary with its data: how tall the picture renders,
 * and whether the name wraps to a second line. Left free, three tiles on a
 * phone ended at three different heights — and stretching the BOXES to match
 * (which a grid row does for free, and the slider does with `!flex`) still
 * left the contents landing at three different places, with a faint grey
 * background that did not show where any box ended. So both are pinned:
 *
 *  - the image sits in a box of FIXED HEIGHT (`h-24`, `lg:h-28`) and is
 *    `object-contain`, so a tall picture and a wide one occupy the same band;
 *  - the name gets a block the height of TWO LINES (`min-h-10` at `text-sm`),
 *    clamped to two, with a one-line name centred in it.
 *
 * Padding + image + gap + name is then the same sum for every tile, whatever
 * the category, on every screen. Pinning the image's WIDTH too was rejected:
 * at three across on a 390px phone a tile's inner width is about 68px, and a
 * fixed 96px box would overflow it.
 *
 * This tile was carried over verbatim from the grid when the layouts were
 * split, and `GRID` was checked byte-identical at that point. It was then
 * changed ONCE, deliberately, on request, for both layouts together — so the
 * grid's phone rendering differs from before by exactly this. See
 * server/openspec/changes/add-featured-categories-layout, tasks 3.1 and 6.3.
 *
 * ── Background: the merchant's card colour, else today's grey ────────────
 *
 * `var(--color-card, var(--color-gray-50))`: the theme's optional card colour
 * when the merchant set one, and the tile's original light grey when not, so an
 * unconfigured shop looks exactly as before. NO hover background: the tile's
 * colour stays put under the cursor (removed on request — a second colour
 * appearing on hover read as a glitch, and a fixed `hover:bg-gray-100` would
 * also flash grey on a cream tile). See
 * server/openspec/changes/add-card-background-theme-color.
 */
export default function CategoryTile({ category }: { category: CategoryGridItem }) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(category.slug)}`}
      className="flex flex-col items-center gap-0 rounded-xl bg-(--color-card,var(--color-gray-50)) p-0 text-center"
    >
      <div className="relative  h-24 w-full overflow-hidden lg:h-38 lg:w-38">
        <Image
          src={category.image!}
          alt={category.name}
          fill
          // A 96px-tall box on a phone (the tile's full width, ~85px at three
          // across), 112px square from lg up, where a 7-across tile has ~166px
          // of room. It once claimed 500x400, which fetched 640px and 1080px
          // images for it.
          sizes="(min-width: 1024px) 112px, 120px"
          className="object-contain"
        />
      </div>
      <div className="flex min-h-10 items-center ">
        <p className="line-clamp-2 text-sm font-semibold text-gray-900">{category.name}</p>
      </div>
    </Link>
  );
}
