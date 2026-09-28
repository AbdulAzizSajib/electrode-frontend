/**
 * A section's heading, centred, with an optional line under it.
 *
 * CENTRED AND LARGE, which is the single biggest difference between a campaign
 * page that reads as organised and one that reads as a long column. A
 * left-aligned `text-xl` heading sits in the flow like a paragraph; a centred
 * one at nearly twice the size is a full stop between sections, and a reader
 * scrolling fast uses those to decide what to slow down for.
 *
 * ONE COMPONENT, not a class string each section repeats. Four sections each
 * spelling out the size, weight, alignment and spacing is four places for them
 * to drift, and the first one to drift is the one nobody notices — it just
 * looks slightly wrong forever.
 *
 * `subtitle` exists because the reference uses it and it earns its place: a
 * heading says what the section is, the line under it says why the reader
 * should care. Omitted entirely when absent, so nothing reserves empty space.
 *
 * See server/openspec/changes/add-landing-page-section-design.
 */
export default function LandingHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6 text-center md:mb-8">
      <h2 className="text-2xl font-bold leading-tight text-lp-text md:text-[1.75rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-lp-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}
