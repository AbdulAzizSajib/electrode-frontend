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
   * `min-h-40` holds the section's full height — 32px padding above and below,
   * around a row of 48px logos with 24px of its own on each side — before the
   * marquee has mounted. The marquee only renders in the browser,
   * so without it the section collapses in the server HTML and then pushes
   * the rest of the page down once the logos appear.
   */
  return (
    <section className=" container-px site-container min-h-40 py-8">
      <Marquee>
        <div className="flex flex-wrap items-center justify-between gap-6 border-gray-100 py-6">
          {brands.map((brand) => (
            <div key={brand.id} className="flex h-12 w-32  items-center justify-center">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={128}
                height={48}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
}
