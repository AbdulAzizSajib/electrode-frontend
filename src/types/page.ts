/** A merchant-authored content page, as `GET /pages/:slug` serves it. */
export interface ApiPage {
  id: string;
  title: string;
  slug: string;
  /** Raw stored HTML. NOT safe to render — see `services/page.ts`. */
  body: string;
  metaTitle: string | null;
  metaDescription: string | null;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
  updatedAt: string;
}

/**
 * A page ready to render. `body` here has already been through
 * `sanitizeHtml`, which is the difference between this type and `ApiPage` —
 * they are kept distinct so a component cannot accidentally be handed the
 * unsanitised one.
 */
export interface ContentPage {
  title: string;
  slug: string;
  /** Sanitised HTML, safe for `dangerouslySetInnerHTML`. */
  body: string;
  metaTitle: string | null;
  metaDescription: string | null;
}
