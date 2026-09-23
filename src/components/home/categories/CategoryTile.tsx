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
 *  - the image sits in a box of FIXED HEIGHT (`h-20`, `lg:h-28`) and is
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
 */
export default function CategoryTile({ category }: { category: CategoryGridItem }) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(category.slug)}`}
      className="flex flex-col items-center gap-3 rounded-xl bg-gray-50 p-5 text-center hover:bg-gray-100"
    >
      <div className="relative h-20 w-full overflow-hidden lg:h-28 lg:w-28">
        <Image
          src={category.image!}
          alt={category.name}
          width={500}
          height={400}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex min-h-10 items-center">
        <p className="line-clamp-2 text-sm font-semibold text-gray-900">{category.name}</p>
      </div>
    </Link>
  );
}
