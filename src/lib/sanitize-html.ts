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

/** What a product description legitimately needs: structure, emphasis, lists, tables, links. */
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
const ALLOWED_ATTR = ["href", "title", "target", "rel", "colspan", "rowspan"];

/**
 * Strips everything outside the allowlist. `javascript:` and `data:` hrefs go
 * with it: an anchor is the easiest place for markup to become a script.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#|\/)/i,
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
