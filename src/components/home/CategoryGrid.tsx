import Image from "next/image";
import Link from "next/link";
import { categoryGrid } from "@/data/content";

export default function CategoryGrid() {
  return (
    <section className="container-px mx-auto max-w-346 py-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {categoryGrid.map((cat) => (
          <Link
            key={cat.title}
            href={`/products?category=${encodeURIComponent(cat.title)}`}
            className="flex flex-col items-center gap-3 rounded-xl bg-gray-50 p-5 text-center hover:bg-gray-100"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-white">
              <Image src={cat.image} alt={cat.title} fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{cat.title}</p>
              <p className="text-xs text-gray-500">({cat.count} Items)</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
