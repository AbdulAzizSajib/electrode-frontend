import { describe, expect, it } from "vitest";
import type { ProductImage } from "@/types/product";
import { firstImageForVariant, variantIdForImage } from "@/lib/variant-gallery";

const MINT = "variant-mint";
const NAVY = "variant-navy";

const img = (url: string, variantId: string | null = null): ProductImage => ({
  url,
  variantId,
});

describe("firstImageForVariant", () => {
  it("finds the photo a selected variant should lead with", () => {
    const images = [img("mint-1.jpg", MINT), img("navy-1.jpg", NAVY)];

    expect(firstImageForVariant(images, MINT)?.url).toBe("mint-1.jpg");
    expect(firstImageForVariant(images, NAVY)?.url).toBe("navy-1.jpg");
  });

  it("takes the first of a variant's photos in the order given", () => {
    // The order given is pickImages' primary-then-sortOrder sequence, so
    // "first" means the variant's primary photo.
    const images = [
      img("box.jpg"),
      img("mint-primary.jpg", MINT),
      img("mint-detail.jpg", MINT),
    ];

    expect(firstImageForVariant(images, MINT)?.url).toBe("mint-primary.jpg");
  });

  it("returns undefined for a variant with no photo of its own", () => {
    // This is what pins the shopper's current view instead of yanking them to
    // an unrelated photo — the caller reads undefined as "nothing to move to".
    const images = [img("mint-1.jpg", MINT), img("box.jpg")];

    expect(firstImageForVariant(images, NAVY)).toBeUndefined();
  });

  it("returns undefined when nothing is selected", () => {
    // An incomplete selection names no variant, so it leads with nothing.
    const images = [img("mint-1.jpg", MINT), img("box.jpg")];

    expect(firstImageForVariant(images, null)).toBeUndefined();
  });

  it("never answers with a shared image", () => {
    // Shared photos carry variantId null; passing null must not match them.
    const images = [img("box-a.jpg"), img("box-b.jpg")];

    expect(firstImageForVariant(images, null)).toBeUndefined();
    expect(firstImageForVariant(images, MINT)).toBeUndefined();
  });

  it("returns undefined for a product with no images", () => {
    expect(firstImageForVariant([], MINT)).toBeUndefined();
    expect(firstImageForVariant([], null)).toBeUndefined();
  });

  it("resolves a photo for every variant of a one-shot-per-variant product", () => {
    // The authoring shape behind this module's history: N variants, one photo
    // each, nothing shared. Every variant must reach its own photo, and the
    // list itself is handed to the gallery whole and unreordered.
    const images = [
      img("white.jpg", "v-white"),
      img("brown.webp", "v-brown"),
      img("black.webp", "v-black"),
      img("green.jpg", "v-green"),
    ];

    expect(
      ["v-white", "v-brown", "v-black", "v-green"].map(
        (id) => firstImageForVariant(images, id)?.url,
      ),
    ).toEqual(["white.jpg", "brown.webp", "black.webp", "green.jpg"]);
  });

  it("leaves the image list untouched", () => {
    // The gallery renders the array it is given, so any mutation here would
    // reorder the strip under the shopper — the exact defect this replaced.
    const images = [img("navy-1.jpg", NAVY), img("box.jpg"), img("mint-1.jpg", MINT)];
    const before = images.map((i) => i.url);

    firstImageForVariant(images, MINT);

    expect(images.map((i) => i.url)).toEqual(before);
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
