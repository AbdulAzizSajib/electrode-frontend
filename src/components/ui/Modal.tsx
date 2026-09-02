"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useScrollLock } from "@/components/providers/SmoothScrollProvider";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Id of the element naming this dialog — wired to `aria-labelledby`. */
  labelledById: string;
  /** Accessible label for the close control. */
  closeLabel?: string;
  children: React.ReactNode;
}

/**
 * An accessible dialog: portalled out of the tree, focus-trapped, Escape-
 * dismissible, and scroll-locking.
 *
 * Portalling matters because cards live inside grids with `overflow-hidden`
 * ancestors — a `fixed` overlay rendered in place can be clipped or trapped in
 * a stacking context, and this renders from five different call sites.
 */
export default function Modal({
  isOpen,
  onClose,
  labelledById,
  closeLabel = "Close dialog",
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Captured on open so focus can be handed back to whatever opened us.
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (focusable.length === 0) {
        // Nothing to land on — keep focus in the dialog rather than letting it
        // escape to the page behind.
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  // Routed through the shared lock rather than setting `body.overflow` here:
  // that alone stops nothing once Lenis drives the scroll loop.
  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    document.addEventListener("keydown", handleKeyDown);

    // Focus the panel itself; the first Tab then moves to the first control.
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  // Only ever open in response to a client interaction, so `document` exists
  // by the time this renders — no mount guard needed.
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledById}
          tabIndex={-1}
          className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl outline-none"
          data-lenis-prevent
        >
          <button
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
