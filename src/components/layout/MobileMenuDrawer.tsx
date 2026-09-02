"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import clsx from "clsx";
import SearchBox from "@/components/layout/SearchBox";
import { useScrollLock } from "@/components/providers/SmoothScrollProvider";
import { navLinks } from "@/data/content";
import type { AuthUser } from "@/types/auth";
import type { CategoryNode } from "@/types/category";

type Tab = "menu" | "categories";

/**
 * The mobile navigation drawer.
 *
 * Two tabs rather than one scroll: the site's own pages and the category tree
 * answer different questions ("where do I go" vs "what do you sell"), and
 * stacking them meant the catalog pushed the nav links far below the fold.
 *
 * Inside Categories, a parent with children expands in place instead of pushing
 * a new panel — the tree is only one level deep, so a drill-in navigation would
 * add a back-button round trip for no extra depth.
 */
export default function MobileMenuDrawer({
  open,
  onClose,
  user,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  user: AuthUser | null;
  categories: CategoryNode[];
}) {
  // Categories is the more useful default when there is a catalog to show, but
  // the tab only exists if there is one — otherwise the drawer opens on an
  // empty panel with no way to tell why.
  const [tab, setTab] = useState<Tab>("menu");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openLink, setOpenLink] = useState<string | null>(null);

  // The drawer covers the viewport; letting the page behind it scroll under the
  // shopper's finger is the classic scroll-chaining bug on iOS. Routed through
  // the shared lock rather than setting `body.overflow` directly — that alone
  // stops nothing once Lenis is driving the scroll loop.
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Reopening should not resume a half-expanded tree from a previous visit.
  useEffect(() => {
    if (open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpanded(null);
    setOpenLink(null);
  }, [open]);

  if (!open) return null;

  const hasCategories = categories.length > 0;
  // Guards against the tab being stuck on an empty catalog if categories fail
  // to load between renders.
  const activeTab: Tab = hasCategories ? tab : "menu";

  const tabClass = (isActive: boolean) =>
    clsx(
      "flex-1 border-b-2 py-3.5 text-sm font-semibold uppercase tracking-wide transition-colors",
      isActive
        ? "border-brand bg-white text-gray-900"
        : "border-transparent bg-gray-50 text-gray-400",
    );

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-white">
        {/* Tabs sit at the very top, as in the reference — the drawer is opened
            to go somewhere, so the first thing under the thumb is the choice of
            where. Close is folded into the strip rather than taking its own row. */}
        <div className="flex items-stretch border-b border-gray-200" role="tablist">
          {hasCategories ? (
            <>
              <button
                role="tab"
                aria-selected={activeTab === "menu"}
                onClick={() => setTab("menu")}
                className={tabClass(activeTab === "menu")}
              >
                Menu
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "categories"}
                onClick={() => setTab("categories")}
                className={tabClass(activeTab === "categories")}
              >
                Categories
              </button>
            </>
          ) : (
            <span className={tabClass(true)}>Menu</span>
          )}
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex w-12 shrink-0 items-center justify-center border-b-2 border-transparent bg-gray-50 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-gray-100 px-4 py-3">
          <SearchBox onNavigate={onClose} />
        </div>

        {/* The only scrolling region — the header, search and tabs stay put, so
            the shopper never loses the tab strip while deep in the tree. */}
        {/* `data-lenis-prevent` keeps Lenis from claiming the wheel here, so this
            list scrolls natively instead of scrolling the page behind it. */}
        <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
          {activeTab === "menu" ? (
            <ul className="text-sm">
              {navLinks.map((link) => (
                <li key={link.label} className="border-b border-gray-100">
                  {link.children ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenLink((l) => (l === link.label ? null : link.label))
                        }
                        className="flex w-full items-center justify-between px-5 py-3.5 font-medium text-gray-800"
                      >
                        {link.label}
                        <ChevronDown
                          size={16}
                          className={clsx(
                            "shrink-0 text-gray-400 transition-transform",
                            openLink === link.label && "rotate-180",
                          )}
                        />
                      </button>
                      {openLink === link.label && (
                        <ul className="bg-gray-50">
                          {link.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                onClick={onClose}
                                className="block py-2.5 pl-8 pr-5 text-gray-600"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block px-5 py-3.5 font-medium text-gray-800"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}

              <li className="border-b border-gray-100">
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="block px-5 py-3.5 font-medium text-gray-800"
                >
                  Wishlist
                </Link>
              </li>
              <li className="border-b border-gray-100">
                <Link
                  href={user ? "/account" : "/account/login"}
                  onClick={onClose}
                  className="block px-5 py-3.5 font-medium text-gray-800"
                >
                  {user ? "My Account" : "Sign In / Register"}
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="text-sm">
              {categories.map((cat) => {
                const isOpen = expanded === cat.id;
                const href = `/products?category=${encodeURIComponent(cat.slug)}`;

                // A leaf category has nothing to expand, so the whole row is
                // the link rather than a link plus a dead chevron.
                if (cat.children.length === 0) {
                  return (
                    <li key={cat.id} className="border-b border-gray-100">
                      <Link
                        href={href}
                        onClick={onClose}
                        className="block px-5 py-3.5 font-medium text-gray-800"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={cat.id} className="border-b border-gray-100">
                    {/* Split row: the name still navigates to the parent
                        category, and only the chevron expands. Making the
                        whole row a toggle would strip the shopper of any way
                        to browse the parent itself. */}
                    <div className="flex items-center">
                      <Link
                        href={href}
                        onClick={onClose}
                        className="flex-1 px-5 py-3.5 font-medium text-gray-800"
                      >
                        {cat.name}
                      </Link>
                      {/* The toggle inverts once open, as in the reference —
                          it marks which parent the sublist below belongs to,
                          which matters when several rows look alike. */}
                      <button
                        onClick={() => setExpanded((c) => (c === cat.id ? null : cat.id))}
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${cat.name}`}
                        className={clsx(
                          "flex h-12 w-12 shrink-0 items-center justify-center transition-colors",
                          isOpen ? "bg-gray-900 text-white" : "text-gray-400",
                        )}
                      >
                        {isOpen ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                    </div>

                    {isOpen && (
                      <ul className="bg-gray-50">
                        {cat.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/products?category=${encodeURIComponent(child.slug)}`}
                              onClick={onClose}
                              className="block py-2.5 pl-8 pr-5 text-gray-600"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
