## Purpose

Defines how a shopper turns a cart into a placed order — what must be chosen before ordering, who decides the amount payable, what becomes of the cart, what the shopper is shown once the order exists, and how a rejected order is handled.

## ADDED Requirements

### Requirement: Checkout requires a signed-in shopper

Placing an order SHALL require the shopper to be signed in, since an order belongs to an account.

A shopper who reaches checkout without being signed in SHALL be asked to sign in and then returned to checkout. Their cart contents MUST survive signing in — a guest who has built a cart MUST NOT lose it by authenticating.

#### Scenario: Guest reaches checkout

- **WHEN** a shopper who is not signed in tries to check out
- **THEN** they are asked to sign in
- **AND** after signing in they are returned to checkout

#### Scenario: Guest cart survives sign-in at checkout

- **WHEN** a guest with items in their cart signs in during checkout
- **THEN** those items are still in their cart afterwards

#### Scenario: Signed-in shopper proceeds directly

- **WHEN** a signed-in shopper reaches checkout with items in their cart
- **THEN** they can proceed without being asked to sign in

### Requirement: Checkout collects a delivery address and a shipping method

Before an order can be placed, the shopper SHALL choose a delivery address from their saved addresses and a shipping method from those the merchant offers. A shopper with no saved address SHALL be able to add one without leaving checkout.

Each shipping method offered SHALL show its cost and, where the merchant provides one, its expected delivery time, so the choice is informed. Only methods the merchant currently offers SHALL be selectable.

The shopper MAY attach a note to the order. Ordering SHALL be prevented until both a delivery address and a shipping method are chosen.

#### Scenario: Choosing address and shipping method

- **WHEN** a shopper at checkout selects a saved address and a shipping method
- **THEN** the order can be placed

#### Scenario: Shipping options show cost and timing

- **WHEN** shipping methods are presented
- **THEN** each shows its cost
- **AND** each shows its expected delivery time where the merchant provides one

#### Scenario: Nothing chosen yet

- **WHEN** a shopper has not chosen both a delivery address and a shipping method
- **THEN** placing the order is prevented
- **AND** the shopper can tell what is still required

#### Scenario: Shopper has no saved address

- **WHEN** a shopper reaches checkout with no saved addresses
- **THEN** they can add one without leaving checkout
- **AND** the newly added address is selected for this order

#### Scenario: Empty cart

- **WHEN** a shopper reaches checkout with an empty cart
- **THEN** they are told the cart is empty and offered a way back to browsing
- **AND** no order can be placed

### Requirement: The amount payable is decided by the merchant's system

The final amount a shopper pays — including any tax, shipping charge, discount, and free-shipping allowance — SHALL be determined by the merchant's system, not by the storefront.

Before ordering, the storefront MAY show an estimated total so the shopper can compare shipping choices. Any such figure SHALL be presented as an estimate and MUST NOT be presented as the final amount payable.

Once an order exists, the amounts shown to the shopper SHALL be the ones recorded against that order.

#### Scenario: Estimate before ordering

- **WHEN** a shopper is choosing a shipping method
- **THEN** an estimated total is shown reflecting that choice
- **AND** it is presented as an estimate rather than a final amount

#### Scenario: Confirmed order shows recorded amounts

- **WHEN** an order has been placed
- **THEN** the amounts shown are those recorded against the order
- **AND** they are shown even where they differ from the pre-order estimate

#### Scenario: Charges are itemised

- **WHEN** a placed order is shown
- **THEN** its item subtotal, shipping charge, tax, and any discount are each visible alongside the total

### Requirement: A placed order is confirmed to the shopper

On a successful order the shopper SHALL be shown a confirmation identifying the order in a form they can quote to the merchant, together with what was ordered and what it cost.

The cart SHALL be emptied once the order is placed, and MUST NOT be emptied when ordering fails.

The confirmation MUST NOT claim an order was placed when none was.

#### Scenario: Order confirmation

- **WHEN** an order is placed successfully
- **THEN** the shopper is shown an identifier for the order
- **AND** the items ordered and the amount charged are shown

#### Scenario: Cart is emptied on success

- **WHEN** an order is placed successfully
- **THEN** the shopper's cart no longer contains the ordered items

#### Scenario: Cart survives a failed order

- **WHEN** placing an order fails
- **THEN** the cart still contains everything it did beforehand

### Requirement: A rejected order is explained and recoverable

Where an order is refused — because an item is no longer in stock, the cart changed, or the delivery details were not accepted — the shopper SHALL be told why, in terms that identify what needs fixing.

The shopper SHALL remain on checkout with their selections intact so they can correct the problem and try again. Ordering SHALL NOT be triggered twice by repeated activation while an attempt is in flight.

#### Scenario: An item is out of stock

- **WHEN** an order is refused because an item does not have enough stock
- **THEN** the shopper is told which item and that it is unavailable in the quantity requested
- **AND** the cart is unchanged

#### Scenario: Selections survive a failure

- **WHEN** an order attempt fails
- **THEN** the shopper remains at checkout with their chosen address, shipping method, and note still selected

#### Scenario: Double submission is prevented

- **WHEN** a shopper activates the order control twice in quick succession
- **THEN** only one order is placed

#### Scenario: The ordering service is unavailable

- **WHEN** the order cannot be submitted because the service is unreachable
- **THEN** the shopper is told it could not be submitted
- **AND** the cart is unchanged so they can retry

### Requirement: Availability shown in the catalog is not a guarantee at checkout

Stock shown while browsing SHALL NOT be presented to the shopper as a reservation. Where an item is available in the catalog but refused at checkout, the storefront SHALL surface that refusal plainly rather than failing silently or appearing to succeed.

#### Scenario: Catalog and checkout disagree

- **WHEN** an item shown as available is refused at checkout for lack of stock
- **THEN** the shopper is shown the refusal and which item caused it
- **AND** no order is created

#### Scenario: Stock is not described as reserved

- **WHEN** a shopper is shown an item's availability before ordering
- **THEN** it is not described as held or reserved for them
