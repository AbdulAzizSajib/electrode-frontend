import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import CartRail from "@/components/layout/CartRail";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CompareBar from "@/components/layout/CompareBar";
import StoreProvider from "@/store/StoreProvider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { getCurrentUser } from "@/services/auth";
import { getCategoryTree } from "@/services/category";
import { getStoreSettings } from "@/services/store-settings";

/**
 * The storefront shell: everything a shopper browses with.
 *
 * Split out of the root layout so a campaign landing page can render under
 * `app/(landing)/` with none of it — see that layout and the root one. The
 * parentheses are a Next.js route group and are not part of any URL, so every
 * route beneath this resolves exactly where it always did.
 *
 * The chrome lives HERE rather than in the root layout on purpose: rendering it
 * globally and hiding it with CSS on the landing page would still ship its
 * markup, its data fetches and its JavaScript to a page whose whole purpose is
 * to be one focused document.
 */
export default async function ShopLayout({ children }: LayoutProps<"/">) {
  // Independent of each other, so run them concurrently — the header renders on
  // every route, and awaiting these in series would add latency to every page.
  //
  // Settings is fetched once here and passed down rather than in each of the
  // four chrome components: they all render on every page, so fetching per
  // component would multiply the request, and fetching client-side would flash
  // default chrome before the merchant's own arrived.
  //
  // `getStoreSettings` is also called by the root layout above. That is one
  // cached read, not two requests: it is a tagged fetch over a singleton row,
  // deduped within the render pass.
  const [user, categories, settings] = await Promise.all([
    getCurrentUser(),
    getCategoryTree(),
    getStoreSettings(),
  ]);

  return (
    <StoreProvider isSignedIn={Boolean(user)}>
      {/* Inside StoreProvider so the drawers can read both the cart state and
          the scroll authority that locks the page behind them. */}
      <SmoothScrollProvider>
        <Header user={user} categories={categories} settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <CartDrawer />
        <CartRail />
        <MobileBottomNav contact={settings.contact} />
        <CompareBar />
      </SmoothScrollProvider>
    </StoreProvider>
  );
}
