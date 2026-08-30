## MODIFIED Requirements

### Requirement: A product displays its identifying and commercial details

Each product presented to a shopper SHALL show its name, its current price, and an image. Where the merchant has recorded them, it SHALL also show the product's brand and a comparison ("was") price.

When a comparison price is shown it MUST be higher than the current price, and the saving SHALL be presented consistently wherever a discount is indicated.

Prices SHALL be displayed to the shopper as currency amounts, never as raw stored values, and MUST NOT lose precision.

A product's identifying and commercial details — its name, price, image, brand, and any discount — SHALL be shown at all times. A listing MAY defer presenting a product's *purchase actions* until the shopper engages with that product, provided the actions remain reachable without hovering; the details a shopper browses and compares by SHALL NOT be deferred in the same way.

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

#### Scenario: Details stay visible when actions do not

- **WHEN** a listing defers a product's purchase actions until the shopper engages
- **THEN** that product's name, price, image, brand, and any discount remain visible at rest

### Requirement: Products requiring a choice are distinguished from those that do not

A product whose purchase requires the shopper to choose between variants SHALL NOT be added to the cart directly from a listing without a choice having been made. It SHALL instead lead the shopper to a place where the choice can be made — either that product's detail view, or a preview presented over the listing itself.

Wherever the choice is offered, the shopper SHALL be presented with the variants the merchant has made available, and nothing SHALL be added to the cart until one has been selected. Once a choice has been made, the product MAY be added from that place directly.

A product requiring no such choice MAY be added to the cart directly from a listing.

This prevents a shopper being charged for, or sent, a variant they never selected.

#### Scenario: Variable product leads to a choice

- **WHEN** a shopper acts on a product that has variants from a listing
- **THEN** the shopper is given somewhere to choose a variant, without the choice being made for them
- **AND** nothing is added to the cart yet

#### Scenario: Simple product adds directly

- **WHEN** a shopper adds a product that has no variants from a listing
- **THEN** that product is added to the cart without leaving the listing

#### Scenario: Detail view presents the available choices

- **WHEN** a shopper views a product that has variants
- **THEN** each variant the merchant has made available is presented as a choice
- **AND** the price shown updates to reflect the selected variant when it differs from the product's base price

#### Scenario: Choice resolved without leaving the listing

- **WHEN** the choice is offered in a preview over the listing and the shopper selects a variant and adds it
- **THEN** the cart receives the selected variant
- **AND** the shopper remains on the listing they were browsing
