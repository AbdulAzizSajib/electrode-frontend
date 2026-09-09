import type { StoreSettings } from "@/types/store-settings";

/**
 * What the header and the footer each draw in their brand slot.
 *
 * ONE function for both slots, because the fallback order is exactly the rule
 * two separate components would each re-derive and then drift on. The header
 * and the footer sit on different backgrounds and have different markup, but
 * "which of the two things do I show, and which image" is the same question in
 * both, and it has to be answered the same way.
 *
 * A plain function taking settings as an argument rather than the module-scope
 * arrangement `lib/catalog-features.ts` uses: both callers are handed the whole
 * settings object already — the header as a prop, the footer as a prop — so
 * there is nothing to thread and no reason to hold state.
 *
 * Three rules, in order:
 *
 *  1. **The mode decides.** Not whether artwork happens to be uploaded. A slot
 *     set to `TEXT` renders the wordmark with its logo still on file, which is
 *     the whole point of storing a mode: it is what lets a shop show a logo in
 *     the header and the wordmark in the footer without deleting either image.
 *     Deriving the mode from "is a logo set" cannot express that — choosing text
 *     for the footer would mean clearing the footer's artwork, which would then
 *     pull the header's logo down into the footer by rule 2.
 *
 *  2. **The footer falls back to the header's artwork.** Header and footer
 *     backgrounds are commonly inverted, so each slot takes its own image; a
 *     footer with none of its own borrows the header's rather than going blank.
 *     This is the behaviour the admin panel has described since the logo fields
 *     were added and that nothing ever implemented.
 *
 *  3. **Anything unresolved falls back to the wordmark.** A slot in logo mode
 *     with no image anywhere renders text. The brand block is on every page of
 *     the site, so an empty one is not a broken component — it is a shop with no
 *     name on it, which is strictly worse than the text the logo replaced.
 *
 * See openspec/changes/add-header-footer-brand-display, design.md Decision 4,
 * and the `storefront-branding` spec. The server's
 * `scripts/verify-brand-display.ts` asserts this same matrix against the
 * backend; if one changes, the other must.
 */

export type BrandSlot = "header" | "footer";

/** The wordmark, or an image and the box to reserve for it. */
export type ResolvedBrand =
  | { kind: "text" }
  | { kind: "logo"; src: string; height: number; alt: string };

/**
 * Only what the resolution actually reads.
 *
 * Narrower than `StoreSettings` so the unit tests can state a case in six
 * fields instead of building a whole settings object, and so it is obvious at a
 * glance that nothing else on that row can influence a brand slot.
 */
export type BrandSettings = Pick<
  StoreSettings,
  | "storeName"
  | "siteNameAccent"
  | "logoUrl"
  | "footerLogoUrl"
  | "headerBrandMode"
  | "footerBrandMode"
  | "headerLogoHeight"
  | "footerLogoHeight"
>;

/**
 * The shop's name as one string — `storeName` plus its accent half.
 *
 * The header renders the two in different colours and so composes them itself;
 * this is the flattened form, used as a logo's `alt` and as the footer's
 * heading. Exported because the header needs the same join for its own text
 * branch and two spellings of "the shop's name" is how they come to disagree.
 */
export function brandName(settings: Pick<BrandSettings, "storeName" | "siteNameAccent">): string {
  return [settings.storeName, settings.siteNameAccent].filter(Boolean).join(" ");
}

export function resolveBrandSlot(
  settings: BrandSettings,
  slot: BrandSlot,
): ResolvedBrand {
  const mode = slot === "header" ? settings.headerBrandMode : settings.footerBrandMode;

  // Rule 1: the mode decides, and it is checked before any artwork is looked at.
  if (mode !== "LOGO") return { kind: "text" };

  /*
   * Rule 2: the header uses its own image; the footer prefers its own and
   * borrows the header's.
   *
   * `||` and NOT `??`. A cleared field can arrive as `""` as easily as `null` —
   * the admin's draft holds `''` for an unset logo — and for the footer's
   * fallback the two mean the same thing: no artwork of its own. Under `??` an
   * empty string is a value, so the footer would fall past the header's logo
   * and land on the wordmark, which is the bug the "cleared footer logo"
   * test pins down.
   */
  const src = slot === "header" ? settings.logoUrl : settings.footerLogoUrl || settings.logoUrl;

  // Rule 3: no image resolved, so the slot shows the wordmark rather than an
  // empty box or a broken image.
  if (!src) return { kind: "text" };

  return {
    kind: "logo",
    src,
    height: slot === "header" ? settings.headerLogoHeight : settings.footerLogoHeight,
    /*
     * Always the wordmark, so the shop is announced identically whether a slot
     * is in logo or text mode — and so a logo that fails to load still says who
     * the shop is instead of leaving an unlabelled link.
     */
    alt: brandName(settings),
  };
}
