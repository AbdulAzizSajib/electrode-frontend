"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";

import { formatPostDate, listingImage } from "@/services/blog";
import type { BlogPostSummary } from "@/types/blog";

/** Cards across per breakpoint: 1 on mobile, 2 on sm (640px), 4 on lg (1024px). */
const COLUMNS = { base: 1, sm: 2, lg: 4 } as const;
const GAP = 24;
const BREAKPOINT = { sm: 640, lg: 1024 } as const;

const ARROW_CLASS =
  "flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-40";

/**
 * The homepage's "Our Latest Blog" carousel on both mobile and desktop.
 */
export default function BlogSection({ posts }: { posts: BlogPostSummary[] }) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  if (posts.length === 0) return null;

  const syncEdges = (instance: SwiperInstance) =>
    setEdges((current) =>
      current.atStart === instance.isBeginning && current.atEnd === instance.isEnd
        ? current
        : { atStart: instance.isBeginning, atEnd: instance.isEnd },
    );

  return (
    <section className="container-px site-container py-12">
      <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-3">
        <h2 className="flex items-center gap-2.5 text-xl font-bold text-gray-900 sm:text-2xl">
          <span aria-hidden="true" className="h-5 w-1.5 shrink-0 rounded-full bg-brand sm:h-6" />
          <span>Our Latest Blog</span>
        </h2>

        <Link
          href="/blogs"
          className="order-2 w-full text-sm font-semibold text-brand hover:underline sm:order-1 sm:ms-auto sm:w-auto"
        >
          See all posts
        </Link>

        <div className="order-1 ms-auto flex shrink-0 gap-2 sm:order-2">
          <button
            type="button"
            aria-label="Previous blog posts"
            disabled={edges.atStart}
            onClick={() => swiper?.slidePrev()}
            className={ARROW_CLASS}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next blog posts"
            disabled={edges.atEnd}
            onClick={() => swiper?.slideNext()}
            className={ARROW_CLASS}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <Swiper
        slidesPerView={COLUMNS.base}
        spaceBetween={GAP}
        breakpoints={{
          [BREAKPOINT.sm]: { slidesPerView: COLUMNS.sm },
          [BREAKPOINT.lg]: { slidesPerView: COLUMNS.lg },
        }}
        onSwiper={(instance) => {
          setSwiper(instance);
          syncEdges(instance);
        }}
        onSlideChange={syncEdges}
        onBreakpoint={syncEdges}
        onResize={syncEdges}
        onUpdate={syncEdges}
        aria-label="Our Latest Blog"
      >
        {posts.map((post) => {
          const image = listingImage(post);

          return (
            <SwiperSlide key={post.id} className="!flex !h-auto [&>article]:flex-1">
              <article className="flex flex-col">
                {image && (
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100"
                  >
                    <Image src={image} alt={post.title} fill className="object-cover" />
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
                <Link
                  href={`/blogs/${post.slug}`}
                  className="mt-3 text-xs font-semibold text-brand underline"
                >
                  Read more
                </Link>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
