import type { Metadata } from "next";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";
import { getStoreSettings } from "@/services/store-settings";

/**
 * Metadata only — `page.tsx` is a client component holding the lookup form's
 * state, and a client component cannot export `generateMetadata`.
 *
 * Grouped as `page` rather than `account`: order tracking is deliberately open
 * to guests (see `proxy.ts`, where `/track-order` is left out of the protected
 * routes), so it is a public page and indexable like any other.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return resolveMetadata({
    settings,
    routeGroup: "page",
    path: "/track-order",
    fallbackTitle: "Track Your Order",
    record: { description: "Look up an order and see its current status." },
  });
}

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
