import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { addressApi } from "@/store/addressApi";
import { cartApi } from "@/store/cartApi";
import { orderApi } from "@/store/orderApi";
import uiReducer from "@/store/uiSlice";

/**
 * A store is created per request rather than as a module singleton — a shared
 * instance on the server would leak one visitor's cart into another's render.
 */
export function makeStore() {
  const store = configureStore({
    reducer: {
      [cartApi.reducerPath]: cartApi.reducer,
      [addressApi.reducerPath]: addressApi.reducer,
      [orderApi.reducerPath]: orderApi.reducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        cartApi.middleware,
        addressApi.middleware,
        orderApi.middleware,
      ),
  });

  // Enables refetchOnFocus / refetchOnReconnect behaviour.
  setupListeners(store.dispatch);

  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
