"use client";

/**
 * The footer's signup form.
 *
 * Split out of `Footer` for one reason: the form needs an event handler, and
 * everything else in the footer is static content the server can render. Keeping
 * the handler here lets the footer stay a server component and take its content
 * as props, instead of the whole footer shipping to the browser to support one
 * input.
 *
 * Still a no-op on submit — there is no subscriber endpoint yet. `preventDefault`
 * is what stops it navigating away and losing the page.
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
        className="w-full rounded-l bg-white px-4 py-3 text-sm text-gray-900 outline-none"
      />
      <button className="whitespace-nowrap rounded-r bg-accent px-5 py-3 text-sm font-semibold text-white">
        {buttonLabel || "Subscribe"}
      </button>
    </form>
  );
}
