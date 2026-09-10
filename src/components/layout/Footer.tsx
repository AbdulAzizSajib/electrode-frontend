import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import NewsletterForm from "@/components/layout/NewsletterForm";
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
 * A server component now: it was `"use client"` only to give the newsletter
 * form its submit handler, which has moved to `NewsletterForm`. That lets the
 * footer take its content as props from the root layout instead of fetching it
 * in the browser, so the real columns are in the first HTML response rather
 * than replacing placeholders a beat later.
 *
 * Every block collapses independently when unset — a store with no social
 * accounts gets no icon row rather than a row of missing images.
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
  const {
    storeName,
    siteNameAccent,
    aboutText,
    copyrightText,
    contact,
    footerColumns,
    socialLinks,
    newsletter,
  } = settings;

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
      {newsletter.heading && (
        <div className="container-px site-container border-b border-white/10 py-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl font-semibold">{newsletter.heading}</h3>
              {newsletter.subtext && (
                <p className="mt-1 text-sm text-white/80">{newsletter.subtext}</p>
              )}
            </div>
            <NewsletterForm
              placeholder={newsletter.placeholder}
              buttonLabel={newsletter.buttonLabel}
            />
          </div>
        </div>
      )}

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

      <div className="container-px flex site-container flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-white/80 sm:flex-row">
        <div className="flex gap-4">
          {socialLinks.map((social) => {
            const IconComponent = SOCIAL_ICONS[social.platform];
            // The backend constrains `platform` to this set, but a payload from
            // an older or newer API could still carry one we have no icon for —
            // skipping beats rendering an empty gap.
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
        <p>
          &copy; {new Date().getFullYear()}
          {copyrightText ? `, ${copyrightText}` : ""}
        </p>
      </div>
    </footer>
  );
}
