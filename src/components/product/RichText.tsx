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
}: {
  html: string;
  className?: string;
}) {
  const clean = sanitizeHtml(html);

  return (
    <div
      className={clsx(
        "text-sm leading-relaxed text-gray-600",
        "[&_p]:my-2",
        "[&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-gray-900",
        "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-gray-900",
        "[&_h3]:mb-1.5 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-900",
        "[&_strong]:font-semibold [&_strong]:text-gray-900",
        "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_li]:my-1",
        "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-200 [&_blockquote]:pl-3 [&_blockquote]:text-gray-500",
        "[&_a]:text-brand [&_a]:underline",
        "[&_table]:my-3 [&_table]:w-full [&_table]:border-collapse",
        "[&_th]:border [&_th]:border-gray-200 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left",
        "[&_td]:border [&_td]:border-gray-200 [&_td]:px-2 [&_td]:py-1",
        className,
      )}
      // Safe only because of `sanitizeHtml` above — never bypass it.
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
