import RichText from "@/components/product/RichText";
import FacebookPixel from "@/components/landing/FacebookPixel";
import LandingGallery from "@/components/landing/LandingGallery";
import LandingOrderForm from "@/components/landing/LandingOrderForm";
import LandingStickyCta from "@/components/landing/LandingStickyCta";
import {
  LandingFaqs,
  LandingHighlights,
  LandingQuotes,
  LandingTrustBadges,
} from "@/components/landing/LandingSections";
import { discountPercent, galleryOf } from "@/lib/landing-page-content";
import { formatPrice } from "@/lib/format";
import { isBlankHtml } from "@/lib/sanitize-html";
import type { LandingPage } from "@/types/landing-page";

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
}: {
  page: LandingPage;
  /** The shop's currency code, for the pixel's purchase event. */
  currency: string;
}) {
  const { productSnapshot: product } = page;
  const gallery = galleryOf(page);
  const discount = discountPercent(product.unitPrice, product.compareAtPrice);

  return (
    <div className="bg-white pb-24 md:pb-0">
      {page.facebookPixelId && <FacebookPixel pixelId={page.facebookPixelId} />}

      <div className="container-px mx-auto max-w-5xl py-6 md:py-10">
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

            <h1 className="mt-3 text-2xl font-bold leading-snug text-gray-900 md:text-3xl">
              {page.headline}
            </h1>

            {page.subheadline && (
              <p className="mt-2 text-base leading-relaxed text-gray-600">
                {page.subheadline}
              </p>
            )}

            {/*
              The product's price and compare-at price — a landing page cannot
              author a price of its own, so "regular vs offer" is whatever the
              merchant set on the product. See LandingPage.prisma.
            */}
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.unitPrice)}
              </span>
              {product.compareAtPrice !== null && product.compareAtPrice > product.unitPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {discount !== null && (
                <span className="rounded bg-sale/10 px-2 py-0.5 text-sm font-semibold text-sale">
                  {discount}% ছাড়
                </span>
              )}
              {product.unit && (
                <span className="text-sm text-gray-500">/ {product.unit}</span>
              )}
            </div>

            <LandingTrustBadges items={page.trustBadges} />

            <div className="mt-6">
              <LandingOrderForm page={page} currency={currency} />
            </div>
          </div>
        </div>

        <LandingHighlights items={page.highlights} />

        {/*
          Merchant-authored HTML, sanitised where it meets the browser — the
          posture Page.body and Product.description already take. Omitted
          entirely when the body is blank rather than rendering an empty gap.
        */}
        {!isBlankHtml(page.bodyHtml) && (
          <section className="mt-12">
            <RichText
              html={page.bodyHtml}
              className="text-base [&_p]:my-4 [&_li]:my-1.5"
            />
          </section>
        )}

        <LandingQuotes items={page.quotes} />
        <LandingFaqs items={page.faqs} />
      </div>

      {product.isOrderable && (
        <LandingStickyCta
          label={page.orderForm.submitLabel}
          price={formatPrice(product.unitPrice)}
        />
      )}
    </div>
  );
}
