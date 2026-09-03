import type { ProductAttribute } from "@/types/product";

/**
 * Turning several products' specification lists into aligned comparison rows.
 *
 * Pure and separate from the table so the alignment rules — which are the whole
 * point of the page — can be tested without rendering anything.
 */

export interface CompareRow {
  name: string;
  /** One entry per product, in product order. `null` means not specified. */
  values: (string | null)[];
}

/**
 * The union of every specification name across the products, in first-seen
 * order, with one cell per product.
 *
 * Union rather than intersection: a specification only one product records is
 * exactly the kind of difference a shopper is looking for, and dropping it would
 * hide it. Every row carries a cell for every product, so a product that lacks a
 * specification cannot shift its column out of alignment.
 */
export function buildCompareRows(
  products: { attributes: ProductAttribute[] }[],
): CompareRow[] {
  const names: string[] = [];

  for (const product of products) {
    for (const attr of product.attributes) {
      if (!names.includes(attr.name)) names.push(attr.name);
    }
  }

  return names.map((name) => ({
    name,
    values: products.map(
      (product) =>
        product.attributes.find((attr) => attr.name === name)?.value ?? null,
    ),
  }));
}

/**
 * The rows on which the products do not all agree.
 *
 * `null` participates as a value of its own, so a specification recorded by some
 * products and not others counts as a difference. That is the behaviour the spec
 * asks for, and it falls out of the same comparison rather than needing a
 * special case.
 */
export function differingRows(rows: CompareRow[]): CompareRow[] {
  return rows.filter((row) => new Set(row.values).size > 1);
}
