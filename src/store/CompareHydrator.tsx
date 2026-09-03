"use client";

import { useEffect } from "react";
import { readCompareSlugs } from "@/lib/compare-storage";
import { hydrateCompare } from "@/store/compareSlice";
import { useAppDispatch } from "@/store/hooks";

/**
 * Seeds the compare list from `localStorage` once, after mount.
 *
 * It has to happen here rather than in `preloadedState`: the store is built on
 * the server, where `localStorage` does not exist. Reading it during render
 * would make the first client render disagree with the server's HTML, which is a
 * hydration mismatch — so the read waits for an effect, and compare controls
 * stay neutral until `isHydrated` flips.
 *
 * Renders nothing; it exists only for the effect.
 */
export default function CompareHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateCompare(readCompareSlugs()));
  }, [dispatch]);

  return null;
}
