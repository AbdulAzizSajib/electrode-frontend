/**
 * The campaign landing page shell — deliberately almost nothing.
 *
 * No header, no navigation, no announcement bar, no footer, no cart drawer, no
 * cart rail, no compare bar, no mobile bottom navigation. A landing page exists
 * to carry one visitor from an ad to one order form; every one of those is
 * somewhere else to go, which is the one thing this page must not offer.
 *
 * That is also why the chrome moved into `app/(shop)/layout.tsx` rather than
 * being hidden here: rendering it globally and suppressing it with CSS would
 * still ship its markup, its data fetches and its JavaScript to a page whose
 * whole purpose is to be one focused document.
 *
 * The theme, font and currency format still apply — they come from the ROOT
 * layout above this one, so a campaign page looks like the same business and
 * writes prices the same way as the shop it belongs to.
 *
 * See add-single-product-landing-page design.md, Decision 6, and the
 * `storefront-cms/landing-pages` spec, "A landing page renders without site
 * chrome".
 */
export default function LandingLayout({ children }: LayoutProps<"/">) {
  return <main className="flex-1">{children}</main>;
}
