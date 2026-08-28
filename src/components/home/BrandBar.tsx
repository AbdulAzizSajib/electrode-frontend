import Marquee from "react-fast-marquee";
import Image from "next/image";

const brands = ["/brands/b1.webp", "/brands/b2.webp", "/brands/b3.webp", "/brands/b4.webp", "/brands/b5.webp", "/brands/b6.webp", "/brands/b7.webp", "/brands/b8.webp", "/brands/b9.webp", "/brands/b10.webp", "/brands/b11.webp", "/brands/b12.webp",  "/brands/b14.webp", "/brands/b15.webp", "/brands/b16.webp", "/brands/b17.webp", "/brands/b18.webp", "/brands/b19.webp", "/brands/b20.webp", "/brands/b21.webp", "/brands/b22.webp"];

export default function BrandBar() {
  return (
    <section className="mx-auto max-w-346 pb-2">
      <Marquee>
        <div className="flex flex-wrap items-center justify-between gap-6 border-gray-100 py-6">
          {brands.map((brand) => (
            <div key={brand} className="flex h-12 w-32  items-center justify-center">
              <Image src={brand} alt="Brand Logo" width={128} height={48} className="h-full w-full object-contain" />
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
}