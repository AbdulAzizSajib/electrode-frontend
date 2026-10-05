import ServerIcon from "@/components/ui/ServerIcon";

/**
 * A mid-page call to action: one button back to the order form, and — when the
 * merchant configured a number — one to call instead.
 *
 * REPEATED DOWN THE PAGE, pointing at the SAME form. A campaign page is read in
 * one scroll, and the moment a shopper is convinced is not predictable: it may
 * be the price, the guarantee, the reviews, or a usage idea that finally
 * answers "what would I do with it". A single button at the bottom asks them to
 * remember they were convinced and scroll to act on it.
 *
 * Every instance is an anchor to `#order-form`, never a second form. Two forms
 * would mean two sets of state, two quotes, and a shopper who fills in one and
 * submits the other.
 *
 * The phone action exists because a shopper who will not type their address
 * into a page they met thirty seconds ago will still ring a number — and for
 * this audience that is a large fraction of them, not an edge case.
 */
export default function LandingOrderCta({
  label,
  phone,
  className = "mt-10",
}: {
  label: string;
  /** Null renders no dial action at all — never a disabled or placeholder one. */
  phone: string | null;
  className?: string;
}) {
  return (
    <section className={`${className} flex flex-wrap items-center justify-center gap-3`}>
      <a
        href="#order-form"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-lp-accent px-8 py-3.5 text-base font-semibold text-lp-accent-contrast shadow-[0_4px_15px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
      >
        {label}
      </a>

      {phone && (
        <a
          /*
           * `tel:` with the number as authored. It is validated as a Bangladeshi
           * mobile server-side, so it is dialable as stored — reformatting it
           * here would be a second opinion about a value the backend already
           * settled.
           */
          href={`tel:${phone}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-lp-accent bg-lp-surface px-8 py-3.5 text-base font-semibold text-lp-accent transition hover:-translate-y-0.5"
        >
          <ServerIcon name="lucide:phone" aria-hidden className="size-4" />
          ফোনে অর্ডার করুন
        </a>
      )}
    </section>
  );
}
