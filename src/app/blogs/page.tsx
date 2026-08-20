import Image from "next/image";
import { blogPosts } from "@/data/content";

export default function BlogsPage() {
  return (
    <div className="container-px mx-auto max-w-346 py-14">
      <h1 className="mb-10 text-3xl font-bold text-gray-900">Our Blog</h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[...blogPosts, ...blogPosts.slice(0, 2)].map((post, i) => (
          <article key={`${post.title}-${i}`} className="flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand">{post.date}</p>
            <h2 className="mt-1 text-base font-semibold text-gray-900">{post.title}</h2>
            <p className="mt-2 text-sm text-gray-500">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
