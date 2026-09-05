"use client";

import Script from "next/script";

/**
 * The Meta pixel, for measuring the ads this page exists to serve.
 *
 * The merchant supplies an ID, never markup. The bootstrap below is written by
 * this app; the only thing that comes from the database is `pixelId`, which the
 * backend validates as `^\d{5,20}$` and which is interpolated here through
 * `JSON.stringify` so it lands as a quoted string literal and nothing else.
 * Merchant input therefore cannot reach the page as a tag, a URL or a script
 * body — the same posture `theme.font.url` takes, where the URL is rebuilt from
 * validated components rather than stored raw.
 *
 * Two events only, both of which the merchant would otherwise have no way to
 * see: the page view, and the purchase. There is deliberately no custom-event
 * authoring — that is a script-injection surface with no bounded shape, and a
 * campaign page does not need one.
 *
 * `afterInteractive`: the pixel must not compete with the hero image or the
 * order form for the first paint. Ad traffic arrives on mobile connections,
 * and a measurement script is never worth a slower page than the one being
 * measured.
 */
export default function FacebookPixel({ pixelId }: { pixelId: string }) {
  return (
    <>
      <Script id="fb-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${JSON.stringify(pixelId)});
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/*
          The no-JavaScript fallback the pixel normally ships. `next/image` is
          not appropriate for a 1x1 tracking beacon on a third-party host, and
          the URL is built from the same validated id.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

/**
 * Reports a completed order to the pixel, if one is installed.
 *
 * A no-op when the merchant has set no pixel id, and a no-op when the script
 * has not loaded — an ad blocker or a slow network must never turn a successful
 * order into a thrown error on the confirmation the shopper is reading.
 */
export function trackLandingPagePurchase(
  pixelId: string | null,
  value: number,
  currency: string,
) {
  if (!pixelId) return;

  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== "function") return;

  try {
    fbq("track", "Purchase", { value, currency });
  } catch {
    // Measurement is never worth breaking the confirmation over.
  }
}
