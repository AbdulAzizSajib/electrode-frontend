import { Icon } from "@iconify/react";
import StarRating from "@/components/ui/StarRating";
import type {
  LandingPageFaq,
  LandingPageHighlight,
  LandingPageQuote,
  LandingPageTrustBadge,
} from "@/types/landing-page";

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
    <section className="mt-10">
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item, index) => (
          <li
            key={`${item.title}-${index}`}
            className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4"
          >
            {item.icon && (
              <Icon
                icon={item.icon}
                aria-hidden
                className="mt-0.5 size-6 shrink-0 text-brand"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900">{item.title}</p>
              {item.text && <p className="mt-1 text-sm text-gray-600">{item.text}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LandingTrustBadges({ items }: { items: LandingPageTrustBadge[] | null }) {
  if (!items?.length) return null;

  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {items.map((item, index) => (
        <li
          key={`${item.label}-${index}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
        >
          {item.icon && <Icon icon={item.icon} aria-hidden className="size-4 text-brand" />}
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export function LandingQuotes({ items }: { items: LandingPageQuote[] | null }) {
  if (!items?.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-gray-900">
        ক্রেতাদের মতামত
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            {/*
              Only rendered when the merchant recorded one. A default of five
              stars on every card would be a rating nobody gave — the same
              reason Testimonial.rating replaced a hardcoded 5.
            */}
            {typeof item.rating === "number" && (
              <div className="mb-2">
                <StarRating rating={item.rating} />
              </div>
            )}
            <p className="text-sm leading-relaxed text-gray-700">{item.text}</p>
            <div className="mt-3 flex items-center gap-2">
              {item.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- merchant-supplied host, not in next.config's allow-list
                <img
                  src={item.photoUrl}
                  alt=""
                  className="size-8 rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span
                  aria-hidden
                  className="grid size-8 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand"
                >
                  {item.name.trim().charAt(0)}
                </span>
              )}
              <span className="text-sm font-medium text-gray-900">{item.name}</span>
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
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-gray-900">সাধারণ জিজ্ঞাসা</h2>
      <ul className="mt-4 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
        {items.map((item, index) => (
          <li key={`${item.question}-${index}`}>
            {/*
              Native <details>, not a JavaScript accordion. It is open-and-close
              behaviour the browser already implements, it works before
              hydration, and on a page reached from an ad the first paint is the
              only one that reliably happens.
            */}
            <details className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-gray-900">
                {item.question}
                <span
                  aria-hidden
                  className="shrink-0 text-gray-400 transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.answer}</p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
