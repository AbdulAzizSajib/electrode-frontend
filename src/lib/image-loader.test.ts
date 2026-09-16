import { describe, expect, it } from "vitest";
import imageLoader from "@/lib/image-loader";

const UPLOAD =
  "https://res.cloudinary.com/dog0dpqre/image/upload/v1789498232/Bariyan/images/earbuds.webp";

describe("imageLoader — Cloudinary images are resized by Cloudinary", () => {
  it("inserts format, limit, width and auto quality right after /image/upload/", () => {
    expect(imageLoader({ src: UPLOAD, width: 640 })).toBe(
      "https://res.cloudinary.com/dog0dpqre/image/upload/f_auto,c_limit,w_640,q_auto/v1789498232/Bariyan/images/earbuds.webp",
    );
  });

  it("gives every srcset width its own URL", () => {
    // Identical URLs across widths is exactly the "loader does not implement
    // width" failure: the browser would download the original at every size.
    const small = imageLoader({ src: UPLOAD, width: 384 });
    const large = imageLoader({ src: UPLOAD, width: 1080 });
    expect(small).not.toBe(large);
    expect(small).toContain("w_384");
    expect(large).toContain("w_1080");
  });

  it("uses an explicit quality prop instead of q_auto", () => {
    expect(imageLoader({ src: UPLOAD, width: 640, quality: 60 })).toContain("w_640,q_60/");
  });

  it("keeps the cloud name and the full public id intact", () => {
    const url = imageLoader({ src: UPLOAD, width: 256 });
    expect(url.startsWith("https://res.cloudinary.com/dog0dpqre/image/upload/")).toBe(true);
    expect(url.endsWith("/v1789498232/Bariyan/images/earbuds.webp")).toBe(true);
  });
});

describe("imageLoader — everything else", () => {
  it("resizes the placeholder by its own parameters, keeping the aspect ratio", () => {
    const url = imageLoader({ src: "/api/placeholder?seed=abc&w=800&h=600", width: 400 });
    const params = new URLSearchParams(url.slice(url.indexOf("?") + 1));
    expect(url.startsWith("/api/placeholder?")).toBe(true);
    expect(params.get("seed")).toBe("abc");
    expect(params.get("w")).toBe("400");
    expect(params.get("h")).toBe("300");
  });

  it("never asks the placeholder for more than the route will draw", () => {
    const url = imageLoader({ src: "/api/placeholder?seed=abc&w=800&h=800", width: 3840 });
    const params = new URLSearchParams(url.slice(url.indexOf("?") + 1));
    expect(params.get("w")).toBe("1600");
    expect(params.get("h")).toBe("1600");
  });

  it("passes an image from any other host through untouched rather than breaking it", () => {
    const other = "https://cdn.example.com/banner.jpg";
    expect(imageLoader({ src: other, width: 640 })).toBe(other);
  });

  it("does not treat a lookalike host as Cloudinary", () => {
    const lookalike = "https://res.cloudinary.com.evil.test/x/image/upload/v1/a.png";
    expect(imageLoader({ src: lookalike, width: 640 })).toBe(lookalike);
  });
});
