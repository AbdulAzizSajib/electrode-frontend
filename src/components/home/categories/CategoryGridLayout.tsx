import CategoryTile from "@/components/home/categories/CategoryTile";
import type { CategoriesLayoutProps } from "@/components/home/categories/types";

/**
 * The category tiles in a wrapping grid — three across on a phone, four at
 * `sm`, seven at `lg`. The arrangement the section has always rendered, and
 * the default.
 *
 * VERBATIM, whitespace included. This is the markup `CategoryGrid` emitted
 * before layouts were selectable, moved rather than rewritten, because `GRID`
 * is required to be byte-identical to it: a shop that never opens the layout
 * control must see no change, and that was checked by diffing served HTML.
 * The TILE inside has since changed once, on request, for both layouts
 * together — a fixed image band and a two-line name block so every tile is
 * the same height on a phone. See `CategoryTile`. The section, heading and
 * grid here are still the original bytes.
 *
 * The three column counts and the gap are the numbers `CategorySlider` has to
 * match, so a tile is the same size in both layouts. Change them together.
 */
export default function CategoryGridLayout({ title, categories }: CategoriesLayoutProps) {
  return (
    <section className="container-px site-container pb-8 ">
        <h2 className="text-xl mb-8  font-bold text-gray-900 sm:text-2xl">{title} </h2>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {categories.map((cat) => (
          <CategoryTile key={cat.slug} category={cat} />
        ))}
      </div>
    </section>
  );
}
