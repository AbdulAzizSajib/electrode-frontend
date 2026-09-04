import Image from "next/image";
import Link from "next/link";
import { getCategoryGrid } from "@/services/category";

export default async function CategoryGrid({ title }: { title: string }) {
  const categories = await getCategoryGrid();

  return (
    <section className="container-px site-container pb-8 ">
        <h2 className="text-xl mb-8  font-bold text-gray-900 sm:text-2xl">{title} </h2>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${encodeURIComponent(cat.slug)}`}
            className="flex flex-col items-center gap-3 rounded-xl bg-gray-50 p-5 text-center hover:bg-gray-100"
          >
            <div className="relative lg:h-28 lg:w-28 overflow-hidden  ">
              <Image src={cat.image!} alt={cat.name} width={500} height={400}  className="object-contain w-full h-full" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
