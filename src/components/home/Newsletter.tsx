import NewsletterForm from "@/components/layout/NewsletterForm";
import type { Newsletter as NewsletterContent } from "@/types/store-settings";

/**
 * The email signup band, as a home page section.
 *
 * It lived inside `Footer` until add-favicon-and-newsletter-section — on every
 * page of the site, and removable only by emptying its heading, which was an
 * off switch by accident rather than by design. It is now an ordinary member of
 * `homeConfig`: the merchant switches it on or off and drags it wherever they
 * want, like every other section.
 *
 * ── A server component wrapping a client one ──────────────────────────────
 *
 * `NewsletterForm` is `"use client"` for exactly one reason — the submit
 * handler. Everything around it is static content the server renders, so that
 * split is kept: this component stays on the server and only the form crosses
 * the boundary. The alternative, making the whole band a client component,
 * would ship the heading and subtext to the browser to support one input.
 *
 * Content arrives as a prop rather than being fetched here. The page already
 * holds the settings object; calling `getStoreSettings` again would be a second
 * cache read for a value that is already on the stack.
 *
 * ── Styling itself, because it no longer has a footer to sit in ───────────
 *
 * In the footer this block inherited `bg-brand text-white`, and its white text
 * and `text-white/80` subtext leaned on it. Lifted onto the home page, all of
 * that would have been white-on-white. So it carries its own full-bleed band,
 * exactly as `PerksBar` and the other self-styling sections do — which is also
 * why the page renders sections inside a bare `Fragment` rather than a wrapper
 * element.
 *
 * The `border-b border-white/10` divider it used to carry is gone: it separated
 * the block from the footer's link columns and now separates nothing.
 */
export default function Newsletter({ newsletter }: { newsletter: NewsletterContent }) {
  /*
   * No emptiness guard around the block, and that is deliberate.
   *
   * The old footer rendered this only `{newsletter.heading && ...}`, which is
   * how a merchant used to remove it. Keeping that condition would now mean a
   * section the merchant explicitly switched ON silently failing to appear
   * because a text field is blank, with nothing in the admin explaining why.
   *
   * Being enabled is the merchant asking for the section. The content here is
   * the FORM, not the heading — so a blank heading drops the heading line and
   * nothing else. Contrast the product rows on this page, which do return null
   * when empty: a heading over an empty grid shows the shopper nothing, whereas
   * a signup form with no heading is still a signup form.
   */
  return (
    <section className="bg-brand text-white">
      <div className="container-px site-container flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        {(newsletter.heading || newsletter.subtext) && (
          <div>
            {newsletter.heading && (
              <h2 className="text-xl font-semibold">{newsletter.heading}</h2>
            )}
            {newsletter.subtext && (
              <p className="mt-1 text-sm text-white/80">{newsletter.subtext}</p>
            )}
          </div>
        )}
        <NewsletterForm
          placeholder={newsletter.placeholder}
          buttonLabel={newsletter.buttonLabel}
        />
      </div>
    </section>
  );
}
