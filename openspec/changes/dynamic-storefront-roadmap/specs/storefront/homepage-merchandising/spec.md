## Purpose

Defines how the homepage's promotional surfaces — hero, banners, brand bar, category grid and tabs — are populated from the merchant's live catalog and from scheduled, merchant-managed banners, so a merchant can run a promotion without a developer editing code.

## ADDED Requirements

### Requirement: Promotional banners are merchant-managed

The storefront's promotional banners SHALL be sourced from the merchant's banner configuration rather than from values embedded in the storefront's code.

Each banner SHALL carry the surface it appears on, the imagery and text shown to the shopper, the destination it leads to, and its position relative to other banners on the same surface.

A banner a merchant adds, edits, reorders, or removes MUST be reflected to shoppers without a code change or redeploy.

#### Scenario: Merchant adds a banner

- **WHEN** the merchant adds a banner to a surface and a shopper next loads the homepage
- **THEN** the banner appears on that surface
- **AND** no redeploy of the storefront is required

#### Scenario: Merchant-defined ordering is honored

- **WHEN** more than one banner is configured for the same surface
- **THEN** they are presented in the order the merchant has assigned

#### Scenario: Banner leads to its configured destination

- **WHEN** a shopper selects a banner
- **THEN** the shopper is taken to the destination the merchant configured for it

#### Scenario: Merchant removes a banner

- **WHEN** the merchant removes a banner and a shopper next loads the homepage
- **THEN** that banner is absent

### Requirement: Banners can be scheduled to start and end on their own

A banner SHALL be able to carry a period during which it is displayed. Outside that period the banner MUST NOT be shown to shoppers.

A banner SHALL also be able to be marked inactive, in which case it MUST NOT be shown regardless of its scheduled period.

A promotion that has been scheduled MUST begin and end without a merchant or developer intervening at the moment it starts or ends.

#### Scenario: Banner scheduled to start in the future

- **WHEN** a banner's display period has not yet begun
- **THEN** the banner is not shown to shoppers

#### Scenario: Banner whose period has ended

- **WHEN** a banner's display period has passed
- **THEN** the banner is not shown to shoppers
- **AND** no intervention was required to withdraw it

#### Scenario: Banner within its period

- **WHEN** the current moment falls inside a banner's display period and the banner is active
- **THEN** the banner is shown to shoppers

#### Scenario: Inactive banner is hidden despite its schedule

- **WHEN** a banner is marked inactive
- **THEN** it is not shown to shoppers even if the current moment falls within its display period

#### Scenario: Banner with no period is always eligible

- **WHEN** a banner is active and carries no display period
- **THEN** it is shown to shoppers

### Requirement: The hero presents every eligible slide

Where more than one banner is eligible for the hero surface, the shopper SHALL be able to reach each of them. An eligible banner MUST NOT be permanently unreachable because another occupies the surface.

#### Scenario: Multiple eligible hero banners

- **WHEN** more than one banner is eligible for the hero surface
- **THEN** the shopper is able to reach each of them
- **AND** no eligible banner is permanently hidden

#### Scenario: Single eligible hero banner

- **WHEN** exactly one banner is eligible for the hero surface
- **THEN** it is displayed
- **AND** no controls for moving between slides are presented

### Requirement: The brand bar reflects the merchant's real brands

The brands presented on the homepage SHALL be the merchant's real catalog brands rather than a fixed list embedded in the storefront's code.

Selecting a brand SHALL take the shopper to the product listing filtered to that brand.

#### Scenario: Brand bar lists catalog brands

- **WHEN** a shopper views the homepage brand bar
- **THEN** the brands shown are the merchant's catalog brands

#### Scenario: Merchant adds a brand

- **WHEN** the merchant adds a brand to the catalog and a shopper next loads the homepage
- **THEN** the brand can appear in the brand bar without a redeploy

#### Scenario: Selecting a brand filters the listing

- **WHEN** a shopper selects a brand from the brand bar
- **THEN** the product listing shows products of that brand

### Requirement: The category grid reflects the live catalog and links correctly

The homepage category grid SHALL be sourced from the merchant's live catalog rather than from a fixed list embedded in the storefront's code.

Each tile SHALL show the category's catalog name and the number of products in that category, and that number MUST reflect the catalog rather than being a fixed value.

Selecting a tile SHALL take the shopper to the product listing filtered to that category, and the listing MUST actually be filtered — a tile MUST NOT lead to an unfiltered listing.

#### Scenario: Grid lists the merchant's active categories

- **WHEN** a shopper views the homepage category grid
- **THEN** the tiles shown are the merchant's active categories, using their catalog names

#### Scenario: Tile shows a real product count

- **WHEN** a category tile displays a product count
- **THEN** that count reflects the number of products the catalog holds for that category

#### Scenario: Selecting a tile filters the listing

- **WHEN** a shopper selects a category tile
- **THEN** the product listing shows only products belonging to that category
- **AND** the listing is not an unfiltered list of all products

#### Scenario: Deactivated category is absent from the grid

- **WHEN** the merchant deactivates a category
- **THEN** that category has no tile in the grid

### Requirement: Category tabs filter the products beneath them

Where the homepage presents category tabs above a set of products, the tabs SHALL be sourced from the live catalog, and selecting a tab SHALL change the products shown to those of the selected category.

A tab presented to a shopper MUST be selectable. Tabs MUST NOT be presented as interactive if selecting them has no effect.

#### Scenario: Selecting a tab changes the products shown

- **WHEN** a shopper selects a category tab
- **THEN** the products shown beneath it become those of the selected category

#### Scenario: Selected tab is distinguishable

- **WHEN** a category tab is selected
- **THEN** it is visually distinguished from the unselected tabs

#### Scenario: Tabs come from the catalog

- **WHEN** the homepage presents category tabs
- **THEN** the tabs correspond to real, active catalog categories

### Requirement: Homepage surfaces degrade safely

When banners, brands, or categories cannot be retrieved, or return nothing, the storefront SHALL omit the affected surface rather than showing placeholder, invented, or stale promotional content.

A failure of any one surface MUST NOT block, delay, or break rendering of the rest of the homepage.

#### Scenario: Banners cannot be retrieved

- **WHEN** the banners cannot be retrieved
- **THEN** the banner surfaces are omitted
- **AND** no invented promotional content is shown
- **AND** the rest of the homepage renders normally

#### Scenario: No banners are eligible

- **WHEN** the banner source is reachable but no banner is currently eligible for a surface
- **THEN** that surface is omitted
- **AND** the rest of the homepage renders normally

#### Scenario: One surface failing does not remove the others

- **WHEN** the brands cannot be retrieved but the categories can
- **THEN** the brand bar is omitted
- **AND** the category surfaces still render

#### Scenario: Shoppers are never shown a fictional promotion

- **WHEN** a promotional banner is displayed to a shopper
- **THEN** it corresponds to a real, currently eligible banner the merchant configured
