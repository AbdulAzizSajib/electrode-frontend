"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Heart, LayoutGrid, Menu, Search, ShoppingBag, Truck, User, X } from "lucide-react";
import { navLinks } from "@/data/content";
import { EMPTY_CART, useGetCartQuery } from "@/store/cartApi";
import { useAppDispatch } from "@/store/hooks";
import { openCart } from "@/store/uiSlice";
import type { AuthUser } from "@/types/auth";
import type { CategoryNode } from "@/types/category";

export default function Header({
  user,
  categories,
}: {
  user: AuthUser | null;
  categories: CategoryNode[];
}) {
  const dispatch = useAppDispatch();
  // The cart query lives here because the header is on every page — it keeps
  // the cart cached so the drawer opens instantly, and the count updates
  // straight from the cache after any mutation invalidates it.
  const { data: cart = EMPTY_CART } = useGetCartQuery();
  const itemCount = cart.itemCount;
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
  }

  return (
    <header className="sticky top-0 z-40 bg-brand shadow-sm ">
      {/* Announcement bar */}
      <div className="hidden bg-brand text-white md:block border-b border-white/30">
        <div className="mx-auto flex max-w-346 items-center justify-between py-2.25 text-[15px] ">
          <p>Free delivery &amp; 40% discount for next 3 orders! Place your 1st order in.</p>
          <div className="flex items-center gap-4">
           
            <Link href="/whatsapp" className="hover:underline flex items-center gap-2 font-light">
            <Icon icon="akar-icons:whatsapp-fill" />
              01782521705
            </Link>
             <Link href="/track-order" className="hover:underline flex items-center gap-2 font-light">
            <Icon icon="garden:email-stroke-16" />
              sajib@gmail.com
            </Link>
             <Link href="/track-order" className="hover:underline flex items-center gap-2 font-light">
            <Icon icon="fa-solid:truck" />
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-white/30">
      <div className="mx-auto flex max-w-346 items-center  gap-4 py-4.75 text-white">
        <button className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={26} />
        </button>

        <Link href="/" className="shrink-0 text-4xl font-semibold  ">
          Electrode
        </Link>

        <form onSubmit={handleSearch} className="ml-auto max-w-2xl hidden  flex-1 items-center md:flex">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search products..."
            className="w-full rounded-l border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand bg-white placeholder:text-gray-400 text-gray-700"
          />
          <button
            type="submit"
            className="flex h-10.5 w-12 items-center justify-center rounded-r bg-accent text-black"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </form>

        <div className="ml-auto flex items-center gap-5 text-sm ">
        
          <Link href="/wishlist" className="hidden items-center gap-2 lg:flex">
            <Heart size={22} />
            <span>
              Wishlist
              <br />
              <span className="font-semibold">0 Reorder</span>
            </span>
          </Link>
          <button onClick={() => dispatch(openCart())} className="flex items-center gap-2">
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
      </div>

      {/* Nav */}
      <nav className="hidden bg-brand text-white md:block">
        <div className="relative mx-auto flex max-w-346 items-center gap-8 py-4 text-[16px] font-medium">
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

          {navLinks.map((link) =>
            link.children ? (
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
                    {link.children.map((child) => (
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
            Today&apos;s Deal
          </Link>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xl font-bold">Electrode</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSearch} className="mb-6 flex">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search"
                className="w-full rounded-l border border-gray-300 px-3 py-2 text-sm outline-none"
              />
              <button type="submit" className="rounded-r bg-accent px-3 text-white">
                <Search size={16} />
              </button>
            </form>

            {categories.length > 0 && (
              <>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Shop By Categories</p>
                <ul className="mb-5 flex flex-col gap-2 border-b border-gray-100 pb-5 text-sm text-gray-600">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link href={`/products?category=${encodeURIComponent(cat.slug)}`} onClick={() => setMobileOpen(false)}>
                        {cat.name}
                      </Link>
                      {cat.children.length > 0 && (
                        <ul className="mt-1 flex flex-col gap-1 pl-4 text-gray-500">
                          {cat.children.map((child) => (
                            <li key={child.id}>
                              <Link
                                href={`/products?category=${encodeURIComponent(child.slug)}`}
                                onClick={() => setMobileOpen(false)}
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <ul className="flex flex-col gap-1 text-sm font-medium">
              {navLinks.map((link) => (
                <li key={link.label}>
                  {link.children ? (
                    <div>
                      <button
                        className="flex w-full items-center justify-between py-2"
                        onClick={() =>
                          setMobileSubmenu((m) => (m === link.label ? null : link.label))
                        }
                      >
                        {link.label}
                        <ChevronDown
                          size={14}
                          className={mobileSubmenu === link.label ? "rotate-180 transition-transform" : "transition-transform"}
                        />
                      </button>
                      {mobileSubmenu === link.label && (
                        <ul className="ml-3 flex flex-col gap-2 border-l border-gray-100 pb-2 pl-3 text-gray-600">
                          {link.children.map((child) => (
                            <li key={child.label}>
                              <Link href={child.href} onClick={() => setMobileOpen(false)}>
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link href={link.href} className="block py-2" onClick={() => setMobileOpen(false)}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="border-t border-gray-100 pt-2">
                <Link
                  href={user ? "/account" : "/account/login"}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2"
                >
                  {user ? "My Account" : "Sign In / Account"}
                </Link>
              </li>
              <li>
                <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="block py-2">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
