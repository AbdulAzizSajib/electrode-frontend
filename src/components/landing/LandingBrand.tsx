import { resolveBrandSlot, type BrandSettings } from "@/lib/brand-slot";

/**
 * Who is selling this, at the very top of the campaign page.
 *
 * `(landing)` renders no chrome at all — no header, no nav, no footer — because
 * every one of those is somewhere else to go, and a page paid for by an ad must
 * not offer one. The cost of that was the shop's name never appearing: a
 * visitor arriving from an ad landed on a headline, a price and a form asking
 * for their phone number and address with nothing on screen saying whose shop
 * it was. The brand is the one piece of chrome that ARGUES FOR the order rather
 * than away from it, so it comes back and nothing else does.
 *
 * NOT A LINK, and that is the difference between this and the header's brand
 * slot. The header's logo is the route home; here home is the exit this page
 * exists to avoid, and a logo at the top of a landing page is the most-clicked
 * way out ever invented. It says who, it does not go anywhere.
 *
 * THE SHOP'S OWN DECISION, through `resolveBrandSlot`, so a merchant who set
 * their header to the wordmark gets the wordmark here too and one who uploaded
 * artwork gets the artwork — including its fallback to text when a slot is in
 * logo mode with no image, which is why this does not read `logoUrl` directly.
 * The header slot rather than the footer's: this sits at the top of a page, and
 * footer artwork is commonly the inverted copy meant for a dark band.
 *
 * Themed like everything else on the page. The wordmark's accent half takes
 * `text-lp-accent`, not the shop-wide `text-accent` the header uses — the
 * campaign has redefined those tokens for itself, and the shop's accent beside
 * the campaign's colours is the one thing on the page that would not match.
 */
export default function LandingBrand({ settings }: { settings: BrandSettings }) {
  const brand = resolveBrandSlot(settings, "header");

  if (brand.kind === "logo") {
    return (
      /*
        A plain <img>, not next/image, for the same reason the header uses one:
        the height is the merchant's and the width follows the artwork, so there
        are no intrinsic dimensions to hand it. `height` is a style because it
        is a runtime value, `w-auto` keeps the proportions, and the box is sized
        before the image arrives so a late logo shifts nothing.
      */
      // eslint-disable-next-line @next/next/no-img-element -- merchant-supplied host, not in next.config's allow-list
      <img
        src={brand.src}
        alt={brand.alt}
        style={{ height: brand.height }}
        className="mx-auto w-auto max-w-full object-contain"
      />
    );
  }

  /*
   * A <p>, not a heading. The campaign's headline is this page's <h1> and it
   * must stay that — a shop name promoted above it would outrank the one line
   * the ad was bought to deliver.
   */
  return (
    <p className="text-2xl font-bold tracking-tight text-lp-text sm:text-3xl">
      {settings.storeName}
      {settings.siteNameAccent && (
        <span className="ml-2 text-lp-accent">{settings.siteNameAccent}</span>
      )}
    </p>
  );
}
