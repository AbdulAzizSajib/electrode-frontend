import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

/**
 * Genuinely client-side UI state — whether the cart drawer is open. Distinct
 * from the cart's *contents*, which are server-owned and live in `cartApi`.
 *
 * Also carries whether the visitor is signed in. The session lives in httpOnly
 * cookies only a server component can read, so the layout reads it once and
 * publishes it here. The alternative is threading the flag as a prop into every
 * component that must not issue an authenticated request — the wishlist heart
 * sits on `ProductCard`, which has five separate render sites.
 */
interface UiState {
  isCartOpen: boolean;
  isSignedIn: boolean;
}

const initialState: UiState = { isCartOpen: false, isSignedIn: false };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    setSignedIn: (state, action: PayloadAction<boolean>) => {
      state.isSignedIn = action.payload;
    },
  },
});

export const { openCart, closeCart, setSignedIn } = uiSlice.actions;

export const selectIsCartOpen = (state: RootState) => state.ui.isCartOpen;
export const selectIsSignedIn = (state: RootState) => state.ui.isSignedIn;

export default uiSlice.reducer;
