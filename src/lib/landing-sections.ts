import type {
  LandingCustomSectionLayout,
  LandingPage,
  LandingSectionConfigEntry,
  LandingSectionKey,
} from "@/types/landing-page";
import type { LandingSurface } from "@/components/landing/LandingBand";

/**
 * Which sections a campaign page renders, in what order, and on which surface.
 *
 * THIS IS THE PART THAT MUST NOT FAIL. It runs on every campaign page view, its
 * inputs drift over time by design, and its failure modes are a blank page or a
 * silently missing section — both of which cost ad money without anything
 * erroring. So every function here is pure and total: it takes data, returns
 * data, throws nothing, and has a defined answer for every malformed input.
 * That is also what lets it be tested without a browser or a database.
 *
 * See server/openspec/changes/add-landing-page-section-builder, design.md D4/D5.
 */

/**
 * The DEFAULT ORDER, and the definition of "unchanged".
 *
 * A faithful transcription of the JSX sequence LandingPageView rendered before
 * the section editor existed, and what a page with no stored order resolves to.
 * Every campaign that exists today is in exactly that state, so this array is
 * what keeps them rendering identically — reorder it and every one of them
 * silently restyles.
 *
 * MIRRORS `DEFAULT_LANDING_SECTION_ORDER` in the backend's
 * landing-page.constant.ts. The packages never import each other, so the two
 * are kept in step by hand and pinned by a verify script.
 */
export const DEFAULT_LANDING_SECTION_ORDER: readonly LandingSectionKey[] = [
  "HERO",
  "ORDER_FORM",
  "OFFER",
  "HIGHLIGHTS",
  "CTA",
  "WHY_US",
  "BODY",
  "USAGE_IDEAS",
  "CTA",
  "QUOTES",
  "FAQS",
  "CTA",
];

/**
 * Every section this build knows how to render.
 *
 * A stored order naming anything outside this set is drift — the merchant saved
 * it against a build that had a section this one does not — and is dropped
 * rather than rendered or thrown on.
 */
const KNOWN_KEYS: ReadonlySet<string> = new Set<LandingSectionKey>([
  "HERO",
  "ORDER_FORM",
  "OFFER",
  "HIGHLIGHTS",
  "WHY_US",
  "BODY",
  "USAGE_IDEAS",
  "QUOTES",
  "FAQS",
  "CTA",
  "CUSTOM",
]);

/**
 * The keys that may legitimately appear more than once.
 *
 * Everything else is deduplicated on read: a hand-edited row naming QUOTES
 * twice would otherwise render the same block twice, and the two entries can
 * disagree about `enabled`. Mirrors the backend's
 * LANDING_REPEATABLE_SECTION_KEYS.
 */
const REPEATABLE_KEYS: ReadonlySet<string> = new Set<LandingSectionKey>(["CTA", "CUSTOM"]);

/**
 * Sections whose absence would leave nothing to buy.
 *
 * Re-asserted here and not only in the backend, because this function also
 * serves stored rows written before a rule existed, and a hand-edited row is
 * not validated by anything.
 *
 * ORDER_FORM joined HERO when the two were split apart. Every order stored
 * before that split names only HERO — the restore pass below puts the form
 * back at its default position, which is exactly where it used to render
 * inside the hero, so those pages are unchanged.
 */
const REQUIRED_KEYS: readonly LandingSectionKey[] = ["HERO", "ORDER_FORM"];

/** One section, resolved and ready to render. */
export interface ResolvedLandingSection {
  key: LandingSectionKey;
  /** Stable within one render; the React key. */
  id: string;
  /** CUSTOM only — the merchant's own content. */
  heading?: string;
  body?: string;
  layout?: LandingCustomSectionLayout;
}

/**
 * Turns a stored order into the sections to render.
 *
 * TOLERATES DRIFT IN BOTH DIRECTIONS, because a stored order and the code it is
 * read by are versioned independently:
 *
 *   - An entry naming a section this build does not have is DROPPED. The
 *     alternative is a campaign page that throws because a section type was
 *     retired — and on this page a failed render is money already spent.
 *   - A section this build has that the stored order never mentions is APPENDED
 *     at its default position. The alternative is that a section added after a
 *     page was last saved is permanently invisible on it, with no indication
 *     why and no remedy but re-saving a page the merchant has no reason to open.
 *
 * A stored value that is not a usable array — null, undefined, or anything a
 * hand-edit left behind — resolves to the default order rather than to nothing.
 * `sectionConfig` is null on every campaign that predates the editor, so that
 * path is the common one, not the exceptional one.
 */
export function resolveLandingSections(
  stored: LandingSectionConfigEntry[] | null | undefined,
): ResolvedLandingSection[] {
  const fromDefault = (): ResolvedLandingSection[] =>
    DEFAULT_LANDING_SECTION_ORDER.map((key, index) => ({ key, id: `${key}-${index}` }));

  if (!Array.isArray(stored) || stored.length === 0) return fromDefault();

  const seen = new Set<string>();
  const resolved: ResolvedLandingSection[] = [];

  stored.forEach((entry, index) => {
    // A malformed element — a string, a null, a number — is skipped rather than
    // read for fields it does not have.
    if (!entry || typeof entry !== "object") return;
    if (!KNOWN_KEYS.has(entry.key)) return;
    if (entry.enabled === false) return;

    const repeatable = REPEATABLE_KEYS.has(entry.key);

    /*
     * Identity is `key` for a normal section, `key:id` for a custom one, and
     * position for a CTA. Matching custom sections on `key` alone would collapse
     * every one of them into the first — the same hazard the backend's
     * LANDING_REPEATABLE_SECTION_KEYS names.
     */
    if (!repeatable) {
      if (seen.has(entry.key)) return;
      seen.add(entry.key);
    }

    if (entry.key === "CUSTOM") {
      // A custom section with no content renders nothing; skip it rather than
      // emitting an empty band.
      if (!entry.heading && !entry.body) return;

      const id = entry.id ?? `custom-${index}`;
      if (seen.has(`CUSTOM:${id}`)) return;
      seen.add(`CUSTOM:${id}`);

      resolved.push({
        key: "CUSTOM",
        id: `custom-${id}`,
        heading: entry.heading,
        body: entry.body,
        layout: entry.layout ?? "PROSE",
      });
      return;
    }

    resolved.push({ key: entry.key, id: `${entry.key}-${index}` });
  });

  /*
   * A section this build has that the stored order never mentioned. Inserted at
   * its default position rather than appended to the end, so a page that
   * predates a new section gets it where it was designed to sit rather than
   * below the last call to action.
   *
   * CTA and CUSTOM are excluded: they repeat, so "was it mentioned" has no
   * single answer, and a page that deliberately kept one CTA must not silently
   * regain the other two.
   */
  const mentioned = new Set(resolved.map((section) => section.key));
  const disabled = new Set(
    stored
      .filter((entry) => entry && typeof entry === "object" && entry.enabled === false)
      .map((entry) => entry.key),
  );

  DEFAULT_LANDING_SECTION_ORDER.forEach((key, defaultIndex) => {
    if (key === "CTA" || key === "CUSTOM") return;
    if (mentioned.has(key)) return;
    // Mentioned and switched OFF is a decision, not an omission.
    if (disabled.has(key)) return;

    /*
     * Insert before the first already-resolved section that sits LATER in the
     * default order, which keeps the newcomer in its designed neighbourhood
     * whatever the merchant did around it.
     */
    const at = resolved.findIndex((section) => {
      const position = DEFAULT_LANDING_SECTION_ORDER.indexOf(section.key);
      return position > defaultIndex;
    });

    const section: ResolvedLandingSection = { key, id: `${key}-restored` };

    if (at === -1) resolved.push(section);
    else resolved.splice(at, 0, section);

    mentioned.add(key);
  });

  /*
   * The page must keep what makes it a page. A stored row can predate this rule
   * or be hand-edited, and a campaign with no hero is a paid click that can buy
   * nothing.
   */
  REQUIRED_KEYS.forEach((key) => {
    if (mentioned.has(key)) return;
    resolved.unshift({ key, id: `${key}-required` });
  });

  // Every section dropped or disabled leaves a page with nothing to show; fall
  // back rather than render a blank campaign.
  return resolved.length > 0 ? resolved : fromDefault();
}

/**
 * Which sections carry the accent wash rather than joining the alternation.
 *
 * Their colour is carrying MEANING — "this is the offer", "this is the button" —
 * rather than rhythm, so they keep it wherever the merchant puts them. Letting
 * them alternate would make a call to action look like body content.
 */
const ACCENT_KEYS: ReadonlySet<string> = new Set<LandingSectionKey>(["OFFER", "CTA"]);

/**
 * The background each resolved section renders on.
 *
 * DERIVED FROM POSITION, not fixed per section, and that is the whole point.
 * With a hardcoded order, assigning each band a literal surface worked because
 * the author could see the whole sequence. Once the merchant controls the order,
 * any fixed assignment produces three identical adjacent surfaces the moment
 * they reorder — which is exactly the "one long column in one colour" that
 * add-landing-page-theme-tokens set out to remove.
 *
 * Computed over the ENABLED, RESOLVED list: alternating over the full list would
 * leave a gap wherever a section is disabled, putting two identical surfaces
 * side by side by a different route.
 *
 * The accent sections are skipped rather than counted, so a call to action
 * between two content bands does not flip the alternation of everything below
 * it — the two content bands either side still differ from each other.
 */
export function landingSectionSurfaces(
  sections: readonly ResolvedLandingSection[],
  /**
   * How many content bands are already on the page ABOVE these.
   *
   * ZERO, because every band is now in the list. It defaulted to ONE while
   * the hero rendered outside it: the hero was a `surface` band the count
   * could not see, so starting at zero made the first folded band `surface`
   * too and the two sat either side of the offer strip reading as one
   * continuous block — the exact defect this function exists to prevent, and
   * it was live until an end-to-end check caught two `bg-lp-surface` bands
   * two apart.
   *
   * Splitting the hero into the product and the order form put both into the
   * reorderable list, which retires the hazard by construction rather than by
   * an offset a caller has to remember. The parameter stays for a caller that
   * genuinely draws a band of its own above the list; nothing does today.
   */
  offset = 0,
): LandingSurface[] {
  let alternating = offset;

  return sections.map((section) => {
    if (ACCENT_KEYS.has(section.key)) return "accentSoft";

    const surface: LandingSurface = alternating % 2 === 0 ? "surface" : "surfaceAlt";
    alternating += 1;
    return surface;
  });
}

/**
 * Which sections have nothing to show for THIS page.
 *
 * Separate from `resolveLandingSections` because the two answer different
 * questions: that one says what the merchant ordered, this says what the page
 * actually holds. A section the merchant enabled but never filled is omitted
 * here — the spec's long-standing rule that an empty section renders nothing
 * rather than a heading over blank space.
 */
export function landingSectionHasContent(
  section: ResolvedLandingSection,
  page: LandingPage,
): boolean {
  switch (section.key) {
    case "HERO":
      return true;
    case "ORDER_FORM":
      /*
       * Always, INCLUDING when the product cannot be ordered — unlike CTA
       * below, which is a button and has nothing to say in that state. The
       * form renders an out-of-stock card in its place, and a campaign page
       * that simply omits the form leaves a visitor who arrived from an ad
       * scrolling for a way to buy that is not there and no word of why.
       */
      return true;
    case "OFFER":
      return Boolean(page.offerEndsAt) || Boolean(page.scarcity);
    case "HIGHLIGHTS":
      return Boolean(page.highlights?.length);
    case "WHY_US":
      return Boolean(page.whyUs?.length);
    case "USAGE_IDEAS":
      return Boolean(page.usageIdeas?.length);
    case "QUOTES":
      return Boolean(page.quotes?.length);
    case "FAQS":
      return Boolean(page.faqs?.length);
    case "CTA":
      return page.productSnapshot.isOrderable;
    case "CUSTOM":
      return Boolean(section.heading) || Boolean(section.body);
    case "BODY":
      // The caller decides: it holds the sanitiser's blank test, which this
      // module deliberately does not import.
      return true;
    default:
      return false;
  }
}
