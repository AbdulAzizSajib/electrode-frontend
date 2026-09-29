import type { ReactNode } from "react";

/**
 * One full-width horizontal band of a campaign page.
 *
 * THE BACKGROUND SPANS THE VIEWPORT, the content does not. That distinction is
 * the whole component: the page used to sit inside a single `max-w-5xl`
 * wrapper, so no section could carry a background of its own and the document
 * read as one long column in one colour. Alternating bands are most of what
 * makes a campaign page feel organised rather than endless.
 *
 * A COMPONENT rather than a class string each section repeats, because this is
 * the one place the container width, the side padding and the vertical rhythm
 * are decided. Eight sections each spelling them out is eight places for them
 * to drift apart, and the first one to drift is the one nobody notices.
 *
 * A band names a SURFACE, never a colour. Which colour that surface is comes
 * from the page's theme tokens, so a merchant recolouring the page moves every
 * band using it at once — which is the point of the tokens and would be lost
 * the moment a section hardcoded a hex here.
 *
 * WHICH surface each band uses is decided in LandingPageView, where the section
 * order already lives. A band cannot know what precedes it, so it cannot decide
 * whether to alternate.
 *
 * THE WIDTH IS A PROP, because a band holds two different kinds of thing. The
 * `max-w-5xl` every band used to share was inherited from the single wrapper
 * this component replaced — that change moved the WRAPPING and never revisited
 * the number — and 64rem is the right measure for a column of prose and too
 * narrow for the rest. On a desktop it left the hero's image and order form
 * squeezed into half of 64rem each with the viewport empty on both sides, which
 * reads as a phone layout stretched rather than a page built for the screen.
 *
 * So `width="wide"` (80rem) for the hero and the card grids, which have real
 * content to spread across and look sparse when they cannot, and the default
 * `"text"` (64rem) for everything that is a line of prose to read — a heading,
 * an FAQ answer, the merchant's body copy. Line length is the constraint there,
 * and wider is strictly worse: past roughly 75 characters the eye loses the
 * start of the next line.
 *
 * See server/openspec/changes/add-landing-page-theme-tokens, design.md D5.
 */

const SURFACES = {
  /** The primary content background. */
  surface: "bg-lp-surface",
  /** The alternating one, for a band that must read as distinct from its neighbours. */
  surfaceAlt: "bg-lp-surface-alt",
  /** A wash of the campaign's accent — the offer block and the call-to-action strips. */
  accentSoft: "bg-lp-accent-soft",
} as const;

export type LandingSurface = keyof typeof SURFACES;

const WIDTHS = {
  /** A column of prose. 64rem keeps the line length readable. */
  text: "max-w-5xl",
  /** The hero and the card grids, which have content to spread across. */
  wide: "max-w-[80rem]",
} as const;

export type LandingWidth = keyof typeof WIDTHS;

export default function LandingBand({
  surface = "surface",
  width = "text",
  children,
  className = "",
  id,
}: {
  surface?: LandingSurface;
  /** Defaults to the reading measure; `"wide"` for the hero and card grids. */
  width?: LandingWidth;
  children: ReactNode;
  /** Extra classes for the INNER container, not the band — the band owns its own background. */
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={SURFACES[surface]}>
      {/*
        `container-px` supplies the side padding at every width, which is what
        keeps the content off the viewport edge on a phone while the band's
        background still reaches it.
      */}
      <div
        className={`container-px mx-auto ${WIDTHS[width]} py-8 md:py-12 ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
