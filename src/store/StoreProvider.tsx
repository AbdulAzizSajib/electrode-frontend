"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";

export default function StoreProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: runs exactly once per client, so the store survives
  // re-renders without being a module singleton (which the server would share
  // across requests, leaking one visitor's cart into another's render).
  const [store] = useState(makeStore);

  return <Provider store={store}>{children}</Provider>;
}
