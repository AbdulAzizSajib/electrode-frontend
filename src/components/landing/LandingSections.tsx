import ServerIcon from "@/components/ui/ServerIcon";
import LandingHeading from "@/components/landing/LandingHeading";
import StarRating from "@/components/ui/StarRating";
import type {
  LandingPageFaq,
  LandingPageHighlight,
  LandingPageQuote,
  LandingPageTrustBadge,
  LandingPageUsageIdea,
  LandingPageWhyUs,
} from "@/types/landing-page";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

/**
 * The repeating content blocks of a campaign page.
 *
 * Every one of these returns `null` when it has nothing to show. That is the
 * spec's requirement and it is what makes the page honest: a merchant who has
 * not written an FAQ gets a shorter page, not a heading over an empty space.
 * Callers therefore do not need to guard — rendering all four unconditionally
 * is correct.
 *
 * All server components. Nothing here is interactive except the FAQ, which uses
 * native `<details>` rather than JavaScript: it is open-and-close, the browser
 * already does it, and it works before hydration.
 */

export function LandingHighlights({ items }: { items: LandingPageHighlight[] | null }) {
  if (!items?.length) return null;

  return (
    <section>
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item, index) => (
          <li
            key={`${item.title}-${index}`}
            /*
              A LIFTED CARD, not a flat bordered box. The shadow is what makes a
              grid read as a set of separate things rather than a table — and
              the hover lift is the only affordance saying the whole card is one
              unit, which matters on a page a reader is skimming rather than
              studying.
            */
            className="flex gap-3.5 rounded-xl border border-lp-border bg-lp-surface p-4 shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          >
            {item.icon && (
              /*
                The icon in a soft disc rather than bare. A loose glyph beside
                text reads as decoration; the same glyph on a filled circle
                reads as a marker, which is what gives a list of eight benefits
                its rhythm.
              */
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-full bg-lp-accent-soft"
              >
                <ServerIcon name={item.icon} className="size-5 text-lp-accent" />
              </span>
            )}
            <div>
              <p className="font-semibold text-lp-text">{item.title}</p>
              {item.text && (
                <p className="mt-1 text-sm leading-relaxed text-lp-muted">{item.text}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LandingTrustBadges({
  items,
  className = "",
}: {
  items: LandingPageTrustBadge[] | null;
  /** Extra classes for the list itself — the hero centres its row. */
  className?: string;
}) {
  if (!items?.length) return null;

  return (
    <ul className={`mt-6 flex flex-wrap gap-2 ${className}`}>
      {items.map((item, index) => (
        <li
          key={`${item.label}-${index}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-lp-border bg-lp-surface-alt px-3 py-1.5 text-xs font-medium text-lp-muted"
        >
          {item.icon && <ServerIcon name={item.icon} aria-hidden className="size-4 text-lp-accent" />}
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export function LandingQuotes({ items }: { items: LandingPageQuote[] | null }) {
  if (!items?.length) return null;

  return (
    <section>
      <LandingHeading
        title="সম্মানিত ক্রেতাদের মতামত"
        subtitle="যাঁরা ইতিমধ্যে নিয়েছেন, তাঁরা কী বলছেন।"
      />
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className="rounded-xl border border-lp-border bg-lp-surface p-4 shadow-[0_4px_15px_rgba(0,0,0,0.05)]"
          >
            {/*
              Only rendered when the merchant recorded one. A default of five
              stars on every card would be a rating nobody gave — the same
              reason Testimonial.rating replaced a hardcoded 5.
            */}
            {typeof item.rating === "number" && (
              <div className="mb-2">
                <StarRating rating={item.rating} themed />
              </div>
            )}
            {/*
              THE SCREENSHOT, when the merchant posted one. Real campaigns show
              the WhatsApp or Messenger reply a customer actually sent, and a
              merchant who has that should not have to retype it to use it.

              Rendered ABOVE the text rather than instead of it, because a quote
              may carry both — an image with a typed summary beside it. The
              backend guarantees at least one of the two, so a card is never
              empty.
            */}
            {item.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- merchant-supplied host, not in next.config's allow-list
              <img
                // A review card is at most ~400px wide; 2x for retina.
                src={cloudinaryUrl(item.imageUrl, { width: 800 })}
                alt={`${item.name} — রিভিউ`}
                className="mb-3 w-full rounded-lg border border-lp-border object-cover"
                loading="lazy"
              />
            )}
            {/*
              Only when there IS text. An image-only review must not leave an
              empty paragraph and its margin behind it.
            */}
            {item.text && (
              <p className="text-sm leading-relaxed text-lp-muted">{item.text}</p>
            )}
            <div className="mt-3 flex items-center gap-2">
              {item.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- merchant-supplied host, not in next.config's allow-list
                <img
                  src={cloudinaryUrl(item.photoUrl, { width: 64, height: 64 })}
                  alt=""
                  className="size-8 rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span
                  aria-hidden
                  className="grid size-8 place-items-center rounded-full bg-lp-accent-soft text-xs font-semibold text-lp-accent"
                >
                  {item.name.trim().charAt(0)}
                </span>
              )}
              <span className="text-sm font-medium text-lp-text">{item.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LandingFaqs({ items }: { items: LandingPageFaq[] | null }) {
  if (!items?.length) return null;

  return (
    <section>
      <LandingHeading
        title="সাধারণ প্রশ্নোত্তর"
        subtitle="যে প্রশ্নগুলো সবাই করেন, তার উত্তর এখানে।"
      />
      <ul className="divide-y divide-lp-border overflow-hidden rounded-xl border border-lp-border bg-lp-surface shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
        {items.map((item, index) => (
          <li key={`${item.question}-${index}`}>
            {/*
              Native <details>, not a JavaScript accordion. It is open-and-close
              behaviour the browser already implements, it works before
              hydration, and on a page reached from an ad the first paint is the
              only one that reliably happens.
            */}
            <details className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-lp-text">
                {item.question}
                <span
                  aria-hidden
                  className="shrink-0 text-lp-muted transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-lp-muted">{item.answer}</p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The numbered "why we are different" grid.
 *
 * Numbered rather than bulleted because the reference this follows numbers
 * them, and a number reads as a list a shopper can finish — eight ticks look
 * like a spec sheet, eight numbers look like eight reasons.
 */
export function LandingWhyUs({ items }: { items: LandingPageWhyUs[] | null }) {
  if (!items?.length) return null;

  return (
    <section>
      <LandingHeading
        title="কেনো আমাদের পণ্য সবার থেকে আলাদা?"
        subtitle="যে কারণগুলোর জন্য হাজারো ক্রেতা আমাদের উপর ভরসা রাখেন।"
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <li
            key={`${item.title}-${index}`}
            className="rounded-xl border border-lp-border bg-lp-surface p-5 text-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          >
            {/*
              A FILLED numeral, not a pale one. The number is the section's
              whole organising idea — eight reasons a reader can count through —
              and a tint-on-tint badge reads as a bullet instead.
            */}
            <span
              aria-hidden
              className="mx-auto grid size-9 place-items-center rounded-full bg-lp-accent text-sm font-bold text-lp-accent-contrast"
            >
              {/*
                Bengali-Indic digits, to match the copy around them. A page
                written in Bangla that numbers its own sections 1..8 in ASCII
                reads as half-translated.
              */}
              {(index + 1).toLocaleString("bn-BD")}
            </span>
            <p className="mt-3 font-semibold text-lp-text">{item.title}</p>
            {item.text && (
              <p className="mt-1.5 text-sm leading-relaxed text-lp-muted">{item.text}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * "What would I actually do with this" — the section that answers the question
 * a shopper has before they will consider the price.
 *
 * Denser than the grids above on purpose: these are short labels, not
 * arguments, and giving each one a card would make ten ideas look like ten
 * claims to evaluate.
 */
export function LandingUsageIdeas({ items }: { items: LandingPageUsageIdea[] | null }) {
  if (!items?.length) return null;

  return (
    <section>
      <LandingHeading
        title="ব্যবহারের আইডিয়া"
        subtitle="আপনি চাইলে অসংখ্যভাবে ব্যবহার করতে পারেন —"
      />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item, index) => (
          <li
            key={`${item.label}-${index}`}
            /*
              STACKED AND CENTRED, not a row of labels. These are ten short
              ideas read at a glance; a centred icon above its label makes each
              one a tile the eye can land on, where an inline row reads as a
              sentence that happens to have icons in it.
            */
            className="flex flex-col items-center gap-2 rounded-xl border border-lp-border bg-lp-surface px-3 py-4 text-center text-sm text-lp-text shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5"
          >
            {item.icon && (
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-full bg-lp-accent-soft"
              >
                <ServerIcon name={item.icon} className="size-4.5 text-lp-accent" />
              </span>
            )}
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
