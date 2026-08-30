/**
 * Banner types mirroring the backend's public `GET /banners` endpoint.
 */

/** Where on the storefront a banner is meant to render. */
export type BannerPlacement =
  | "HERO_SLIDER"
  | "HERO_SIDE"
  | "HERO_PROMO"
  | (string & {});

/**
 * A banner exactly as `GET /banners` returns it.
 *
 * The `resolved*` fields are the backend's merge of the banner's own values with
 * the linked product's — when a banner points at a product, the product wins.
 * Prefer those over the raw `price` / `discountPrice` / `link`.
 */
export interface ApiBanner {
  id: string;
  type: string;
  placement: BannerPlacement;
  image: string;
  mobileImage: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  price: string | number | null;
  discountPrice: string | number | null;
  buttonText: string | null;
  bgColor: string | null;
  textColor: string | null;
  link: string | null;
  productId: string | null;
  status: string;
  sortOrder: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
  product: { slug?: string } | null;
  resolvedPrice: string | number | null;
  resolvedDiscountPrice: string | number | null;
  resolvedLink: string | null;
}

/**
 * The trimmed shape the hero renders. The API returns ~24 fields per banner and
 * the hero uses five; mapping down keeps the RSC payload small, the same way
 * `CategoryNode` does for the navigation.
 */
export interface Banner {
  id: string;
  image: string;
  /** `mobileImage` when the merchant supplied one, else null — not `image`. */
  mobileImage: string | null;
  /** Empty string when the merchant left the title blank; used as alt text. */
  title: string;
  /** Always a usable href — falls back to the product page, then to `#`. */
  href: string;
  sortOrder: number;
}
