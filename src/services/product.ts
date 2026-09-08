import { ApiError, apiFetch } from "@/lib/api-client";
import { placeholderImage } from "@/lib/placeholder";
import type {
  ApiProduct,
  ApiProductOption,
  ApiProductVariant,
  PaginationMeta,
  Product,
  ProductImage,
  ProductListResult,
  ProductOption,
  ProductQuery,
  ProductVariant,
} from "@/types/product";

/**
 * Catalog data changes more often than categories but is still far from
 * per-request volatile, so a short window collapses repeat traffic without
 * showing visibly stale prices.
 */
const PRODUCT_REVALIDATE_SECONDS = 60;

const EMPTY_META: PaginationMeta = { page: 1, limit: 0, total: 0, totalPages: 0 };

/**
 * Money arrives as a decimal string ("79.99"). Parse once here so no component
 * ever does arithmetic on a string. Returns undefined for null/empty/unparseable
 * so optional prices stay genuinely optional.
 */
function toPrice(value: string | null | undefined): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Primary image first, then the lowest-sorted one, then a placeholder.
 *
 * Keeps each image's `variantId` rather than flattening to urls — that is what
 * lets the gallery filter to the selected variant. The sort is unchanged, so a
 * product whose images carry no variant yields the same order as before.
 */
function pickImages(product: ApiProduct): { image: string; images: ProductImage[] } {
  const sorted = [...(product.images ?? [])].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder,
  );

  return {
    image: sorted[0]?.url ?? placeholderImage(product.slug, { label: product.name }),
    images: sorted.map((img) => ({
      url: img.url,
      // Older payloads (and the list projection) omit the field entirely;
      // treat a missing value as shared rather than as undefined.
      variantId: img.variantId ?? null,
      altText: img.altText ?? undefined,
    })),
  };
}

function toVariant(variant: ApiProductVariant): ProductVariant {
  return {
    id: variant.id,
    name: variant.name,
    sku: variant.sku,
    offerPrice: toPrice(variant.offerPrice) ?? 0,
    sellingPrice: toPrice(variant.sellingPrice),
    stockQuantity: variant.stockQuantity,
    attributes: variant.attributes ?? {},
    image: variant.image ?? undefined,
    inStock: variant.stockQuantity > 0,
    // Defaults to empty rather than undefined, so a storefront deployed ahead
    // of the backend renders every product through the no-options path instead
    // of crashing on a missing field.
    optionValueIds: (variant.optionValues ?? []).map((ov) => ov.valueId),
  };
}

/**
 * Maps an option and sorts its values by the merchant's authored `position`.
 *
 * Sorted here rather than trusted from the payload: the order is the whole
 * point (S -> M -> XL is not derivable from the labels), and a single mapper is
 * a cheaper guarantee than every consumer remembering.
 *
 * An unrecognised presentation becomes `LABEL`, so a presentation added to the
 * backend later cannot break a deployed storefront.
 */
function toOption(option: ApiProductOption): ProductOption {
  return {
    id: option.id,
    name: option.name,
    presentation: option.presentation === "SWATCH" ? "SWATCH" : "LABEL",
    values: [...option.values]
      .sort((a, b) => a.position - b.position)
      .map((value) => ({
        id: value.id,
        label: value.label,
        swatch: value.swatch ?? undefined,
      })),
  };
}

/** Maps the wire shape to the view model the UI renders. */
export function toProduct(product: ApiProduct): Product {
  const { image, images } = pickImages(product);
  const basePrice = toPrice(product.offerPrice) ?? 0;
  // An active campaign discounts the product; when present it *is* the price
  // the shopper pays, and the offer price becomes the struck-through comparison.
  const campaignPrice = toPrice(product.campaignPrice);
  const sellingPrice = toPrice(product.sellingPrice);

  const effectivePrice = campaignPrice ?? basePrice;
  const effectiveCompareAt = campaignPrice ? basePrice : sellingPrice;

  // A rating only exists once something has been rated. Gating on reviewCount
  // rather than on the parsed number keeps "unrated" distinct from "rated 0",
  // which is what stops an unrated product rendering an empty five-star row.
  const reviewCount = product.reviewCount ?? 0;
  const rating = reviewCount > 0 ? toPrice(product.averageRating) : undefined;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    description: product.description ?? undefined,
    shortDescription: product.shortDescription ?? undefined,
    seoTitle: product.seoTitle ?? undefined,
    seoDescription: product.seoDescription ?? undefined,
    type: product.type,
    isVariable: product.type === "VARIABLE",
    offerPrice: effectivePrice,
    // Only a comparison price *above* the current one represents a saving.
    sellingPrice:
      effectiveCompareAt !== undefined && effectiveCompareAt > effectivePrice
        ? effectiveCompareAt
        : undefined,
    image,
    images,
    brand: product.brand?.name,
    category: product.category?.name,
    categorySlug: product.category?.slug,
    stockQuantity: product.stockQuantity,
    inStock: product.stockQuantity > 0,
    isFeatured: product.isFeatured,
    variants: (product.variants ?? []).filter((v) => v.status).map(toVariant),
    options: [...(product.options ?? [])]
      .sort((a, b) => a.position - b.position)
      .map(toOption),
    attributes: (product.attributes ?? []).map((a) => ({
      name: a.name,
      value: a.value,
    })),

    // `?? undefined` and not `?? ""`: an absent fact must be absent, so the UI
    // can render nothing at all rather than an empty label. The two booleans
    // stay tri-state for the same reason — `null` becomes `undefined` ("not
    // stated"), never `false`.
    unit: product.unit || undefined,
    badge: product.badge || undefined,
    isRefundable: product.isRefundable ?? undefined,
    hasWarranty: product.hasWarranty ?? undefined,
    video: product.video ?? undefined,
    videoThumbnail: product.videoThumbnail ?? undefined,
    bundleDeal: product.bundleDeal
      ? {
          name: product.bundleDeal.name,
          buyQuantity: product.bundleDeal.buyQuantity,
          freeQuantity: product.bundleDeal.freeQuantity,
        }
      : undefined,
    collections: (product.collections ?? []).map((row) => row.collection),
    tags: (product.tags ?? []).map((row) => row.tag.name),

    rating,
    reviewCount,
    // Defaults to 0 so a storefront deployed ahead of the backend renders — and
    // 0 is what makes the page show no view line at all.
    viewCount: product.viewCount ?? 0,
  };
}

function buildQueryString(query: ProductQuery): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Paginated product listing. Returns an empty result rather than throwing so a
 * listing page can render its empty/unavailable state instead of erroring.
 */
export async function getProducts(
  query: ProductQuery = {},
): Promise<ProductListResult> {
  try {
    const response = await apiFetch<ApiProduct[]>(
      `/products${buildQueryString(query)}`,
      { revalidate: PRODUCT_REVALIDATE_SECONDS },
    );

    const data = Array.isArray(response.data) ? response.data : [];

    return {
      products: data.map(toProduct),
      meta: response.meta ?? { ...EMPTY_META, total: data.length },
    };
  } catch {
    return { products: [], meta: EMPTY_META };
  }
}

/**
 * The cheapest and dearest active product, for the listing's price slider.
 *
 * Derived from two one-item sorted listings rather than a dedicated aggregate
 * endpoint: `GET /products` already sorts by `offerPrice` server-side, so the
 * first row of each direction *is* the bound. Two `limit=1` requests cost less
 * than the one full page the listing fetches anyway, and they share its cache
 * window.
 *
 * Bounds must come from the whole catalog, not from the products on screen —
 * deriving them from the current page would make the slider's range shift every
 * time the shopper moved it, so the handle could never reach a price that
 * happens to fall on another page.
 *
 * Note this ignores campaign pricing, which is applied per-row after the query;
 * a discounted product can therefore sell below `min`. The slider is a coarse
 * budget control and the backend filters on the same `offerPrice` column, so the
 * bounds stay consistent with what the filter actually does.
 */
export async function getPriceBounds(): Promise<{ min: number; max: number }> {
  const query = { page: 1, limit: 1, sortBy: "offerPrice" as const };

  const [cheapest, dearest] = await Promise.all([
    getProducts({ ...query, sortOrder: "asc" }),
    getProducts({ ...query, sortOrder: "desc" }),
  ]);

  const min = cheapest.products[0]?.offerPrice;
  const max = dearest.products[0]?.offerPrice;

  // An empty catalog, or a failed fetch, yields a degenerate range. Report a
  // zero-width one rather than a made-up ceiling so the panel can hide the
  // slider instead of offering a filter over prices that do not exist.
  if (min === undefined || max === undefined) return { min: 0, max: 0 };

  // Floor/ceil to whole units: the handles step in whole currency units, so a
  // fractional bound would leave the extreme product unreachable by dragging.
  return { min: Math.floor(min), max: Math.ceil(max) };
}

/**
 * A single product with its variants and attributes. Returns null when the
 * product does not exist or is not active, so the page can call `notFound()`.
 * Other failures rethrow, so a backend outage surfaces as an error rather than
 * masquerading as a missing product.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await apiFetch<ApiProduct>(`/products/${slug}`, {
      revalidate: PRODUCT_REVALIDATE_SECONDS,
    });

    return data ? toProduct(data) : null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * Relevance-ranked "you may also like" for a product.
 *
 * The backend scores candidates (same category, same brand, shared tag, nearby
 * price) and backfills with featured/newest active products, so this never
 * needs the category re-query and whole-catalog fallback the page used to do
 * by hand. The response is the ordinary product shape, so `toProduct` applies
 * unchanged.
 *
 * Returns an empty array on failure: the product page has already rendered the
 * product itself by this point, so a failure here omits the section rather than
 * failing the page.
 */
export async function getRelatedProducts(
  slug: string,
  limit = 6,
): Promise<Product[]> {
  try {
    const { data } = await apiFetch<ApiProduct[]>(
      `/products/${slug}/related?limit=${limit}`,
      { revalidate: PRODUCT_REVALIDATE_SECONDS },
    );

    return Array.isArray(data) ? data.map(toProduct) : [];
  } catch {
    return [];
  }
}
