import Marquee from "react-fast-marquee";
import Image from "next/image";
import { getBrands } from "@/services/brand";

/**
 * The homepage's scrolling row of brand logos, from the merchant's own brands.
 *
 * Only active brands with a logo appear: a brand without one has nothing to put
 * in a row of logos, and a blank tile would read as a broken image. With none to
 * show the section renders nothing at all rather than an empty band.
 *
 * Logos are Cloudinary uploads, so the image loader serves each at the tile's
 * size rather than the original upload.
 */
export default async function BrandBar() {
  const brands = (await getBrands()).filter(
    (brand): brand is typeof brand & { logo: string } => Boolean(brand.logo),
  );

  if (brands.length === 0) return null;

  /*
   * `min-h-30` (120px) holds the section's height before the marquee has
   * mounted — 40px of top padding above a row of 64px tiles. The marquee only
   * renders in the browser, so without it the section collapses in the server
   * HTML and then pushes the rest of the page down once the logos appear.
   * Raise it with the tile if the tile grows.
   */
  return (
    <section className=" container-px site-container min-h-30 py-0">
      <Marquee>
        <div className="flex flex-wrap items-center justify-between gap-6 pt-10">
          {brands.map((brand) => (
            /*
             * A TILE behind each logo, in the merchant's card colour (white
             * until one is chosen, with the product card's light border), so
             * the brand row reads as the same family as the category tiles.
             * The logo is `object-contain` in the padded box, so a wide and a
             * square logo occupy the same tile. See
             * server/openspec/changes/add-card-background-theme-color.
             */
            <div
              key={brand.id}
              className="flex h-16 w-36 items-center justify-center rounded-xl bg-(--color-card,#ffffff) p-3"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={120}
                height={40}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
}
