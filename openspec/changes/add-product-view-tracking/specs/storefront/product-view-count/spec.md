## Purpose

Governs how a shopper opening a product page is counted as a view, which visits are excluded from that count, and how the accumulated count is presented back to shoppers and to the merchant.

## ADDED Requirements

### Requirement: Opening a product page records a view

The system SHALL record a product view when a shopper opens that product's detail page. The recorded count SHALL be a lifetime total that only ever increases, and SHALL be attributed to the specific product the shopper opened.

Recording a view SHALL NOT be a precondition for displaying the page. If the view cannot be recorded, the product page SHALL render normally and the shopper SHALL see no error.

#### Scenario: A shopper opens a product page

- **WHEN** a shopper opens a product's detail page
- **THEN** that product's recorded view count increases by one

#### Scenario: Recording a view fails

- **WHEN** a shopper opens a product's detail page and the view cannot be recorded
- **THEN** the page renders in full with no error shown to the shopper
- **AND** the previously recorded count is unchanged

#### Scenario: Views are attributed per product

- **WHEN** a shopper views one product and then a different product
- **THEN** each product's count increases by one, and neither product is credited with the other's view

### Requirement: A view is counted once per viewer within a window

A view SHALL be counted at most once per viewer per product within a defined recency window, so that the count reports how many people looked at a product rather than how many requests were received. Repeat visits by the same viewer to the same product within that window SHALL NOT increase the count.

A return visit by the same viewer after the window has elapsed SHALL count again, because it represents renewed interest rather than the same visit continuing.

#### Scenario: A shopper reloads the page

- **WHEN** a shopper opens a product page and reloads it several times in quick succession
- **THEN** the product's count increases by exactly one

#### Scenario: A shopper navigates away and back

- **WHEN** a shopper opens a product page, browses to another page, and returns to the same product within the window
- **THEN** the product's count does not increase a second time

#### Scenario: A shopper returns the next day

- **WHEN** a shopper who viewed a product returns to it after the recency window has elapsed
- **THEN** the product's count increases again

#### Scenario: Two different shoppers view the same product

- **WHEN** two different shoppers each open the same product page within the window
- **THEN** the product's count increases by two

### Requirement: Automated and internal traffic is excluded

Traffic that does not represent a person considering a purchase SHALL NOT be counted. This SHALL exclude automated clients such as crawlers and monitoring checks, and SHALL exclude requests that are not a shopper opening the page, including prefetches and requests the application makes about a product for its own purposes.

#### Scenario: A crawler indexes the catalogue

- **WHEN** an automated client requests every product page in the catalogue
- **THEN** no product's count increases

#### Scenario: Product data is fetched without a shopper opening the page

- **WHEN** the application retrieves a product's data to render it somewhere other than its detail page, such as a listing, a preview, or a related-products row
- **THEN** that product's count does not increase

### Requirement: The product page states the recorded count honestly

The product page SHALL replace the fabricated "people are viewing this right now" line with a statement of the product's actual recorded lifetime view count. The wording SHALL describe accumulated past views and SHALL NOT claim anything about concurrent or current viewers, because a lifetime total carries no information about the present moment.

When a product has no recorded views, the page SHALL omit the statement entirely rather than display a zero or a placeholder.

Large counts SHALL be presented in a form that stays readable at a glance.

#### Scenario: A product with recorded views

- **WHEN** a shopper opens a product that has recorded views
- **THEN** the page states how many people have viewed the product, using the real recorded count

#### Scenario: The count never claims to be live

- **WHEN** the view statement is shown
- **THEN** its wording refers to views that have accumulated
- **AND** it does not assert that any number of people are viewing the product at that moment

#### Scenario: A product nobody has viewed yet

- **WHEN** a shopper opens a product with no recorded views
- **THEN** no view statement is shown at all

#### Scenario: The displayed number is never invented

- **WHEN** a shopper opens any product page
- **THEN** any view number shown comes from the recorded count
- **AND** the number does not change between renders of the same unchanged data

### Requirement: The merchant can see and rank products by views

The recorded view count SHALL be visible to the merchant for every product in the product list, alongside the existing commercial figures, so that a product nobody finds can be distinguished from a product many people find and do not buy.

The merchant SHALL be able to order the product list by view count in both directions.

#### Scenario: The merchant reviews the catalogue

- **WHEN** a merchant opens the product list
- **THEN** each product shows its recorded view count

#### Scenario: The merchant ranks by attention

- **WHEN** a merchant sorts the product list by view count
- **THEN** products are ordered by how many views they have recorded
- **AND** the merchant can reverse that order to find the least-viewed products

#### Scenario: A product with no views

- **WHEN** a product has never been viewed
- **THEN** the merchant sees a zero rather than an empty cell, since zero views is a meaningful finding
