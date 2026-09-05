import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductVideo from "@/components/product/ProductVideo";
import RichText from "@/components/product/RichText";
import { formatPostDate, getBlogPostBySlug } from "@/services/blog";

/*
 * A single blog post.
 *
 * This is where "Read more" has always pointed in spirit and never in fact —
 * the fixture cards linked to the index, because there were no posts to link
 * to.
 *
 * No `generateStaticParams`: pre-rendering would mean a rebuild before a new
 * post went live, which defeats the point of writing one in the admin panel.
 */

export async function generateMetadata({
  params,
}: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) return { title: "Post not found" };

  return {
    // Falls back to the title and the excerpt, so a post is never published
    // without metadata a search result can show.
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
  };
}

export default async function BlogPostRoute({ params }: PageProps<"/blogs/[slug]">) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  // Unknown slug, draft post and unreachable API all land here. A visitor
  // cannot tell an unpublished post from one that never existed, which is the
  // point — a draft's title should not leak through a 404 that looks different.
  if (!post) notFound();

  return (
    <article className="container-px mx-auto max-w-4xl py-10 md:py-14">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All posts
      </Link>

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-brand">
        {formatPostDate(post.publishedAt)}
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-gray-900 md:text-4xl">{post.title}</h1>
      <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>

      {/*
        The post's one piece of media. This is the only place a video post's
        video actually plays — listings show its poster frame instead, so the
        homepage does not load four clips nobody asked for.

        `ProductVideo` is reused rather than copied: it already does the thing
        that matters here, which is showing the poster and loading the video
        only on click.
      */}
      {post.mediaType === "IMAGE" && post.imageUrl && (
        <div className="relative mt-6 aspect-video overflow-hidden rounded-xl bg-gray-100">
          <Image src={post.imageUrl} alt={post.title} fill className="object-cover" priority />
        </div>
      )}
      {post.mediaType === "VIDEO" && post.videoUrl && (
        <ProductVideo
          url={post.videoUrl}
          thumbnail={post.videoThumbnailUrl ?? undefined}
          title={post.title}
        />
      )}

      <div className="mt-6 h-px w-full bg-gray-200" />
      {/*
        `post.body` is already sanitised by the service. RichText sanitises
        again — idempotent, and it keeps one component owning the prose styles
        rather than this route growing its own copy of them. Same arrangement as
        the content-page route.
      */}
      <RichText html={post.body} className="mt-6 text-base [&_p]:my-4 [&_li]:my-1.5" />
    </article>
  );
}
