## Purpose

Defines what a storefront page render is allowed to wait on, and how cached shop content stays both fast and fresh after a merchant saves.

## ADDED Requirements

### Requirement: Page chrome does not wait on an account lookup
Rendering the shop chrome (header, mobile navigation, signed-in state) and the product page SHALL NOT make a network request to resolve the visitor's account. Signed-in state and the display name SHALL come from the credentials the request already carries. Pages that show or edit the account's own data (account pages, checkout) MAY still fetch the full profile.

#### Scenario: Signed-in visitor opens the home page
- **WHEN** a signed-in visitor requests `/`
- **THEN** the header shows their first name and account link
- **AND** the render makes no request to the backend's `/auth/me`

#### Scenario: Guest opens a product page
- **WHEN** a visitor with no session requests `/products/{handle}`
- **THEN** the page renders with signed-out chrome and makes no account request

#### Scenario: Expired credentials read as signed out
- **WHEN** a request carries an access token whose expiry has passed and the session cannot be renewed
- **THEN** the chrome renders as signed out

### Requirement: Shared shop content is served from cache and refreshed by invalidation
Store settings, catalog, reviews, landing pages and other merchant-managed public content SHALL be served from the storefront's data cache. A merchant's save SHALL make the change visible on the next request through tag invalidation. When a cached entry's time-based window has passed, a render SHALL still be served from the stale entry while it refreshes in the background, never by waiting on the backend.

#### Scenario: Merchant edits store settings
- **WHEN** a merchant saves store settings and the server's revalidation call succeeds
- **THEN** the next storefront request shows the new settings, without waiting for time-based expiry

#### Scenario: Expired cache entry does not block a render
- **WHEN** a visitor loads a page after store settings' time-based window has passed and nothing was saved in between
- **THEN** the page renders from the cached settings without waiting on the backend

### Requirement: Cache tags are exactly the tags the server invalidates
The storefront SHALL tag its cached reads with the plain content tag (for example `products`), and a revalidation for a tag SHALL expire exactly that tag, whatever hostname the storefront is served at. The storefront SHALL NOT send a shop- or demo-selecting header to the API.

#### Scenario: Multi-label domain receives invalidation
- **WHEN** a storefront served at `www.myshop.com.bd` receives a revalidation for `products` from its server
- **THEN** the cached product data served at `www.myshop.com.bd` is invalidated

#### Scenario: Subdomain storefront
- **WHEN** a storefront is served at `shop.example.com`
- **THEN** its API calls carry no `x-demo-key` header and its cached product reads are tagged `products`

### Requirement: Merchant-configured icons render with the first paint
Icons that the merchant configures by Iconify name (header links, perks strip, mobile navigation, landing-page sections) SHALL be present in the server-rendered HTML. They SHALL NOT be fetched by the browser after hydration. An icon name that cannot be resolved SHALL render as no icon, not as an error.

#### Scenario: Header link icon is in the initial HTML
- **WHEN** a header link is configured with icon `lucide:truck` and the page is requested
- **THEN** the HTML response contains that icon's SVG markup

#### Scenario: Unknown icon name
- **WHEN** a perk is configured with an icon name the icon service does not know
- **THEN** the perk renders its text with no icon and the page does not fail
