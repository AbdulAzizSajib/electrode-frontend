import Link from "next/link";
import CountdownTimer from "@/components/ui/CountdownTimer";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

export default function DealOfWeek({ products }: { products: Product[] }) {
  return (
    <section className="container-px sm:container-px mx-auto max-w-346 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
        <div className="flex flex-col justify-center rounded-xl bg-[#eef1fb] p-6 lg:col-span-1">
          <p className="mb-1 inline-block w-fit rounded bg-brand px-3 py-1 text-xs font-bold text-white">
            DEAL OF
          </p>
          <p className="mb-3 inline-block w-fit rounded bg-sale px-3 py-1 text-xs font-bold text-white">
            THE WEEK!
          </p>
          <p className="mb-4 text-sm text-gray-600">
            Now is the time to take advantage of a limited number of discounts.
          </p>
          <CountdownTimer />
          <p className="mb-4 mt-2 text-xs text-gray-500">Remains until the end of the offer</p>
          <Link
            href="/products"
            className="rounded bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Shop Now
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-5 lg:col-span-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
