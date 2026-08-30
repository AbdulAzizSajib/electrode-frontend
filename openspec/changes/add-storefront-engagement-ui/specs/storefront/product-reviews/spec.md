## Purpose

Defines how the storefront presents a product's published reviews and rating breakdown, and how a customer who has actually bought the product writes, edits, withdraws, and tracks the moderation status of their own review.

## ADDED Requirements

### Requirement: Shoppers can read a product's published reviews

A shopper SHALL be able to read the published reviews of a product from the product detail page, without signing in.

Each review shown SHALL display its rating, the reviewer's name, and the date it was submitted. Where more reviews exist than are shown at once, the shopper SHALL be able to reach the remainder.

#### Scenario: Product with published reviews
- **WHEN** a shopper opens a product that has published reviews
- **THEN** those reviews are shown with their rating, reviewer name, and date

#### Scenario: Product with no published reviews
- **WHEN** a shopper opens a product with no published reviews
- **THEN** the review area states that there are no reviews yet
- **AND** it is not presented as a failure

#### Scenario: More reviews than fit at once
- **WHEN** a product has more published reviews than are shown at once
- **THEN** the shopper can reach the remaining reviews

#### Scenario: Reviews cannot be retrieved
- **WHEN** a product's reviews cannot be retrieved
- **THEN** the shopper is told they could not be loaded
- **AND** the product's other details still render

#### Scenario: Unapproved reviews are not shown to others
- **WHEN** a shopper views a product for which another customer has an unapproved review
- **THEN** that review is not shown

### Requirement: A product's rating breakdown is shown alongside its reviews

Where a product has published reviews, the shopper SHALL be shown its average rating, the total number of published reviews, and how many reviews gave each rating value.

The breakdown MUST be consistent with the reviews it summarises: the total SHALL equal the sum of the per-rating counts.

#### Scenario: Breakdown shown for a reviewed product
- **WHEN** a shopper views the reviews of a product with published reviews
- **THEN** the average rating, the total count, and a per-rating distribution are shown

#### Scenario: Breakdown is internally consistent
- **WHEN** a rating breakdown is shown
- **THEN** the total equals the sum of the per-rating counts

#### Scenario: No breakdown without reviews
- **WHEN** a product has no published reviews
- **THEN** no rating breakdown is shown

### Requirement: Only an eligible customer is offered the review form

A shopper SHALL be offered the ability to write a review only when they are entitled to submit one.

A shopper who is not signed in SHALL be prompted to sign in rather than shown a form that will be refused. A signed-in customer who has not purchased the product SHALL be told that reviewing requires a completed purchase. A customer who has already reviewed the product SHALL be offered the option to edit their existing review instead of writing a second one.

A refusal by the system MUST be presented as an explanation of the rule, not as an error or a failure of the storefront.

#### Scenario: Eligible customer sees the form
- **WHEN** a signed-in customer who has purchased the product and not yet reviewed it views its reviews
- **THEN** they are able to write a review

#### Scenario: Signed-out shopper
- **WHEN** a shopper who is not signed in attempts to write a review
- **THEN** they are prompted to sign in
- **AND** no review is submitted

#### Scenario: Customer has not purchased the product
- **WHEN** a signed-in customer who has not purchased the product attempts to write a review
- **THEN** they are told that a completed purchase is required
- **AND** the message is presented as an explanation rather than an error

#### Scenario: Customer has already reviewed the product
- **WHEN** a customer who has already reviewed the product views its reviews
- **THEN** they are offered the option to edit their existing review
- **AND** they are not offered a second submission

### Requirement: A customer can submit a review with a bounded rating

A customer SHALL submit a review as a rating together with an optional written comment. The rating SHALL be a whole number within the permitted range, and the storefront MUST NOT allow a submission outside it.

On success the customer SHALL be told the review was received and that it awaits moderation before other shoppers can see it. On failure the customer SHALL be told the review was not submitted, and the entered content MUST NOT be silently discarded.

#### Scenario: Review submitted successfully
- **WHEN** an eligible customer submits a rating with or without a comment
- **THEN** the review is recorded
- **AND** the customer is told it awaits moderation

#### Scenario: Submission without a rating
- **WHEN** a customer attempts to submit a review without choosing a rating
- **THEN** the submission is prevented
- **AND** the customer is told a rating is required

#### Scenario: Submission fails
- **WHEN** a customer submits a review and the submission fails
- **THEN** the customer is told it was not submitted
- **AND** what they wrote is still available to them

#### Scenario: Newly submitted review is not yet public
- **WHEN** a customer has submitted a review that has not been approved
- **THEN** it does not appear in the product's published review list to other shoppers

### Requirement: A customer can manage their own reviews and see their status

A customer SHALL be able to see every review they have submitted, including those awaiting moderation and those that were rejected, together with the status of each and the product it concerns.

A customer SHALL be able to edit or withdraw a review they submitted. Where editing a published review returns it to moderation, the customer SHALL be told this before they submit the edit.

A customer MUST NOT be able to edit or withdraw a review submitted by someone else.

#### Scenario: Customer views their own reviews
- **WHEN** a customer opens their reviews
- **THEN** every review they submitted is listed with its status and the product it concerns

#### Scenario: Pending and rejected reviews are visible to their author
- **WHEN** a customer has reviews awaiting moderation or that were rejected
- **THEN** those reviews appear in their own list with that status shown

#### Scenario: Customer edits a review
- **WHEN** a customer edits a review they submitted
- **THEN** the updated content replaces the previous content

#### Scenario: Editing a published review returns it to moderation
- **WHEN** a customer edits a review that is currently published
- **THEN** they are told beforehand that the edit returns it for re-moderation

#### Scenario: Customer withdraws a review
- **WHEN** a customer withdraws a review they submitted
- **THEN** it no longer appears in their list
- **AND** it no longer appears to other shoppers

#### Scenario: Customer has written no reviews
- **WHEN** a customer with no reviews opens their reviews
- **THEN** an empty state is shown rather than a failure
