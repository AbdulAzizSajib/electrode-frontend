import { describe, expect, it } from "vitest";
import type { ProductImage } from "@/types/product";
import { variantIdForImage, visibleImages } from "@/lib/variant-gallery";

const MINT = "variant-mint";
const NAVY = "variant-navy";

const img = (url: string, variantId: string | null = null): ProductImage => ({
  url,
  variantId,
});

const urls = (images: ProductImage[]) => images.map((i) => i.url);

describe("visibleImages", () => {
  it("returns every image for a product photographed one shot per variant", () => {
    // The shape that caused the bug this module was rewritten for: four
    // variants, one image each, nothing shared. The old filtering rule returned
    // one image here, which also collapsed the thumbnail strip.
    const images = [
      img("white.jpg", "v-white"),
      img("brown.webp", "v-brown"),
      img("black.webp", "v-black"),
      img("green.jpg", "v-green"),
    ];

    for (const selected of ["v-white", "v-brown", "v-black", "v-green"]) {
      expect(visibleImages(images, selected)).toHaveLength(4);
    }

    expect(urls(visibleImages(images, "v-black"))).toEqual([
      "black.webp",
      "white.jpg",
      "brown.webp",
      "green.jpg",
    ]);
  });

  it("leads with the selected variant's images, then shared, then the rest", () => {
    const images = [
      img("mint-1.jpg", MINT),
      img("navy-1.jpg", NAVY),
      img("box.jpg"),
      img("mint-2.jpg", MINT),
    ];

    expect(urls(visibleImages(images, MINT))).toEqual([
      "mint-1.jpg",
      "mint-2.jpg",
      "box.jpg",
      "navy-1.jpg",
    ]);
    expect(urls(visibleImages(images, NAVY))).toEqual([
      "navy-1.jpg",
      "box.jpg",
      "mint-1.jpg",
      "mint-2.jpg",
    ]);
  });

  it("preserves the given order within each group", () => {
    const images = [
      img("mint-2.jpg", MINT),
      img("box-b.jpg"),
      img("mint-1.jpg", MINT),
      img("box-a.jpg"),
    ];

    expect(urls(visibleImages(images, MINT))).toEqual([
      "mint-2.jpg",
      "mint-1.jpg",
      "box-b.jpg",
      "box-a.jpg",
    ]);
  });

  it("keeps every image for a variant with none of its own", () => {
    const images = [img("mint-1.jpg", MINT), img("box.jpg")];

    // NAVY has no image, so the shared one leads and MINT's still follows.
    expect(urls(visibleImages(images, NAVY))).toEqual(["box.jpg", "mint-1.jpg"]);
  });

  it("keeps every image when each one belongs to another variant", () => {
    const images = [img("mint-1.jpg", MINT), img("mint-2.jpg", MINT)];

    expect(urls(visibleImages(images, NAVY))).toEqual(["mint-1.jpg", "mint-2.jpg"]);
  });

  it("handles a partially-assigned product", () => {
    const images = [img("hero.jpg"), img("mint-1.jpg", MINT), img("detail.jpg")];

    expect(urls(visibleImages(images, MINT))).toEqual([
      "mint-1.jpg",
      "hero.jpg",
      "detail.jpg",
    ]);
    expect(urls(visibleImages(images, NAVY))).toEqual([
      "hero.jpg",
      "detail.jpg",
      "mint-1.jpg",
    ]);
  });

  it("returns the full list unchanged when no image is assigned to a variant", () => {
    // The guarantee that products predating assignment are unaffected: not just
    // the same images, the same order.
    const images = [img("a.jpg"), img("b.jpg"), img("c.jpg")];

    expect(urls(visibleImages(images, MINT))).toEqual(["a.jpg", "b.jpg", "c.jpg"]);
    expect(urls(visibleImages(images, null))).toEqual(["a.jpg", "b.jpg", "c.jpg"]);
  });

  it("returns the full list in its given order when nothing is selected", () => {
    const images = [img("mint-1.jpg", MINT), img("box.jpg"), img("navy-1.jpg", NAVY)];

    expect(urls(visibleImages(images, null))).toEqual([
      "mint-1.jpg",
      "box.jpg",
      "navy-1.jpg",
    ]);
  });

  it("returns an empty list for a product with no images", () => {
    expect(visibleImages([], MINT)).toEqual([]);
    expect(visibleImages([], null)).toEqual([]);
  });

  it("never hides an image, whatever is selected", () => {
    // The invariant the whole rewrite exists to hold: the output is a
    // permutation of the input, never a subset.
    const images = [
      img("hero.jpg"),
      img("mint-1.jpg", MINT),
      img("navy-1.jpg", NAVY),
      img("mint-2.jpg", MINT),
      img("box.jpg"),
    ];

    for (const selected of [MINT, NAVY, "variant-unknown", null]) {
      const result = visibleImages(images, selected);
      expect(result).toHaveLength(images.length);
      expect([...urls(result)].sort()).toEqual([...urls(images)].sort());
    }
  });
});

describe("variantIdForImage", () => {
  it("returns the variant an image depicts", () => {
    expect(variantIdForImage(img("mint-1.jpg", MINT))).toBe(MINT);
  });

  it("returns null for a shared image", () => {
    expect(variantIdForImage(img("box.jpg"))).toBeNull();
  });

  it("returns null when there is no image", () => {
    expect(variantIdForImage(undefined)).toBeNull();
  });
});
