## 1. Types and API plumbing

- [x] 1.1 Add `src/types/category.ts` with the raw API category shape (`id`, `name`, `slug`, `status`, `parentId`, `sortOrder`, optional `children`) and the trimmed view model `CategoryNode` (`id`, `name`, `slug`, `children`) that the header consumes (design D4)
- [x] 1.2 Thread an optional `next` revalidate option through `apiFetch` in `src/lib/api-client.ts`, defaulting to today's `cache: "no-store"` so existing auth callers are unaffected (design D2)
- [x] 1.3 Add a request timeout to `apiFetch` via `AbortSignal.timeout`, so a hung backend cannot pin the root layout open (design, Risks)

## 2. Category service

- [x] 2.1 Add `src/services/category.ts` with `getCategoryTree(): Promise<CategoryNode[]>` calling `GET /categories` with a 300s revalidate window
- [x] 2.2 Map the API response to `CategoryNode`: keep only `id`/`name`/`slug`/`children`, drop any entry with `status: false`, and sort parents and children by `sortOrder` (design D4; spec: "Category ordering and hierarchy")
- [x] 2.3 Catch every failure and return `[]` — never throw, so the root layout cannot be taken down (design D3; spec: "Menu degrades safely when the catalog is unavailable")
- [x] 2.4 Verify against the running backend that `getCategoryTree()` returns 4 parents in `sortOrder` order, each with its children ordered, and that no auth is sent (spec: "Category menu is available to all shoppers")

## 3. Wire the header

- [x] 3.1 Fetch the tree in `src/app/layout.tsx` and pass it to `<Header categories={...} />` alongside the existing `user` prop (design D1)
- [x] 3.2 Change `Header.tsx` to accept a `categories: CategoryNode[]` prop and drop the `categoriesMenu` import
- [x] 3.3 Update the desktop dropdown to render from the prop: parents with children expand on click, childless parents navigate to `/products?category=<slug>`; key on `id`, not the display name (spec: "Category ordering and hierarchy")
- [x] 3.4 Update the child submenu panel to link each child to `/products?category=<child.slug>` — note the current code links children to the *parent's* label, which is a bug to fix here
- [x] 3.5 Update the mobile drawer's category list to render from the prop with slug links — parents link to their own slug and nest their children, since the flat mobile list has no expand affordance
- [x] 3.6 Render no categories menu when the array is empty (spec: "Catalog request fails", "Catalog returns no categories")

## 4. Keep category links working on the listing

- [x] 4.1 Update `ProductListing.tsx` to match the `?category=` slug against a slugified form of each static product's category, using the existing `slugify` in `src/lib/validation.ts` (design D5). Also updated `ProductFilters.tsx` to compare on the slug, so arriving via a category link highlights the matching sidebar filter
- [ ] 4.2 Confirm an unknown or inactive slug yields an empty state rather than an error (spec: "Unknown category in the address")

## 5. Clean up

- [x] 5.1 Remove the `categoriesMenu` export from `src/data/content.ts` and confirm no remaining references
- [x] 5.2 Leave `categoryGrid` and `categoryTabs` untouched — still consumed by `CategoryGrid` and the homepage (proposal, out of scope)

## 6. Verify

- [ ] 6.1 With the backend running, confirm the real categories render in the desktop dropdown, expand to their children, and that links carry slugs
- [ ] 6.2 With the backend stopped, confirm the menu is omitted and every page still renders (spec: "Catalog request fails")
- [ ] 6.3 Confirm the menu is identical for a guest and a signed-in customer (spec: "Category menu is available to all shoppers")
- [ ] 6.4 Run `npx next build`, `npx eslint src --max-warnings=0`, and `npx tsc --noEmit` clean
