import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { COMPARE_LIMIT } from "@/lib/compare-storage";

/**
 * The compare list: which products the shopper is weighing against each other.
 *
 * Local state, not server state, so this is a plain slice like `uiSlice` rather
 * than one of the RTK Query members. There is no compare endpoint; the list
 * belongs to the device and is persisted to `localStorage` by middleware.
 *
 * Products are keyed by slug, because that is the only identifier the public
 * product endpoint accepts — see `compare-storage`.
 *
 * `isHydrated` is what keeps compare controls from flashing the wrong state. The
 * server cannot read `localStorage`, so every render starts with an empty list;
 * a control that immediately claimed "not in list" would disagree with the
 * stored truth a moment later. Controls render neutral until this flips.
 */
interface CompareState {
  /** Product slugs, in the order added. Never longer than `COMPARE_LIMIT`. */
  slugs: string[];
  isHydrated: boolean;
}

const initialState: CompareState = { slugs: [], isHydrated: false };

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    /**
     * Adding past the limit is a no-op rather than a silent eviction. Enforcing
     * it here rather than at the call sites means no control can bypass it, and
     * "the list is unchanged, with no product silently dropped" holds by
     * construction. Callers detect the refusal by the count not moving.
     */
    addToCompare: (state, action: PayloadAction<string>) => {
      const slug = action.payload;
      if (state.slugs.includes(slug)) return;
      if (state.slugs.length >= COMPARE_LIMIT) return;
      state.slugs.push(slug);
    },
    removeFromCompare: (state, action: PayloadAction<string>) => {
      state.slugs = state.slugs.filter((slug) => slug !== action.payload);
    },
    clearCompare: (state) => {
      state.slugs = [];
    },
    /**
     * Seeds the list from storage after mount and marks the state trustworthy.
     * Dispatched even when nothing was stored — the flag, not the slugs, is what
     * releases the controls from their neutral state.
     */
    hydrateCompare: (state, action: PayloadAction<string[]>) => {
      state.slugs = action.payload.slice(0, COMPARE_LIMIT);
      state.isHydrated = true;
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare, hydrateCompare } =
  compareSlice.actions;

export const selectCompareSlugs = (state: RootState) => state.compare.slugs;
export const selectCompareCount = (state: RootState) => state.compare.slugs.length;
export const selectIsCompareHydrated = (state: RootState) => state.compare.isHydrated;
export const selectIsCompareFull = (state: RootState) =>
  state.compare.slugs.length >= COMPARE_LIMIT;

export default compareSlice.reducer;
