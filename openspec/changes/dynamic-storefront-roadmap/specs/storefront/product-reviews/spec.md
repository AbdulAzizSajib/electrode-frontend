## Purpose

Defines how shoppers rate and review products, who is entitled to review, how individual ratings aggregate onto the catalog, and how a merchant moderates what is published — so that ratings shown to shoppers are trustworthy rather than decorative.

## ADDED Requirements

### Requirement: A verified purchaser can review a product

A customer SHALL be able to submit a review of a product consisting of a rating and, optionally, a written comment.

A review MAY be submitted only by a customer who has purchased that product. A shopper who has not purchased the product MUST NOT be able to submit a review of it.

A customer SHALL be able to submit at most one review per product, and SHALL be able to edit or withdraw a review they submitted.

#### Scenario: Purchaser submits a review

- **WHEN** a customer who has purchased a product submits a rating for it
- **THEN** the review is accepted

#### Scenario: Non-purchaser cannot review

- **WHEN** a shopper who has not purchased a product attempts to review it
- **THEN** the submission is refused
- **AND** the shopper is told why

#### Scenario: Signing in is required

- **WHEN** a shopper who is not signed in attempts to submit a review
- **THEN** the shopper is asked to sign in
- **AND** no review is recorded

#### Scenario: One review per product

- **WHEN** a customer who has already reviewed a product submits another review of it
- **THEN** a second review is not created
- **AND** the customer is offered the option to edit their existing review

#### Scenario: Customer edits their review

- **WHEN** a customer edits a review they submitted
- **THEN** the updated content replaces the previous content

#### Scenario: Customer withdraws their review

- **WHEN** a customer withdraws a review they submitted
- **THEN** the review no longer appears to shoppers
- **AND** it no longer contributes to the product's aggregate rating

#### Scenario: A customer cannot alter another's review

- **WHEN** a customer attempts to edit or withdraw a review submitted by someone else
- **THEN** the attempt is refused

### Requirement: A rating is bounded and a review is attributable

A rating SHALL be a whole number within a fixed, stated range, and a submission outside that range MUST be refused.

Each review shown to a shopper SHALL display the rating given, the date it was submitted, and the name of the customer who submitted it. A review MUST NOT be shown without attribution or without a date.

#### Scenario: Rating outside the range is refused

- **WHEN** a customer submits a rating outside the permitted range
- **THEN** the submission is refused
- **AND** the shopper is told the permitted range

#### Scenario: Review is displayed with attribution

- **WHEN** a review is shown to a shopper
- **THEN** the rating, the submission date, and the reviewer's name are shown

#### Scenario: Verified purchase is indicated

- **WHEN** a review is shown to a shopper
- **THEN** it is indicated that the reviewer purchased the product

### Requirement: The merchant moderates before publication

A submitted review SHALL NOT be visible to other shoppers until the merchant has approved it.

A review the merchant rejects MUST NOT be shown to shoppers and MUST NOT contribute to the product's aggregate rating. The customer who submitted a review SHALL be able to see its status.

#### Scenario: Submitted review awaits approval

- **WHEN** a customer submits a review and the merchant has not yet approved it
- **THEN** the review is not shown to other shoppers
- **AND** it does not contribute to the product's aggregate rating

#### Scenario: Approved review becomes visible

- **WHEN** the merchant approves a review
- **THEN** the review is shown to shoppers
- **AND** it contributes to the product's aggregate rating

#### Scenario: Rejected review stays hidden

- **WHEN** the merchant rejects a review
- **THEN** the review is not shown to shoppers
- **AND** it does not contribute to the product's aggregate rating

#### Scenario: Author sees their own pending review

- **WHEN** the customer who submitted a review that is awaiting approval views the product
- **THEN** they can see their review and that it is awaiting approval

### Requirement: Aggregate ratings are accurate and honestly absent

A product SHALL carry an aggregate rating and a count of the published reviews contributing to it.

The aggregate MUST be derived from published reviews only, and MUST change when a review is published, withdrawn, edited, or rejected.

A product with no published reviews MUST NOT display a rating. A default, placeholder, or invented rating MUST NOT be shown for such a product.

#### Scenario: Aggregate reflects published reviews

- **WHEN** a product has published reviews
- **THEN** the aggregate rating shown is derived from those reviews
- **AND** the review count equals the number of published reviews

#### Scenario: Aggregate updates when a review is published

- **WHEN** a review is approved for a product
- **THEN** the product's aggregate rating and review count reflect it

#### Scenario: Aggregate updates when a review is withdrawn

- **WHEN** a published review is withdrawn or rejected
- **THEN** the product's aggregate rating and review count no longer reflect it

#### Scenario: Product with no reviews shows no rating

- **WHEN** a product has no published reviews
- **THEN** no rating is displayed for it
- **AND** no placeholder or default rating is shown

### Requirement: Ratings reach listings without a request per product

Where a product is presented in a listing, its aggregate rating and review count SHALL be available as part of that product's own details.

Displaying ratings across a listing MUST NOT require a separate retrieval for each product shown.

#### Scenario: Listing shows ratings

- **WHEN** a shopper views a product listing
- **THEN** each product's aggregate rating and review count are shown where it has published reviews

#### Scenario: Listing ratings need no per-product retrieval

- **WHEN** a listing of products is retrieved
- **THEN** the ratings and review counts arrive with the products
- **AND** no additional retrieval per product is required to display them

### Requirement: Shoppers can read reviews and mark them helpful

A shopper SHALL be able to read the published reviews of a product. Where more reviews exist than are shown at once, the shopper SHALL be able to reach the remainder.

A shopper SHALL be able to mark a review as helpful, and the number of shoppers who have done so SHALL be shown. A shopper MUST NOT be able to inflate the count by marking the same review repeatedly.

#### Scenario: Shopper reads a product's reviews

- **WHEN** a shopper views a product with published reviews
- **THEN** those reviews are shown

#### Scenario: More reviews than fit at once

- **WHEN** a product has more published reviews than are shown at once
- **THEN** the shopper is able to reach the remaining reviews

#### Scenario: Shopper marks a review helpful

- **WHEN** a shopper marks a review as helpful
- **THEN** the review's helpful count increases

#### Scenario: Repeated marking does not inflate the count

- **WHEN** a shopper marks the same review as helpful more than once
- **THEN** the helpful count reflects that shopper only once

### Requirement: Testimonials shown on the storefront are real and merchant-curated

Where the storefront presents customer testimonials, each SHALL be a distinct, merchant-curated testimonial with its own text and its own attribution.

The same text MUST NOT be repeated across several testimonials, and a fixed rating MUST NOT be attached to a testimonial that does not carry one.

#### Scenario: Testimonials are distinct

- **WHEN** testimonials are shown to a shopper
- **THEN** each has its own text and its own attribution
- **AND** no placeholder text is shown

#### Scenario: Testimonial rating is its own

- **WHEN** a testimonial is displayed with a rating
- **THEN** that rating is the one recorded for that testimonial

#### Scenario: No testimonials configured

- **WHEN** the merchant has curated no testimonials
- **THEN** the testimonial section is omitted
- **AND** the rest of the page renders normally
