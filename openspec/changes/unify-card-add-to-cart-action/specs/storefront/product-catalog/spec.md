## MODIFIED Requirements

### Requirement: Products requiring a choice are distinguished from those that do not

A product whose purchase requires the shopper to choose between variants SHALL NOT be added to the cart directly from a listing without a choice having been made. It SHALL instead lead the shopper to a place where the choice can be made — either that product's detail view, or a preview presented over the listing itself.

Wherever the choice is offered, the shopper SHALL be presented with the variants the merchant has made available, and nothing SHALL be added to the cart until one has been selected. Once a choice has been made, the product MAY be added from that place directly.

A product requiring no such choice MAY be added to the cart directly from a listing.

This prevents a shopper being charged for, or sent, a variant they never selected.

The distinction SHALL be drawn in what the action *does*, not in what it is *called*. A listing's purchase action SHALL carry the same label and the same visual treatment for every product in that listing, naming the shopper's intent — adding the product to their cart — rather than the mechanism it happens to trigger. A shopper scanning a listing MUST NOT be able to tell from the action alone whether a product has variants, and no product SHALL be made to look less purchasable than another because a choice is required first.

Where the action leads to a choice rather than adding immediately, that SHALL be conveyed to assistive technology, so a shopper who cannot see the resulting preview is not told an item was added when it was not.

#### Scenario: Variable product leads to a choice

- **WHEN** a shopper acts on a product that has variants from a listing
- **THEN** the shopper is given somewhere to choose a variant, without the choice being made for them
- **AND** nothing is added to the cart yet

#### Scenario: Simple product adds directly

- **WHEN** a shopper adds a product that has no variants from a listing
- **THEN** that product is added to the cart without leaving the listing

#### Scenario: One label across a mixed listing

- **WHEN** a listing shows both products that require a choice and products that do not
- **THEN** every product's purchase action reads identically and is presented identically
- **AND** the label names adding to the cart, not the mechanism behind it

#### Scenario: Action leading to a choice is announced as such

- **WHEN** a purchase action opens a preview for choosing a variant rather than adding immediately
- **THEN** assistive technology is told the action opens a chooser
- **AND** the shopper is not told the product was added to the cart

#### Scenario: Detail view presents the available choices

- **WHEN** a shopper views a product that has variants
- **THEN** each variant the merchant has made available is presented as a choice
- **AND** the price shown updates to reflect the selected variant when it differs from the product's base price

#### Scenario: Choice resolved without leaving the listing

- **WHEN** the choice is offered in a preview over the listing and the shopper selects a variant and adds it
- **THEN** the cart receives the selected variant
- **AND** the shopper remains on the listing they were browsing

### Requirement: Product availability is communicated honestly

Where a product or its selected variant is out of stock, the storefront SHALL indicate this and SHALL NOT offer it for direct addition to the cart.

A listing's purchase action SHALL be unavailable for any product with no available stock, whether that action would add the product immediately or lead the shopper to choose a variant first. A product that cannot be bought at all MUST NOT present an action inviting the shopper to buy it, and this SHALL hold equally for products with variants and products without — an unavailable product is unavailable regardless of how its purchase would have proceeded.

Such a product SHALL remain viewable: its detail view stays reachable from the listing, so a shopper can still inspect it and see which of its variants are out of stock.

The storefront MUST NOT present stock levels as a guarantee of availability, since stock can change between browsing and purchase.

#### Scenario: Out-of-stock product

- **WHEN** a product has no available stock
- **THEN** it is shown as unavailable
- **AND** it cannot be added to the cart from the listing

#### Scenario: Out-of-stock variable product offers no purchase action

- **WHEN** a product that has variants has no available stock
- **THEN** its listing's purchase action is unavailable rather than leading to a variant chooser
- **AND** it is shown as unavailable, exactly as a product without variants would be

#### Scenario: Unavailable product remains inspectable

- **WHEN** a shopper encounters a product shown as unavailable in a listing
- **THEN** that product's detail view is still reachable from the listing

#### Scenario: Stock changes between browsing and adding

- **WHEN** a product's stock is exhausted after the shopper loaded the page but before they add it
- **THEN** the storefront does not claim the purchase is guaranteed
- **AND** the shopper is not shown a confirmation implying stock was reserved
