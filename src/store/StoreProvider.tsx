"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";
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

  return (
    <Provider store={store}>
      <CompareHydrator />
      {children}
    </Provider>
  );
}
