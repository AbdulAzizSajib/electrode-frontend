import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/*
 * The tall tile's wrapper must be a flex container.
 *
 * `HeroTile` renders an `<a>`, which is `display: inline`, and an inline
 * element ignores `aspect-ratio` and `width`. Every other layout places the
 * tile directly in a grid or a flex column, which blockifies it. This layout
 * wraps it in a `<div>` to give it a third of the row — and a plain `<div>`
 * leaves the `<a>` inline: zero height, so the column is zero height, so the
 * slider that stretches to the column is zero height, and the hero renders as
 * NOTHING. The setting saved, the server published it, the HTML carried every
 * class — and the merchant saw a blank band. That is the failure this pins.
 *
 * Asserted against the source, because this repo's test runner cannot render
 * `next/image`, and a layout test that measured nothing would be a worse
 * guard than one that reads the class list. The skeleton is held to the same
 * rule so the placeholder and the layout cannot drift apart.
 */
describe("HeroSplitTall", () => {
  const promoWrapper = (source: string) => {
    const match = source.match(/<div className="([^"]*lg:w-1\/3[^"]*)">/);
    expect(match, "the third-of-the-row wrapper was not found — was it renamed?").not.toBeNull();
    return match![1].split(/\s+/);
  };

  // Paths from the project root, not `import.meta.url`: under Vite that is not
  // a `file:` URL and `readFileSync` refuses it.
  it("blockifies the tile's <a> by making its wrapper a flex container", () => {
    const source = readFileSync("src/components/home/hero/HeroSplitTall.tsx", "utf8");
    expect(promoWrapper(source)).toContain("flex");
  });

  it("gives the skeleton's wrapper the same rule", () => {
    const source = readFileSync("src/components/home/HomeSkeletons.tsx", "utf8");
    expect(promoWrapper(source)).toContain("flex");
  });
});
