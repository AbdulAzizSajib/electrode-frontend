"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/data/products";
import type { CartLine, Product } from "@/types/product";

interface CartItem extends CartLine {
  product: Product;
}

interface CartContextValue {
  lines: CartLine[];
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, quantity?: number, selectedOptions?: Record<string, string>) => void;
  removeItem: (productId: string, selectedOptions?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, selectedOptions?: Record<string, string>) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "electrode-cart";

function optionsKey(options?: Record<string, string>) {
  if (!options) return "";
  return Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Cart is intentionally hydrated from localStorage after mount (rather
    // than in a lazy useState initializer) so the server-rendered markup
    // (always an empty cart) matches the client's first render, avoiding a
    // hydration mismatch. The one-time setState below is expected here.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = useCallback(
    (productId: string, quantity = 1, selectedOptions?: Record<string, string>) => {
      setLines((prev) => {
        const key = optionsKey(selectedOptions);
        const existing = prev.find(
          (l) => l.productId === productId && optionsKey(l.selectedOptions) === key
        );
        if (existing) {
          return prev.map((l) =>
            l === existing ? { ...l, quantity: l.quantity + quantity } : l
          );
        }
        return [...prev, { productId, quantity, selectedOptions }];
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((productId: string, selectedOptions?: Record<string, string>) => {
    const key = optionsKey(selectedOptions);
    setLines((prev) =>
      prev.filter((l) => !(l.productId === productId && optionsKey(l.selectedOptions) === key))
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, selectedOptions?: Record<string, string>) => {
      const key = optionsKey(selectedOptions);
      setLines((prev) =>
        prev
          .map((l) =>
            l.productId === productId && optionsKey(l.selectedOptions) === key
              ? { ...l, quantity }
              : l
          )
          .filter((l) => l.quantity > 0)
      );
    },
    []
  );

  const clearCart = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const items = useMemo<CartItem[]>(
    () =>
      lines
        .map((line) => {
          const product = products.find((p) => p.id === line.productId);
          return product ? { ...line, product } : null;
        })
        .filter((x): x is CartItem => x !== null),
    [lines]
  );

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);

  const value: CartContextValue = {
    lines,
    items,
    itemCount,
    subtotal,
    isOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
