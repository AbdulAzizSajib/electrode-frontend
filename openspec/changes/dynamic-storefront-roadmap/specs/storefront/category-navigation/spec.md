## MODIFIED Requirements

### Requirement: Category links resolve to a filtered product listing

Selecting a category SHALL take the shopper to the product listing filtered to that category, and the listing SHALL show the products the merchant has assigned to it.

The address of a filtered listing SHALL identify the category by its human-readable slug, so the address is readable and can be shared or bookmarked and still resolve to the same category.

Every category link the storefront presents — wherever it appears, including outside the navigation menu — MUST identify the category by that slug. A link that identifies a category by its display name, or by any other value the listing cannot resolve, MUST NOT be presented, because such a link silently yields an unfiltered listing rather than the category the shopper chose.

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

#### Scenario: Category links outside the menu also filter

- **WHEN** a shopper selects a category link presented anywhere other than the navigation menu
- **THEN** the listing is filtered to that category
- **AND** the shopper is not shown an unfiltered listing of all products

#### Scenario: Links never identify a category by display name

- **WHEN** the storefront presents a link to a category
- **THEN** the address identifies the category by its slug
- **AND** not by the name displayed to the shopper

## ADDED Requirements

### Requirement: Categories carry a product count for display

Each category presented to a shopper MAY be accompanied by the number of products it contains. Where such a count is displayed, it SHALL be derived from the merchant's catalog.

A fixed or invented count MUST NOT be displayed. Where a count cannot be determined, no count SHALL be shown rather than a placeholder value.

#### Scenario: Displayed count reflects the catalog

- **WHEN** a category is displayed with a product count
- **THEN** that count is the number of products the catalog holds for that category

#### Scenario: Count changes with the catalog

- **WHEN** the merchant adds a product to a category and a shopper next sees that category's count
- **THEN** the count reflects the addition
- **AND** no redeploy of the storefront is required

#### Scenario: Count is omitted rather than invented

- **WHEN** a product count for a category cannot be determined
- **THEN** no count is shown for that category
- **AND** no placeholder count is shown

#### Scenario: Empty category counts zero

- **WHEN** a category contains no products and its count is displayed
- **THEN** the count shown is zero
