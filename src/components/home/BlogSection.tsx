import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/content";

export default function BlogSection() {
  return (
    <section className="container-px mx-auto max-w-346 py-12 ">
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Our Latest Blog</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {blogPosts.map((post) => (
          <article key={post.title} className="flex flex-col">
            <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand">{post.date}</p>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">{post.title}</h3>
            <p className="mt-2 line-clamp-2 text-xs text-gray-500">{post.excerpt}</p>
            <Link href="/blogs" className="mt-3 text-xs font-semibold text-brand underline">
              Read more
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
