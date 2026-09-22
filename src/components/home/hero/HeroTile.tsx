import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/types/banner";

/**
 * One clickable still tile in the hero — a side tile, a promo tile, or one of
 * the three in the stacked row.
 *
 * Extracted because four layouts times up to three tiles is twelve copies of
 * the same `Link` + `fill` `Image` + hover-and-focus treatment, and the focus
 * ring is exactly the detail that gets dropped from the twelfth copy. Every
 * class here is carried over verbatim from the hero's original side and promo
 * tiles, so `SPLIT_THREE` renders the same markup it always did.
 *
 * NOTHING HERE IS A PIXEL. The caller supplies the aspect ratio as a Tailwind
 * class and the painted share of the viewport as `sizes`, both of which are
 * properties of the LAYOUT rather than of a tile — see `registry.ts`.
 *
 * See openspec/changes/add-hero-section-variants-ui, design.md Decision 7.
 */
export default function HeroTile({
  banner,
  ratio,
  sizes,
  tint,
}: {
  banner: Banner;
  /** e.g. `"aspect-square"`, `"aspect-43/20"`, `"aspect-4/3"`. */
  ratio: string;
  /** What share of the viewport this tile paints at, in THIS layout. */
  sizes: string;
  /**
   * The placeholder colour behind the artwork while it loads, AS A TAILWIND
   * CLASS (`"bg-[#eef1fb]"`), not a colour value — so the class list this
   * renders is identical to the one the original hero emitted, which is what
   * lets `SPLIT_THREE` be a move rather than a rewrite.
   *
   * Per slot rather than shared: the original used `#eef1fb` behind the square
   * tiles and `#eaf3ec` behind the promo, and collapsing them to one would be a
   * visible change to the default layout.
   *
   * Every value passed here must appear as a literal string in a scanned source
   * file for Tailwind to emit it; they all do, in the layout components.
   */
  tint: string;
}) {
  return (
    <Link
      href={banner.href}
      className={`group relative ${ratio} w-full overflow-hidden rounded-sm ${tint} transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2`}
    >
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </Link>
  );
}
