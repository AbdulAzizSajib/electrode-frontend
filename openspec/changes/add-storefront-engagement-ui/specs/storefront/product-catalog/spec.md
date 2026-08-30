## ADDED Requirements

### Requirement: A product carries its rating wherever it is shown

A product presented to a shopper SHALL carry an aggregate rating and a count of the published reviews behind it, and both SHALL be displayed in product listings and on the product detail page.

Displaying ratings across a listing MUST NOT require a separate retrieval per product.

A product with no published reviews MUST NOT be shown with a rating — no zero-star row, no placeholder, and no invented default. The absence of a rating SHALL be visually distinct from a low rating.

#### Scenario: Rated product in a listing
- **WHEN** a shopper views a listing containing a product that has published reviews
- **THEN** that product's rating and review count are shown

#### Scenario: Unrated product in a listing
- **WHEN** a shopper views a listing containing a product with no published reviews
- **THEN** no rating is shown for that product
- **AND** it is not presented as having a zero or one-star rating

#### Scenario: Rating on the product detail page
- **WHEN** a shopper opens a product that has published reviews
- **THEN** its rating and review count are shown alongside the product's other details

#### Scenario: Ratings arrive with the listing
- **WHEN** a listing of products is retrieved
- **THEN** each product's rating and review count arrive as part of that product
- **AND** no additional per-product retrieval is made to display them

#### Scenario: Rating reflects later moderation
- **WHEN** a product's published reviews change and the shopper views the product again
- **THEN** the rating and count shown reflect the current published set

### Requirement: Related products are chosen by relevance, not re-queried by category

The related products shown on a product detail page SHALL come from a dedicated relevance-ranked source for that product, rather than being assembled by re-querying the catalog and discarding entries client-side.

The source product MUST NOT appear among its own related products. Where the catalog holds other purchasable products, the related section SHALL NOT be empty.

#### Scenario: Related products shown
- **WHEN** a shopper opens a product detail page and the catalog holds other purchasable products
- **THEN** related products are shown
- **AND** the product being viewed is not among them

#### Scenario: Few close matches
- **WHEN** a product has few closely related products in the catalog
- **THEN** the related section is still populated rather than shown empty

#### Scenario: Related products cannot be retrieved
- **WHEN** related products cannot be retrieved
- **THEN** the related section is omitted
- **AND** the rest of the product detail page renders normally

#### Scenario: Only product in the catalog
- **WHEN** a shopper opens the only purchasable product in the catalog
- **THEN** the related section is omitted rather than showing the product itself
