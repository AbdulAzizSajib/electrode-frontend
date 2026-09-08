import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/components/product/ProductDetail";
import RecordProductView from "@/components/product/RecordProductView";
import { getCurrentUser } from "@/services/auth";
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
  const product = await getProductBySlug(handle);

  if (!product) notFound();

  // Both are independent of each other and of the product body, so they run
  // together rather than serially. The related endpoint scores candidates and
  // backfills server-side, which is what the old category re-query plus
  // whole-catalog fallback was approximating by hand.
  const [related, reviews, user, settings] = await Promise.all([
    getRelatedProducts(handle, 6),
    getProductReviews(product.id),
    // The session lives in httpOnly cookies, so whether to offer the review
    // form has to be decided here and handed down — a client component cannot
    // read it.
    getCurrentUser(),
    // Cached and already fetched by the layout, so this is a cache read rather
    // than a second round trip. Needed for the structured data below.
    getStoreSettings(),
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
