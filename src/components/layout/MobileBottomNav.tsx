"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { Home, Phone, Repeat, ShoppingBag, Store } from "lucide-react";
import clsx from "clsx";
import type { StoreSettings } from "@/types/store-settings";
import { EMPTY_CART, useGetCartQuery } from "@/store/cartApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openCart } from "@/store/uiSlice";
import {
  selectCompareCount,
  selectIsCompareHydrated,
} from "@/store/compareSlice";

/**
 * Thumb-reach navigation for small screens, hidden from `md` up where the
 * header's own nav takes over.
 *
 * The bar is fixed, so it would otherwise sit on top of the last of the page's
 * content. `body` carries matching bottom padding (see globals.css) rather than
 * each page adding its own — a page that forgot would lose its footer links
 * underneath this.
 */
export default function MobileBottomNav({
  contact,
}: {
  /** The store's contact details, from the settings fetched in the root layout. */
  contact: StoreSettings["contact"];
}) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  // Already cached by the header's query, so this subscribes to the same data
  // rather than costing a second request.
  const { data: cart = EMPTY_CART } = useGetCartQuery();
  const itemCount = cart.itemCount;
  const compareCount = useAppSelector(selectCompareCount);
  const isCompareHydrated = useAppSelector(selectIsCompareHydrated);

  const itemClass = (active: boolean) =>
    clsx(
      "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
      active ? "text-brand" : "text-gray-500",
    );

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white md:hidden"
      // Keeps the row clear of the iOS home indicator / Android gesture bar.
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-lg items-stretch">
        {/* Both dial the store's configured number. Omitted when it is unset
            rather than rendering a `tel:` link that goes nowhere — the
            remaining items simply spread to fill the bar. */}
        {contact.phone && (
          <>
            <a href={`tel:${contact.phone}`} className={itemClass(false)}>
              <Phone size={20} strokeWidth={1.75} />
              Phone
            </a>

            <a
              href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={itemClass(false)}
            >
              <Icon icon="akar-icons:whatsapp-fill" width={20} height={20} />
              WhatsApp
            </a>
          </>
        )}

        <Link href="/" className={itemClass(pathname === "/")}>
          <Home size={20} strokeWidth={1.75} />
          Home
        </Link>

        {/* `/shop` is not a route in this app — this link 404'd. The catalog
            lives at `/products`, same as the desktop nav. */}
        <Link href="/products" className={itemClass(pathname.startsWith("/products"))}>
          <Store size={20} strokeWidth={1.75} />
          Shop
        </Link>

        <button
          type="button"
          onClick={() => dispatch(openCart())}
          className={itemClass(false)}
        >
          <span className="relative">
            <ShoppingBag size={20} strokeWidth={1.75} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </span>
          Cart
        </button>

        {/* Only while something is being compared. The row already carries five
            items at phone width, and a sixth that is empty most of the time
            would crowd the four that are always useful. */}
        {isCompareHydrated && compareCount > 0 && (
          <Link href="/compare" className={itemClass(pathname === "/compare")}>
            <span className="relative">
              <Repeat size={20} strokeWidth={1.75} />
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-bold text-white">
                {compareCount}
              </span>
            </span>
            Compare
          </Link>
        )}
      </div>
    </nav>
  );
}
