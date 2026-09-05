import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/components/product/ProductDetail";
import RecordProductView from "@/components/product/RecordProductView";
import { getCurrentUser } from "@/services/auth";
import { getProductBySlug, getRelatedProducts } from "@/services/product";
import { getProductReviews } from "@/services/review";

// No `generateStaticParams`: the catalog is API-backed now, and pre-rendering it
// at build time would serve prices that are stale the moment a merchant edits one.

export async function generateMetadata({
  params,
}: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductBySlug(handle);

  return {
    title: product ? `${product.name} – Electrode` : "Product not found – Electrode",
  };
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
  const [related, reviews, user] = await Promise.all([
    getRelatedProducts(handle, 6),
    getProductReviews(product.id),
    // The session lives in httpOnly cookies, so whether to offer the review
    // form has to be decided here and handed down — a client component cannot
    // read it.
    getCurrentUser(),
  ]);

  return (
    <>
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
