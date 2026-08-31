"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import clsx from "clsx";
import { formatPrice } from "@/lib/format";
import { useSearchProductsQuery } from "@/store/productApi";

/** Below this a query matches most of the catalog, so it isn't worth a request. */
const MIN_QUERY_LENGTH = 2;

/**
 * Long enough that ordinary typing doesn't fire a request per keystroke, short
 * enough that the dropdown still feels immediate once the shopper pauses.
 */
const DEBOUNCE_MS = 300;

/**
 * The storefront's search box, with a typeahead dropdown.
 *
 * One component for both layouts — the header renders it twice (inline on
 * desktop, in its own row on mobile) rather than keeping two search
 * implementations that would drift apart.
 *
 * Submitting goes to `/products?q=`, the full filterable listing. The dropdown
 * is a shortcut, never the only way to see results: `/products/search` returns a
 * capped, unfiltered projection, so a shopper looking for "everything Anker"
 * still gets the real listing by pressing Enter.
 */
export default function SearchBox({
  onNavigate,
  autoFocus = false,
  className,
}: {
  /** Lets the header close its mobile search row once a result is chosen. */
  onNavigate?: () => void;
  autoFocus?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  // Which suggestion the arrow keys have moved to; -1 means "none, submit the
  // raw query instead".
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const term = debounced.trim();
  const shouldSearch = term.length >= MIN_QUERY_LENGTH;

  const { data: results = [], isFetching } = useSearchProductsQuery(term, {
    skip: !shouldSearch,
  });

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  // A new set of results invalidates whatever the arrow keys had selected —
  // otherwise Enter could open a product the shopper can no longer see.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(-1);
  }, [results]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function close() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function goTo(href: string) {
    close();
    onNavigate?.();
    router.push(href);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // An arrowed-to suggestion wins over the raw text — the shopper picked it.
    const picked = results[activeIndex];
    if (picked) {
      goTo(`/products/${picked.slug}`);
      return;
    }
    const trimmed = query.trim();
    goTo(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products");
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (!results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    }
  }

  // Only meaningful once the debounce has caught up with what was typed;
  // otherwise "no products found" flashes while the request is still pending.
  const settled = debounced === query && !isFetching;
  const showDropdown = open && shouldSearch;

  return (
    <div ref={containerRef} className={clsx("relative", className)}>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          type="search"
          placeholder="Search for products"
          aria-label="Search products"
          autoFocus={autoFocus}
          className="w-full rounded-l border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand"
        />
        <button
          type="submit"
          className="flex h-10.5 w-12 shrink-0 items-center justify-center rounded-r bg-accent text-black"
          aria-label="Search"
        >
          {isFetching && shouldSearch ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </button>
      </form>

      {showDropdown && (
        <div className="absolute inset-x-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded border border-gray-200 bg-white shadow-xl">
          {results.length > 0 ? (
            <>
              {results.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  // `mousedown` fires before the input's blur, so the click is
                  // not lost to the dropdown unmounting first.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goTo(`/products/${item.slug}`)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={clsx(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                    index === activeIndex ? "bg-gray-100" : "hover:bg-gray-50",
                  )}
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-1 block text-sm text-gray-800">
                      {item.name}
                    </span>
                    {item.brand && (
                      <span className="block text-xs text-gray-400">
                        {item.brand}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-sale">
                    {formatPrice(item.price)}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  goTo(`/products?q=${encodeURIComponent(query.trim())}`)
                }
                className="block w-full border-t border-gray-100 px-3 py-2.5 text-center text-sm font-semibold text-brand hover:bg-gray-50"
              >
                See all results for &ldquo;{query.trim()}&rdquo;
              </button>
            </>
          ) : settled ? (
            <p className="px-3 py-4 text-center text-sm text-gray-500">
              No products found for &ldquo;{term}&rdquo;.
            </p>
          ) : (
            <p className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-gray-400">
              <Loader2 size={15} className="animate-spin" /> Searching...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
