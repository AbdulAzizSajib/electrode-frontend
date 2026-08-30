## Purpose

Lets a shopper buy without creating an account: reaching checkout, supplying delivery details inline, and finding the order again afterwards using only what they were given at the time.

## ADDED Requirements

### Requirement: Checkout is reachable without an account
The checkout page SHALL render for a shopper with no session instead of redirecting them to sign in. A shopper who does have a session SHALL continue to see the saved-address flow unchanged.

#### Scenario: Guest opens checkout
- **WHEN** a shopper with no session opens the checkout page with items in their cart
- **THEN** the checkout renders with fields for their contact and delivery details, and they are not redirected

#### Scenario: Signed-in shopper opens checkout
- **WHEN** a shopper with a session opens the checkout page
- **THEN** they see their saved addresses to choose from, exactly as before this change

#### Scenario: Guest chooses to sign in instead
- **WHEN** a guest at checkout follows the sign-in link
- **THEN** they are taken to sign-in and returned to checkout afterwards, with their cart intact

#### Scenario: Empty cart
- **WHEN** a shopper with no session opens checkout with an empty cart
- **THEN** they are shown the empty-cart message rather than a form they cannot submit

### Requirement: A guest supplies contact and delivery details at checkout
Because a guest has nothing saved, checkout SHALL collect their full name, phone number and delivery address, and SHALL NOT submit until each required field is present and well-formed. The phone number SHALL be accepted in any form the backend recognizes.

#### Scenario: Guest completes the form
- **WHEN** a guest fills in name, phone and a complete address and submits
- **THEN** the order is placed and they are taken to confirmation

#### Scenario: Required field missing
- **WHEN** a guest submits with a required field empty
- **THEN** the field is marked with a message saying what is needed, and no order is attempted

#### Scenario: Phone entered in an alternative format
- **WHEN** a guest enters a valid Bangladeshi mobile number in an accepted alternative form, such as with a country code
- **THEN** it is accepted, matching what the backend accepts

#### Scenario: Phone not a valid mobile number
- **WHEN** a guest enters a phone number that is not a valid Bangladeshi mobile number
- **THEN** the field is marked and no order is attempted

### Requirement: Guest checkout states cash on delivery
Checkout SHALL tell a guest that payment is cash on delivery before they place the order, rather than leaving the payment method unstated.

#### Scenario: Guest reviews the order before placing it
- **WHEN** a guest is on the checkout page
- **THEN** cash on delivery is shown as the payment method for their order

### Requirement: A guest order is confirmed without a session
After a guest places an order, the confirmation SHALL show that order's details. It SHALL NOT tell a guest their order could not be found, and SHALL still show the order if the page is reloaded.

#### Scenario: Guest lands on confirmation
- **WHEN** a guest's order is placed successfully
- **THEN** the confirmation shows the order number, what was ordered, the total, and the delivery address

#### Scenario: Guest reloads the confirmation
- **WHEN** a guest reloads the confirmation page for an order they just placed
- **THEN** the same confirmation is shown rather than a not-found message

#### Scenario: Confirmation opened without enough information
- **WHEN** the confirmation page is opened without enough information to identify an order
- **THEN** a not-found state is shown, and no order details are invented

### Requirement: A guest can find an order later using its number and phone
The order-tracking page SHALL let a shopper retrieve an order by entering its order number together with the phone number it was placed with. Entering an order number alone SHALL NOT return an order.

#### Scenario: Guest tracks their order
- **WHEN** a shopper enters an order number and the matching phone number
- **THEN** the order and its current status are shown

#### Scenario: Phone does not match the order
- **WHEN** a shopper enters a valid order number with a phone number that did not place it
- **THEN** they are told the order could not be found, and nothing about that order is revealed

#### Scenario: Tracking form incomplete
- **WHEN** a shopper submits the tracking form with either field empty
- **THEN** the missing field is marked and no lookup is attempted

### Requirement: A product can be ordered without going through the cart
A shopper SHALL be able to start checkout for a single product directly from its page, so that arriving from a campaign link and buying does not require adding to the cart first. Their existing cart SHALL be left untouched by such an order.

#### Scenario: Shopper orders directly from a product page
- **WHEN** a shopper chooses to order a product directly from its page
- **THEN** they reach checkout for that product and quantity without it being added to their cart

#### Scenario: Direct order leaves the cart alone
- **WHEN** a shopper with items already in their cart places a direct order for a different product
- **THEN** their cart still holds what it did before

#### Scenario: Product cannot be ordered
- **WHEN** a product is unavailable or requires a variant selection that has not been made
- **THEN** direct ordering is unavailable for it, consistent with adding it to the cart

### Requirement: Checkout failures are reported without losing the shopper's input
When an order cannot be placed, checkout SHALL show the reason given by the server and SHALL retain what the shopper entered so they can correct it and retry. A retry SHALL NOT be able to place a second order for the same attempt.

#### Scenario: Server rejects the order
- **WHEN** the server rejects a guest's order, for example because an item is out of stock
- **THEN** the reason is shown, the entered details are still present, and the cart is unchanged

#### Scenario: Guest exceeds the ordering limit
- **WHEN** a guest's order is rejected because too many orders are already pending for their phone number or connection
- **THEN** that reason is shown rather than a generic failure

#### Scenario: Outcome unknown
- **WHEN** the request times out so the outcome is unknown
- **THEN** the shopper is told the order may have gone through and is pointed at order tracking rather than urged to retry

#### Scenario: Retry after a failure
- **WHEN** a shopper presses place-order again after a failed attempt without changing the order
- **THEN** the retry is treated as the same attempt and cannot result in two orders
