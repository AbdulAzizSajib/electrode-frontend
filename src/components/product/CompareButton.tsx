"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Repeat } from "lucide-react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addToCompare,
  removeFromCompare,
  selectCompareSlugs,
  selectIsCompareFull,
  selectIsCompareHydrated,
} from "@/store/compareSlice";
import { COMPARE_LIMIT } from "@/lib/compare-storage";

/**
 * Compare toggle for a single product.
 *
 * Membership is read from the store and nowhere else, so every instance on
 * screen — the detail page, each card in a listing, the quick view — agrees
 * without any of them coordinating.
 *
 * Until the stored list has been read the control renders neutral rather than
 * "not in list". The server cannot know what is in `localStorage`, so claiming
 * a state before hydration would either mismatch the server's HTML or flash the
 * wrong answer at a shopper whose list is not empty.
 */
export default function CompareButton({
  slug,
  className,
  size = 16,
  withLabel = false,
}: {
  slug: string;
  className?: string;
  size?: number;
  withLabel?: boolean;
}) {
  const dispatch = useAppDispatch();
  const slugs = useAppSelector(selectCompareSlugs);
  const isHydrated = useAppSelector(selectIsCompareHydrated);
  const isFull = useAppSelector(selectIsCompareFull);

  const isCompared = slugs.includes(slug);

  // Transient acknowledgement, so a click is never silent. There is no toast
  // system in this app; the compare bar is the durable feedback and this covers
  // the moment before the eye reaches it.
  const [notice, setNotice] = useState<"added" | "full" | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function flash(next: "added" | "full") {
    setNotice(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(null), 2200);
  }

  function handleToggle() {
    if (isCompared) {
      dispatch(removeFromCompare(slug));
      setNotice(null);
      return;
    }

    // The reducer refuses the add at capacity; checking here is what lets the
    // shopper be told why instead of watching nothing happen.
    if (isFull) {
      flash("full");
      return;
    }

    dispatch(addToCompare(slug));
    flash("added");
  }

  const label = !isHydrated
    ? "Compare"
    : isCompared
      ? "Comparing"
      : notice === "full"
        ? `Compare list full (${COMPARE_LIMIT})`
        : "Compare";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isHydrated ? isCompared : undefined}
      aria-label={
        isCompared ? "Remove from comparison" : "Add to comparison"
      }
      title={label}
      className={clsx(
        "flex items-center gap-1.5 transition-colors",
        isHydrated && isCompared && "text-brand",
        notice === "full" && "text-sale",
        className,
      )}
    >
      {isHydrated && isCompared ? (
        <Check size={size} />
      ) : (
        <Repeat size={size} />
      )}
      {withLabel && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
}
