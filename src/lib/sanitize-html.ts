import DOMPurify from "isomorphic-dompurify";

/**
 * The allowlist merchant-authored HTML is filtered through before it reaches a
 * shopper's browser.
 *
 * Sanitising here rather than on save is deliberate. Cleaning only on the way
 * in would leave everything already stored — and anything written by any other
 * path: a script, a database fix, a future endpoint — trusted forever. The
 * storefront is where the markup becomes a page, so this is where the guarantee
 * has to hold. See design.md, "Rich text is sanitised on the way out, not only
 * on the way in".
 *
 * Kept apart from the component that renders it so it can be tested directly.
 */

/**
 * What merchant-authored content legitimately needs: structure, emphasis,
 * lists, tables, links — and, since content pages were added, images. An About
 * page reasonably contains one; a product description never did, which is why
 * `img` arrived only with the page editor that can insert it.
 *
 * The editor and this list are two halves of one switch: a tag Tiptap can emit
 * but this strips disappears silently on the storefront. `page-form-page.tsx`
 * opts into the image extension and nothing else, and a test pins the pair
 * together.
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "del",
  "mark",
  "code",
  "pre",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "hr",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "span",
  "div",
];

/**
 * No `style`, no `class`, no `id`, and no `on*`.
 *
 * A class could pull in the storefront's own utility styles to cover the page
 * with an overlay, and an inline style can do it without help — neither is
 * something a product description needs.
 */
const ALLOWED_ATTR = [
  "href",
  "title",
  "target",
  "rel",
  "colspan",
  "rowspan",
  // For `img`. `src` is constrained by ALLOWED_URI_REGEXP below exactly like
  // `href` is, which is what keeps a `data:` payload out of an image tag.
  "src",
  "alt",
  "width",
  "height",
];

/** The only URI shapes any attribute here may carry. */
const SAFE_URI = /^(?:https?:|mailto:|tel:|#|\/)/i;

/**
 * Closes a hole `ALLOWED_URI_REGEXP` does not.
 *
 * DOMPurify treats `img` (with `audio`, `video`, `source`, `track`) as a
 * "data URI tag": for those, a `data:` source is accepted even when the
 * configured URI regexp rejects it. That is deliberate on their side — inline
 * images are a normal thing to want — but this storefront never needs one, and
 * `data:image/svg+xml` is a documented content-injection vector.
 *
 * `javascript:` was already blocked; only `data:` slipped through, and only
 * once `img` was added to the allow-list for content pages. This hook re-checks
 * `src` against the same rule `href` gets, so both are held to one standard.
 *
 * Registered at module scope, so it is installed exactly once no matter how
 * many callers import `sanitizeHtml`.
 */
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  // Duck-typed, not `instanceof Element`: on the server this runs against
  // isomorphic-dompurify's own jsdom window, whose `Element` is not the same
  // constructor as any global one — and under the `node` test environment
  // there is no global `Element` at all, so the check would throw.
  if (typeof node?.getAttribute !== "function") return;

  const src = node.getAttribute("src");
  if (src !== null && !SAFE_URI.test(src)) node.removeAttribute("src");
});

/**
 * Strips everything outside the allowlist. `javascript:` and `data:` URIs go
 * with it, on `href` and `src` alike: a link or an image source is the easiest
 * place for markup to become something else.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: SAFE_URI,
    // A rejected tag's text still reads; dropping it whole would silently lose
    // wording the merchant wrote.
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: false,
  });
}

/** True when the markup carries nothing a shopper would see. */
export function isBlankHtml(html: string | undefined | null): boolean {
  if (!html) return true;
  return (
    sanitizeHtml(html)
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim() === ""
  );
}
