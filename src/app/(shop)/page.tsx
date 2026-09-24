import type { Metadata } from "next";
import { Fragment, Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";
import { getStoreSettings } from "@/services/store-settings";
import { categoryTabs } from "@/data/content";
import type { HomeSectionKey } from "@/types/store-settings";
import Hero from "@/components/home/Hero";
import BrandBar from "@/components/home/BrandBar";
import MidBanners from "@/components/home/MidBanners";
import PerksBar from "@/components/home/PerksBar";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import { FEATURED_CATEGORIES_LAYOUTS } from "@/components/home/categories/registry";
import { PRODUCT_ROW_LAYOUTS } from "@/components/home/products/registry";
import Newsletter from "@/components/home/Newsletter";
import {
  BlogRow,
  DealOfWeekRow,
  ProductRow,
  TestimonialsRow,
} from "@/components/home/HomeSections";
import {
  BrandBarSkeleton,
  DealOfWeekSkeleton,
  MidBannersSkeleton,
} from "@/components/home/HomeSkeletons";
import { HERO_VARIANTS } from "@/components/home/hero/registry";
import { resolveSectionLayout } from "@/lib/section-layouts";

/** Products per merchandising row, matching the five-across deal layout. */
const SECTION_SIZE = 6;

/**
 * The homepage inherits its title and description from the root layout, but not
 * its canonical — a layout is not a page, so the root leaves `path` unset rather
 * than claiming every route in the site is `/`. This supplies it for `/` alone.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return resolveMetadata({ settings, routeGroup: "home", path: "/" });
}

/**
 * Which sections the merchant has switched on, and in what order.
 *
 * ── Why the fetch set is BUILT rather than fixed ──────────────────────────
 *
 * This page used to issue six concurrent queries in one `Promise.all` and
 * destructure them positionally, then render fixed JSX. Neither half survives a
 * configurable homepage:
 *
 *  - positional destructuring cannot skip a query. Omitting one shifts every
 *    binding after it, so the only way to "disable" a section under that shape
 *    is to fetch its data anyway and throw it away. A merchant who turns nine
 *    sections off would still pay for nine sections of data on every render —
 *    the page would get no faster, which is the opposite of what hiding
 *    something should do;
 *  - fixed JSX cannot express ORDER, and ordering is half the feature.
 *
 * So the enabled set is derived first and each section is looked up BY KEY —
 * with one exception that the key-addressed map below cannot hold. `MID_BANNERS`
 * appears once per promo banner group the merchant created, so a record keyed by
 * section key could only ever carry one of them; those entries are resolved by
 * GROUP ID instead. See `promoStrips` below.
 *
 * ── Why every section loads on its own ────────────────────────────────────
 *
 * The rows used to be fetched here, in one `Promise.all`, before the page
 * returned anything — so the whole homepage waited for its slowest section, and
 * the hero, brands and categories (which fetch inside their own components)
 * could not even START until that batch had settled. A shopper saw the route's
 * generic skeleton for the full duration.
 *
 * Now every section that needs data fetches it itself, inside its own
 * `<Suspense>` boundary with a skeleton shaped like it (HomeSections.tsx,
 * HomeSkeletons.tsx). The page returns as soon as settings are in hand — a
 * cached read the layout has already made — so the sections all start at once,
 * run concurrently as siblings, and each replaces its skeleton the moment its
 * own data arrives. Disabling a section still stops its work entirely: a
 * section that is not in the enabled list is never rendered, so its fetch never
 * runs. `PERKS_BAR` and `NEWSLETTER` fetch nothing (local constants, and copy
 * from the settings payload) and render directly.
 *
 * The list arrives complete and current: the backend reconciles the stored
 * configuration against its own registry before serving it, so a section added
 * in a later release is already here and enabled, and an unrecognised one never
 * arrives. Nothing on this page repairs it — doing so would be a second,
 * divergent copy of that rule.
 *
 * See server/openspec/changes/add-homepage-section-toggles, design.md Decisions 4 & 5.
 */
export default async function Home() {
  /*
   * The site-mode toggle, checked before anything else is fetched.
   *
   * When a merchant is running a campaign, `/` serves that campaign — and
   * serving it means redirecting to its own `/lp/<slug>` URL rather than
   * rendering it here. Three reasons:
   *
   *  - the landing page needs a shell with NO header, footer or cart drawer,
   *    and this route sits under `(shop)`'s layout, which renders all of them.
   *    Rendering the campaign here would wrap it in exactly what it must not
   *    have;
   *  - one campaign, one canonical URL, in both modes — which is what an ad
   *    platform and an analytics tool both want anyway;
   *  - the alternative, a middleware rewrite, would have to learn the active
   *    slug on every request to every route, to save one hop on one route.
   *
   * `getStoreSettings` is a tagged fetch the layout above already made, so this
   * is a cache read, not a second request. The backend pings that tag on every
   * site-mode and landing-page write, so the redirect appears and disappears on
   * the existing revalidation path — no redeploy, no waiting out a window.
   *
   * Only reached when the settings payload reports BOTH the mode and a live
   * page; the service degrades a half-configured pair to WEBSITE, so there is
   * no way to end up redirecting to `/lp/undefined`.
   *
   * STILL FIRST, ahead of the section config below: in landing-page mode this
   * route renders no sections at all, so reading them — let alone fetching for
   * them — would be work done for a page that is about to redirect.
   *
   * See add-single-product-landing-page design.md, Decision 6.
   */
  const settings = await getStoreSettings();

  if (settings.siteMode === "LANDING_PAGE" && settings.activeLandingPage) {
    redirect(`/lp/${settings.activeLandingPage.slug}`);
  }

  // The merchant's order, filtered to what is on. Order is preserved exactly —
  // position in this list is the order the page renders in.
  const sections = settings.homeConfig.filter((section) => section.enabled);

  /*
   * What each section renders, looked up by key. Building these elements runs
   * nothing: a component executes — and fetches — only when it is rendered, and
   * only the enabled sections below are.
   *
   * ENABLED AND NON-EMPTY ARE TWO INDEPENDENT CONDITIONS, and both are required.
   * Being switched on is the merchant saying they want the section; it is not a
   * claim that the section has anything to show. So every section that fetches
   * returns null when it has nothing, and an unseeded catalog still degrades to
   * a shorter page rather than to empty grids under populated headings.
   *
   * Each product row asks the API for exactly what its title claims. This
   * replaced a single 24-product fetch sliced four ways in memory, where "Best
   * Selling" was the first six of an arbitrary page and "New Arrivals" was that
   * same page reversed — which is not the newest products, since the newest may
   * not be in the fetched page at all.
   *
   * Testimonials and the blog sit far below the fold, so they stream in with no
   * placeholder: a skeleton nobody can see would only be extra markup.
   */
  /*
   * THE HERO AND THE FEATURED CATEGORIES ARE BUILT FROM THEIR CONFIG ENTRIES,
   * not from fixed elements like the ten below.
   *
   * Their arrangement is a merchant setting now, and the map is keyed by
   * section key alone — it cannot express "this section, with this layout".
   * Both halves need the answer, too: the component renders the arrangement,
   * and the Suspense fallback has to be the placeholder shaped like THAT
   * arrangement, or the page re-flows the moment the content lands — a slider
   * store shown the grid's two rows of boxes, or the reverse.
   *
   * `resolveSectionLayout` is the storefront's only defence, not a second copy
   * of the backend's rule: the payload always carries a resolved layout, and
   * this turns one from a newer server — or a `FALLBACK_SETTINGS` standing in
   * for an outage — into something this build can actually render.
   */
  const heroVariant = resolveSectionLayout(
    "HERO",
    settings.homeConfig.find((section) => section.key === "HERO")?.variant,
  );
  const { Skeleton: HeroSkeleton } = HERO_VARIANTS[heroVariant];

  const categoriesLayout = resolveSectionLayout(
    "FEATURED_CATEGORIES",
    settings.homeConfig.find((section) => section.key === "FEATURED_CATEGORIES")?.variant,
  );
  const { Skeleton: CategoriesSkeleton } = FEATURED_CATEGORIES_LAYOUTS[categoriesLayout];

  /*
   * The same resolution for each of the three product rows.
   *
   * A helper rather than three copies: the layout and the skeleton have to come
   * from the SAME answer, and three hand-written pairs is three chances for one
   * row to render a slider behind a grid's placeholder.
   */
  const productRow = (key: "BEST_SELLING" | "FEATURED_PRODUCTS" | "NEW_ARRIVALS") => {
    const layout = resolveSectionLayout(
      key,
      settings.homeConfig.find((section) => section.key === key)?.variant,
    );
    return { layout, Skeleton: PRODUCT_ROW_LAYOUTS[layout].Skeleton };
  };

  const bestSelling = productRow("BEST_SELLING");
  const featuredProducts = productRow("FEATURED_PRODUCTS");
  const newArrivals = productRow("NEW_ARRIVALS");

  /*
   * THE PROMO STRIPS, BUILT PER ENTRY — not from the map below.
   *
   * `rendered` is keyed by section key, and that is exactly the assumption
   * `MID_BANNERS` breaks: a merchant may have several promo strips, so the key
   * appears once per group and a key-addressed record can only hold one of
   * them. Each entry also needs its OWN group's layout, which the key alone
   * cannot supply.
   *
   * So the promo entries are resolved into a map keyed by GROUP id, and the
   * render loop reaches for that map when it meets a promo entry. A group named
   * by an entry but absent from `promoBannerGroups` yields nothing rather than
   * throwing — the backend already drops those entries, so this is a guard
   * against a payload assembled by an older server, not an expected path.
   */
  const promoStrips = new Map<string, ReactNode>(
    settings.promoBannerGroups.map((group) => [
      group.id,
      <Suspense key={group.id} fallback={<MidBannersSkeleton layout={group.layout} />}>
        <MidBanners groupId={group.id} layout={group.layout} />
      </Suspense>,
    ]),
  );

  const rendered: Record<Exclude<HomeSectionKey, "MID_BANNERS">, ReactNode> = {
    HERO: (
      <Suspense fallback={<HeroSkeleton />}>
        <Hero variant={heroVariant} />
      </Suspense>
    ),
    BRAND_BAR: (
      <Suspense fallback={<BrandBarSkeleton />}>
        <BrandBar />
      </Suspense>
    ),
    FEATURED_CATEGORIES: (
      <Suspense fallback={<CategoriesSkeleton />}>
        <FeaturedCategories title="Featured Categories" layout={categoriesLayout} />
      </Suspense>
    ),
    BEST_SELLING: (
      <Suspense fallback={<bestSelling.Skeleton />}>
        <ProductRow
          title="Best Selling Products"
          query={{ limit: SECTION_SIZE, sortBy: "totalSold", sortOrder: "desc" }}
          tabs={categoryTabs}
          layout={bestSelling.layout}
        />
      </Suspense>
    ),
    FEATURED_PRODUCTS: (
      <Suspense fallback={<featuredProducts.Skeleton />}>
        <ProductRow
          title="Featured Products"
          query={{ limit: SECTION_SIZE, isFeatured: true }}
          layout={featuredProducts.layout}
        />
      </Suspense>
    ),
    PERKS_BAR: <PerksBar />,
    DEAL_OF_WEEK: (
      <Suspense fallback={<DealOfWeekSkeleton />}>
        <DealOfWeekRow />
      </Suspense>
    ),
    NEW_ARRIVALS: (
      <Suspense fallback={<newArrivals.Skeleton />}>
        <ProductRow
          title="New Arrivals"
          query={{ limit: SECTION_SIZE, sortBy: "createdAt", sortOrder: "desc" }}
          layout={newArrivals.layout}
        />
      </Suspense>
    ),
    TESTIMONIALS: (
      <Suspense fallback={null}>
        <TestimonialsRow />
      </Suspense>
    ),
    BLOG: (
      <Suspense fallback={null}>
        <BlogRow />
      </Suspense>
    ),
    /* Fetches nothing — its copy rides the settings payload this route already
       holds — exactly like PERKS_BAR. And no emptiness guard: unlike the rows
       above, its content is the form rather than the heading, so a blank
       heading shortens the block instead of removing it. See the component. */
    NEWSLETTER: <Newsletter newsletter={settings.newsletter} />,
  };

  /*
   * With every section disabled this maps to nothing, and that is a valid
   * homepage — the shop's header and footer still render from the layout above,
   * with nothing between them. It is a state a merchant can reach deliberately,
   * so it must not be an error or quietly substituted with the default page.
   */
  return (
    <>
      {sections.map((section) => {
        /*
         * KEYED BY KEY *AND* GROUP, because `MID_BANNERS` can appear several
         * times and duplicate React keys in one list are a correctness bug, not
         * a warning — React reconciles two siblings sharing a key as one, so the
         * second strip would silently never mount.
         */
        const key =
          section.key === "MID_BANNERS"
            ? `${section.key}:${section.groupId ?? ""}`
            : section.key;

        const content =
          section.key === "MID_BANNERS"
            ? section.groupId
              ? promoStrips.get(section.groupId)
              : null
            : rendered[section.key];

        // A keyed Fragment, not a wrapper element: several sections are
        // full-bleed bands that style themselves, and an extra div in the flow
        // would be a box they did not account for.
        return <Fragment key={key}>{content}</Fragment>;
      })}
    </>
  );
}
