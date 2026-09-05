import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { formatPostDate, listingImage } from "@/services/blog";
import type { BlogPostSummary } from "@/types/blog";

/**
 * The homepage's "Our Latest Blog" row.
 *
 * Takes its posts as a prop rather than fetching them: the homepage already
 * runs its section queries concurrently, and a fetch in here would serialise
 * behind the rest of the page for no reason.
 *
 * Renders nothing when there are no posts. The homepage gates on that too, so
 * this is the second of two guards — a heading over an empty grid is worse than
 * a shorter page, and a shop that has published nothing yet should look
 * unfinished in neither direction.
 */
export default function BlogSection({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="container-px site-container py-12 ">
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Our Latest Blog</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => {
          const image = listingImage(post);

          return (
            <article key={post.id} className="flex flex-col">
              {/*
                No media area at all for a post without media, rather than an
                empty grey box — an unillustrated post should read as a text
                post, not as one whose picture failed to load.
              */}
              {image && (
                <Link
                  href={`/blogs/${post.slug}`}
                  className="relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100"
                >
                  <Image src={image} alt={post.title} fill className="object-cover" />
                  {/*
                    A video post shows its POSTER FRAME here, marked as playable.
                    Four autoplaying clips above the fold is a bandwidth and
                    layout-shift cost the merchant did not ask for by uploading
                    one; the video itself plays on the post's own page.
                  */}
                  {post.mediaType === "VIDEO" && (
                    <span
                      className="absolute inset-0 flex items-center justify-center bg-black/15"
                      aria-hidden
                    >
                      <span className="flex size-11 items-center justify-center rounded-full bg-white/90 shadow-sm">
                        <Play className="ml-0.5 size-5 fill-gray-900 text-gray-900" />
                      </span>
                    </span>
                  )}
                  {post.mediaType === "VIDEO" && <span className="sr-only">Video post</span>}
                </Link>
              )}
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand">
                {formatPostDate(post.publishedAt)}
              </p>
              <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">
                <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="mt-2 line-clamp-2 text-xs text-gray-500">{post.excerpt}</p>
              {/* Goes to the POST, not the index — which is what "read more"
                  has always implied and never did. */}
              <Link
                href={`/blogs/${post.slug}`}
                className="mt-3 text-xs font-semibold text-brand underline"
              >
                Read more
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
