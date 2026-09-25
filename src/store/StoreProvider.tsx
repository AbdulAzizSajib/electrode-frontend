"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";
import { addressApi } from "@/store/addressApi";
import { cartApi } from "@/store/cartApi";
import { wishlistApi } from "@/store/wishlistApi";
import { setSignedIn } from "@/store/uiSlice";
import CompareHydrator from "@/store/CompareHydrator";

export default function StoreProvider({
  children,
  isSignedIn = false,
}: {
  children: ReactNode;
  isSignedIn?: boolean;
}) {
  // Lazy initializer: runs exactly once per client, so the store survives
  // re-renders without being a module singleton (which the server would share
  // across requests, leaking one visitor's cart into another's render).
  //
  // The session flag is seeded at creation rather than dispatched on mount, so
  // no component ever observes a first render claiming "signed out" and fires
  // an authenticated request it should have skipped (or skips one it shouldn't).
  const [store] = useState(() => makeStore({ isSignedIn }));

  /*
   * THE STORE OUTLIVES THE SESSION, SO THE SESSION HAS TO BE TOLD TO IT.
   *
   * The store is created once per client and every client-side navigation
   * keeps it — including the one after signing out. Nothing else reset it, so a
   * shopper who signed out kept the cart they had signed in with: the header
   * badge went on counting a cart the server had stopped serving them, and
   * Place Order came back "you don't have any products", because the guest the
   * request was now coming from had an empty one. The flag was stale with it,
   * so the wishlist heart went on issuing requests for a session that had
   * ended.
   *
   * The prop is the truth: it is read from the session cookie in the layout's
   * server render, and signing in or out re-renders that layout. So the moment
   * it disagrees with what this store was built for, every cache whose contents
   * BELONG to a session is dropped and refetched for whoever is here now.
   *
   * Cart, wishlist and addresses — those three, because those three are the
   * server's answer to "whose are these". Compare and the catalogue are not:
   * they are the same for everybody, and dropping them would only make the next
   * page slower. The checkout quote is not either; it is priced from the cart,
   * which is being refetched here anyway.
   */
  const builtFor = useRef(isSignedIn);
  useEffect(() => {
    if (builtFor.current === isSignedIn) return;
    builtFor.current = isSignedIn;
    store.dispatch(setSignedIn(isSignedIn));
    store.dispatch(cartApi.util.resetApiState());
    store.dispatch(wishlistApi.util.resetApiState());
    store.dispatch(addressApi.util.resetApiState());
  }, [isSignedIn, store]);

  return (
    <Provider store={store}>
      <CompareHydrator />
      {children}
    </Provider>
  );
}
