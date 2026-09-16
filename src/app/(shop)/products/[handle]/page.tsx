import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/components/product/ProductDetail";
import RecordProductView from "@/components/product/RecordProductView";
import { getCurrentUser } from "@/lib/current-user";
import { getProductBySlug, getRelatedProducts } from "@/services/product";
import { getProductReviews } from "@/services/review";
import { getStoreSettings } from "@/services/store-settings";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";
import { buildBreadcrumbSchema, buildProductSchema } from "@/lib/seo/schema-builders";
import JsonLd from "@/components/seo/json-ld";

// No `generateStaticParams`: the catalog is API-backed now, and pre-rendering it
// at build time would serve prices that are stale the moment a merchant edits one.

export async function generateMetadata({
  params,
}: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(handle),
    getStoreSettings(),
  ]);

  /*
   * `seoTitle`/`seoDescription` are the columns the product form and the SEO
   * menu both write. They existed in the database and were returned by the API
   * long before anything rendered them — this page hardcoded "– Electrode"
   * instead, a brand the seeded store does not even have.
   *
   * A missing product still resolves rather than throwing: the page 404s just
   * below, and metadata is generated before that runs.
   */
  return resolveMetadata({
    settings,
    routeGroup: "product",
    path: `/products/${handle}`,
    record: product
      ? {
          metaTitle: product.seoTitle,
          metaDescription: product.seoDescription,
          title: product.name,
          description: product.shortDescription ?? product.description,
          image: product.image,
        }
      : undefined,
    fallbackTitle: product ? undefined : "Product not found",
  });
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[handle]">) {
  const { handle } = await params;

  /*
   * Everything that does not need the product body is STARTED before the
   * product is awaited, not after. Only the reviews need `product.id`; the
   * related endpoint takes the slug, and the session and settings take nothing.
   * Awaiting the product first made every one of them wait out its round trip
   * for no reason.
   *
   * The related endpoint scores candidates and backfills server-side, which is
   * what the old category re-query plus whole-catalog fallback was
   * approximating by hand. The session lives in httpOnly cookies, so whether to
   * offer the review form has to be decided here and handed down — a client
   * component cannot read it. Settings (for the structured data below) and the
   * session are both shared with the layout through React `cache`.
   *
   * The `.catch` on each is not error handling — `Promise.all` below still sees
   * every rejection. It only marks the promises handled, so `notFound()` throwing
   * while they are still in flight cannot surface one as an unhandled rejection.
   */
  const relatedPromise = getRelatedProducts(handle, 6);
  const userPromise = getCurrentUser();
  const settingsPromise = getStoreSettings();
  for (const pending of [relatedPromise, userPromise, settingsPromise]) {
    pending.catch(() => {});
  }

  const product = await getProductBySlug(handle);

  if (!product) notFound();

  const [related, reviews, user, settings] = await Promise.all([
    relatedPromise,
    getProductReviews(product.id),
    userPromise,
    settingsPromise,
  ]);

  return (
    <>
      {/* The product and its trail. Both render nothing when the merchant has
          the corresponding toggle off. */}
      <JsonLd data={buildProductSchema(settings, product)} />
      <JsonLd
        data={buildBreadcrumbSchema(settings, [
          { name: "Products", path: "/products" },
          { name: product.name, path: `/products/${product.slug}` },
        ])}
      />
      {/* Renders nothing; exists to record that this page was opened. Mounted
          here rather than inside ProductDetail so it is unmistakably tied to
          the detail route and cannot be dragged into a listing or preview. */}
      <RecordProductView productId={product.id} />
      <ProductDetail
        product={product}
      related={related}
        initialReviews={reviews.reviews}
        initialBreakdown={reviews.breakdown}
        initialReviewMeta={reviews.meta}
        reviewsUnavailable={reviews.failed}
        isSignedIn={Boolean(user)}
      />
    </>
  );
}
