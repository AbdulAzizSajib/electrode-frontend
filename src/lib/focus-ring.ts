/**
 * Focus ring for interactive controls across the storefront.
 *
 * Lived in `ProductDetail` as a private constant, which held for exactly as
 * long as the detail page was the only screen that had been given one. The
 * catalog card composes the same controls a shopper reaches by keyboard, so the
 * choice is now one exported string or two copies of it drifting apart — and a
 * ring that differs between the grid and the page it links to is the same defect
 * this replaced, one level up.
 *
 * Drawn from the brand token, offset so it reads as a ring around the control
 * rather than a border on it, and `focus-visible` so a mouse click never paints
 * one. Anything it is applied to needs a `rounded-*` of its own, or the ring is
 * drawn square around a rounded control.
 */
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";
