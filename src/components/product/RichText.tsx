import clsx from "clsx";
import { sanitizeHtml } from "@/lib/sanitize-html";

/**
 * Renders merchant-authored HTML, sanitised at the point it meets a browser.
 *
 * `dangerouslySetInnerHTML` below is only as dangerous as `sanitizeHtml`'s
 * allowlist makes it — see `lib/sanitize-html.ts` for what survives it and why.
 * Nothing else in the storefront should set product markup directly.
 */
export default function RichText({
  html,
  className,
  themed = false,
}: {
  html: string;
  className?: string;
  /**
   * Renders the merchant's prose in the campaign-page `lp-*` tokens instead of
   * this app's literal greys.
   *
   * OPT-IN, and it cannot be done by the caller instead: the element styles its
   * descendants through `[&_h2]`-style variants, and a `className` passed in
   * cannot override a variant it does not repeat — a landing page could recolour
   * the body text and would still get gray-900 headings and gray-200 table rules
   * in the middle of a themed page.
   *
   * Product and page bodies elsewhere in the storefront pass nothing and are
   * unaffected.
   *
   * See server/openspec/changes/add-landing-page-theme-tokens.
   */
  themed?: boolean;
}) {
  const clean = sanitizeHtml(html);

  return (
    <div
      className={clsx(
        "text-sm leading-relaxed",
        themed ? "text-lp-muted" : "text-gray-600",
        "[&_p]:my-2",
        "[&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-lg [&_h1]:font-bold",
        "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-bold",
        "[&_h3]:mb-1.5 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-semibold",
        "[&_strong]:font-semibold",
        themed
          ? "[&_h1]:text-lp-text [&_h2]:text-lp-text [&_h3]:text-lp-text [&_strong]:text-lp-text"
          : "[&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_strong]:text-gray-900",
        "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_li]:my-1",
        "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-3",
        themed
          ? "[&_blockquote]:border-lp-border [&_blockquote]:text-lp-muted"
          : "[&_blockquote]:border-gray-200 [&_blockquote]:text-gray-500",
        themed ? "[&_a]:text-lp-accent" : "[&_a]:text-brand",
        "[&_a]:underline",
        "[&_table]:my-3 [&_table]:w-full [&_table]:border-collapse",
        "[&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:border",
        "[&_td]:px-2 [&_td]:py-1 [&_td]:border",
        themed
          ? "[&_th]:border-lp-border [&_td]:border-lp-border"
          : "[&_th]:border-gray-200 [&_td]:border-gray-200",
        className,
      )}
      // Safe only because of `sanitizeHtml` above — never bypass it.
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
