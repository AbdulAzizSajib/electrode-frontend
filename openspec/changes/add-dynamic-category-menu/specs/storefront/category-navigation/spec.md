## Purpose

Defines how the storefront presents the merchant's catalog taxonomy to shoppers: which categories appear in the navigation menu, in what order and hierarchy, how a shopper moves from a category to its filtered product listing, and how the menu behaves when the catalog cannot be loaded.

## ADDED Requirements

### Requirement: Category menu reflects the live catalog

The storefront SHALL source its category navigation from the merchant's live catalog rather than from a fixed, build-time list, so that categories added, renamed, reordered, or deactivated by the merchant appear correctly to shoppers without a code change or redeploy.

The menu SHALL include only categories that are active and visible to the public. Categories that the merchant has deactivated MUST NOT appear.

#### Scenario: Menu lists the merchant's active categories

- **WHEN** a shopper opens the "Shop By Categories" menu and the catalog contains active top-level categories
- **THEN** the menu lists those categories using their catalog names
- **AND** no category absent from the catalog is shown

#### Scenario: Merchant renames a category

- **WHEN** the merchant renames an existing category and a shopper next loads the storefront
- **THEN** the menu shows the new name
- **AND** no redeploy of the storefront is required

#### Scenario: Deactivated categories are hidden

- **WHEN** the catalog contains a category that is not active
- **THEN** that category is absent from the menu
- **AND** its children are also absent from the menu

### Requirement: Category ordering and hierarchy

The menu SHALL present top-level categories in the order the merchant has assigned to them, and SHALL present each category's children in the merchant's assigned order within their parent.

A category that has children SHALL be presented such that a shopper can reveal those children. A category with no children SHALL take the shopper directly to its product listing.

#### Scenario: Merchant-defined ordering is honored

- **WHEN** the merchant assigns a display order to top-level categories
- **THEN** the menu lists them in that order rather than alphabetically or in an arbitrary order

#### Scenario: Parent reveals its children

- **WHEN** a shopper selects a category that has children
- **THEN** the menu reveals that category's children
- **AND** the children appear in the merchant's assigned order

#### Scenario: Childless category navigates directly

- **WHEN** a shopper selects a category that has no children
- **THEN** the shopper is taken to the product listing filtered to that category

### Requirement: Category links resolve to a filtered product listing

Selecting a category SHALL take the shopper to the product listing filtered to that category, and the listing SHALL show the products the merchant has assigned to it.

The address of a filtered listing SHALL identify the category by its human-readable slug, so the address is readable and can be shared or bookmarked and still resolve to the same category.

#### Scenario: Selecting a category filters the listing

- **WHEN** a shopper selects a category from the menu
- **THEN** the product listing shows products belonging to that category
- **AND** products outside that category are excluded

#### Scenario: Shared category address resolves

- **WHEN** a shopper opens a category listing address that was copied or bookmarked earlier
- **THEN** the listing resolves to the same category and shows its products

#### Scenario: Unknown category in the address

- **WHEN** a shopper opens a listing address naming a category that does not exist or is no longer active
- **THEN** the storefront does not error
- **AND** the shopper is shown either an unfiltered listing or a clear empty state

### Requirement: Menu degrades safely when the catalog is unavailable

When the catalog cannot be retrieved, or returns no categories, the storefront SHALL omit the category menu rather than showing placeholder or stale categories. Because the menu appears on every page, a failure to load categories MUST NOT block, delay, or break rendering of the rest of the page.

#### Scenario: Catalog request fails

- **WHEN** the catalog cannot be retrieved
- **THEN** the category menu is omitted
- **AND** no fictional or placeholder categories are shown
- **AND** the rest of the page renders normally

#### Scenario: Catalog returns no categories

- **WHEN** the catalog is reachable but contains no active categories
- **THEN** the category menu is omitted
- **AND** the rest of the page renders normally

#### Scenario: Shoppers are never shown dead category links

- **WHEN** the category menu is displayed to a shopper
- **THEN** every category shown corresponds to a real, active category in the merchant's catalog

### Requirement: Category menu is available to all shoppers

The category menu SHALL be available to every shopper, whether signed in or browsing as a guest. Retrieving the categories MUST NOT require the shopper to hold any account or elevated privilege.

#### Scenario: Guest sees the menu

- **WHEN** a shopper who is not signed in loads the storefront
- **THEN** the category menu is populated with the merchant's active categories

#### Scenario: Signed-in customer sees the same menu

- **WHEN** a signed-in customer loads the storefront
- **THEN** the category menu shows the same active categories as it does for a guest
