import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { writeCompareSlugs } from "@/lib/compare-storage";
import {
  addToCompare,
  clearCompare,
  removeFromCompare,
} from "@/store/compareSlice";
import type { RootState } from "@/store";

/**
 * Persists the compare list whenever it changes.
 *
 * One place, rather than a write beside every dispatch: a control that mutated
 * without persisting would look correct and silently lose the list on reload,
 * and that bug is invisible until someone refreshes.
 *
 * `hydrateCompare` is deliberately absent from the trigger list — it carries
 * what storage already holds, so writing it back would be a pointless write on
 * every page load.
 */
export const compareListenerMiddleware = createListenerMiddleware();

compareListenerMiddleware.startListening({
  matcher: isAnyOf(addToCompare, removeFromCompare, clearCompare),
  effect: (_action, listenerApi) => {
    const { slugs } = (listenerApi.getState() as RootState).compare;
    writeCompareSlugs(slugs);
  },
});
