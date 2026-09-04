import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import CartRail from "@/components/layout/CartRail";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CompareBar from "@/components/layout/CompareBar";
import StoreProvider from "@/store/StoreProvider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { getCurrentUser } from "@/services/auth";
import { getCategoryTree } from "@/services/category";
import { getStoreSettings } from "@/services/store-settings";
import { resolveFontHref, themeStyle } from "@/lib/theme";

/**
 * The site's default document metadata, from the merchant's settings.
 *
 * Was a hardcoded literal reading "Electrode - Electronics Store" — a name the
 * seeded store does not even have. A page that supplies its own title (a
 * product, a CMS page) still wins; this is only the default beneath them.
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
  // Independent of each other, so run them concurrently — the header renders on
  // every route, and awaiting these in series would add latency to every page.
  //
  // Settings is fetched once here and passed down rather than in each of the
  // four chrome components: they all render on every page, so fetching per
  // component would multiply the request, and fetching client-side would flash
  // default chrome before the merchant's own arrived.
  const [user, categories, settings] = await Promise.all([
    getCurrentUser(),
    getCategoryTree(),
    getStoreSettings(),
  ]);

  const fontHref = resolveFontHref(settings.theme?.font?.url);

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
        <StoreProvider isSignedIn={Boolean(user)}>
          {/* Inside StoreProvider so the drawers can read both the cart state and
              the scroll authority that locks the page behind them. */}
          <SmoothScrollProvider>
            <Header user={user} categories={categories} settings={settings} />
            <main className="flex-1">{children}</main>
            <Footer settings={settings} />
            <CartDrawer />
            <CartRail />
            <MobileBottomNav contact={settings.contact} />
            <CompareBar />
          </SmoothScrollProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
