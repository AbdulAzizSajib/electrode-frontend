import { brandLogos } from "@/data/content";

export default function BrandBar() {
  return (
    <section className="mx-auto max-w-346 py-8">
      <div className="flex flex-wrap items-center justify-between gap-6 border-y border-gray-100 py-6">
        {brandLogos.map((brand) => (
          <span key={brand} className="text-lg font-semibold tracking-wide text-gray-300 sm:text-xl">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
