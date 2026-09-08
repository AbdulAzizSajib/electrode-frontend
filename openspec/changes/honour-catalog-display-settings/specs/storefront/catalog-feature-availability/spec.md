## Purpose

Governs which of the storefront's optional catalog features — saving products for later, comparing products, and previewing a product from a listing — a given shop offers, so a merchant can remove a feature their business has no use for without a developer editing the storefront.

## ADDED Requirements

### Requirement: The features a storefront offers are the merchant's decision

Whether the storefront offers a wishlist, whether it offers product comparison, and whether it offers a preview of a product from a listing SHALL each be determined by the merchant's configuration, independently of one another.

A feature that has not been configured SHALL be offered. A storefront whose configuration cannot be read SHALL offer all three, so that a failure to read settings never silently removes working features from a shop.

#### Scenario: Unconfigured store offers everything

- **WHEN** a shopper browses a store whose catalog features have never been configured
- **THEN** the wishlist, comparison, and preview are all offered

#### Scenario: Settings cannot be read

- **WHEN** the storefront cannot retrieve its settings
- **THEN** all three features are offered rather than withdrawn
- **AND** the rest of the page renders normally

#### Scenario: Features are independent

- **WHEN** the merchant offers comparison but not the wishlist
- **THEN** comparison is offered everywhere it normally appears
- **AND** no wishlist control appears anywhere

### Requirement: A feature that is not offered is absent everywhere, not merely disabled

Where a feature is not offered, the storefront SHALL NOT present any control for it, in any location — including product listings, a product's own page, and any preview of a product.

A disabled feature's controls SHALL be **absent**, not shown in an inoperable state. A shopper MUST NOT be shown a control for something their store does not do.

The storefront SHALL NOT present any count, indicator, or summary of a feature that is not offered.

#### Scenario: Wishlist withdrawn from every product surface

- **WHEN** the wishlist is not offered and a shopper views a product listing, a product's page, and a product preview
- **THEN** no control for saving a product appears in any of them

#### Scenario: Comparison withdrawn from every product surface

- **WHEN** comparison is not offered and a shopper views a product listing, a product's page, and a product preview
- **THEN** no control for comparing a product appears in any of them
- **AND** no running summary of products being compared is shown

#### Scenario: Counts and indicators go with the feature

- **WHEN** a feature is not offered
- **THEN** no count or indicator for it is shown anywhere in the storefront's navigation

#### Scenario: Controls are removed, not greyed out

- **WHEN** a feature is not offered
- **THEN** its controls are absent from the page rather than present and inoperable

### Requirement: A feature that is not offered has no reachable destination

Where a feature is not offered, the storefront SHALL NOT serve a page for it. A shopper who reaches such a route directly — by an old link, a bookmark, or a search result — SHALL be told the page does not exist, rather than shown an empty or broken version of the feature.

No navigation the storefront presents SHALL lead to a feature that is not offered. This SHALL hold for merchant-authored navigation as well as for links built into the storefront: a merchant who has configured a menu entry pointing at a disabled feature MUST NOT have that entry shown to shoppers.

#### Scenario: Direct navigation to a disabled feature's page

- **WHEN** a shopper opens the wishlist or comparison page of a store that does not offer it
- **THEN** they are shown that the page does not exist

#### Scenario: Merchant-authored menu entry pointing at a disabled feature

- **WHEN** the merchant's configured navigation contains an entry leading to a feature that is not offered
- **THEN** that entry is not shown to shoppers
- **AND** the remaining navigation entries are shown unchanged

#### Scenario: No built-in link survives its feature

- **WHEN** a feature is not offered
- **THEN** no link the storefront itself renders leads to it

### Requirement: Turning a feature off withdraws it without discarding what shoppers saved

Turning a feature off SHALL affect only what the storefront offers. Items a shopper has already saved under that feature MUST NOT be deleted or emptied as a consequence.

Where the feature is offered again, the shopper's previously saved items SHALL still be there.

#### Scenario: Saved items survive the feature being withdrawn and restored

- **WHEN** a shopper has saved products, the merchant turns the feature off, and later turns it back on
- **THEN** the shopper's saved products are still listed

#### Scenario: Withdrawing a feature performs no deletion

- **WHEN** a merchant turns a feature off
- **THEN** no request is made to delete or clear what any shopper has saved
