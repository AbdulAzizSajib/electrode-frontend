import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import AgencyLogo from "@/components/ui/AgencyLogo";
import { AGENCY_CREDIT } from "@/lib/agency-credit";
import { resolveBrandSlot } from "@/lib/brand-slot";
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/ui/SocialIcons";
import type { SocialPlatform, StoreSettings } from "@/types/store-settings";

/**
 * The storefront footer, rendered entirely from merchant-managed settings.
 *
 * A server component: it was `"use client"` only to give the newsletter form
 * its submit handler, and that form has left the footer altogether — it is the
 * `NEWSLETTER` home page section now. The footer takes its content as props
 * from the root layout instead of fetching it in the browser, so the real
 * columns are in the first HTML response rather than replacing placeholders a
 * beat later.
 *
 * Every block collapses independently when unset — a store with no social
 * accounts gets no icon row rather than a row of missing images.
 *
 * THE SOCIAL ICONS BELONG TO THE BRAND BLOCK, not the bottom bar. They sit
 * directly under the about paragraph, where a visitor looking for "who is this
 * shop, and where else do they exist" is already reading. They used to sit on
 * the left of the bottom rail, detached from the brand they describe, which is
 * the arrangement this replaces. The setting behind them is untouched — this is
 * a change of position, not of data.
 *
 * THE BOTTOM BAR IS TWO HALVES: the store's own copyright on the left, and the
 * builder's credit on the right. See `lib/agency-credit` for why that credit is
 * a constant rather than a setting.
 *
 * `copyrightText` IS NO LONGER RENDERED HERE. The left half composes
 * `Copyright © <year> | <brand name>` from `storeName`/`siteNameAccent`, the
 * same pair the brand slot above resolves, so renaming the shop renames the
 * copyright and there is no second place to remember. `copyrightText` remains a
 * stored, editable column — it was not dropped, because deleting a populated
 * column to change a layout destroys merchant text for no gain — but nothing on
 * the storefront reads it. DO NOT "restore" it here as a bug fix; the admin
 * field says as much beside it.
 *
 * See server/openspec/changes/add-footer-credit-and-chat-widget, design.md
 * Decisions 2 and 3.
 */

const SOCIAL_ICONS: Record<
  SocialPlatform,
  (props: { size?: number; className?: string }) => React.ReactElement
> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  x: XIcon,
  pinterest: PinterestIcon,
};

/*
 * Focus treatment for every interactive element sitting on the brand bar —
 * the same rule the header applies to its on-brand controls. The browser's
 * own ring is blue, which is the one colour that vanishes against `bg-brand`,
 * so the accent carries it here too.
 */
const FOCUS_ON_BRAND =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function Footer({ settings }: { settings: StoreSettings }) {
  const { storeName, siteNameAccent, aboutText, contact, footerColumns, socialLinks } =
    settings;

  const brandName = [storeName, siteNameAccent].filter(Boolean).join(" ");
  const hasContact = Boolean(contact.address || contact.email || contact.phone);

  /*
   * Whether this slot shows the wordmark or artwork, and — in logo mode — which
   * image: the footer's own, or the header's when the footer has none of its
   * own. Shared with the header so the two cannot drift; see `lib/brand-slot`.
   */
  const brand = resolveBrandSlot(settings, "footer");

  return (
    <footer className="bg-brand text-white">
      {/*
        No newsletter strip here any more.

        It used to sit above these columns, on every page of the site, and the
        only way a merchant could remove it was to empty its heading. It is a
        home page section now — `components/home/Newsletter.tsx`, ordered and
        switched through `homeConfig` — so it appears once, on `/`, and the
        merchant can move it or turn it off. Do not reintroduce it here: this
        layout renders on every route, which is the property that made it
        unremovable in the first place.
      */}

      {/*
        Two grids, not one, below `lg`.

        The brand block sits outside the link grid so its heading and about
        paragraph get the full row on phones — sharing a row with a link column
        squeezed the prose into a ragged half-width strip. From `lg` up the
        outer flex turns back into a row and the brand takes a normal track.

        The link grid itself is `auto-fit` rather than a fixed 4: the merchant
        controls how many columns there are, and a hardcoded count would either
        strand empty tracks or crush extra columns into too few slots.
      */}
      <div className="container-px site-container flex flex-col gap-10 py-12 lg:flex-row lg:gap-x-10">
        <div className="lg:w-1/4 lg:shrink-0">
          {/*
            The brand slot. Still an <h4> in both modes — it heads this block,
            and a logo does not stop it being the heading — but its content is
            now whichever of the two the merchant chose, and it links home like
            the header's does. In logo mode the accessible name comes from the
            image's alt, which is this same wordmark.
          */}
          <h4 className="text-2xl font-bold">
            <Link href="/" className={`inline-block hover:text-accent ${FOCUS_ON_BRAND}`}>
              {brand.kind === "logo" ? (
                /*
                  Sized by the reserved height with the width left to the
                  artwork, exactly as in the header — see design.md Decision 3.
                  `max-w-full` keeps a wide logo inside the narrow brand column
                  rather than letting it stretch the footer's first track.
                */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.src}
                  alt={brand.alt}
                  style={{ height: brand.height }}
                  className="max-w-full w-auto object-contain"
                />
              ) : (
                brandName
              )}
            </Link>
          </h4>
          {aboutText && <p className="mt-3 text-sm text-white/80">{aboutText}</p>}

          {/*
            The social row, under the brand it belongs to. Collapses to nothing
            when the merchant has configured no accounts — `map` over an empty
            list renders no wrapper content, and the `mt-5` only costs a margin
            on a block that is already there.
          */}
          {socialLinks.length > 0 && (
            <div className="mt-5 flex gap-4 text-white/80">
              {socialLinks.map((social) => {
                const IconComponent = SOCIAL_ICONS[social.platform];
                // The backend constrains `platform` to this set, but a payload
                // from an older or newer API could still carry one we have no
                // icon for — skipping beats rendering an empty gap.
                if (!IconComponent) return null;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className={`hover:text-accent ${FOCUS_ON_BRAND}`}
                  >
                    <IconComponent size={18} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/*
          `items-start` keeps each cell's height to its own content. Without it
          the stretched cells make a short column's heading float in whitespace
          instead of sitting directly under the row above.
        */}
        <div className="grid flex-1 grid-cols-2 items-start gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h5 className="mb-4 font-semibold">{column.title}</h5>
              <ul className="space-y-2.5 text-sm text-white/80">
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    {/* A real target, not `href="#"`. Footer links pointing
                        nowhere is the bug this whole change removes. */}
                    <Link href={link.href} className={`hover:text-accent ${FOCUS_ON_BRAND}`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {hasContact && (
            <div>
              <h5 className="mb-4 font-semibold">About Information</h5>
              <ul className="space-y-3 text-sm text-white/80">
                {contact.address && (
                  <li className="flex gap-2">
                    <MapPin size={18} className="mt-0.5 shrink-0" />
                    <span>{contact.address}</span>
                  </li>
                )}
                {contact.email && (
                  <li className="flex items-center gap-2">
                    <Mail size={18} className="shrink-0" />
                    <a
                      href={`mailto:${contact.email}`}
                      className={`break-all hover:text-accent ${FOCUS_ON_BRAND}`}
                    >
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li className="flex items-center gap-2">
                    <Phone size={18} className="shrink-0" />
                    <a href={`tel:${contact.phone}`} className={`hover:text-accent ${FOCUS_ON_BRAND}`}>
                      {contact.phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/*
        Two halves, centred and stacked on phones and pushed apart from `sm` up.
        The social icons are NOT here any more — see the header comment.
      */}
      <div className="container-px flex site-container flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-white/80 sm:flex-row">
        {/*
          The store's own name, not `copyrightText`. `brandName` is the same
          composition the brand slot above uses, so the two cannot disagree —
          and a store that has set no accent simply reads as its `storeName`.
        */}
        <p>
          Copyright &copy; {new Date().getFullYear()}
          {brandName ? <> | <span className="font-semibold text-white">{brandName}</span></> : null}
        </p>

        {/*
          The builder's credit. A constant, not a setting — `lib/agency-credit`
          carries the reasoning. `target="_blank"` because it leaves the
          merchant's shop, and the shopper should keep their place in it.
        */}
        {/*
          `gap-2.5` here against the lockup's own `gap-1.5`, and the difference is
          deliberate. At one shared gap the prefix sat as tight to the mark as the
          mark's two halves sit to each other, so "by" read as part of the logo.
          The outer gap has to be the larger of the two for the eye to group the
          lockup before it groups the sentence.
        */}
        <p className="flex items-center gap-2.5">
          <span>{AGENCY_CREDIT.prefix}</span>
          {/*
            daisyUI's `aura-gold`: an animated conic-gradient ring with a blurred
            glow behind it, wrapping the mark. daisyUI is already a plugin on this
            app's Tailwind build (`globals.css`), so this is a stock component, not
            a local effect.

            `aura-sm` trims the ring's padding from the 2px default to 1px — this
            sits on one footer line beside 14px text, and the stock width reads as
            a frame around a badge rather than a glow around a logo.

            THE RING ANIMATES CONTINUOUSLY, on every page, forever. daisyUI honours
            `prefers-reduced-motion` by quartering the speed rather than stopping,
            which is its call and not one to override here.
          */}
        <span className="aura">
            <a
              href={AGENCY_CREDIT.href}
              target="_blank"
              rel="noopener noreferrer"
              /*
                NO HOVER TINT. `hover:text-accent` was here and had to go: the mark's
                letterforms are `currentColor`, so tinting the link recoloured the
                traced TOP as well as the text beside it — a logo changing colour
                under the cursor, which is the one thing a logo must not do. The
                focus ring stays; that is an accessibility affordance, not decoration.

                `text-base-content` rather than the footer's white, because the card
                below puts a light plate under the mark — `currentColor` has to be
                the ink that reads on THAT, not on the blue outside the ring.
              */
              className={`card inline-flex items-center bg-zinc-900 px-2.5 py-1.5 text-base-content ${FOCUS_ON_BRAND}`}
            >
              {/*
                An inline mark, not an <img>: its letterforms take `currentColor`,
                so the lockup reads white on this brand-coloured bar and inverts
                correctly anywhere else without a second asset. `name` becomes its
                accessible name, so the credit is announced once, as the agency.
              */}
              <AgencyLogo label={AGENCY_CREDIT.name} />
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
