import type { Metadata } from "next";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";
import { getStoreSettings } from "@/services/store-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return resolveMetadata({
    settings,
    routeGroup: "page",
    path: "/gift-cards",
    fallbackTitle: "Gift Cards",
  });
}

export default function GiftCardsPage() {
  return (
    <div className="container-px mx-auto max-w-3xl py-20 text-center">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Gift Cards</h1>
      <p className="text-gray-500">
        Gift card purchase and redemption isn&apos;t connected yet — hook this page up to your
        backend once it&apos;s ready.
      </p>
    </div>
  );
}
