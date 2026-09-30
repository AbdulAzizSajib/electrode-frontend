import RichText from "@/components/product/RichText";
import FacebookPixel from "@/components/landing/FacebookPixel";
import LandingBand from "@/components/landing/LandingBand";
import LandingBrand from "@/components/landing/LandingBrand";
import LandingCountdown from "@/components/landing/LandingCountdown";
import LandingGallery from "@/components/landing/LandingGallery";
import LandingScarcity from "@/components/landing/LandingScarcity";
import LandingOrderForm from "@/components/landing/LandingOrderForm";
import LandingStickyCta from "@/components/landing/LandingStickyCta";
import LandingOrderCta from "@/components/landing/LandingOrderCta";
import {
  LandingFaqs,
  LandingHighlights,
  LandingQuotes,
  LandingTrustBadges,
  LandingUsageIdeas,
  LandingWhyUs,
} from "@/components/landing/LandingSections";
import LandingCustomSection from "@/components/landing/LandingCustomSection";
import { discountPercent, galleryOf } from "@/lib/landing-page-content";
import {
  landingSectionHasContent,
  landingSectionSurfaces,
  resolveLandingSections,
} from "@/lib/landing-sections";
import { resolveLandingPixelId } from "@/lib/facebook-pixel";
import type { BrandSettings } from "@/lib/brand-slot";
import { formatPrice } from "@/lib/format";
import { isBlankHtml } from "@/lib/sanitize-html";
import type { LandingPage } from "@/types/landing-page";
import type { FacebookPixel as FacebookPixelSettings } from "@/types/store-settings";

/**
 * The campaign page itself: hero and order form together, then everything that
 * argues for the purchase, then the form again within reach.
 *
 * THE ORDER IS THE MERCHANT'S, NOT THIS FILE'S. It used to be a fixed sequence
 * written out in JSX here, which meant "should the reviews come before the
 * benefits" was a code change and therefore never happened. The sections below
 * the hero are now a fold over `resolveLandingSections(page.sectionConfig)`,
 * and the stored order decides both what renders and in what sequence.
 *
 * A NULL `sectionConfig` MEANS "NEVER CONFIGURED" and resolves to the default
 * order — the same eleven bands this file used to spell out. Every campaign
 * created before the section editor existed is in exactly that state, so they
 * render unchanged by construction rather than by a migration. Null is not an
 * error and must never be treated as one: resolving it to an empty list would
 * blank every existing campaign the day it deployed.
 *
 * THE PRODUCT AND THE ORDER FORM ARE TWO SECTIONS, and both are in the fold.
 * They were one — a HERO block rendering the gallery beside the form, drawn
 * above the loop and unreorderable — which meant the page could not express
 * the one arrangement campaign pages most often want: the form first, for
 * traffic that already knows from the ad what it is buying. Splitting them
 * makes that a drag in the section editor rather than a code change.
 *
 * WHAT REPLACES THE OLD LOCK. Neither may be removed, and the loop no longer
 * guarantees that by construction, so three things do: the backend refuses to
 * store an order missing either, the resolver puts a missing one back at its
 * default position, and the admin offers no switch for them. A campaign with
 * nothing to buy is a paid click that buys nothing, and the ads keep running
 * either way.
 *
 * EACH SECTION IS ONE CENTRED COLUMN. The hero was two — media left, copy and
 * form right — which put the headline the ad had just promised in the right
 * half of a desktop screen while the left half carried a picture of something
 * the visitor could not yet name. A campaign page is read in one direction,
 * and that direction is the order the sale is argued in: whose shop this is,
 * what is on offer, what it looks like, then what it costs and the form.
 *
 * THE BRAND IS THE ONE THING ABOVE THE LOOP. It is not a section — a merchant
 * cannot drag their own logo below the FAQ — and it is not chrome either; see
 * `LandingBrand`.
 *
 * WHICH SURFACE EACH BAND TAKES IS COMPUTED, not fixed per section, because a
 * fixed assignment cannot know what now sits next to what. See
 * `landingSectionSurfaces`.
 *
 * What has NOT changed is why the default order is what it is: a visitor
 * arriving from an ad has already decided they are interested, so the form is
 * part of the hero and the ones who are ready never reach a section to buy;
 * the highlights, quotes and FAQ below are for the ones who are not; and the
 * sticky button carries the undecided back up.
 *
 * A server component. Only the gallery, the order form and the sticky button
 * are interactive, and each is its own client island, so the page's text and
 * images paint without waiting on hydration — which on ad traffic is often the
 * only paint that happens.
 *
 * See server/openspec/changes/add-landing-page-section-builder.
 */
export default function LandingPageView({
  page,
  currency,
  brand,
  shopPixel,
  trackingDisabled = false,
}: {
  page: LandingPage;
  /** The shop's currency code, for the pixel's purchase event. */
  currency: string;
  /**
   * Enough of the store settings to draw the logo or the wordmark at the top
   * of the page.
   *
   * Both routes already fetch the settings row for the currency and the
   * shop-wide pixel, so the brand costs no extra request. See
   * `LandingBrand` for why a campaign page carries this one piece of chrome
   * and none of the rest.
   */
  brand: BrandSettings;
  /**
   * The shop-wide pixel, used only when this campaign has none of its own.
   *
   * A campaign that set its own id keeps it — moving those conversions into the
   * shop-wide pixel would silently misattribute the traffic the merchant is
   * paying for. See `lib/facebook-pixel.ts`.
   */
  shopPixel?: FacebookPixelSettings | null;
  /**
   * Suppresses the pixel entirely, for the merchant's own preview.
   *
   * A preview is not traffic. Firing the pixel there records the merchant's
   * every look at their own draft as a campaign visit, which inflates exactly
   * the numbers they are about to judge the campaign by — and it happens most
   * while they are iterating on the page, so the noise is worst before the ad
   * has even run. Defaults to false so the public route is unchanged.
   */
  trackingDisabled?: boolean;
}) {
  const { productSnapshot: product } = page;

  /*
   * Resolved ONCE, here, and passed to both the script and the order form. If
   * each decided for itself, a page could render one pixel and report its
   * purchase to another.
   *
   * Null on a preview, which is what both suppresses the bootstrap script below
   * and stops the order form reporting a purchase — one decision, so the two
   * cannot disagree.
   */
  const pixelId = trackingDisabled
    ? null
    : resolveLandingPixelId(page.facebookPixelId, shopPixel);
  const gallery = galleryOf(page);
  const discount = discountPercent(product.unitPrice, product.sellingPrice);

  /*
   * THE CAMPAIGN'S OWN LOOK, scoped to this page's wrapper.
   *
   * Written as CSS CUSTOM PROPERTIES rather than as class names, so every
   * `text-lp-text` and `bg-lp-surface` below resolves to the campaign's own
   * colour without any component knowing a campaign can be themed. Tailwind
   * cannot see a class name built at runtime, so the alternative — `bg-${token}`
   * — would produce no CSS at all.
   *
   * ONLY WHAT THE MERCHANT SET is written here. An unset token is simply absent
   * from the style attribute, so the default in globals.css applies — which is
   * what makes a page that sets nothing identical to one written before tokens
   * existed, by construction rather than by a default table kept in step here.
   *
   * Every value is a strict hex validated server-side: it reaches an inline
   * `style` attribute, so anything that could carry further declarations is
   * refused before it is stored.
   *
   * Scoped to this element and not `<html>`: the storefront's own chrome must
   * be untouched, and `(landing)` has no chrome of its own, which is what makes
   * a per-page theme safe at all.
   *
   * See server/openspec/changes/add-landing-page-theme-tokens, design.md D1.
   */
  const theme = page.theme;
  const themeStyle = theme
    ? (Object.fromEntries(
        (
          [
            ["--lp-accent", theme.accent],
            ["--lp-accent-soft", theme.accentSoft],
            ["--lp-accent-contrast", theme.accentContrast],
            ["--lp-surface", theme.surface],
            ["--lp-surface-alt", theme.surfaceAlt],
            ["--lp-text", theme.text],
            ["--lp-muted", theme.textMuted],
            ["--lp-border", theme.border],
          ] as const
        ).filter(([, value]) => Boolean(value)),
      ) as React.CSSProperties)
    : undefined;

  /*
   * WHAT THIS PAGE RENDERS, AND IN WHAT ORDER.
   *
   * `sectionConfig` is NULL on every campaign created before the section editor
   * existed, and that resolves to the default order — the same sequence this
   * file used to spell out in JSX. So an existing page is unaffected by
   * construction rather than by a migration.
   *
   * HERO AND ORDER_FORM ARE IN THIS LIST, unlike every earlier version of this
   * file, where the hero was drawn above the loop so that no stored order could
   * remove it. They are reorderable now — that is the point of splitting them —
   * so the guarantee moved rather than went away: `resolveLandingSections`
   * restores either one a stored order has lost, and the backend refuses to
   * store an order without them in the first place.
   *
   * Sections with nothing to show are filtered out HERE rather than inside each
   * branch, so the surface alternation below is computed over what actually
   * renders. Computing it over the unfiltered list would leave a gap wherever a
   * section was empty, putting two identical surfaces side by side.
   */
  const sections = resolveLandingSections(page.sectionConfig).filter(
    (section) =>
      landingSectionHasContent(section, page) &&
      // BODY defers its blank test to the caller, which holds the sanitiser.
      (section.key !== "BODY" || !isBlankHtml(page.bodyHtml)),
  );

  /*
   * The background each band renders on, derived from POSITION rather than
   * fixed per section.
   *
   * With a hardcoded order, a literal surface per band worked because the
   * author could see the whole sequence. Once the merchant controls the order,
   * any fixed assignment produces two identical adjacent bands the moment they
   * reorder — the "one long column in one colour" that
   * add-landing-page-theme-tokens set out to remove.
   *
   * This also corrects a flaw in the old fixed assignment, where HERO and
   * HIGHLIGHTS were both `surface` and sat adjacent once the accent band
   * between them is discounted.
   */
  const surfaces = landingSectionSurfaces(sections);

  return (
    <div className="bg-lp-surface pb-24 md:pb-0" style={themeStyle}>
      {pixelId && <FacebookPixel pixelId={pixelId} />}

      {/*
        FULL-WIDTH BANDS, not one wrapper.

        Every section used to sit inside a single `max-w-5xl` container, so none
        of them could carry a background and the page read as one long column in
        one colour. Each is now its own band: the background spans the viewport,
        the content stays at a readable measure inside.

        THE ALTERNATION IS STILL DECIDED OUTSIDE THE BAND — a band cannot see
        what precedes it, so it cannot decide whether to differ from it — but it
        is now COMPUTED from the resolved order rather than written per band.
        See `landingSectionSurfaces`. Each band still names a surface and never
        a colour, so recolouring the page moves every band using it at once.
      */}
      {/*
        THE BRAND, ABOVE EVERYTHING AND OUTSIDE THE ORDER.

        NOT A BAND: it takes the page's own surface and only a top padding, so
        it reads as the top edge of whatever section follows rather than as a
        strip of its own. That is also why it is not counted in the surface
        alternation — it has no background to differ from.

        NOT A SECTION either. Every other block on this page is the merchant's
        to move or switch off; their own logo below the FAQ is not an
        arrangement worth being able to express.
      */}
      <div className="bg-lp-surface">
        <div className="container-px mx-auto max-w-5xl pt-6 text-center">
          <LandingBrand settings={brand} />
        </div>
      </div>

      {/*
        EVERY SECTION BELOW THE HERO, IN THE MERCHANT'S OWN ORDER.

        This was eleven bands written out in a fixed sequence. It is now a fold
        over the resolved order, which is what lets a merchant move the reviews
        above the benefits, or switch the FAQ off, without a code change.

        A section renders only when it has something to show. That is TWO
        separate questions and both must be yes: `landingSectionHasContent`
        asks whether this page holds anything for it, and the resolver has
        already dropped the ones the merchant switched off. An empty section
        and a disabled one look the same here and are different states in the
        data — which is the whole point of the enabled flag.
      */}
      {sections.map((section, index) => {
        const surface = surfaces[index] ?? "surface";

        switch (section.key) {
          case "HERO":
            /*
              WHAT IS BEING SOLD: the headline the ad promised, the picture, the
              price and the badges that make the price believable.

              THE PICTURE COMES AFTER THE WORDS. It is the claim's evidence, not
              its opening: a photograph answers "what does it look like", which
              is a question the visitor only has once the headline has told them
              what is being sold. Held to 32rem because it is a square — at the
              full column it would be most of a laptop screen of product shot,
              pushing the price below a scroll of picture.
            */
            return (
              <LandingBand key={section.id} surface={surface}>
                <div className="mx-auto max-w-3xl text-center">
                  {page.badgeText && (
                    <span className="inline-block rounded-full bg-sale/10 px-3 py-1 text-xs font-semibold text-sale">
                      {page.badgeText}
                    </span>
                  )}

                  <h1 className="mt-3 text-3xl font-bold leading-snug text-lp-text md:text-3xl">
                    {page.headline}
                  </h1>

                  {page.subheadline && (
                    <p className="mt-2 text-base leading-relaxed text-lp-muted">
                      {page.subheadline}
                    </p>
                  )}
                </div>

                {gallery.length > 0 && (
                  <div className="mx-auto mt-8 max-w-lg">
                    <LandingGallery items={gallery} productName={product.name} />
                  </div>
                )}

                <div className="mx-auto mt-8 max-w-2xl">
                  {/*
                    The price pair. A package's own price when one is selected —
                    `productSnapshot` is resolved for it server-side.
                  */}
                  <div className="flex flex-wrap items-baseline justify-center gap-3">
                    <span className="text-3xl font-bold text-lp-text">
                      {formatPrice(product.unitPrice)}
                    </span>
                    {product.sellingPrice !== null &&
                      product.sellingPrice > product.unitPrice && (
                        <span className="text-lg text-lp-muted line-through">
                          {formatPrice(product.sellingPrice)}
                        </span>
                      )}
                    {discount !== null && (
                      <span className="rounded bg-sale/10 px-2 py-0.5 text-sm font-semibold text-sale">
                        {/*
                          Bengali-Indic digits, like every other figure on the
                          page. This one is COMPUTED, so it used to render as ASCII "35%"
                          directly beside a merchant-typed badge reading "৩০% ছাড়" —
                          two scripts in one line, which reads as a rendering
                          fault rather than as two numbers. `LandingWhyUs` and
                          `LandingScarcity` already localise theirs the same way.
                        */}
                        {discount.toLocaleString("bn-BD")}% ছাড়
                      </span>
                    )}
                    {product.unit && (
                      <span className="text-sm text-lp-muted">/ {product.unit}</span>
                    )}
                  </div>

                  <LandingTrustBadges items={page.trustBadges} className="justify-center" />
                </div>
              </LandingBand>
            );

          case "ORDER_FORM":
            /*
              THE FORM, AND NOTHING ELSE IN THE BAND. It is the only thing on
              this page a visitor does rather than reads, and every call-to-action
              strip down the page is an anchor to the `#order-form` id inside it.

              At a form's measure rather than the heading's, and left-aligned:
              centred labels over left-aligned inputs is the one layout a
              multi-field form is measurably worse for.
            */
            return (
              <LandingBand key={section.id} surface={surface}>
                <div className="mx-auto max-w-2xl">
                  <LandingOrderForm page={page} currency={currency} pixelId={pixelId} />
                </div>
              </LandingBand>
            );

          case "OFFER":
            /*
              Both halves answer "why now", which is the question a shopper has
              immediately after "what is it". Rendered only when the merchant
              configured at least one, so a page without urgency has no empty
              coloured strip.
            */
            return (
              <LandingBand
                key={section.id}
                surface={surface}
                className="flex flex-col gap-4"
              >
                {page.offerEndsAt && <LandingCountdown endsAt={page.offerEndsAt} />}
                <LandingScarcity scarcity={page.scarcity} />
              </LandingBand>
            );

          case "HIGHLIGHTS":
            return (
              <LandingBand key={section.id} surface={surface} width="wide">
                <LandingHighlights items={page.highlights} />
              </LandingBand>
            );

          case "WHY_US":
            return (
              <LandingBand key={section.id} surface={surface} width="wide">
                <LandingWhyUs items={page.whyUs} />
              </LandingBand>
            );

          case "BODY":
            /*
              Merchant-authored HTML, sanitised where it meets the browser — the
              posture Page.body and Product.description already take.
            */
            return (
              <LandingBand key={section.id} surface={surface}>
                <RichText
                  html={page.bodyHtml}
                  className="text-base [&_p]:my-4 [&_li]:my-1.5"
                  themed
                />
              </LandingBand>
            );

          case "USAGE_IDEAS":
            return (
              <LandingBand key={section.id} surface={surface} width="wide">
                <LandingUsageIdeas items={page.usageIdeas} />
              </LandingBand>
            );

          case "QUOTES":
            return (
              <LandingBand key={section.id} surface={surface} width="wide">
                <LandingQuotes items={page.quotes} />
              </LandingBand>
            );

          case "FAQS":
            return (
              <LandingBand key={section.id} surface={surface}>
                <LandingFaqs items={page.faqs} />
              </LandingBand>
            );

          case "CTA":
            /*
              REPEATED DOWN THE PAGE, pointing at the SAME form. The moment a
              shopper is convinced is not predictable — it may be the price, the
              guarantee, the reviews, or a usage idea — and a single button at
              the bottom asks them to remember they were convinced and scroll to
              act on it.
            */
            return (
              <LandingBand key={section.id} surface={surface}>
                <LandingOrderCta
                  label={page.orderForm.submitLabel}
                  phone={page.orderPhone}
                  className=""
                />
              </LandingBand>
            );

          case "CUSTOM":
            return (
              <LandingBand key={section.id} surface={surface}>
                <LandingCustomSection section={section} />
              </LandingBand>
            );

          default:
            /*
              A key this build does not have — the resolver drops those, so this
              is unreachable rather than a fallback. Returning null keeps the
              switch total instead of relying on that.
            */
            return null;
        }
      })}
      {/*
        The sticky bar states the DEFAULT package's price — the same one the
        page opens showing, because `productSnapshot` is already resolved for
        it server-side.

        It does not follow a later selection, and that is a deliberate limit
        rather than an oversight: the selector lives inside the order form's
        client island, and lifting its state up to here would make the whole
        page a client component to keep one number in sync. The bar exists to
        carry an undecided reader BACK to the form, where the live figure is; a
        shopper who has already chosen a tier is by definition looking at the
        form rather than at this bar.
      */}
      {product.isOrderable && (
        <LandingStickyCta
          label={page.orderForm.submitLabel}
          price={formatPrice(product.unitPrice)}
        />
      )}
    </div>
  );
}
