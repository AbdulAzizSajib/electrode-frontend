import type { ApiProduct, ApiProductVariant } from "@/types/product";

/**
 * Cart types mirroring the backend's cart endpoints
 * (electrode-server: src/app/module/cart).
 *
 * Cart responses carry no line total and no subtotal — those are still derived
 * on this side. They DO carry one price per line: `effectiveUnitPrice`, what
 * that unit will actually be charged.
 *
 * That field exists because deriving the price here from `offerPrice` was
 * wrong the moment campaigns could discount a product: the cart quoted a
 * subtotal the order then undercut. The charged figure is resolved server side
 * by `CampaignService`, so it is read, never recomputed.
 */

export interface ApiCartItem {
  id: string;
  cartId: string;
  productId: string;
  /** null when the product was added without a variant selection. */
  variantId: string | null;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: ApiProduct;
  variant: ApiProductVariant | null;
  /**
   * What this unit is charged — the variant's price (or the product's), less
   * any active campaign discount. Always present; prefer it over reaching into
   * `product`/`variant` for a price.
   */
  effectiveUnitPrice: number;
  /**
   * Set only while a campaign is cutting this line's price, so the cart can
   * strike through the undiscounted figure. Null means no campaign applies.
   */
  campaignUnitPrice: number | null;
}

export interface ApiCart {
  id: string;
  /** null for a guest cart, which is identified by `guestToken` instead. */
  customerId: string | null;
  guestToken: string | null;
  createdAt: string;
  updatedAt: string;
  items: ApiCartItem[];
  /** Populated only while a coupon is applied; null otherwise. */
  discount: CartDiscount | null;
}

export interface CartDiscount {
  code: string;
  amount: string;
}

/** A cart line with its money resolved — what the cart UI renders. */
export interface CartLine {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  name: string;
  slug: string;
  /** Variant name (e.g. "Pro Edition") when the line has one. */
  variantName?: string;
  image: string;
  /** What this unit is charged, campaign discount included. */
  unitPrice: number;
  /**
   * The undiscounted price to strike through, set only when a campaign is
   * cutting this line. Undefined means `unitPrice` is the only price to show.
   */
  compareAtPrice?: number;
  lineTotal: number;
  stockQuantity: number;
}

/** The derived view of a cart: lines plus computed totals. */
export interface CartSummary {
  id: string | null;
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  discountCode?: string;
  discountAmount: number;
  /** subtotal minus discount. Tax and shipping are applied at checkout. */
  total: number;
}

export interface AddCartItemPayload {
  productId: string;
  variantId?: string;
  quantity?: number;
}
