## MODIFIED Requirements

### Requirement: A product displays its identifying and commercial details

Each product presented to a shopper SHALL show its name, its current price, and an image. Where the merchant has recorded them, it SHALL also show the product's brand and a comparison ("was") price.

Where a product has published reviews, it SHALL also show its aggregate rating and the number of published reviews contributing to it. Where a product has no published reviews, no rating SHALL be shown for it, and a default or placeholder rating MUST NOT be displayed in its place.

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

#### Scenario: Reviewed product shows its rating

- **WHEN** a product with published reviews is displayed
- **THEN** its aggregate rating and published review count are shown

#### Scenario: Unreviewed product shows no rating

- **WHEN** a product with no published reviews is displayed
- **THEN** no rating is shown for it
- **AND** no placeholder or default rating is shown

### Requirement: Shoppers can narrow the catalog

Shoppers SHALL be able to narrow the products shown by search term, by category, and by brand, and the results SHALL reflect the merchant's catalog rather than being filtered from a partial local copy.

Shoppers SHALL additionally be able to narrow the products shown by price range, by minimum rating, to those currently purchasable, and to those carrying a comparison price higher than their current price. As with the other filters, these SHALL be applied to the merchant's catalog rather than to a partial local copy.

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

#### Scenario: Price range narrows results

- **WHEN** a shopper filters to a price range
- **THEN** only products whose current price falls within that range are shown
- **AND** matching products beyond the first page are still reachable

#### Scenario: Minimum rating narrows results

- **WHEN** a shopper filters to a minimum rating
- **THEN** only products whose aggregate rating meets or exceeds it are shown

#### Scenario: Purchasable-only filter narrows results

- **WHEN** a shopper filters to products currently purchasable
- **THEN** products that cannot currently be purchased are excluded

#### Scenario: Discounted-only filter narrows results

- **WHEN** a shopper filters to discounted products
- **THEN** only products with a comparison price higher than their current price are shown
- **AND** the set shown is drawn from the whole catalog rather than from the products already displayed

#### Scenario: Filters combine

- **WHEN** a shopper applies more than one filter at once
- **THEN** only products satisfying all of them are shown

## ADDED Requirements

### Requirement: Ordering applies to the whole result set

Where a shopper chooses how the products are ordered, that ordering SHALL be applied across every product matching their current filters, not only across the products currently displayed.

The first page of an ordered result set MUST therefore contain the products that genuinely come first across the whole match, and paging through an ordered result set MUST NOT show a product twice or omit one.

The ordering options offered to a shopper MUST each have an effect. An option that does not change the order MUST NOT be presented.

#### Scenario: Ordering spans the whole match

- **WHEN** a shopper orders a result set by price ascending and more products match than fit on one page
- **THEN** the first page shows the lowest-priced matching products across the whole result set
- **AND** not merely the lowest-priced among those already displayed

#### Scenario: Paging an ordered result set is consistent

- **WHEN** a shopper moves through the pages of an ordered result set
- **THEN** no product appears on more than one page
- **AND** no matching product is skipped

#### Scenario: Ordering combines with filters

- **WHEN** a shopper applies a filter and an ordering together
- **THEN** the ordering is applied across every product matching that filter

#### Scenario: Ordering choice survives paging

- **WHEN** a shopper who has chosen an ordering moves to the next page
- **THEN** the chosen ordering still applies

#### Scenario: Every offered ordering has an effect

- **WHEN** a shopper selects any offered ordering option
- **THEN** the products are ordered accordingly
