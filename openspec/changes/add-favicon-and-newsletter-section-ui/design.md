## Context

See proposal.md — Why. The server side is `server/openspec/changes/add-favicon-and-newsletter-section`, which adds `faviconUrl` to the public settings payload and `NEWSLETTER` to the home-section registry. Both arrive in the payload this storefront already fetches in its root layout, so this change costs no additional request.

Four facts about the current code shape everything below.

**The file-convention favicon wins by default, and it cannot be turned off from metadata.** `src/app/favicon.ico` exists, and Next resolves it by *prepending* it to whatever `metadata.icons` a layout returns — `metadata.icons.icon.unshift(favicon)` in `node_modules/next/dist/lib/metadata/resolve-metadata.js`. There is no precedence flag and no way to suppress it. As long as that file is in `app/`, every document head carries `<link rel="icon" href="/favicon.ico" sizes="any">` ahead of whatever the merchant configured, and which of the two a browser picks is its own business.

**There are two shells, and the favicon belongs to both.** `app/(shop)/layout.tsx` and `app/(landing)/lp/[slug]` are siblings; only `app/layout.tsx` is above both. A tab icon is a property of the site, so it goes in the root layout's `generateMetadata` — the same place the site's default title and description already resolve from.

**`resolveMetadata` is the storefront's single metadata resolver, and it has a standing rule: never throw.** It runs inside `generateMetadata` on every page, and a malformed stored value must degrade to a plainer tag rather than take the page down. Anything added to it inherits that obligation.

**The home page renders sections by key and fetches only for the ones that are on.** `app/(shop)/page.tsx` derives the enabled set, builds its query set from it, and looks results up by key from a `rendered: Record<HomeSectionKey, ReactNode>` map. The newsletter fetches nothing, so it joins the map and contributes nothing to the query set — the same way `BRAND_BAR` and `PERKS_BAR` already do.

## Goals / Non-Goals

**Goals:**

- Exactly one icon declaration per document, and it is the merchant's when they have one.
- A newsletter section that reads as a deliberate band on the home page rather than a slice of footer that lost its background.
- No new data fetch on any route. Both halves ride the settings payload the layout already reads.
- The fallback rule for the icon lives in a pure, tested function in `src/lib`, not in a layout — this repository's tests are node-environment unit tests over `src/lib` only, so anything that needs covering has to live there.

**Non-Goals:**

- An icon set: no apple-touch icon, no dark-mode variant, no generated size ladder, no web manifest. One image, declared once.
- Validating or proxying the merchant's icon URL. If it 404s the browser falls back on its own, which is the correct outcome and needs no code.
- Making the signup form work. It stays a `preventDefault` no-op; see the proposal.
- Any change to how sections are ordered, reconciled or fetched. `NEWSLETTER` is an ordinary member of a mechanism that already exists.

## Decisions

### 1. Delete `src/app/favicon.ico`; serve the same artwork from `public/favicon.ico`

Deleting the file convention is the only way to stop Next prepending its `<link>`. But deleting it outright would also mean a bare `GET /favicon.ico` — which browsers, crawlers and link unfurlers issue regardless of what the head says — returning a 404 for every shop on the platform.

So the same bytes move to `public/favicon.ico`, where Next serves them as a static asset at the identical URL. That one move buys three things: the file convention stops injecting a link, the implicit request keeps resolving, and the file becomes the natural fallback value for a shop that has configured no icon.

*Alternative considered — keep `app/favicon.ico` and let the merchant's icon be the second link.* Rejected: browser behaviour with two `rel="icon"` links is not specified in a way anyone should rely on, and "the merchant's icon usually wins" is not a thing to ship.

*Alternative considered — an `app/icon.tsx` route that redirects to the merchant's URL.* This keeps the file convention and makes it dynamic. Rejected as more machinery for a worse result: it puts a storefront request in front of every icon fetch, it has to handle the unconfigured case anyway, and it makes a Cloudinary-hosted image look like a same-origin asset that the storefront is on the hook for serving.

### 2. The icon is resolved in `resolve-metadata.ts`, not in the layout

A one-line `settings.faviconUrl ?? "/favicon.ico"` in `app/layout.tsx` would work and would be untestable — this repository runs node-environment unit tests over pure `src/lib` modules and has no React renderer, so a rule living in a layout is a rule nothing checks.

Putting it in `resolve-metadata.ts` alongside `metadataBaseOf` and `storeTitleOf` gives it the file's existing `resolve-metadata.test.ts` coverage and its existing never-throw posture: a blank string, a whitespace-only value and a malformed address all fall through to the shipped icon via the module's own `clean` helper, the same way every other stored value there is treated.

It returns `Metadata["icons"]` shaped as `{ icon: [{ url }] }` — a single-element array rather than a bare string, because that is the shape Next normalises everything to internally and the shape that stays readable if a second entry is ever added.

*Deliberately not folded into `resolveMetadata`'s return value.* That function is called by roughly eighteen routes, and every one of them would then emit an icon link — the same icon, eighteen times over, once per route's head. The icon is declared once, in the root layout, and inherited. `resolve-metadata.ts` is where the *resolver* lives; the root layout is the only *caller*.

### 3. `Newsletter` is a server component wrapping the existing client form

`NewsletterForm` is already `"use client"` for one reason: the submit handler. Everything around it — heading, subtext, the band — is static content the server renders. That split is worth keeping exactly as it is, so the new `components/home/Newsletter.tsx` is a server component that takes the merchant's `newsletter` object and renders `NewsletterForm` inside it, unchanged.

The component takes the newsletter content as a prop from the page rather than fetching settings itself. The page already has the settings object in hand, and `getStoreSettings` inside the component would be a second cache read for a value already on the stack.

### 4. Enabled is the only switch; a blank heading omits the heading

Today the block's visibility is `{newsletter.heading && ...}` — a merchant switching it off by emptying a text field. With `homeConfig` governing it, that condition is not just redundant, it is wrong: it would make a section the merchant explicitly switched **on** fail to appear because of a blank text field, with nothing in the admin explaining why.

The page's own standing rule is that *enabled and non-empty are two independent conditions*, and several sections return `null` when they have nothing to show. The newsletter is not one of them: its content is the form, not the heading. A section with no heading renders the form without a heading line; a section with no subtext renders without one. The merchant switches it off to remove it.

### 5. The band styles itself, against the page

In the footer the block inherited `bg-brand text-white`, and its white-on-brand text, its `border-b border-white/10` divider and its `text-white/80` subtext all lean on that. Lifted onto the home page, all of that is white text on a white page.

The section carries its own `bg-brand text-white` band instead, full-bleed, with the container inside it — matching how `PERKS_BAR` and the other full-bleed home sections style themselves. The page's comment about section wrappers is the constraint to respect here: sections are rendered inside a keyed `Fragment`, not a wrapper element, *because* several of them are full-bleed bands that style themselves. This becomes another one.

The `border-b border-white/10` divider goes: it separated the newsletter from the footer's link columns and separates nothing now.

### 6. `FALLBACK_SETTINGS` must carry `NEWSLETTER`, and this is the part that is easy to forget

`FALLBACK_SETTINGS.homeConfig` in `services/store-settings.ts` is a hand-maintained mirror of the server's `HOME_SECTION_KEYS`, and it is what the storefront renders when the settings read fails entirely. Its whole reason for existing is that a shopper cannot tell a stripped home page caused by an outage from one the merchant chose, so the safe direction is to show everything.

Omitting `NEWSLETTER` from it would mean the section silently disappears during exactly the incident where the page is already degraded. It goes in last, matching the server's registry order, and the spec has a scenario for it.

The `HomeSectionKey` union in `types/store-settings.ts` needs the same addition, and the compiler enforces that one: `rendered` is a `Record<HomeSectionKey, ReactNode>`, so a key added to the union without an entry in the map is a build error rather than a blank section.

## Risks / Trade-offs

**Deleting `src/app/favicon.ico` without adding `public/favicon.ico` in the same commit** → every shop's icon request 404s and every unconfigured shop loses its icon. The two are one task in tasks.md for this reason, and the spec has a scenario asserting the bare `/favicon.ico` request is still answered.

**A merchant's icon on an `http://` URL, on an `https://` storefront** → blocked as mixed content; the tab shows the browser's default. Nothing here can fix it, and the server change deliberately does not gate the scheme either (it does not gate `logoUrl`'s). The admin's helper text steers merchants to the upload button, which always yields `https://`.

**The newsletter vanishing from every non-home route is a real, visible loss** → it is the change the merchant asked for, but it is worth saying plainly in the release note rather than letting someone discover it. A merchant who wants site-wide signup no longer has that option; this design does not preserve one.

**A stale cached settings payload could briefly render the old configuration** → the settings read is tagged and the server pings that tag on every settings write, so this resolves on the existing revalidation path with no redeploy. Worst case is one render of the previous state.

**Two hand-maintained mirrors of the section registry** → this repository owns one of them (`FALLBACK_SETTINGS.homeConfig`); the admin owns the other. Decision 6 and its task exist because the failure mode is invisible in development, where the settings API is up and the fallback never runs.

## Migration Plan

1. The server change ships first. Until it does, `faviconUrl` is absent from the payload (the storefront falls back to the shipped icon, as it does today) and `NEWSLETTER` is absent from `homeConfig` — so if this change landed first, the section would exist in the code and never render, while the footer's newsletter would already be gone. **That is the one ordering that produces a visible regression**, so it is the one to avoid.
2. Ship this change. The newsletter moves and the icon becomes configurable in the same deploy — deliberately, because splitting them would leave a window with a newsletter in neither place.
3. The admin change can land before or after; it only affects whether a merchant can *edit* these, not whether they render.

**Rollback** is a plain revert: `src/app/favicon.ico` comes back, `public/favicon.ico` goes, and the footer regains its newsletter. Nothing in this change writes to the database, so no merchant data is affected either way. If the server change is rolled back *after* this one has shipped, the storefront falls back to the shipped icon and `reconcileHomeConfig` stops returning `NEWSLETTER` — so the section disappears from the home page and does not come back in the footer. Roll back in the reverse of the order above.
