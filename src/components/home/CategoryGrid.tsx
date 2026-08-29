import Image from "next/image";
import Link from "next/link";
import { categoryGrid } from "@/data/content";

export default function CategoryGrid({ title }: { title: string }) {
  return (
    <section className="container-px mx-auto max-w-346 pb-8 ">
        <h2 className="text-xl mb-8  font-bold text-gray-900 sm:text-2xl">{title} </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {categoryGrid.map((cat) => (
          <Link
            key={cat.title}
            href={`/products?category=${encodeURIComponent(cat.title)}`}
            className="flex flex-col items-center gap-3 rounded-xl bg-gray-50 p-5 text-center hover:bg-gray-100"
          >
            <div className="relative h-28 w-28 overflow-hidden  ">
              <Image src={cat.image} alt={cat.title} width={500} height={400}  className="object-contain w-full h-full" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{cat.title}</p>
              {/* <p className="text-xs text-gray-500">({cat.count} Items)</p> */}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
