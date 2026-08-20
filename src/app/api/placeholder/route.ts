import { NextRequest } from "next/server";

// Deterministic, dependency-free placeholder image generator. Renders a
// soft-colored SVG tile with the item's initials so the storefront never
// depends on an external image CDN. Swap `product.image` for real photo
// URLs once the backend is connected — every component just reads that
// field, so nothing else needs to change.

const PALETTE = [
  ["#dbe6fd", "#1a56db"],
  ["#fde8cc", "#b45309"],
  ["#dcfce7", "#15803d"],
  ["#fee2e2", "#b91c1c"],
  ["#ede9fe", "#6d28d9"],
  ["#fce7f3", "#be185d"],
  ["#e0f2fe", "#0369a1"],
  ["#fef9c3", "#a16207"],
];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function initials(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seed = searchParams.get("seed") ?? "electrode";
  const w = Math.min(Number(searchParams.get("w")) || 800, 1600);
  const h = Math.min(Number(searchParams.get("h")) || 800, 1600);
  const label = searchParams.get("label") ?? seed;

  const idx = hash(seed) % PALETTE.length;
  const [bg, fg] = PALETTE[idx];
  const text = initials(label);
  const fontSize = Math.round(Math.min(w, h) * 0.32);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bg}" />
  <circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) * 0.34}" fill="${fg}" fill-opacity="0.12" />
  <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" fill="${fg}">${text}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
