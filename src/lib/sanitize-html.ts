import sanitize from "sanitize-html";

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
 *
 * ## Why `sanitize-html` and not `isomorphic-dompurify`
 *
 * This used DOMPurify, which needs a DOM — on the server that meant jsdom, and
 * jsdom is what made the storefront undeployable. jsdom@30 requires
 * `html-encoding-sniffer@6`, a CommonJS package that `require()`s
 * `@exodus/bytes`, which is pure ESM. Node 22 tolerates `require(esm)`; Node 24
 * refuses it with ERR_REQUIRE_ESM. So every route 500'd on any host running
 * Node 24 while working perfectly on a Node 22 laptop — and because the throw
 * happens at MODULE EVALUATION, not at call time, the `try/catch` in
 * `services/store-settings.ts` could not degrade it. The whole site was down,
 * not one component.
 *
 * `sanitize-html` parses with htmlparser2 and never touches a DOM, so there is
 * no jsdom, no ESM/CJS conflict, and no Node-version constraint. Do not
 * reintroduce a DOM-based sanitiser to "modernise" this — the runtime
 * independence is the point.
 *
 * Both files that pin this module's behaviour (`sanitize-html.test.ts` and
 * `page-content.test.ts`) pass unchanged against this implementation; the
 * allowlists and URI rule below are carried over verbatim.
 */

/**
 * What merchant-authored content legitimately needs: structure, emphasis,
 * lists, tables, links — and, since content pages were added, images. An About
 * page reasonably contains one; a product description never did, which is why
 * `img` arrived only with the page editor that can insert it.
 *
 * The editor and this list are two halves of one switch: a tag the admin's
 * editor can emit but this strips disappears silently on the storefront.
 * `page-form-page.tsx` opts into images and nothing else, and a test pins the
 * pair together. The editor is Quill (`admin/src/components/forms/
 * rich-text-editor.tsx`) — its toolbar is deliberately narrower than Quill's
 * default set for exactly this reason, and `buildToolbar` there says which
 * controls were left out and why.
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
  "colspan",
  "rowspan",
  // For `img`. `src` is constrained by SAFE_URI below exactly like `href` is,
  // which is what keeps a `data:` payload out of an image tag.
  "src",
  "alt",
  "width",
  "height",
];

/*
 * `target` and `rel` are deliberately absent, and their absence is asserted by
 * "drops target and rel from anchors, so links stay same-tab" in
 * page-content.test.ts.
 *
 * They were on this list under DOMPurify, which removed both anyway regardless
 * of the allow-list — the test documents that as the storefront's real
 * behaviour rather than a slip. `sanitize-html` honours the list literally, so
 * leaving them here would have CHANGED behaviour: links would start opening in
 * new tabs. Listing them would be the bug; omitting them preserves what shipped.
 *
 * A same-tab link cannot be a reverse-tabnabbing vector, so nothing is lost.
 */

/** The only URI shapes any attribute here may carry. */
const SAFE_URI = /^(?:https?:|mailto:|tel:|#|\/)/i;

/**
 * Strips everything outside the allowlist. `javascript:` and `data:` URIs go
 * with it, on `href` and `src` alike: a link or an image source is the easiest
 * place for markup to become something else.
 */
export function sanitizeHtml(html: string): string {
  return sanitize(html, {
    allowedTags: ALLOWED_TAGS,
    // One list for every tag, matching DOMPurify's flat `ALLOWED_ATTR`. A
    // per-tag map would be tighter, but it would also be a second, divergent
    // statement of the same rule — and the tests pin the flat behaviour.
    allowedAttributes: { "*": ALLOWED_ATTR },
    /*
     * The scheme allow-list, and then SAFE_URI again in `transformTags` below.
     * Both are needed, and the duplication is deliberate:
     *
     * `allowedSchemes` rejects `javascript:` and `data:`, but it says nothing
     * about protocol-relative (`//evil.example`) or other shapes, and it is
     * expressed as a list of schemes rather than as the one regexp the rest of
     * this file is written against. SAFE_URI is the actual rule — it also
     * admits `#`, `/` and `tel:`, and admits nothing else.
     *
     * Keeping both means a future edit to either one cannot silently widen what
     * a link may point at.
     */
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    allowProtocolRelative: false,
    /*
     * A rejected tag's TEXT still reads — this is `KEEP_CONTENT: true` under
     * the old implementation. Dropping the element whole would silently lose
     * wording the merchant wrote.
     *
     * `nonTextTags` is the exception, and the reason it is listed explicitly:
     * for these, the "text" is a program, not prose. Without it `<script>` is
     * discarded but `alert("xss")` survives as a text node, which is inert but
     * renders as visible gibberish — and `isBlankHtml` would then report a
     * script-only document as non-blank. `script` and `style` alone would cover
     * the tests; `textarea`, `option` and `noscript` are included because they
     * are the same category of "contents are not prose" and `sanitize-html`
     * defaults to exactly this set.
     */
    disallowedTagsMode: "discard",
    nonTextTags: ["script", "style", "textarea", "option", "noscript"],
    /*
     * Re-checks every `href` and `src` against SAFE_URI, dropping the attribute
     * rather than the element.
     *
     * This is what the old `afterSanitizeAttributes` DOMPurify hook did, and it
     * exists for the same reason: `img` was added to the allow-list for content
     * pages, and an image source is the one place a `data:` payload can still
     * reach a browser. `data:image/svg+xml` is a documented content-injection
     * vector, and this storefront never needs an inline image.
     *
     * Dropping the ATTRIBUTE and keeping the element matches the old behaviour
     * exactly — `<a href="javascript:…">Click</a>` keeps the word "Click", which
     * is merchant-authored copy and should not vanish because the link was bad.
     */
    transformTags: {
      "*": (tagName, attribs) => {
        const safe: Record<string, string> = {};

        for (const [name, value] of Object.entries(attribs)) {
          if ((name === "href" || name === "src") && !SAFE_URI.test(value)) {
            continue;
          }
          safe[name] = value;
        }

        return { tagName, attribs: safe };
      },
    },
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
