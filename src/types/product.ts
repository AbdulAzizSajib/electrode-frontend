export interface ProductVariantOption {
  name: string; // e.g. "Color", "RAM", "Size"
  values: string[];
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images?: string[];
  rating?: number; // 0-5
  reviewCount?: number;
  inStock: boolean;
  stockCount?: number;
  sku?: string;
  tags?: string[];
  options?: ProductVariantOption[];
  description?: string;
  featured?: boolean;
  isNew?: boolean;
}

export interface CartLine {
  productId: string;
  quantity: number;
  selectedOptions?: Record<string, string>;
}
