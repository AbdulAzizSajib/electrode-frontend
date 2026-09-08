import type { Metadata } from "next";
import "./globals.css";
import CurrencyFormatProvider from "@/components/providers/CurrencyFormatProvider";
import CatalogFeaturesProvider from "@/components/providers/CatalogFeaturesProvider";
import { setCurrencyFormat } from "@/lib/format";
import { setCatalogFeatures } from "@/lib/catalog-features";
import { getStoreSettings } from "@/services/store-settings";
import { resolveFontHref, themeStyle } from "@/lib/theme";
import { resolveMetadata, storeTitleOf } from "@/lib/seo/resolve-metadata";
import { buildOrganizationSchema } from "@/lib/seo/schema-builders";
import JsonLd from "@/components/seo/json-ld";

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
   * The site-wide default, beneath every page that supplies its own. Resolved
   * through the shared resolver rather than assembled here, so the root and the
   * eighteen routes below it cannot disagree about precedence, canonical shape
   * or robots policy — which is exactly how a dozen pages ended up hardcoding
   * "– Electrode" while the store's real name sat unused in the settings row.
   *
   * `home` as the route group: this is the metadata `/` inherits, and every
   * other route overrides it with a group of its own.
   *
   * No `path` — a layout is not a page, and a canonical here would claim every
   * route in the site is the homepage.
   */
  const metadata = resolveMetadata({ settings, routeGroup: "home" });

  /*
   * `title.template` in ADDITION to the already-final title above, because the
   * two do different jobs. Next applies a template only to CHILD segments that
   * set a bare string title — so this catches any page that has not been moved
   * onto the resolver yet, while the resolver keeps templating the ones that
   * have. `default` is required whenever a template is set.
   */
  const template = settings.seoConfig.titleTemplate?.trim();
  const rootTitle = typeof metadata.title === "string" ? metadata.title : storeTitleOf(settings);

  return {
    ...metadata,
    ...(template && template.includes("%s")
      ? { title: { default: rootTitle, template } }
      : {}),
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

  /*
   * Which catalog features this shop offers, applied on both sides of the boundary for the same
   * reason the currency format is — see `lib/catalog-features.ts`, which inherits `lib/format.ts`'s
   * reasoning wholesale.
   *
   * In the ROOT layout rather than `(shop)`'s even though a landing page renders no product card:
   * these belong beside the currency format, and setting them once here means no future surface has
   * to work out which layout it sits under before it can ask.
   */
  const catalogFeatures = settings.catalogConfig;
  setCatalogFeatures(catalogFeatures);

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
        {/* The store itself, on every page — which is what lets a search engine
            attach a knowledge panel to the brand rather than to one product.
            Renders nothing when the merchant has the toggle off. */}
        <JsonLd data={buildOrganizationSchema(settings)} />
        {/* Outermost, so the format and the feature flags are both in place before anything
            beneath them renders a price or a product card. */}
        <CurrencyFormatProvider format={currencyFormat}>
          <CatalogFeaturesProvider features={catalogFeatures}>{children}</CatalogFeaturesProvider>
        </CurrencyFormatProvider>
      </body>
    </html>
  );
}
