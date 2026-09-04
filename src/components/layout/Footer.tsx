import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import NewsletterForm from "@/components/layout/NewsletterForm";
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
        The column count is `auto-fit` rather than a fixed 5: the merchant
        controls how many link columns there are, and a hardcoded grid would
        either strand empty tracks or crush six columns into five slots.
      */}
      <div className="container-px grid site-container grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        <div>
          <h4 className="text-2xl font-bold">{brandName}</h4>
          {aboutText && <p className="mt-3 text-sm text-white/80">{aboutText}</p>}
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h5 className="mb-4 font-semibold">{column.title}</h5>
            <ul className="space-y-2.5 text-sm text-white/80">
              {column.links.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  {/* A real target, not `href="#"`. Footer links pointing
                      nowhere is the bug this whole change removes. */}
                  <Link href={link.href} className="hover:text-accent">
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
                  <Mail size={16} />
                  <a href={`mailto:${contact.email}`} className="hover:text-accent">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li className="flex items-center gap-2">
                  <Phone size={16} />
                  <a href={`tel:${contact.phone}`} className="hover:text-accent">
                    {contact.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
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
                className="hover:text-accent"
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
