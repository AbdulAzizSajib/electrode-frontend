"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  LayoutGrid,
  Menu,
  Repeat,
  ShoppingBag,
  User,
  Zap,
} from "lucide-react";
import clsx from "clsx";
import MobileMenuDrawer from "@/components/layout/MobileMenuDrawer";
import SearchBox from "@/components/layout/SearchBox";
import { resolveAnnouncementLink } from "@/services/store-settings";
import type { StoreSettings } from "@/types/store-settings";
import { EMPTY_CART, useGetCartQuery } from "@/store/cartApi";
import { useGetWishlistCountQuery } from "@/store/wishlistApi";
import {
  selectCompareCount,
  selectIsCompareHydrated,
} from "@/store/compareSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openCart } from "@/store/uiSlice";
import type { AuthUser } from "@/types/auth";
import type { CategoryNode } from "@/types/category";
import { filterNavForFeatures } from "@/lib/catalog-features";

/**
 * Focus treatment for controls sitting on the brand bar.
 *
 * The browser's own focus ring is blue, which is the one colour that vanishes
 * against `bg-brand` — so the accent carries it, offset against the bar behind
 * it. Every interactive element in the header uses one of these two, because a
 * keyboard shopper who loses the ring on a single control has lost the header.
 */
const FOCUS_ON_BRAND =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** The same idea inside the white dropdown panels, drawn inward so a row at the
 *  panel's edge keeps its whole ring instead of clipping it. */
const FOCUS_IN_PANEL =
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand";

/**
 * The count bubble. Same geometry as the mobile bottom nav's — `min-w` plus
 * horizontal padding rather than a fixed square, so a two- or three-digit count
 * grows the pill instead of spilling out of it.
 *
 * Always `aria-hidden`: every badge in this header sits beside a label that
 * already states the number, so announcing it twice is noise.
 */
const BADGE =
  "absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-bold text-white";

/** The desktop icon-plus-label actions, so the four cannot drift apart. */
const HEADER_ACTION = clsx(
  "items-center gap-2 transition-colors hover:text-accent motion-reduce:transition-none",
  FOCUS_ON_BRAND,
);

export default function Header({
  user,
  categories,
  settings,
}: {
  user: AuthUser | null;
  categories: CategoryNode[];
  /** Merchant-managed chrome, fetched once in the root layout. */
  settings: StoreSettings;
}) {
  const { announcementBar, contact, catalogConfig } = settings;
  const { showWishlist, showCompare } = catalogConfig;

  /*
   * Merchant-authored navigation, minus any entry leading to a feature this
   * shop no longer offers — that entry would be a menu item pointing at a page
   * that 404s. Read from the settings prop rather than `getCatalogFeatures()`:
   * the header is handed the whole settings object already, so there is no
   * reason to reach for the module-scope copy the components without a props
   * path use.
   *
   * Filtered once, here, because the same list is handed to the mobile drawer
   * below — computing it twice is how the two menus would come to disagree.
   */
  const mainNav = useMemo(
    () => filterNavForFeatures(settings.mainNav, catalogConfig),
    [settings.mainNav, catalogConfig],
  );

  const dispatch = useAppDispatch();
  // The cart query lives here because the header is on every page — it keeps
  // the cart cached so the drawer opens instantly, and the count updates
  // straight from the cache after any mutation invalidates it.
  const { data: cart = EMPTY_CART } = useGetCartQuery();
  const itemCount = cart.itemCount;
  // Skipped entirely for a signed-out visitor: the endpoint 401s without a
  // session, and the header is on every page, so this would 401 site-wide.
  // Skipped again when the shop does not offer a wishlist — there is nowhere
  // left to show the count, so subscribing would be a request per page view
  // whose result nothing reads.
  const { data: wishlistCount = 0 } = useGetWishlistCountQuery(undefined, {
    skip: !user || !showWishlist,
  });
  // Local state, not a query: the compare list lives in `localStorage` and works
  // signed out, so there is nothing to fetch and nothing to skip.
  const compareCount = useAppSelector(selectCompareCount);
  const isCompareHydrated = useAppSelector(selectIsCompareHydrated);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  // The whole nav row, not just the categories block: an outside click has to
  // close whichever menu is open, and they do not share a container otherwise.
  const navRef = useRef<HTMLDivElement>(null);
  const categoriesButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenus = useCallback(() => {
    setOpenMenu(null);
    setOpenCategory(null);
  }, []);

  useEffect(() => {
    if (!openMenu) return;

    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeMenus();
      }
    }
    // Escape is the only way out for a keyboard shopper — an outside click is
    // not a gesture they have. Focus goes back to the trigger rather than to
    // <body>, so the next Tab resumes from where they were.
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const wasCategories = openMenu === "categories";
      closeMenus();
      if (wasCategories) categoriesButtonRef.current?.focus();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenu, closeMenus]);

  /**
   * Whether a nav destination is the page being read.
   *
   * Compares the path alone, as the feature filter does — a stored href may
   * carry a query, and `/products?sort=new` still marks `/products`. A child
   * route counts as its parent so `/products/anker-321` keeps Shop lit.
   */
  const isCurrent = useCallback(
    (href: string) => {
      const path = href.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
      if (path === "/") return pathname === "/";
      return pathname === path || pathname.startsWith(`${path}/`);
    },
    [pathname],
  );

  /*
   * Hover opens the mega menus, but only under a real mouse. On a touch tablet
   * — still `md` and up, so still this nav — a tap fires `pointerenter` and
   * then `click`, which would open the menu and immediately toggle it shut. The
   * pointer type is the thing that actually distinguishes the two, so it is
   * what the handlers test.
   */
  const hoverOpen = (label: string) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    setOpenMenu(label);
    setOpenCategory(null);
  };
  const hoverClose = (label: string) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    setOpenMenu((m) => (m === label ? null : m));
  };

  return (
    <>
      <header className="bg-brand shadow-sm">
        {/* Announcement bar. Rendered only when the merchant has switched it on —
            and omitted entirely rather than emptied, so the header below it does
            not sit on a stray border or a collapsed row. */}
        {announcementBar.enabled && (
          <div className="hidden border-b border-white/30 bg-brand text-white md:block">
            <div className="container-px flex site-container items-center justify-between gap-6 py-2.25 text-[15px]">
              {/* Truncated rather than wrapped: merchant text of any length has
                  to leave the links on the same single row it shares. */}
              <p className="min-w-0 truncate">{announcementBar.text}</p>
              <div className="flex shrink-0 items-center gap-4">
                {(announcementBar.links ?? []).map((link, index) => {
                  // A link bound to the store's phone or email resolves against
                  // the contact block here, so changing the number in the admin
                  // updates the bar and the footer together.
                  const { label, href } = resolveAnnouncementLink(link, contact);
                  const isExternal = /^https?:\/\//.test(href);
                  const className = clsx(
                    "flex items-center gap-2 whitespace-nowrap font-light hover:underline hover:underline-offset-4",
                    FOCUS_ON_BRAND,
                  );

                  const body = (
                    <>
                      {link.icon && <Icon icon={link.icon} className="shrink-0" aria-hidden />}
                      {label}
                    </>
                  );

                  // `mailto:`/`tel:`/external targets are not routes, so they use
                  // a plain anchor; internal ones keep client-side navigation.
                  return isExternal || href.includes(":") ? (
                    <a
                      key={index}
                      href={href}
                      {...(isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={className}
                    >
                      {body}
                    </a>
                  ) : (
                    <Link key={index} href={href} className={className}>
                      {body}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main header */}
        <div className="border-b border-white/30">
          <div className="container-px flex site-container items-center gap-4 py-4.75 text-white">
            {/* The menu button and the account icon are given equal flex-basis so
                the logo between them lands on the true centre of the row — sizing
                them to their own content would offset it by the difference. Both
                collapse at `md`, where the logo goes back to the left.

                The `before` pseudo-element widens the tap area to roughly 52px
                square without touching that basis. Padding would be measured
                inside the 32px box and squeeze the icon; a bigger box would move
                the wordmark off centre at 320px. This moves neither. */}
            <button
              type="button"
              className={clsx(
                "relative flex basis-8 justify-start before:absolute before:-inset-x-2.5 before:-inset-y-3 before:content-[''] md:hidden",
                FOCUS_ON_BRAND,
              )}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={26} />
            </button>

            {/*
              `shrink-0` only from `md` up. Keeping it below that would let the
              wordmark push past a narrow (320px) viewport instead of shrinking
              between the two icons, so the row is allowed to compress it there.
            */}
            <Link
              href="/"
              className={clsx(
                "whitespace-nowrap text-center text-3xl font-semibold tracking-tight max-md:flex-1 sm:text-4xl md:shrink-0 md:text-left",
                FOCUS_ON_BRAND,
              )}
            >
              {settings.storeName}
              {settings.siteNameAccent && (
                <span className="text-accent ml-2">{settings.siteNameAccent}</span>
              )}
            </Link>

            {/* Mobile-only account entry. The bottom nav carries phone, chat, home,
                shop and cart, so this is the one primary action without a home
                there — hence keeping it in the header rather than crowding the
                bar with a sixth item. */}
            <Link
              href={user ? "/account" : "/account/login"}
              className={clsx(
                "relative flex basis-8 justify-end before:absolute before:-inset-x-2.5 before:-inset-y-3 before:content-[''] md:hidden",
                FOCUS_ON_BRAND,
              )}
              aria-label={user ? "My account" : "Sign in or register"}
            >
              <User size={26} />
            </Link>

            <SearchBox className="ml-auto hidden max-w-2xl flex-1 md:block" />

            {/* Every child here is desktop-only now that the cart moved to the
                bottom nav, so the whole group is too — otherwise its `ml-auto`
                would still push the logo around on mobile.

                All four read label-then-value, top line plain and bottom line
                bold. Mixed orders and three different weights across four
                neighbouring controls is the kind of drift nobody names but
                everybody feels. */}
            <div className="ml-auto hidden items-center gap-5 text-sm md:flex">
              {showWishlist && (
                <Link href="/wishlist" className={clsx("hidden lg:flex", HEADER_ACTION)}>
                  <span className="relative">
                    <Heart size={22} />
                    {wishlistCount > 0 && (
                      <span className={BADGE} aria-hidden>
                        {wishlistCount}
                      </span>
                    )}
                  </span>
                  <span className="leading-tight">
                    Wishlist
                    <span className="block font-semibold">{wishlistCount} Saved</span>
                  </span>
                </Link>
              )}

              {/* Only once the stored list has been read — before that the count is
                  zero by construction and would tick up a beat after the page
                  settled. */}
              {showCompare && isCompareHydrated && compareCount > 0 && (
                <Link href="/compare" className={clsx("hidden lg:flex", HEADER_ACTION)}>
                  <span className="relative">
                    <Repeat size={22} />
                    <span className={BADGE} aria-hidden>
                      {compareCount}
                    </span>
                  </span>
                  <span className="leading-tight">
                    Compare
                    <span className="block font-semibold">{compareCount} Added</span>
                  </span>
                </Link>
              )}

              {/* Hidden below `md`: the mobile bottom nav already carries the cart,
                  and two cart buttons on one screen is just noise. */}
              <button
                type="button"
                onClick={() => dispatch(openCart())}
                className={clsx("hidden md:flex", HEADER_ACTION)}
              >
                <span className="relative">
                  <ShoppingBag size={22} />
                  {itemCount > 0 && (
                    <span className={BADGE} aria-hidden>
                      {itemCount}
                    </span>
                  )}
                </span>
                <span className="text-left leading-tight">
                  My Cart
                  <span className="block font-semibold">{itemCount} Items</span>
                </span>
              </button>

              <Link
                href={user ? "/account" : "/account/login"}
                className={clsx("hidden md:flex", HEADER_ACTION)}
              >
                <User size={22} />
                <span className="leading-tight">
                  {user ? "Hello" : "Account"}
                  {/* A single very long token is the failure case a first name
                      cannot rule out, so the line is capped rather than left to
                      stretch the bar. Falls back to the neutral greeting when
                      the account carries no name at all. */}
                  <span className="block max-w-36 truncate font-semibold">
                    {user ? user.name?.trim().split(" ")[0] || "My account" : "Register or Login"}
                  </span>
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile search. Its own row rather than a tap-to-open icon: search is
              the primary way to find a product on a small screen, so it should not
              cost an extra tap. */}
          <div className="container-px site-container pb-3 md:hidden">
            <SearchBox />
          </div>
        </div>
      </header>

      {/*
        Nav — the only header row that stays pinned. The announcement bar and the
        main row above it scroll away, so browsing keeps the category menu within
        reach without the full header eating the viewport.

        Deliberately a SIBLING of <header>, not a child of it. A sticky element can
        only travel inside its own parent's box, and <header> is exactly as tall as
        its rows — nested there, the nav would have zero distance to stick through
        and would scroll away like everything else. As a direct child of the body's
        flex column it sticks against the page instead.

        No `overflow` is set here on purpose: the mega-menu dropdowns are
        `absolute` children that have to escape this row's box, and clipping them
        is exactly what an overflow value would do.
      */}
      <nav
        aria-label="Main"
        className="sticky top-0 z-40 hidden bg-brand text-white shadow-sm md:block"
      >
        <div
          ref={navRef}
          className="container-px relative flex site-container items-center gap-8 py-4 text-base font-medium"
        >
          {/* Shop By Categories mega menu. Omitted entirely when the catalog
              is empty or unreachable — better no menu than dead links. */}
          {categories.length > 0 && (
            <div className="relative border-r border-white/30 pr-6">
              {/* `min-w-64` is the panel's own width. It is what the hand-tuned
                  margin between the label and the chevron was approximating, and
                  saying it this way means the chevron lands on the dropdown's
                  right edge for any merchant font rather than only the shipped
                  one — while a wider label still grows the button instead of
                  overflowing it. */}
              <button
                ref={categoriesButtonRef}
                type="button"
                aria-expanded={openMenu === "categories"}
                aria-controls="header-categories-menu"
                className={clsx(
                  "flex min-w-64 items-center justify-between gap-2 transition-colors hover:text-accent motion-reduce:transition-none",
                  FOCUS_ON_BRAND,
                )}
                onClick={() =>
                  setOpenMenu((m) => {
                    if (m === "categories") {
                      setOpenCategory(null);
                      return null;
                    }
                    return "categories";
                  })
                }
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid size={20} />
                  Shop By Categories
                </span>
                <ChevronDown
                  size={14}
                  className={clsx(
                    "shrink-0 transition-transform motion-reduce:transition-none",
                    openMenu === "categories" && "rotate-180",
                  )}
                />
              </button>

              {openMenu === "categories" && (
                // `top-full` plus the row's own bottom padding, so the panel
                // meets the nav's lower edge instead of the magic offset that
                // left it floating inside the bar. The padding doubles as the
                // bridge the pointer crosses without leaving the group.
                <div
                  id="header-categories-menu"
                  className="absolute left-0 top-full z-50 pt-4 text-gray-700"
                >
                  <div className="flex animate-menu-in overflow-hidden rounded-b-lg bg-white shadow-xl motion-reduce:animate-none">
                    <div className="w-64">
                      {categories.map((cat) => {
                        const href = `/products?category=${encodeURIComponent(cat.slug)}`;
                        const isOpen = openCategory === cat.id;

                        return (
                          <div
                            key={cat.id}
                            className="flex items-center border-b border-gray-100 last:border-b-0"
                            onPointerEnter={(e) => {
                              if (e.pointerType !== "mouse") return;
                              setOpenCategory(cat.children.length > 0 ? cat.id : null);
                            }}
                          >
                            {/* The name navigates, always. Making the whole row
                                a toggle — as it was — left a parent category
                                with no way to be browsed on its own, while the
                                mobile drawer has always let it be. Only the
                                chevron opens the second panel, and only rows
                                that have one carry it. */}
                            <Link
                              href={href}
                              onClick={closeMenus}
                              className={clsx(
                                "flex-1 px-5 py-2.5 text-base transition-colors hover:bg-gray-100 hover:text-brand motion-reduce:transition-none",
                                isOpen && "bg-gray-50 text-brand",
                                FOCUS_IN_PANEL,
                              )}
                            >
                              {cat.name}
                            </Link>
                            {cat.children.length > 0 && (
                              <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-label={`${isOpen ? "Hide" : "Show"} ${cat.name} subcategories`}
                                onClick={() =>
                                  setOpenCategory((c) => (c === cat.id ? null : cat.id))
                                }
                                className={clsx(
                                  "flex h-10 w-10 shrink-0 items-center justify-center transition-colors hover:text-brand motion-reduce:transition-none",
                                  isOpen ? "text-brand" : "text-gray-400",
                                  FOCUS_IN_PANEL,
                                )}
                              >
                                <ChevronRight size={14} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {openCategory &&
                      (() => {
                        const active = categories.find((c) => c.id === openCategory);
                        if (!active?.children.length) return null;
                        return (
                          <div className="w-56 border-l border-gray-100 py-2.5">
                            {active.children.map((child) => (
                              <Link
                                key={child.id}
                                href={`/products?category=${encodeURIComponent(child.slug)}`}
                                onClick={closeMenus}
                                className={clsx(
                                  "block px-5 py-2.5 text-sm transition-colors hover:bg-gray-50 hover:text-brand motion-reduce:transition-none",
                                  FOCUS_IN_PANEL,
                                )}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        );
                      })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {mainNav.map((link, index) =>
            link.children?.length ? (
              <div
                key={link.label}
                className="relative"
                onPointerEnter={hoverOpen(link.label)}
                onPointerLeave={hoverClose(link.label)}
                // Tabbing into the group opens it and tabbing past it closes it,
                // which is the whole reason these children were reachable by
                // mouse and by nothing else.
                onFocus={() => setOpenMenu(link.label)}
                onBlur={(e) => {
                  if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                  setOpenMenu((m) => (m === link.label ? null : m));
                }}
              >
                <div className="flex items-center gap-1">
                  <Link
                    href={link.href}
                    onClick={closeMenus}
                    aria-current={isCurrent(link.href) ? "page" : undefined}
                    className={clsx(
                      "transition-colors hover:text-accent motion-reduce:transition-none",
                      isCurrent(link.href) && "text-accent",
                      FOCUS_ON_BRAND,
                    )}
                  >
                    {link.label}
                  </Link>
                  {/* Split off the label rather than nested inside it: a chevron
                      inside the anchor can only ever navigate, so touch and
                      keyboard had no way to reach the submenu at all. */}
                  <button
                    type="button"
                    aria-expanded={openMenu === link.label}
                    aria-controls={`header-menu-${index}`}
                    aria-label={`${openMenu === link.label ? "Hide" : "Show"} ${link.label} submenu`}
                    onClick={() =>
                      setOpenMenu((m) => (m === link.label ? null : link.label))
                    }
                    className={clsx(
                      "transition-colors hover:text-accent motion-reduce:transition-none",
                      FOCUS_ON_BRAND,
                    )}
                  >
                    <ChevronDown
                      size={14}
                      className={clsx(
                        "transition-transform motion-reduce:transition-none",
                        openMenu === link.label && "rotate-180",
                      )}
                    />
                  </button>
                </div>

                {openMenu === link.label && (
                  <div
                    id={`header-menu-${index}`}
                    className="absolute left-0 top-full z-50 pt-4"
                  >
                    <div className="w-52 animate-menu-in rounded-b-lg bg-white py-2 text-gray-700 shadow-xl motion-reduce:animate-none">
                      {(link.children ?? []).map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={closeMenus}
                          aria-current={isCurrent(child.href) ? "page" : undefined}
                          className={clsx(
                            "block px-5 py-2.5 text-sm transition-colors hover:bg-gray-50 hover:text-brand motion-reduce:transition-none",
                            isCurrent(child.href) && "text-brand",
                            FOCUS_IN_PANEL,
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                className={clsx(
                  "transition-colors hover:text-accent motion-reduce:transition-none",
                  isCurrent(link.href) && "text-accent",
                  FOCUS_ON_BRAND,
                )}
              >
                {link.label}
              </Link>
            ),
          )}

          <Link
            href="/deals"
            aria-current={isCurrent("/deals") ? "page" : undefined}
            className={clsx(
              "ml-auto flex items-center gap-2 transition-colors hover:text-accent motion-reduce:transition-none",
              isCurrent("/deals") && "text-accent",
              FOCUS_ON_BRAND,
            )}
          >
            {/* Lucide, like every other icon this component draws — the filled
                Fluent bolt was the one shape in the row from another family. */}
            <Zap size={16} />
            Today&apos;s Offers
          </Link>
        </div>
      </nav>

      <MobileMenuDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        categories={categories}
        mainNav={mainNav}
      />
    </>
  );
}
