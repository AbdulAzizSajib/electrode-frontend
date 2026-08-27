## Purpose

Defines what the storefront shows shoppers about the merchant's real products — the information each product must carry, how products that require a choice are distinguished from those that can be bought directly, and how listings behave when the catalog is slow, empty, or unavailable.

## ADDED Requirements

### Requirement: Products shown are the merchant's real catalog

Every product the storefront displays SHALL come from the merchant's live catalog. The storefront MUST NOT display invented or placeholder products, and a product added, edited, or deactivated by the merchant SHALL be reflected to shoppers without a code change.

Only products the merchant has made active SHALL be shown.

#### Scenario: Listing shows real products

- **WHEN** a shopper opens the product listing
- **THEN** the products shown are those in the merchant's catalog
- **AND** no invented or placeholder product appears

#### Scenario: Merchant edits a product

- **WHEN** the merchant changes a product's name or price and a shopper next loads the listing
- **THEN** the shopper sees the updated name and price

#### Scenario: Inactive products are hidden

- **WHEN** the catalog contains a product that is not active
- **THEN** that product does not appear in listings or search results

### Requirement: A product displays its identifying and commercial details

Each product presented to a shopper SHALL show its name, its current price, and an image. Where the merchant has recorded them, it SHALL also show the product's brand and a comparison ("was") price.

When a comparison price is shown it MUST be higher than the current price, and the saving SHALL be presented consistently wherever a discount is indicated.

Prices SHALL be displayed to the shopper as currency amounts, never as raw stored values, and MUST NOT lose precision.

#### Scenario: Product shows its core details

- **WHEN** a product is displayed in a listing
- **THEN** its name, current price, and image are shown
- **AND** its brand is shown when the merchant has recorded one

#### Scenario: Discounted product shows the saving

- **WHEN** a product has a comparison price higher than its current price
- **THEN** both prices are shown, with the comparison price presented as superseded
- **AND** the discount indicated matches the difference between the two prices

#### Scenario: Product without a comparison price

- **WHEN** a product has no comparison price, or one not higher than its current price
- **THEN** only the current price is shown
- **AND** no discount is indicated

#### Scenario: Product image is missing

- **WHEN** a product has no image recorded
- **THEN** a neutral placeholder is shown in its place
- **AND** the product remains selectable and purchasable

### Requirement: Products requiring a choice are distinguished from those that do not

A product whose purchase requires the shopper to choose between variants SHALL NOT be added to the cart directly from a listing. It SHALL instead lead the shopper to a place where the choice can be made.

A product requiring no such choice MAY be added to the cart directly from a listing.

This prevents a shopper being charged for, or sent, a variant they never selected.

#### Scenario: Variable product leads to a choice

- **WHEN** a shopper acts on a product that has variants from a listing
- **THEN** the shopper is taken to that product's detail view to choose a variant
- **AND** nothing is added to the cart yet

#### Scenario: Simple product adds directly

- **WHEN** a shopper adds a product that has no variants from a listing
- **THEN** that product is added to the cart without leaving the listing

#### Scenario: Detail view presents the available choices

- **WHEN** a shopper views a product that has variants
- **THEN** each variant the merchant has made available is presented as a choice
- **AND** the price shown updates to reflect the selected variant when it differs from the product's base price

### Requirement: Product availability is communicated honestly

Where a product or its selected variant is out of stock, the storefront SHALL indicate this and SHALL NOT offer it for direct addition to the cart.

The storefront MUST NOT present stock levels as a guarantee of availability, since stock can change between browsing and purchase.

#### Scenario: Out-of-stock product

- **WHEN** a product has no available stock
- **THEN** it is shown as unavailable
- **AND** it cannot be added to the cart from the listing

#### Scenario: Stock changes between browsing and adding

- **WHEN** a product's stock is exhausted after the shopper loaded the page but before they add it
- **THEN** the storefront does not claim the purchase is guaranteed
- **AND** the shopper is not shown a confirmation implying stock was reserved

### Requirement: Listings degrade safely

When the catalog cannot be retrieved, the storefront SHALL show the shopper a clear message rather than an error page or an indefinite loading state. When the catalog is reachable but matches no products, the storefront SHALL show an empty state distinguishable from a failure.

While a listing is loading, the shopper SHALL be given a visible indication rather than a blank region.

#### Scenario: Catalog unavailable

- **WHEN** the catalog cannot be retrieved
- **THEN** the shopper is shown a message explaining products could not be loaded
- **AND** the rest of the page remains usable

#### Scenario: No products match

- **WHEN** a search or filter matches no products
- **THEN** the shopper is shown an empty state indicating nothing matched
- **AND** it is distinguishable from a load failure

#### Scenario: Product not found

- **WHEN** a shopper opens a product address that does not exist or is no longer active
- **THEN** the shopper is shown a not-found result rather than an error page

### Requirement: Shoppers can narrow the catalog

Shoppers SHALL be able to narrow the products shown by search term, by category, and by brand, and the results SHALL reflect the merchant's catalog rather than being filtered from a partial local copy.

Where more products match than are shown at once, the shopper SHALL be able to reach the remainder.

#### Scenario: Search narrows results

- **WHEN** a shopper searches for a term
- **THEN** the products shown are those the catalog matches for that term

#### Scenario: Category filter narrows results

- **WHEN** a shopper filters by a category
- **THEN** only products belonging to that category are shown

#### Scenario: More matches than fit on one page

- **WHEN** more products match than are displayed at once
- **THEN** the shopper is able to reach the remaining matches
