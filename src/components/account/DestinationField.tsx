"use client";

import { useCallback } from "react";
import SearchableSelect, {
  type SearchableSelectOption,
} from "@/components/ui/SearchableSelect";
import {
  destinationFromLabel,
  findDestination,
  searchDestinations,
  type Destination,
} from "@/lib/delivery-destination";

/**
 * Where the order is going, asked once: a district and an area together.
 *
 * It replaces a free-text City box, and the two are not the same question. A
 * typed city comes back as "dhaka", "Dahka", "savar, dhaka" — unusable for
 * finding an order, briefing a courier or deciding what delivery costs. A
 * chosen one is a place the system knows, which is what lets the delivery
 * charge follow from it. See
 * openspec/changes/add-district-area-picker/design.md.
 *
 * Shared by the checkout's guest fields and the saved-address form so the two
 * cannot drift into asking for the destination differently — the same address
 * has to mean the same thing whichever form captured it.
 *
 * The options are labelled `District - Area` with the district ALWAYS shown,
 * even where an area name is unique today: the list is regenerated from an
 * outside source, and "Kachua" becoming ambiguous is a data update, not a code
 * change anyone would think to review for it.
 */
export default function DestinationField({
  id = "destination",
  label = "District / City",
  value,
  onChange,
  error,
  disabled,
  name,
}: {
  id?: string;
  label?: string;
  value: Destination | null;
  onChange: (destination: Destination | null) => void;
  error?: string;
  disabled?: boolean;
  name?: string;
}) {
  const errorId = `${id}-error`;

  /*
   * The search runs on every keystroke, so it is handed over as a stable
   * function — a new one each render would re-filter 1,343 rows for every
   * unrelated change in the form around it.
   */
  const search = useCallback(
    (query: string): SearchableSelectOption[] =>
      searchDestinations(query).map((entry) => ({
        value: entry.label,
        label: entry.label,
      })),
    [],
  );

  /*
   * What the closed field shows. Resolved through the list rather than
   * formatted from the value, so an address holding something that is NOT a
   * known place — anything saved before this existed — reads as empty and is
   * asked for again, instead of showing a destination that would not resolve.
   */
  const selected = findDestination(value?.district, value?.area);

  return (
    <div>
      {/*
        NO REQUIRED MARKER. This label carried a red `*` when required, and it
        was the only one on either form that did — `Field`, which draws every
        other label in checkout and in the saved-address form, names the
        OPTIONAL ones with a " (optional)" suffix and leaves required ones
        unmarked. Two opposite conventions on one form do not read as two
        conventions; they read as "this one field is required and the rest are
        not", which is the opposite of what was true.

        A caller that wants this field marked optional appends the same suffix to
        `label` that it appends to every other one. See `optionalSuffix` in
        CheckoutForm.tsx.
      */}
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <SearchableSelect
        id={id}
        name={name}
        value={selected?.label ?? null}
        selectedLabel={selected?.label ?? null}
        onChange={(chosen) => onChange(destinationFromLabel(chosen))}
        search={search}
        placeholder="আপনার জেলা এবং শহর নির্বাচন করুন"
        emptyMessage="কোনো জেলা বা এলাকা এর সাথে মেলে না"
        invalid={Boolean(error)}
        describedBy={error ? errorId : undefined}
        disabled={disabled}
      />

      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
