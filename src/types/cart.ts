import type { ApiProduct, ApiProductVariant } from "@/types/product";

/**
 * Cart types mirroring the backend's cart endpoints
 * (electrode-server: src/app/module/cart).
 *
 * IMPORTANT: cart responses carry NO monetary fields — no unit price, no line
 * total, no subtotal. Only the nested `product` and `variant` objects hold
 * prices. Every total shown to the shopper is derived on this side, pricing a
 * line from its `variant` when one is set and from the product otherwise.
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
  /** Variant price when a variant is selected, else the product's base price. */
  unitPrice: number;
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
