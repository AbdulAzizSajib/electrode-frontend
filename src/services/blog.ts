import { apiFetch } from "@/lib/api-client";
import { sanitizeHtml } from "@/lib/sanitize-html";
import type { BlogPost, BlogPostSummary } from "@/types/blog";

/**
 * Posts change on the order of days, so five minutes — matching banners, the
 * category tree and content pages, rather than the settings row's 30 seconds.
 *
 * That shorter window exists because a merchant edits a colour and reloads
 * immediately to check it; publishing an article is not that, and the backend
 * drops the tag on every write anyway, so a save is visible on the next request
 * regardless. This bound only governs how stale an UNEDITED blog gets.
 */
const BLOG_REVALIDATE_SECONDS = 300;

/** The cache tag the backend invalidates after a post is created, edited or deleted. */
export const BLOG_POSTS_CACHE_TAG = "blog-posts";

/**
 * The most recent published posts, for the homepage section.
 *
 * Returns an empty array rather than throwing on failure: the homepage renders
 * several independent sections, and a blog outage must shorten the page rather
 * than fail it. An empty result is also the specified behaviour for a shop with
 * nothing published — the section is omitted entirely.
 */
export async function getRecentBlogPosts(): Promise<BlogPostSummary[]> {
  try {
    const { data } = await apiFetch<BlogPostSummary[]>("/blog-posts/recent", {
      revalidate: BLOG_REVALIDATE_SECONDS,
      tags: [BLOG_POSTS_CACHE_TAG],
    });

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export interface BlogPostPage {
  posts: BlogPostSummary[];
  page: number;
  totalPages: number;
}

/** Published posts, newest first, for the blog index. */
export async function getBlogPosts(page = 1, limit = 9): Promise<BlogPostPage> {
  try {
    const { data, meta } = await apiFetch<BlogPostSummary[]>(
      `/blog-posts?page=${page}&limit=${limit}`,
      { revalidate: BLOG_REVALIDATE_SECONDS, tags: [BLOG_POSTS_CACHE_TAG] },
    );

    return {
      posts: Array.isArray(data) ? data : [],
      page: meta?.page ?? page,
      totalPages: meta?.totalPages ?? 1,
    };
  } catch {
    return { posts: [], page: 1, totalPages: 1 };
  }
}

/**
 * A published post by slug, or null.
 *
 * Sanitising happens HERE, in the service, exactly as it does for content pages
 * — it makes the safe path the default one, so a future second consumer of a
 * post body cannot forget. Nothing else returns a `BlogPost`.
 *
 * Returns null rather than throwing on every failure. A missing slug, a draft
 * and an unreachable API are all "there is no post here" as far as the route is
 * concerned, and it calls `notFound()` for all three — so a draft is
 * indistinguishable from a post that never existed.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data } = await apiFetch<BlogPost>(`/blog-posts/${encodeURIComponent(slug)}`, {
      revalidate: BLOG_REVALIDATE_SECONDS,
      tags: [BLOG_POSTS_CACHE_TAG],
    });

    if (!data || typeof data.body !== "string") return null;

    return { ...data, body: sanitizeHtml(data.body) };
  } catch {
    return null;
  }
}

/**
 * The still image a listing should show for a post, or null when it has none.
 *
 * A video post shows its POSTER FRAME in a listing, never the video: four
 * autoplaying clips above the fold is a bandwidth and layout-shift cost the
 * merchant did not ask for when they uploaded one. The video plays on the
 * post's own page.
 */
export function listingImage(post: BlogPostSummary): string | null {
  if (post.mediaType === "IMAGE") return post.imageUrl;
  if (post.mediaType === "VIDEO") return post.videoThumbnailUrl;
  return null;
}

/** The date as a card renders it — "Jul 19, 2026". */
export function formatPostDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
