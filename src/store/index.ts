import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { addressApi } from "@/store/addressApi";
import { cartApi } from "@/store/cartApi";
import { orderApi } from "@/store/orderApi";
import { productApi } from "@/store/productApi";
import { reviewApi } from "@/store/reviewApi";
import { wishlistApi } from "@/store/wishlistApi";
import compareReducer from "@/store/compareSlice";
import { compareListenerMiddleware } from "@/store/compareMiddleware";
import uiReducer from "@/store/uiSlice";

/**
 * A store is created per request rather than as a module singleton — a shared
 * instance on the server would leak one visitor's cart into another's render.
 *
 * `isSignedIn` is preloaded rather than dispatched after mount: components gate
 * authenticated queries on it, and a first render that wrongly said "signed
 * out" would skip a query it should have run.
 */
export function makeStore({ isSignedIn = false }: { isSignedIn?: boolean } = {}) {
  const store = configureStore({
    preloadedState: { ui: { isCartOpen: false, isSignedIn } },
    reducer: {
      [cartApi.reducerPath]: cartApi.reducer,
      [addressApi.reducerPath]: addressApi.reducer,
      [orderApi.reducerPath]: orderApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
      [reviewApi.reducerPath]: reviewApi.reducer,
      [wishlistApi.reducerPath]: wishlistApi.reducer,
      compare: compareReducer,
      ui: uiReducer,
    },
    // The compare list starts empty and is never preloaded: `preloadedState` is
    // computed on the server, where `localStorage` does not exist. It is seeded
    // after mount instead — see `CompareHydrator`.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(compareListenerMiddleware.middleware).concat(
        cartApi.middleware,
        addressApi.middleware,
        orderApi.middleware,
        productApi.middleware,
        reviewApi.middleware,
        wishlistApi.middleware,
      ),
  });

  // Enables refetchOnFocus / refetchOnReconnect behaviour.
  setupListeners(store.dispatch);

  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
