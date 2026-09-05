/**
 * Merchant-authored blog posts, as served by `GET /blog-posts`.
 *
 * Mirrors the backend's `blog-post.interface.ts`. Only published posts ever
 * reach the storefront — a draft resolves to nothing, indistinguishable from a
 * post that was never written.
 */

/** Which of the media fields below is meaningful. Stated by the record, not inferred. */
export type BlogMediaType = "NONE" | "IMAGE" | "VIDEO";

/** What a listing needs — no `body`, so four cards do not ship four documents. */
export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  mediaType: BlogMediaType;
  imageUrl: string | null;
  videoUrl: string | null;
  /**
   * Never null on a VIDEO post — the upload endpoint derives a frame when the
   * merchant supplies no poster. This is what listings render; only the post's
   * own page plays the video.
   */
  videoThumbnailUrl: string | null;
  publishedAt: string;
}

export interface BlogPost extends BlogPostSummary {
  /** Semantic HTML. Sanitised on the way OUT, here — see `lib/sanitize-html.ts`. */
  body: string;
  metaTitle: string | null;
  metaDescription: string | null;
}
