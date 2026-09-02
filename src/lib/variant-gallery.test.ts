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
  it("shows a variant's own images plus the shared ones", () => {
    const images = [
      img("mint-1.jpg", MINT),
      img("navy-1.jpg", NAVY),
      img("box.jpg"),
      img("mint-2.jpg", MINT),
    ];

    expect(urls(visibleImages(images, MINT))).toEqual([
      "mint-1.jpg",
      "box.jpg",
      "mint-2.jpg",
    ]);
    expect(urls(visibleImages(images, NAVY))).toEqual(["navy-1.jpg", "box.jpg"]);
  });

  it("preserves the given order within a selection", () => {
    const images = [img("box.jpg"), img("mint-1.jpg", MINT), img("mint-2.jpg", MINT)];

    expect(urls(visibleImages(images, MINT))).toEqual([
      "box.jpg",
      "mint-1.jpg",
      "mint-2.jpg",
    ]);
  });

  it("falls back to the shared images for a variant with none of its own", () => {
    const images = [img("mint-1.jpg", MINT), img("box.jpg")];

    expect(urls(visibleImages(images, NAVY))).toEqual(["box.jpg"]);
  });

  it("falls back to every image when each one belongs to another variant", () => {
    const images = [img("mint-1.jpg", MINT), img("mint-2.jpg", MINT)];

    // Nothing matches NAVY and there are no shared images — showing the full
    // set beats rendering an empty gallery.
    expect(urls(visibleImages(images, NAVY))).toEqual(["mint-1.jpg", "mint-2.jpg"]);
  });

  it("handles a partially-assigned product", () => {
    const images = [img("hero.jpg"), img("mint-1.jpg", MINT), img("detail.jpg")];

    expect(urls(visibleImages(images, MINT))).toEqual([
      "hero.jpg",
      "mint-1.jpg",
      "detail.jpg",
    ]);
    expect(urls(visibleImages(images, NAVY))).toEqual(["hero.jpg", "detail.jpg"]);
  });

  it("returns the full list unchanged when no image is assigned to a variant", () => {
    // 3.4: the guarantee that products predating assignment are unaffected.
    const images = [img("a.jpg"), img("b.jpg"), img("c.jpg")];

    expect(urls(visibleImages(images, MINT))).toEqual(["a.jpg", "b.jpg", "c.jpg"]);
    expect(urls(visibleImages(images, null))).toEqual(["a.jpg", "b.jpg", "c.jpg"]);
  });

  it("returns an empty list for a product with no images", () => {
    expect(visibleImages([], MINT)).toEqual([]);
    expect(visibleImages([], null)).toEqual([]);
  });

  it("shows the shared images when nothing is selected yet", () => {
    const images = [img("mint-1.jpg", MINT), img("box.jpg")];

    expect(urls(visibleImages(images, null))).toEqual(["box.jpg"]);
  });

  it("shows every image when nothing is selected and none are shared", () => {
    const images = [img("mint-1.jpg", MINT), img("navy-1.jpg", NAVY)];

    expect(urls(visibleImages(images, null))).toEqual(["mint-1.jpg", "navy-1.jpg"]);
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
