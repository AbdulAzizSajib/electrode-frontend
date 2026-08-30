## 1. Hover-reveal on the product card

- [x] 1.1 Declare a `hover-capable` custom variant in `src/app/globals.css` using `@custom-variant` so `@media (hover: hover) and (pointer: fine)` is expressed once rather than repeated per utility (design — Decision 1)
- [x] 1.2 Wrap both branches of the `product.isVariable` ternary in `ProductCard.tsx` in a single action-slot div that carries the reveal classes and the existing `mt-3` spacing; move `mt-3` off the two buttons onto the wrapper (design — Decision 2)
- [x] 1.3 On that wrapper, conceal at rest only under the hover-capable variant, using `opacity-0` **and** `invisible` together, revealed by `group-hover:` and `group-focus-within:` on the card's existing `group` root
- [x] 1.4 Animate `opacity` and a small `translate-y` only — never `height`, `display`, or margin — so the card's layout is byte-identical in both states; add `motion-reduce:transition-none`
- [ ] 1.5 Verify by tabbing through a grid that a concealed action is not focusable, and that tabbing into a card reveals its action and keeps it revealed while focus stays inside
- [ ] 1.6 Verify on a real touch device (not DevTools emulation, which does not reliably resolve the `hover` media feature) that every card's action is permanently visible and that the first tap performs the action rather than being consumed as a reveal
- [ ] 1.7 Verify no card shifts, resizes, or reflows its neighbours when its action is revealed or hidden

## 2. Reusable modal primitive

- [x] 2.1 Create `src/components/ui/Modal.tsx` (client component) taking `isOpen`, `onClose`, `labelledById`, and children; render `null` when closed
- [x] 2.2 Render through `createPortal` to `document.body`, guarded so it does not run during SSR (design — Decision 3)
- [x] 2.3 Add the backdrop with a click-to-close handler, and the panel with `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` wired to `labelledById`
- [x] 2.4 Add an explicit close control with an `aria-label`
- [x] 2.5 Close on Escape via a keydown listener registered only while open
- [x] 2.6 Trap focus: on Tab, query focusable descendants and wrap at both ends (forward past the last, backward past the first)
- [x] 2.7 Move focus into the panel on open; capture the previously focused element and restore focus to it on close
- [x] 2.8 Lock body scroll while open by setting `document.body.style.overflow`, capturing the prior value and restoring exactly that value on cleanup — not a hardcoded `""`
- [ ] 2.9 Verify the panel is not clipped when opened from a card inside an `overflow-hidden` grid ancestor

## 3. Client-side product fetching

- [x] 3.1 Confirm `toProduct` and `placeholderImage` are importable from a client bundle (pure functions, no server-only imports); if `services/product.ts` carries a server-only import, extract the mapper to its own module rather than duplicating it (design — Decision 4)
- [x] 3.2 Create `src/store/productApi.ts` — an RTK Query service with `baseUrl: API_BASE_URL` pointing directly at the backend, not a local proxy
- [x] 3.3 Add a `getProductBySlug` query whose `transformResponse` unwraps the `{ data }` envelope and maps through `toProduct`, so client-fetched products match server-fetched ones exactly
- [x] 3.4 Set `keepUnusedDataFor` high enough that reopening the same product within a session does not refetch
- [x] 3.5 Register the new reducer and middleware in the existing store setup

## 4. Quick view content

- [x] 4.1 Create `src/components/product/ProductQuickView.tsx` (client component) taking the card's `Product` and open/close props, rendering inside `Modal`
- [x] 4.2 Call the `getProductBySlug` hook with `skip: !isOpen`; seed the header (name, image, price) from the card's props so the panel is never blank while loading
- [x] 4.3 Render the loading state with a visible indicator, keeping add-to-cart disabled until the fetched details arrive
- [x] 4.4 Render the error state: tell the shopper the preview could not be loaded and offer a link to the product's detail page as the alternative route
- [x] 4.5 Lay out the loaded state — image gallery with thumbnails, brand, name, price with comparison price and discount, short description
- [x] 4.6 Give the name element the id passed to `Modal` as `labelledById`, so the dialog's accessible name identifies the product
- [x] 4.7 Render the variant chips as a flat list matching `ProductDetail.tsx:142-165` — disabled and struck-through when out of stock, per-chip price shown only when variant prices differ (design — Decision 7)
- [x] 4.8 Preselect the first in-stock variant, falling back to `null` when none is in stock; reset quantity to 1 whenever the selection changes
- [x] 4.9 Update the displayed price, comparison price, and discount to follow the selected variant
- [x] 4.10 Add a quantity control clamped to the selected variant's `stockQuantity` (the detail page does not clamp — do not copy that gap; fixing it is out of scope)
- [x] 4.11 Add the "View Full Product Details" link to `/products/${product.slug}`, dismissing the modal on navigate

## 5. Add to cart from the quick view

- [x] 5.1 Wire `useAddItemMutation` with `{ productId, variantId, quantity }` from the shopper's selection
- [x] 5.2 Gate the control on `availableStock > 0 && (!isVariable || selectedVariantId !== null) && !isLoading &&` details-have-loaded (design — Decision 6)
- [x] 5.3 Show a visible in-progress indication and ensure repeat activation cannot submit a second add
- [x] 5.4 On success, close the modal first, then `dispatch(openCart())` — never leave both overlays mounted together
- [x] 5.5 On failure, keep the modal open with the shopper's selection intact, show an inline message, and do not open the cart drawer

## 6. Wire the card to the quick view

- [x] 6.1 Add local `useState` in `ProductCard` for whether its quick view is open (design — Decision 5; not Redux)
- [x] 6.2 Convert the "Options" `Link` to a `button` that opens the quick view; keep the icon and label, and confirm focus returns to this button when the modal closes
- [x] 6.3 Render `ProductQuickView` from the card, passing the product and open/close handlers
- [ ] 6.4 Confirm the closed state costs nothing beyond the `useState` — modal returns `null` and the query is skipped

## 7. Verification across call sites

- [ ] 7.1 Verify hover-reveal and quick view on the products listing (`ProductListing.tsx`)
- [ ] 7.2 Verify on the homepage sections (`home/ProductSection.tsx`, `home/DealOfWeek.tsx`)
- [ ] 7.3 Verify on `app/deals/page.tsx`
- [ ] 7.4 Verify in `ProductDetail`'s "You May Also Like" — a quick view layered over a product detail page; check it reads coherently and that the underlying page is inert
- [ ] 7.5 Verify a simple (non-variable) product still adds directly from the card with no quick view involved
- [ ] 7.6 Verify closing the quick view restores the listing's scroll position, filters, and page of results
- [ ] 7.7 Verify opening a quick view, closing it before the fetch resolves, then opening a different product does not show the first product's details
- [x] 7.8 Run lint and a production build; confirm no server-only code was pulled into a client bundle
