import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";
import { getProducts } from "@/services/product";
import { getCampaignByPlacement } from "@/services/campaign";
import { getStoreSettings } from "@/services/store-settings";
import { getRecentBlogPosts } from "@/services/blog";
import { getTestimonials } from "@/services/testimonials";
import { categoryTabs } from "@/data/content";
import type { HomeSectionKey } from "@/types/store-settings";
import Hero from "@/components/home/Hero";
import BrandBar from "@/components/home/BrandBar";
import ProductSection from "@/components/home/ProductSection";
import MidBanners from "@/components/home/MidBanners";
import PerksBar from "@/components/home/PerksBar";
import DealOfWeek from "@/components/home/DealOfWeek";
import CategoryGrid from "@/components/home/CategoryGrid";
import Testimonials from "@/components/home/Testimonials";
import BlogSection from "@/components/home/BlogSection";

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
 * So the enabled set is derived first, the queries are built from it, and the
 * results are looked up BY KEY. Sections that fetch nothing (`BRAND_BAR` and
 * `PERKS_BAR` read local constants; `HERO` and `MID_BANNERS` fetch their own
 * banners internally) contribute nothing to the set — disabling those stops
 * their work by never rendering the component at all.
 *
 * The list arrives complete and current: the backend reconciles the stored
 * configuration against its own registry before serving it, so a section added
 * in a later release is already here and enabled, and an unrecognised one never
 * arrives. Nothing on this page repairs it — doing so would be a second,
 * divergent copy of that rule.
 *
 * See openspec/changes/add-homepage-section-toggles, design.md Decisions 4 & 5.
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
  const isOn = (key: HomeSectionKey) => sections.some((section) => section.key === key);

  /*
   * One query per enabled section, each asking the API for what that section's
   * title claims. This replaced a single 24-product fetch sliced four ways in
   * memory, where "Best Selling" was the first six of an arbitrary page and
   * "New Arrivals" was that same page reversed — which is not the newest
   * products, since the newest may not be in the fetched page at all.
   *
   * A disabled section's query is never issued: the ternary yields `null`
   * without calling the service, so nothing is requested and nothing is
   * awaited. `Promise.all` over the tuple keeps the enabled ones concurrent, so
   * they still cost one round trip between them.
   *
   * Every one of these resolves rather than rejects on failure, so an outage in
   * one section cannot fail the page — it shortens it.
   */
  const [bestSelling, featured, latest, dealCampaign, testimonials, blogPosts] =
    await Promise.all([
      isOn("BEST_SELLING")
        ? getProducts({ limit: SECTION_SIZE, sortBy: "totalSold", sortOrder: "desc" })
        : null,
      isOn("FEATURED_PRODUCTS") ? getProducts({ limit: SECTION_SIZE, isFeatured: true }) : null,
      isOn("NEW_ARRIVALS")
        ? getProducts({ limit: SECTION_SIZE, sortBy: "createdAt", sortOrder: "desc" })
        : null,
      isOn("DEAL_OF_WEEK") ? getCampaignByPlacement("DEAL_OF_WEEK") : null,
      // Both resolve rather than reject on failure, like the product queries
      // above — an outage in one section shortens the page, it does not fail it.
      isOn("TESTIMONIALS") ? getTestimonials() : null,
      isOn("BLOG") ? getRecentBlogPosts() : null,
    ]);

  /*
   * What each section renders, looked up by key.
   *
   * ENABLED AND NON-EMPTY ARE TWO INDEPENDENT CONDITIONS, and both are required.
   * Being switched on is the merchant saying they want the section; it is not a
   * claim that the section has anything to show. So every emptiness guard that
   * was in the old fixed JSX lives on here, beside its own section — a section
   * with no content returns null and renders nothing, exactly as before, so an
   * unseeded catalog still degrades to a shorter page rather than to empty
   * grids under populated headings.
   */
  const rendered: Record<HomeSectionKey, ReactNode> = {
    HERO: <Hero />,
    BRAND_BAR: <BrandBar />,
    FEATURED_CATEGORIES: <CategoryGrid title="Featured Categories" />,
    BEST_SELLING: bestSelling?.products.length ? (
      <ProductSection
        title="Best Selling Products"
        products={bestSelling.products}
        tabs={categoryTabs}
      />
    ) : null,
    MID_BANNERS: <MidBanners />,
    FEATURED_PRODUCTS: featured?.products.length ? (
      <ProductSection title="Featured Products" products={featured.products} />
    ) : null,
    PERKS_BAR: <PerksBar />,
    /* No fallback when the slot is empty: showing "any product with a
       sellingPrice" under a countdown would put a deadline on products
       that have none. */
    DEAL_OF_WEEK: dealCampaign ? <DealOfWeek campaign={dealCampaign} /> : null,
    NEW_ARRIVALS: latest?.products.length ? (
      <ProductSection title="New Arrivals" products={latest.products} />
    ) : null,
    /* Both sections are omitted entirely when the merchant has published
       nothing, matching how the merchandising rows above already handle an
       unseeded catalog. The components guard on this too — a heading over an
       empty grid is worse than a shorter page. */
    TESTIMONIALS: testimonials?.length ? <Testimonials testimonials={testimonials} /> : null,
    BLOG: blogPosts?.length ? <BlogSection posts={blogPosts} /> : null,
  };

  /*
   * With every section disabled this maps to nothing, and that is a valid
   * homepage — the shop's header and footer still render from the layout above,
   * with nothing between them. It is a state a merchant can reach deliberately,
   * so it must not be an error or quietly substituted with the default page.
   */
  return (
    <>
      {sections.map((section) => (
        // A keyed Fragment, not a wrapper element: several sections are
        // full-bleed bands that style themselves, and an extra div in the flow
        // would be a box they did not account for.
        <Fragment key={section.key}>{rendered[section.key]}</Fragment>
      ))}
    </>
  );
}
