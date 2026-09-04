"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Heart, LayoutGrid, Menu, Repeat, ShoppingBag, User } from "lucide-react";
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
  const { mainNav, announcementBar, contact } = settings;
  const dispatch = useAppDispatch();
  // The cart query lives here because the header is on every page — it keeps
  // the cart cached so the drawer opens instantly, and the count updates
  // straight from the cache after any mutation invalidates it.
  const { data: cart = EMPTY_CART } = useGetCartQuery();
  const itemCount = cart.itemCount;
  // Skipped entirely for a signed-out visitor: the endpoint 401s without a
  // session, and the header is on every page, so this would 401 site-wide.
  const { data: wishlistCount = 0 } = useGetWishlistCountQuery(undefined, {
    skip: !user,
  });
  // Local state, not a query: the compare list lives in `localStorage` and works
  // signed out, so there is nothing to fetch and nothing to skip.
  const compareCount = useAppSelector(selectCompareCount);
  const isCompareHydrated = useAppSelector(selectIsCompareHydrated);
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openMenu !== "categories") return;
    function handleClickOutside(e: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setOpenCategory(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  return (
    <>
      <header className="bg-brand shadow-sm ">
      {/* Announcement bar. Rendered only when the merchant has switched it on —
          and omitted entirely rather than emptied, so the header below it does
          not sit on a stray border or a collapsed row. */}
      {announcementBar.enabled && (
        <div className="hidden bg-brand text-white md:block border-b border-white/30">
          <div className="container-px flex site-container items-center justify-between py-2.25 text-[15px] ">
            <p>{announcementBar.text}</p>
            <div className="flex items-center gap-4">
              {(announcementBar.links ?? []).map((link, index) => {
                // A link bound to the store's phone or email resolves against
                // the contact block here, so changing the number in the admin
                // updates the bar and the footer together.
                const { label, href } = resolveAnnouncementLink(link, contact);
                const isExternal = /^https?:\/\//.test(href);
                const className =
                  "hover:underline flex items-center gap-2 font-light";

                const body = (
                  <>
                    {link.icon && <Icon icon={link.icon} />}
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
      <div className="container-px flex site-container items-center  gap-4 py-4.75 text-white">
        {/* The menu button and the account icon are given equal flex-basis so
            the logo between them lands on the true centre of the row — sizing
            them to their own content would offset it by the difference. Both
            collapse at `md`, where the logo goes back to the left. */}
        <button
          className="flex basis-8 justify-start md:hidden"
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
          className="whitespace-nowrap text-center text-3xl font-semibold max-md:flex-1 sm:text-4xl md:shrink-0 md:text-left"
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
          className="flex basis-8 justify-end md:hidden"
          aria-label={user ? "My account" : "Sign in or register"}
        >
          <User size={26} />
        </Link>

        <SearchBox className="ml-auto hidden max-w-2xl flex-1 md:block" />

        {/* Every child here is desktop-only now that the cart moved to the
            bottom nav, so the whole group is too — otherwise its `ml-auto`
            would still push the logo around on mobile. */}
        <div className="ml-auto hidden items-center gap-5 text-sm md:flex">

          <Link href="/wishlist" className="hidden items-center gap-2 lg:flex">
            <span className="relative">
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-sale text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </span>
            <span className="flex flex-col items-center">
              Wishlist
              <br />
              <span className="font-semibold">
                {wishlistCount} Saved
              </span>
            </span>
          </Link>

          {/* Only once the stored list has been read — before that the count is
              zero by construction and would tick up a beat after the page
              settled. */}
          {isCompareHydrated && compareCount > 0 && (
            <Link href="/compare" className="hidden items-center gap-2 lg:flex">
              <span className="relative">
                <Repeat size={22} />
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-sale text-[10px] font-bold text-white">
                  {compareCount}
                </span>
              </span>
              <span className="flex flex-col items-center">
                Compare
                <br />
                <span className="font-semibold">{compareCount} Added</span>
              </span>
            </Link>
          )}
          {/* Hidden below `md`: the mobile bottom nav already carries the cart,
              and two cart buttons on one screen is just noise. */}
          <button
            onClick={() => dispatch(openCart())}
            className="hidden items-center gap-2 md:flex"
          >
            <span className="relative">
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-sale text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </span>
            <span className="hidden sm:block">
              {itemCount} Items
              <br />
              <span className="font-semibold">My Cart</span>
            </span>
          </button>
            <Link
            href={user ? "/account" : "/account/login"}
            className="hidden items-center  gap-2 md:flex"
          >
            <User size={22} />
            <span>
              {user ? "Hello" : "Account"}
              <br />
              <span className="font-light">
                {user ? user.name.split(" ")[0] : "Register or Login"}
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
      <nav className="sticky top-0 z-40 hidden bg-brand text-white shadow-sm md:block">
        <div className="container-px relative flex site-container items-center gap-8 py-4 text-[16px] font-medium">
          {/* Shop By Categories mega menu. Omitted entirely when the catalog
              is empty or unreachable — better no menu than dead links. */}
          {categories.length > 0 && (
          <div className="relative border-r border-white/30 pr-6" ref={categoriesRef}>

            <button
              className="flex items-center gap-2"
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
              <LayoutGrid size={20} />
              Shop By Categories
              <ChevronDown size={14} className={openMenu === "categories" ? "rotate-180 transition-transform ml-10.5 " : "transition-transform ml-10.5"} />
            </button>
            {openMenu === "categories" && (
              <div className="absolute left-0 top-8  z-50 flex pt-2 text-gray-700">
                <div className="w-64  bg-white py-0 shadow-xl ">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <button
                        type="button"
                        onClick={() =>
                          cat.children.length > 0
                            ? setOpenCategory((c) => (c === cat.id ? null : cat.id))
                            : router.push(`/products?category=${encodeURIComponent(cat.slug)}`)
                        }
                        className={`flex w-full items-center justify-between border border-gray-100 px-5 py-2.5 text-left text-base  hover:bg-gray-100 hover:text-brand ${
                          openCategory === cat.id ? "bg-gray-50 text-brand" : ""
                        }`}
                      >
                        {cat.name}
                        {cat.children.length > 0 && <ChevronRight size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
                {openCategory &&
                  (() => {
                    const active = categories.find((c) => c.id === openCategory);
                    if (!active?.children.length) return null;
                    return (
                      <div className="w-56 bg-white py-2.5 rounded-r-lg shadow-xl">
                        {active.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/products?category=${encodeURIComponent(child.slug)}`}
                            onClick={() => {
                              setOpenMenu(null);
                              setOpenCategory(null);
                            }}
                            className="block px-5 py-2.5 text-sm hover:bg-gray-50 hover:text-brand"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    );
                  })()}
              </div>
            )}
          </div>
          )}

          {mainNav.map((link) =>
            link.children?.length ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(link.label)}
                onMouseLeave={() => setOpenMenu((m) => (m === link.label ? null : m))}
              >
                <Link href={link.href} className="flex items-center gap-1 hover:text-accent">
                  {link.label}
                  <ChevronDown size={14} />
                </Link>
                {openMenu === link.label && (
                  <div className="absolute left-0 top-full z-50 w-52 rounded-b-lg bg-white py-2 text-gray-700 shadow-xl">
                    {(link.children ?? []).map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-5 py-2.5 text-sm hover:bg-gray-50 hover:text-brand"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.label} href={link.href} className="hover:text-accent">
                {link.label}
              </Link>
            )
          )}
          <Link href="/deals" className="ml-auto flex items-center gap-2 hover:text-accent">
            <Icon icon="fluent:flash-on-24-filled" />
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
