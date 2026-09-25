"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import clsx from "clsx";
import { FOCUS_RING } from "@/lib/focus-ring";

/**
 * A select the shopper searches by typing, for a list too long to scroll.
 *
 * Built here rather than pulled in: the admin has a combobox and the two apps
 * share no package, and one control in a bundle a customer downloads over
 * mobile data does not justify a dependency. See
 * openspec/changes/add-district-area-picker/design.md, D9.
 *
 * NOT a `<select>`. A native select cannot be typed into, and the list this was
 * built for is 1,343 places long — a shopper who lives in Savar would scroll
 * past five hundred Dhaka neighbourhoods to reach it. The caller does the
 * filtering and the capping, because it owns the data and knows what "matches"
 * means for it; this component knows only how to show a list and take a choice.
 *
 * Deliberately NOT a portal or a modal. The list is positioned under the input
 * in normal flow, so it moves with the field inside the checkout's own
 * scrolling column and cannot be left floating behind it.
 */

export interface SearchableSelectOption {
  /** Unique and stable; what `value`/`onChange` speak in. */
  value: string;
  /** What the shopper reads in the list and in the closed field. */
  label: string;
  /** Optional second line, for the detail that tells two similar rows apart. */
  hint?: string;
}

export default function SearchableSelect({
  id,
  value,
  onChange,
  search,
  selectedLabel,
  placeholder = "Search…",
  emptyMessage = "No matches",
  invalid,
  describedBy,
  disabled,
  name,
}: {
  /** The id the label points at. The text input carries it. */
  id: string;
  /** The chosen option's value, or null. */
  value: string | null;
  onChange: (value: string | null) => void;
  /**
   * The rows to show for what has been typed. Called on every keystroke, so it
   * is the caller's job to keep it cheap AND to cap what it returns — every row
   * returned is a row in the DOM.
   */
  search: (query: string) => SearchableSelectOption[];
  /** The chosen option's label. Passed in because the list is not exhaustive. */
  selectedLabel: string | null;
  placeholder?: string;
  emptyMessage?: string;
  invalid?: boolean;
  describedBy?: string;
  disabled?: boolean;
  /**
   * Submitted with the form as a hidden input, so the field behaves like the
   * `<select>` it stands in for when the form is read by anything but React.
   */
  name?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const listId = useId();
  const optionId = (index: number) => `${listId}-option-${index}`;

  const results = useMemo(() => (open ? search(query) : []), [open, query, search]);

  /*
   * The text in the box: what the shopper is typing while the list is open,
   * and what they chose when it is closed. One input doing both is what makes
   * this feel like a select rather than a search box that happens to set a
   * value — reopening it shows their choice, and typing replaces it.
   */
  const inputValue = open ? query : (selectedLabel ?? "");

  // Every change of the filtered list starts from its first row, so Enter after
  // typing takes the best match rather than whatever row an earlier query had
  // left highlighted.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(0);
  }, [query, open]);

  // Keep the highlighted row on screen when it moves by keyboard. `nearest`
  // rather than `center` so the list does not lurch on every arrow press.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  /*
   * A click anywhere else closes the list and abandons what was typed. Bound on
   * `pointerdown` rather than `click` so that clicking straight into another
   * field does not leave this one open behind it for a frame.
   */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
      setQuery("");
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    setQuery("");
  };

  const choose = (option: SearchableSelectOption | undefined) => {
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    setQuery("");
    // Focus goes back to the control the shopper was on, not to the top of the
    // form — a keyboard user who tabs after choosing must land on the next
    // field, not start again.
    inputRef.current?.focus();
  };

  const clear = () => {
    onChange(null);
    setOpen(false);
    setQuery("");
    inputRef.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) return openList();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        return;
      case "ArrowUp":
        event.preventDefault();
        if (!open) return openList();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      case "Home":
        if (!open) return;
        event.preventDefault();
        setActiveIndex(0);
        return;
      case "End":
        if (!open) return;
        event.preventDefault();
        setActiveIndex(results.length - 1);
        return;
      case "Enter":
        // Only swallowed while the list is open with something to take —
        // otherwise Enter must still submit the form it sits in.
        if (!open || results.length === 0) return;
        event.preventDefault();
        choose(results[activeIndex]);
        return;
      case "Escape":
        if (!open) return;
        event.preventDefault();
        setOpen(false);
        setQuery("");
        return;
      case "Tab":
        // Leaving abandons what was typed rather than guessing at it: a
        // half-typed "Mir" is not a choice of Mirpur.
        if (open) {
          setOpen(false);
          setQuery("");
        }
        return;
      default:
        return;
    }
  };

  return (
    <div ref={rootRef} className="relative">
      {name && <input type="hidden" name={name} value={value ?? ""} />}

      <div className="relative">
        {/* The magnifier only while searching: closed, this is a field showing
            a choice, and a search icon on it invites a search nobody needs. */}
        {open && (
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
        )}
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={
            open && results.length > 0 ? optionId(activeIndex) : undefined
          }
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedBy}
          aria-autocomplete="list"
          disabled={disabled}
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => {
            if (!open) setOpen(true);
            setQuery(e.target.value);
          }}
          onFocus={openList}
          onKeyDown={onKeyDown}
          className={clsx(
            "w-full rounded border py-3 pr-16 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400",
            open ? "pl-9" : "pl-4",
            invalid
              ? "border-red-400 focus:border-red-500"
              : "border-gray-300 focus:border-brand",
          )}
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear selection"
              className={clsx(
                "rounded p-1 text-gray-400 hover:text-gray-600",
                FOCUS_RING,
              )}
            >
              <X size={15} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={clsx(
              "pointer-events-none text-gray-400 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </div>
      </div>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          /* Capped, not tall: on a phone an open keyboard takes the bottom half
             of the screen, and a list taller than this puts its own rows behind
             it. `overscroll-contain` keeps a flick inside the list from
             scrolling the checkout page underneath it. */
          className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto overscroll-contain rounded border border-gray-200 bg-white py-1 shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-500">{emptyMessage}</li>
          ) : (
            results.map((option, index) => {
              const selected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={optionId(index)}
                  data-index={index}
                  role="option"
                  aria-selected={selected}
                  /* `pointerdown`, not `click`: the input's blur would close
                     the list first and the click would land on nothing. */
                  onPointerDown={(e) => {
                    e.preventDefault();
                    choose(option);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={clsx(
                    "flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-sm",
                    index === activeIndex ? "bg-brand/10" : "bg-white",
                    selected ? "font-semibold text-gray-900" : "text-gray-700",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate">{option.label}</span>
                    {option.hint && (
                      <span className="mt-0.5 block truncate text-xs text-gray-500">
                        {option.hint}
                      </span>
                    )}
                  </span>
                  {selected && (
                    <Check size={15} className="shrink-0 text-brand" aria-hidden />
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
