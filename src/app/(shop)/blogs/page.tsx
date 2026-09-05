import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { formatPostDate, getBlogPosts, listingImage } from "@/services/blog";

/**
 * The blog index.
 *
 * Was a fixture list that repeated its own four entries to look fuller. Now it
 * lists what the merchant has actually published, newest first.
 *
 * No `generateStaticParams` and no pre-render: publishing a post should not
 * need a rebuild. The service's five-minute window plus the backend's cache-tag
 * invalidation keep the cost near zero.
 */

export const metadata = {
  title: "Blog",
};

const PER_PAGE = 9;

export default async function BlogsPage({ searchParams }: PageProps<"/blogs">) {
  const params = await searchParams;
  const requested = Number(Array.isArray(params.page) ? params.page[0] : params.page);
  const page = Number.isFinite(requested) && requested > 0 ? Math.trunc(requested) : 1;

  const { posts, totalPages } = await getBlogPosts(page, PER_PAGE);

  return (
    <div className="container-px site-container py-14">
      <h1 className="mb-10 text-3xl font-bold text-gray-900">Our Blog</h1>

      {posts.length === 0 ? (
        /*
         * Said out loud rather than left as a bare heading over nothing. A
         * visitor should be able to tell "this shop has not published anything
         * yet" from "this page is broken".
         */
        <p className="text-sm text-gray-500">
          There are no posts yet. Check back soon.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const image = listingImage(post);

              return (
                <article key={post.id} className="flex flex-col">
                  {image && (
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100"
                    >
                      <Image src={image} alt={post.title} fill className="object-cover" />
                      {/* Poster frame plus a play affordance — the video plays
                          on the post's own page, not in a listing. */}
                      {post.mediaType === "VIDEO" && (
                        <span
                          className="absolute inset-0 flex items-center justify-center bg-black/15"
                          aria-hidden
                        >
                          <span className="flex size-12 items-center justify-center rounded-full bg-white/90 shadow-sm">
                            <Play className="ml-0.5 size-5 fill-gray-900 text-gray-900" />
                          </span>
                        </span>
                      )}
                    </Link>
                  )}
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand">
                    {formatPostDate(post.publishedAt)}
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-gray-900">
                    <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">{post.excerpt}</p>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <nav className="mt-12 flex items-center justify-center gap-3" aria-label="Blog pages">
              {page > 1 && (
                <Link
                  href={`/blogs?page=${page - 1}`}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/blogs?page=${page + 1}`}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
