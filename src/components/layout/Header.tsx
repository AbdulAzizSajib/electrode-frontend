"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Heart, LayoutGrid, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { categoriesMenu, navLinks } from "@/data/content";
import { useCart } from "@/contexts/cart-context";

export default function Header() {
  const { itemCount, openCart } = useCart();
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
    <header className="sticky top-0 z-40 bg-white shadow-sm ">
      {/* Announcement bar */}
      <div className="hidden bg-brand text-white md:block ">
        <div className="mx-auto flex max-w-346 items-center justify-between py-2.25 text-[15px] ">
          <p>Free delivery &amp; 40% discount for next 3 orders! Place your 1st order in.</p>
          <div className="flex items-center gap-4">
            <Link href="/track-order" className="hover:underline">
              Track Order
            </Link>
            <Link href="/gift-cards" className="hover:underline">
              Gift Cards
            </Link>
            <span>USD $</span>
            <span>English</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto flex max-w-346 items-center gap-4 py-4.75">
        <button className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={26} />
        </button>

        <Link href="/" className="shrink-0 text-4xl font-semibold text-gray-900">
          Electrode
        </Link>

        <form onSubmit={handleSearch} className="mx-auto hidden max-w-xl flex-1 items-center md:flex">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search"
            className="w-full rounded-l border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <button
            type="submit"
            className="flex h-[42px] w-12 items-center justify-center rounded-r bg-accent text-white"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </form>

        <div className="ml-auto flex items-center gap-5 text-sm">
          <Link href="/account/login" className="hidden items-center gap-2 md:flex">
            <User size={22} />
            <span>
              Sign In
              <br />
              <span className="font-semibold">Account</span>
            </span>
          </Link>
          <Link href="/wishlist" className="hidden items-center gap-2 lg:flex">
            <Heart size={22} />
            <span>
              Wishlist
              <br />
              <span className="font-semibold">0 Reorder</span>
            </span>
          </Link>
          <button onClick={openCart} className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Nav */}
      <nav className="hidden bg-brand text-white md:block">
        <div className="relative mx-auto flex max-w-346 items-center gap-8 py-4 text-[16px] font-medium">
          {/* Shop By Categories mega menu */}
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
              <div className="absolute left-0 top-8 z-50 flex pt-2 text-gray-700">
                <div className="w-64 rounded-b-lg bg-white py-2 shadow-xl">
                  {categoriesMenu.map((cat) => (
                    <div key={cat.label}>
                      <button
                        type="button"
                        onClick={() =>
                          cat.children
                            ? setOpenCategory((c) => (c === cat.label ? null : cat.label))
                            : router.push(`/products?category=${encodeURIComponent(cat.label)}`)
                        }
                        className={`flex w-full items-center justify-between border-b border-gray-100 px-5 py-2.5 text-left text-sm last:border-b-0 hover:bg-gray-50 hover:text-brand ${
                          openCategory === cat.label ? "bg-gray-50 text-brand" : ""
                        }`}
                      >
                        {cat.label}
                        {cat.children && <ChevronRight size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
                {openCategory &&
                  (() => {
                    const active = categoriesMenu.find((c) => c.label === openCategory);
                    if (!active?.children) return null;
                    return (
                      <div className="w-56 rounded-b-lg bg-white py-2 shadow-xl">
                        {active.children.map((child) => (
                          <Link
                            key={child}
                            href={`/products?category=${encodeURIComponent(active.label)}`}
                            onClick={() => {
                              setOpenMenu(null);
                              setOpenCategory(null);
                            }}
                            className="block px-5 py-2.5 text-sm hover:bg-gray-50 hover:text-brand"
                          >
                            {child}
                          </Link>
                        ))}
                      </div>
                    );
                  })()}
              </div>
            )}
          </div>

          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.href}
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
              <Link key={link.href} href={link.href} className="hover:text-accent">
                {link.label}
              </Link>
            )
          )}
          <Link href="/deals" className="ml-auto flex items-center gap-2 hover:text-accent">
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

            <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Shop By Categories</p>
            <ul className="mb-5 flex flex-col gap-2 border-b border-gray-100 pb-5 text-sm text-gray-600">
              {categoriesMenu.map((cat) => (
                <li key={cat.label}>
                  <Link href={`/products?category=${encodeURIComponent(cat.label)}`} onClick={() => setMobileOpen(false)}>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="flex flex-col gap-1 text-sm font-medium">
              {navLinks.map((link) => (
                <li key={link.href}>
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
                <Link href="/account/login" onClick={() => setMobileOpen(false)} className="block py-2">
                  Sign In / Account
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
