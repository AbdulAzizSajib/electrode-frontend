## Purpose

Defines how a customer reviews the orders they have placed, and how anyone holding an order number can follow that order's progress — including a guest who checked out without an account or who is not currently signed in.

## ADDED Requirements

### Requirement: A customer can see the orders they have placed

A signed-in customer SHALL be able to view a list of the orders they have placed, most recent first.

Each listed order SHALL show enough to identify and judge it: its order number, the date it was placed, its current status, its total, and an indication of what it contained. From the list the customer SHALL be able to open the full detail of any of their orders.

#### Scenario: Customer views their order list

- **WHEN** a signed-in customer opens their order history
- **THEN** the orders they have placed are listed, most recent first
- **AND** each shows its order number, date, status, and total

#### Scenario: Customer opens an order

- **WHEN** a customer selects an order from their history
- **THEN** the full detail of that order is shown

#### Scenario: More orders than fit on one page

- **WHEN** a customer has placed more orders than are displayed at once
- **THEN** the customer is able to reach the remaining orders

#### Scenario: Customer has placed no orders

- **WHEN** a customer who has never placed an order opens their order history
- **THEN** a clear empty state is shown
- **AND** the customer is offered a route back to the catalog

### Requirement: Orders are visible only to the customer who placed them

A customer SHALL be able to see only their own orders. An order MUST NOT be listed to, or readable in detail by, any customer other than the one who placed it.

Requesting an order belonging to another customer MUST NOT disclose its contents, its total, or the identity of the customer who placed it.

#### Scenario: Another customer's order is not listed

- **WHEN** a customer views their order history
- **THEN** no order placed by a different customer appears

#### Scenario: Another customer's order is not readable

- **WHEN** a customer requests the detail of an order placed by a different customer
- **THEN** the request is refused
- **AND** no part of that order's contents, total, or customer identity is disclosed

#### Scenario: Order history requires sign-in

- **WHEN** a shopper who is not signed in attempts to view order history
- **THEN** the shopper is asked to sign in
- **AND** no orders are shown

### Requirement: An order's progress is shown as a timeline

An order SHALL carry a record of the stages it has passed through, each stage identifying what happened and when.

The stages SHALL be presented to the customer in the order they occurred, and the order's current status MUST be consistent with the most recent stage recorded. Where the merchant has recorded a carrier, a consignment reference, or an expected delivery date, these SHALL be shown.

#### Scenario: Timeline shows the stages passed

- **WHEN** a customer views the tracking for an order
- **THEN** the stages the order has passed through are shown in the order they occurred
- **AND** each shows when it happened

#### Scenario: Current status matches the timeline

- **WHEN** an order's tracking is shown
- **THEN** the current status reflects the most recent recorded stage

#### Scenario: Consignment details are shown when recorded

- **WHEN** the merchant has recorded a carrier and consignment reference for an order
- **THEN** these are shown to the customer

#### Scenario: Order with no stages beyond placement

- **WHEN** an order has only just been placed and no further stage is recorded
- **THEN** the timeline shows that it was placed
- **AND** no invented later stage is shown

### Requirement: An order can be tracked without signing in

A shopper SHALL be able to look up an order's progress by supplying the order number together with the email address the order was placed under, without signing in.

A lookup MUST succeed only when both values correspond to the same order. Supplying an order number alone MUST NOT reveal anything about the order.

#### Scenario: Guest tracks an order successfully

- **WHEN** a shopper supplies an order number and the email address that order was placed under
- **THEN** that order's status and timeline are shown

#### Scenario: Order number without a matching email

- **WHEN** a shopper supplies a valid order number with an email address the order was not placed under
- **THEN** the lookup fails
- **AND** nothing about the order is disclosed

#### Scenario: Unknown order number

- **WHEN** a shopper supplies an order number that does not exist
- **THEN** the lookup fails with a message that does not distinguish a non-existent order from a mismatched email address

#### Scenario: Tracking form requires both values

- **WHEN** a shopper submits the tracking form without both an order number and an email address
- **THEN** the shopper is told what is missing
- **AND** no lookup is attempted

### Requirement: Guest tracking reveals only what is needed to track

A successful guest lookup SHALL disclose only what a shopper needs to follow the order: its number, status, timeline, expected delivery, and what was ordered.

It MUST NOT disclose the customer's stored payment details, their saved addresses beyond the delivery address for that order, or any other order.

#### Scenario: Guest lookup discloses tracking detail only

- **WHEN** a guest lookup succeeds
- **THEN** the order's number, status, timeline, and contents are shown
- **AND** no stored payment details are disclosed
- **AND** no other order belonging to that customer is disclosed

#### Scenario: Repeated failed lookups are limited

- **WHEN** repeated guest lookups fail against the same order number
- **THEN** further attempts are limited
- **AND** the order's details remain undisclosed

### Requirement: Order retrieval degrades safely

When an order or an order list cannot be retrieved, the shopper SHALL be told it could not be loaded rather than being shown an empty history or a fabricated status.

An order MUST NOT be presented with an invented status, timeline, or delivery estimate.

#### Scenario: Order history cannot be retrieved

- **WHEN** a customer's order history cannot be retrieved
- **THEN** the customer is told it could not be loaded
- **AND** it is not presented as empty

#### Scenario: Tracking cannot be retrieved

- **WHEN** an order's tracking cannot be retrieved
- **THEN** the shopper is told so
- **AND** no invented status or delivery estimate is shown
