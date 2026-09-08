import type { Metadata } from "next";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";
import { getStoreSettings } from "@/services/store-settings";

/**
 * Metadata only. `page.tsx` here is a client component — it holds form state —
 * and a client component cannot export `generateMetadata`, so the page's
 * metadata lives in a server layout wrapped around it. Same reason
 * `/track-order` has one.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return resolveMetadata({
    settings,
    routeGroup: "page",
    path: "/contact",
    fallbackTitle: "Contact Us",
    record: { description: "Get in touch with our team." },
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
