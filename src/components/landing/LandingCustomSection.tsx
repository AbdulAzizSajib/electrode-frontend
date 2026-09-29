import RichText from "@/components/product/RichText";
import LandingHeading from "@/components/landing/LandingHeading";
import { isBlankHtml } from "@/lib/sanitize-html";
import type { ResolvedLandingSection } from "@/lib/landing-sections";

/**
 * A section the merchant wrote themselves.
 *
 * The built-in sections each model one KIND of argument — benefits, reasons,
 * reviews, questions — and a campaign that needs a comparison table, a
 * guarantee panel or a delivery-timeline strip had nowhere to put it. The
 * workaround was to pour everything into `bodyHtml`, which is a single
 * unstructured blob: it cannot be reordered, cannot be switched off, and
 * appears exactly once. This is the same content as its own section, so it
 * takes a position in the order like any other.
 *
 * ITS BODY IS SANITISED THROUGH THE EXISTING PATH, not a new one. `RichText`
 * runs `sanitizeHtml` over the markup where it meets the browser — the posture
 * `bodyHtml`, `Page.body` and `Product.description` already take. There is one
 * allow-list in this app and a second would be a second thing to get wrong.
 *
 * Renders `themed`, so the merchant's prose follows the campaign's own colours
 * rather than sitting grey in the middle of a themed page.
 *
 * See server/openspec/changes/add-landing-page-section-builder, design.md D3/D8.
 */
export default function LandingCustomSection({
  section,
}: {
  section: ResolvedLandingSection;
}) {
  const hasBody = Boolean(section.body) && !isBlankHtml(section.body ?? "");

  // Nothing to show. Guarded here as well as in the resolver because a section
  // whose body is only empty markup passes "has a body" and renders a blank band.
  if (!section.heading && !hasBody) return null;

  const layout = section.layout ?? "PROSE";
  const centered = layout === "CENTERED" || layout === "HIGHLIGHT";

  return (
    <section>
      {/*
        The heading uses the SAME component the built-in sections use, so a
        merchant's own section reads as part of the page rather than as
        something pasted into it — which is most of what makes the built-in
        sections look deliberate.
      */}
      {section.heading &&
        (centered ? (
          <LandingHeading title={section.heading} />
        ) : (
          <h2 className="mb-4 text-2xl font-bold leading-tight text-lp-text md:text-[1.75rem]">
            {section.heading}
          </h2>
        ))}

      {hasBody && (
        <RichText
          html={section.body ?? ""}
          className={`text-base [&_p]:my-4 [&_li]:my-1.5 ${
            centered ? "mx-auto max-w-2xl text-center" : ""
          }`}
          themed
        />
      )}
    </section>
  );
}
