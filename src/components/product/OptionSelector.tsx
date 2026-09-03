"use client";

import clsx from "clsx";
import type { ResolvedOption } from "@/lib/product-options";

/**
 * One control per option, rendered from `resolveOptions`' output.
 *
 * Shared by the product page and the quick view so the two cannot diverge in
 * how options are presented, how unavailability reads, or what a click does —
 * the spec requires them indistinguishable.
 *
 * Unavailable values stay visible and disabled rather than being removed:
 * hiding one silently changes what the control offers, and takes with it the
 * shopper's ability to see that the combination was ever askable.
 */
export default function OptionSelector({
  options,
  onSelect,
  className,
}: {
  options: ResolvedOption[];
  onSelect: (optionId: string, valueId: string) => void;
  className?: string;
}) {
  if (options.length === 0) return null;

  return (
    <div className={clsx("space-y-4", className)}>
      {options.map((option) => {
        const selected = option.values.find((value) => value.isSelected);

        return (
          <div key={option.id}>
            <p className="mb-2 text-sm font-semibold text-gray-700">
              {option.name}
              {selected && (
                <span className="ml-1 font-normal text-gray-500">
                  — {selected.label}
                </span>
              )}
            </p>

            <div className="flex flex-wrap gap-2">
              {option.values.map((value) =>
                option.presentation === "SWATCH" ? (
                  <button
                    key={value.id}
                    type="button"
                    onClick={() => onSelect(option.id, value.id)}
                    disabled={!value.isAvailable}
                    aria-pressed={value.isSelected}
                    // The swatch is the only thing on screen naming this value,
                    // so the label has to travel for anyone who cannot see or
                    // distinguish the colour.
                    aria-label={
                      value.isAvailable
                        ? value.label
                        : `${value.label} (unavailable)`
                    }
                    title={value.label}
                    className={clsx(
                      "relative h-9 w-9 rounded-full border-2 transition-colors",
                      value.isSelected
                        ? "border-brand"
                        : "border-gray-200 hover:border-gray-400",
                      !value.isAvailable && "cursor-not-allowed opacity-40",
                    )}
                  >
                    <span
                      className="absolute inset-1 rounded-full border border-black/10"
                      style={{ backgroundColor: value.swatch ?? "#e5e7eb" }}
                    />
                    {!value.isAvailable && (
                      // A line through the swatch, so unavailability does not
                      // rest on opacity alone.
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-px w-7 rotate-45 bg-gray-500" />
                      </span>
                    )}
                  </button>
                ) : (
                  <button
                    key={value.id}
                    type="button"
                    onClick={() => onSelect(option.id, value.id)}
                    disabled={!value.isAvailable}
                    aria-pressed={value.isSelected}
                    aria-label={
                      value.isAvailable
                        ? value.label
                        : `${value.label} (unavailable)`
                    }
                    className={clsx(
                      "rounded border px-3 py-2 text-sm transition-colors",
                      value.isSelected
                        ? "border-brand bg-blue-50 font-semibold text-brand"
                        : "border-gray-200 hover:border-gray-400",
                      !value.isAvailable &&
                        "cursor-not-allowed text-gray-400 line-through opacity-60",
                    )}
                  >
                    {value.label}
                  </button>
                ),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
