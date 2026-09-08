## MODIFIED Requirements

### Requirement: Products requiring a choice are distinguished from those that do not

A product whose purchase requires the shopper to choose between variants SHALL NOT be added to the cart directly from a listing without a choice having been made. It SHALL instead lead the shopper to a place where the choice can be made — either that product's detail view, or a preview presented over the listing itself.

Which of those two the listing's action leads to SHALL follow whether the storefront offers a preview at all. Where a preview is offered, the action SHALL open it. Where it is not, the action SHALL take the shopper to that product's own detail view, which presents the same choices. A product requiring no choice is unaffected either way and SHALL still be added directly from the listing.

Wherever the choice is offered, the shopper SHALL be presented with the variants the merchant has made available, and nothing SHALL be added to the cart until one has been selected. Once a choice has been made, the product MAY be added from that place directly.

A product requiring no such choice MAY be added to the cart directly from a listing.

This prevents a shopper being charged for, or sent, a variant they never selected.

The distinction SHALL be drawn in what the action *does*, not in what it is *called*. A listing's purchase action SHALL carry the same label and the same visual treatment for every product in that listing, naming the shopper's intent — adding the product to their cart — rather than the mechanism it happens to trigger. A shopper scanning a listing MUST NOT be able to tell from the action alone whether a product has variants, and no product SHALL be made to look less purchasable than another because a choice is required first. This SHALL hold whichever destination the action leads to.

Where the action leads to a choice rather than adding immediately, that SHALL be conveyed to assistive technology, so a shopper who cannot see the resulting preview is not told an item was added when it was not. What is conveyed SHALL match what actually happens: an action that opens a preview SHALL be announced as opening one, and an action that navigates to the product's page SHALL NOT be.

#### Scenario: Variable product leads to a choice

- **WHEN** a shopper acts on a product that has variants from a listing
- **THEN** the shopper is given somewhere to choose a variant, without the choice being made for them
- **AND** nothing is added to the cart yet

#### Scenario: Simple product adds directly

- **WHEN** a shopper adds a product that has no variants from a listing
- **THEN** that product is added to the cart without leaving the listing

#### Scenario: Choice is offered in a preview when the storefront offers one

- **WHEN** the storefront offers a preview and a shopper acts on a product that has variants
- **THEN** the preview opens over the listing

#### Scenario: Choice is offered on the product's page when no preview is offered

- **WHEN** the storefront does not offer a preview and a shopper acts on a product that has variants
- **THEN** the shopper is taken to that product's own detail view
- **AND** the variants the merchant has made available are presented there

#### Scenario: Products without variants ignore the preview setting

- **WHEN** the storefront does not offer a preview and a shopper acts on a product that has no variants
- **THEN** that product is added to the cart from the listing exactly as it would be otherwise

#### Scenario: One label across a mixed listing

- **WHEN** a listing shows both products that require a choice and products that do not
- **THEN** every product's purchase action reads identically and is presented identically
- **AND** the label names adding to the cart, not the mechanism behind it

#### Scenario: Action leading to a choice is announced as such

- **WHEN** a purchase action opens a preview for choosing a variant rather than adding immediately
- **THEN** assistive technology is told the action opens a chooser
- **AND** the shopper is not told the product was added to the cart

#### Scenario: Navigating action is not announced as opening a preview

- **WHEN** a purchase action takes the shopper to the product's detail view rather than opening a preview
- **THEN** assistive technology is not told a preview will open

#### Scenario: Detail view presents the available choices

- **WHEN** a shopper views a product that has variants
- **THEN** each variant the merchant has made available is presented as a choice
- **AND** the price shown updates to reflect the selected variant when it differs from the product's base price

#### Scenario: Choice resolved without leaving the listing

- **WHEN** the choice is offered in a preview over the listing and the shopper selects a variant and adds it
- **THEN** the cart receives the selected variant
- **AND** the shopper remains on the listing they were browsing
