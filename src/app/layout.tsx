import type { Metadata } from "next";
import "./globals.css";
import CurrencyFormatProvider from "@/components/providers/CurrencyFormatProvider";
import { setCurrencyFormat } from "@/lib/format";
import { getStoreSettings } from "@/services/store-settings";
import { resolveFontHref, themeStyle } from "@/lib/theme";

/**
 * The document shell, and only the shell.
 *
 * This layout used to render the site chrome too — header, footer, cart drawer,
 * cart rail, mobile nav, compare bar. It no longer does, because there are now
 * TWO kinds of page under it and they need different shells:
 *
 *   app/(shop)/   the storefront, with all of that chrome
 *   app/(landing)/ a campaign landing page, with none of it
 *
 * A landing page is a single focused document ending in an order form; a header
 * offering somewhere else to go is the one thing it must not have. Route groups
 * are how Next.js expresses that — the parentheses are not part of any URL, so
 * moving every storefront route under `(shop)` changed no address.
 *
 * What stays here is what BOTH shells need and neither should duplicate: the
 * html/body elements, the merchant's theme and font, and the currency format.
 * A landing page still has to look like the same business.
 *
 * See add-single-product-landing-page design.md, Decision 6.
 */

/**
 * The site's default document metadata, from the merchant's settings.
 *
 * Was a hardcoded literal reading "Electrode - Electronics Store" — a name the
 * seeded store does not even have. A page that supplies its own title (a
 * product, a CMS page, a landing page) still wins; this is only the default
 * beneath them.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  /*
   * Falls back to the wordmark rather than a placeholder, so the title is never
   * empty and never someone else's brand.
   *
   * Joined with a space because that is how the header renders it — the accent
   * half carries `ml-2`, so the brand reads as two words on the page and must
   * read the same way in a tab title. Concatenating them gave "UdokktarSite".
   */
  const title =
    settings.metaTitle?.trim() ||
    [settings.storeName, settings.siteNameAccent].filter(Boolean).join(" ").trim();

  /*
   * Only set when the merchant has recorded a usable canonical origin. Guessing
   * one would be worse than leaving metadata relative — an absolute URL
   * resolved against the wrong host points social previews and canonical links
   * at somebody else's site. A malformed stored value is ignored, not thrown
   * on: this runs for every page on the site.
   */
  let metadataBase: URL | undefined;
  if (settings.siteUrl) {
    try {
      metadataBase = new URL(settings.siteUrl);
    } catch {
      metadataBase = undefined;
    }
  }

  return {
    title,
    ...(settings.metaDescription?.trim()
      ? { description: settings.metaDescription.trim() }
      : {}),
    ...(metadataBase ? { metadataBase } : {}),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getStoreSettings();

  const fontHref = resolveFontHref(settings.theme?.font?.url);

  /*
   * How money is written, applied on BOTH sides of the boundary.
   *
   * Here for the server render pass — `formatPrice` reads module state, so it has to be set before
   * any server component below this renders a price. And again inside `CurrencyFormatProvider`,
   * which is a client component: the browser bundle has its own module registry, so a client
   * component like `ProductCard` would otherwise hydrate against the fallback and disagree with the
   * server-rendered markup beside it.
   *
   * Kept in the ROOT layout rather than in `(shop)`'s: a landing page renders
   * prices too, and it must render them the way the rest of the shop does.
   */
  const currencyFormat = {
    symbol: settings.currencySymbol,
    position: settings.currencyPosition,
    decimals: settings.currencyDecimals,
  };
  setCurrencyFormat(currencyFormat);

  return (
    /*
     * The merchant's theme rides on an inline style attribute rather than a
     * <style> block — see lib/theme.ts. `--font-sans` is inherited from here
     * down to `body`, whose own `font-family: var(--font-sans)` rule in
     * globals.css is what actually applies it to the page. Tailwind's preflight
     * sets `html { font-family: var(--default-font-family) }` with the default
     * family baked in by `@theme inline`; that is deliberately left alone,
     * because every rendered element lives inside <body> and body's rule wins
     * for all of them.
     */
    <html lang="en" className="h-full antialiased" style={themeStyle(settings.theme)}>
      {/*
        `precedence` is what makes React hoist this into <head> and dedupe it.
        Without it React refuses to place a stylesheet outside the document
        head, and rendering it here as a literal child of <html> is invalid
        HTML that the parser relocates — which is a hydration mismatch.

        Absent when no valid stylesheet URL is stored, in which case the
        fallback stack in --font-sans carries the page on its own. `display=swap`
        (forced by the backend parser) means text paints in that fallback
        immediately rather than waiting on this request.
      */}
      {fontHref && <link rel="stylesheet" href={fontHref} precedence="default" />}
      <body className="flex min-h-full flex-col">
        {/* Outermost, so the format is in place before anything beneath it renders a price. */}
        <CurrencyFormatProvider format={currencyFormat}>{children}</CurrencyFormatProvider>
      </body>
    </html>
  );
}
