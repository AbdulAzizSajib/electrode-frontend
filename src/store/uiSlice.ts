import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

/**
 * Genuinely client-side UI state — whether the cart drawer is open. Distinct
 * from the cart's *contents*, which are server-owned and live in `cartApi`.
 */
interface UiState {
  isCartOpen: boolean;
}

const initialState: UiState = { isCartOpen: false };

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
  },
});

export const { openCart, closeCart } = uiSlice.actions;

export const selectIsCartOpen = (state: RootState) => state.ui.isCartOpen;

export default uiSlice.reducer;
