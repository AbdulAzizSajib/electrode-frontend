"use client";

/**
 * The newsletter signup form.
 *
 * NOT the footer's any more — it is the input half of the `NEWSLETTER` home
 * page section (`components/home/Newsletter.tsx`). The file stays here, under
 * `layout/`, only because moving it would be churn for no gain.
 *
 * Split out of its parent for one reason: the form needs an event handler, and
 * everything around it is static content the server can render. Keeping the
 * handler here lets the band stay a server component and take its content as
 * props, instead of the whole section shipping to the browser to support one
 * input.
 *
 * Still a no-op on submit — there is no subscriber endpoint yet, and moving the
 * block did not give it one. `preventDefault` is what stops it navigating away
 * and losing whatever the shopper was doing. Do not make this look like it
 * succeeded until something is actually storing addresses.
 */
export default function NewsletterForm({
  placeholder,
  buttonLabel,
}: {
  placeholder?: string;
  buttonLabel?: string;
}) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full max-w-md gap-0 md:w-auto"
    >
      <input
        type="email"
        placeholder={placeholder || "Email"}
        aria-label="Email address"
        className="w-full rounded-l border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand"
      />
      <button className="whitespace-nowrap rounded-r bg-accent px-5 py-3 text-sm font-semibold text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark">
        {buttonLabel || "Subscribe"}
      </button>
    </form>
  );
}
