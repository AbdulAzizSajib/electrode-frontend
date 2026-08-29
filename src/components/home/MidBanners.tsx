import Image from "next/image";
import Link from "next/link";
import { midBanners } from "@/data/content";

export default function MidBanners() {
  return (
    <section className="container-px  mx-auto max-w-346 py-8  ">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {midBanners.map((b) => (
          <Link
            key={b.id}
            href={b.href}
            className="relative flex h-56 items-center overflow-hidden rounded-xl bg-gray-100"
          >
            <div className="relative z-10 max-w-[65%] p-6">
              <p className="text-xs text-gray-500">{b.eyebrow}</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{b.title}</p>
              <p className="mt-2 text-sm text-gray-600">
                Starting <span className="font-semibold text-sale">{b.price}</span>
              </p>
              <span className="mt-3 inline-block text-xs font-semibold text-brand underline">Shop Now</span>
            </div>
            <div className="absolute right-0 top-0 h-full w-32 sm:w-36">
              <Image src={b.image} alt={b.title} fill className="object-cover" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
