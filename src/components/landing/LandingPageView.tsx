import RichText from "@/components/product/RichText";
import FacebookPixel from "@/components/landing/FacebookPixel";
import LandingBand from "@/components/landing/LandingBand";
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
import { discountPercent, galleryOf } from "@/lib/landing-page-content";
import { resolveLandingPixelId } from "@/lib/facebook-pixel";
import { formatPrice } from "@/lib/format";
import { isBlankHtml } from "@/lib/sanitize-html";
import type { LandingPage } from "@/types/landing-page";
import type { FacebookPixel as FacebookPixelSettings } from "@/types/store-settings";

/**
 * The campaign page itself: hero and order form together, then everything that
 * argues for the purchase, then the form again within reach.
 *
 * The order is deliberate. A visitor arriving from an ad has already decided
 * they are interested — the form is beside the hero so the ones who are ready
 * never have to scroll to buy, and the highlights, quotes and FAQ below are for
 * the ones who are not. The sticky button carries the undecided back up.
 *
 * A server component. Only the gallery, the order form and the sticky button
 * are interactive, and each is its own client island, so the page's text and
 * images paint without waiting on hydration — which on ad traffic is often the
 * only paint that happens.
 */
export default function LandingPageView({
  page,
  currency,
  shopPixel,
  trackingDisabled = false,
}: {
  page: LandingPage;
  /** The shop's currency code, for the pixel's purchase event. */
  currency: string;
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

  return (
    <div className="bg-lp-surface pb-24 md:pb-0" style={themeStyle}>
      {pixelId && <FacebookPixel pixelId={pixelId} />}

      {/*
        FULL-WIDTH BANDS, not one wrapper.

        Every section used to sit inside a single `max-w-5xl` container, so none
        of them could carry a background and the page read as one long column in
        one colour. Each is now its own band: the background spans the viewport,
        the content stays at a readable measure inside.

        THE ALTERNATION IS DECIDED HERE, where the section order already lives —
        a band cannot see what precedes it, so it cannot decide whether to
        differ from it. Each names a surface, never a colour, so recolouring the
        page moves every band using that surface at once.
      */}
      <LandingBand surface="surface">
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <div>
            {gallery.length > 0 && (
              <LandingGallery items={gallery} productName={product.name} />
            )}
          </div>

          <div>
            {page.badgeText && (
              <span className="inline-block rounded-full bg-sale/10 px-3 py-1 text-xs font-semibold text-sale">
                {page.badgeText}
              </span>
            )}

            <h1 className="mt-3 text-2xl font-bold leading-snug text-lp-text md:text-3xl">
              {page.headline}
            </h1>

            {page.subheadline && (
              <p className="mt-2 text-base leading-relaxed text-lp-muted">
                {page.subheadline}
              </p>
            )}

            {/*
              The price pair. A package's own price when one is selected —
              `productSnapshot` is resolved for it server-side.
            */}
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-lp-text">
                {formatPrice(product.unitPrice)}
              </span>
              {product.sellingPrice !== null && product.sellingPrice > product.unitPrice && (
                <span className="text-lg text-lp-muted line-through">
                  {formatPrice(product.sellingPrice)}
                </span>
              )}
              {discount !== null && (
                <span className="rounded bg-sale/10 px-2 py-0.5 text-sm font-semibold text-sale">
                  {discount}% ছাড়
                </span>
              )}
              {product.unit && (
                <span className="text-sm text-lp-muted">/ {product.unit}</span>
              )}
            </div>

            <LandingTrustBadges items={page.trustBadges} />

            <div className="mt-6">
              <LandingOrderForm page={page} currency={currency} pixelId={pixelId} />
            </div>
          </div>
        </div>
      </LandingBand>

      {/*
        THE OFFER BAND, on the accent wash — the one place the page raises its
        voice. Both halves answer "why now", which is the question a shopper has
        immediately after "what is it". Rendered only when the merchant
        configured at least one of them, so a page without urgency has no empty
        coloured strip.
      */}
      {(page.offerEndsAt || page.scarcity) && (
        <LandingBand surface="accentSoft" className="flex flex-col gap-4">
          {page.offerEndsAt && <LandingCountdown endsAt={page.offerEndsAt} />}
          <LandingScarcity scarcity={page.scarcity} />
        </LandingBand>
      )}

      {page.highlights?.length ? (
        <LandingBand surface="surface">
          <LandingHighlights items={page.highlights} />
        </LandingBand>
      ) : null}

      {/* The first repeat, for the shopper convinced by the benefits alone. */}
      {product.isOrderable && (
        <LandingBand surface="accentSoft">
          <LandingOrderCta
            label={page.orderForm.submitLabel}
            phone={page.orderPhone}
            className=""
          />
        </LandingBand>
      )}

      {page.whyUs?.length ? (
        <LandingBand surface="surfaceAlt">
          <LandingWhyUs items={page.whyUs} />
        </LandingBand>
      ) : null}

      {/*
        Merchant-authored HTML, sanitised where it meets the browser — the
        posture Page.body and Product.description already take. Omitted
        entirely when the body is blank rather than rendering an empty band.
      */}
      {!isBlankHtml(page.bodyHtml) && (
        <LandingBand surface="surface">
          <RichText html={page.bodyHtml} className="text-base [&_p]:my-4 [&_li]:my-1.5" />
        </LandingBand>
      )}

      {page.usageIdeas?.length ? (
        <LandingBand surface="surfaceAlt">
          <LandingUsageIdeas items={page.usageIdeas} />
        </LandingBand>
      ) : null}

      {/* The second repeat: after the usage ideas, which is where a shopper
          who needed to picture using it has just done so. */}
      {product.isOrderable && (
        <LandingBand surface="accentSoft">
          <LandingOrderCta
            label={page.orderForm.submitLabel}
            phone={page.orderPhone}
            className=""
          />
        </LandingBand>
      )}

      {page.quotes?.length ? (
        <LandingBand surface="surface">
          <LandingQuotes items={page.quotes} />
        </LandingBand>
      ) : null}

      {page.faqs?.length ? (
        <LandingBand surface="surfaceAlt">
          <LandingFaqs items={page.faqs} />
        </LandingBand>
      ) : null}

      {/* The last: after the FAQ has answered whatever was still holding
          them back. */}
      {product.isOrderable && (
        <LandingBand surface="accentSoft">
          <LandingOrderCta
            label={page.orderForm.submitLabel}
            phone={page.orderPhone}
            className=""
          />
        </LandingBand>
      )}

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
