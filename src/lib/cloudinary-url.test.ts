import { describe, expect, it } from "vitest";
import { cloudinaryUrl, cloudinaryVideoUrl } from "@/lib/cloudinary-url";
import imageLoader from "@/lib/image-loader";

const IMAGE = "https://res.cloudinary.com/demo/image/upload/v1/Bariyan/images/logo.png";
const VIDEO = "https://res.cloudinary.com/demo/video/upload/v1/Bariyan/images/clip.mp4";
const POSTER = "https://res.cloudinary.com/demo/video/upload/v1/Bariyan/images/clip.jpg";

describe("cloudinaryUrl", () => {
  it("bounds an image by width", () => {
    expect(cloudinaryUrl(IMAGE, { width: 480 })).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,c_limit,w_480,q_auto/v1/Bariyan/images/logo.png",
    );
  });

  it("bounds a logo by height alone, for a mark drawn at the merchant's height", () => {
    expect(cloudinaryUrl(IMAGE, { height: 80 })).toContain("/upload/f_auto,c_limit,h_80,q_auto/v1/");
  });

  it("rounds fractional sizes, which Cloudinary would reject", () => {
    expect(cloudinaryUrl(IMAGE, { width: 63.6 })).toContain("w_64,");
  });

  it("treats a generated poster frame as an image", () => {
    expect(cloudinaryUrl(POSTER, { width: 800 })).toBe(
      "https://res.cloudinary.com/demo/video/upload/f_auto,c_limit,w_800,q_auto/v1/Bariyan/images/clip.jpg",
    );
  });

  it("leaves a video, the placeholder, another host and a lookalike host alone", () => {
    for (const src of [
      VIDEO,
      "/api/placeholder?w=800&h=800",
      "https://cdn.example.com/banner.jpg",
      "https://res.cloudinary.com.evil.test/x/image/upload/v1/a.png",
    ]) {
      expect(cloudinaryUrl(src, { width: 640 })).toBe(src);
    }
  });
});

describe("cloudinaryVideoUrl", () => {
  it("asks for automatic quality and codec", () => {
    expect(cloudinaryVideoUrl(VIDEO)).toBe(
      "https://res.cloudinary.com/demo/video/upload/q_auto,vc_auto/v1/Bariyan/images/clip.mp4",
    );
  });

  it("leaves posters, images and other hosts alone", () => {
    for (const src of [POSTER, IMAGE, "https://cdn.example.com/clip.mp4"]) {
      expect(cloudinaryVideoUrl(src)).toBe(src);
    }
  });
});

describe("imageLoader — poster frames", () => {
  it("resizes a /video/upload/ poster, which it used to pass through at full size", () => {
    expect(imageLoader({ src: POSTER, width: 640 })).toContain("/video/upload/f_auto,c_limit,w_640,q_auto/");
  });

  it("still passes a video URL through untouched", () => {
    expect(imageLoader({ src: VIDEO, width: 640 })).toBe(VIDEO);
  });
});
