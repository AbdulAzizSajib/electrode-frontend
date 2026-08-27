## Purpose

Defines how a shopper's cart behaves on the storefront — where it is held, how it survives across visits and sign-in, how lines are added and changed, how a line's price is determined when a variant is chosen, and how coupons and totals are presented.

## ADDED Requirements

### Requirement: The cart is owned by the server

A shopper's cart SHALL be held by the backend, not only in the browser. The storefront MUST treat the server's cart as the single source of truth: after any change, what the shopper sees SHALL reflect what the server holds.

A cart MUST NOT be assembled from a local copy of the catalog. Every line SHALL describe a product the merchant actually sells.

#### Scenario: Cart survives a page reload

- **WHEN** a shopper adds an item and then reloads the page
- **THEN** the item is still in their cart

#### Scenario: Cart survives a new browser session

- **WHEN** a shopper adds an item, closes the site, and returns later in the same browser
- **THEN** their cart still contains that item

#### Scenario: Server rejects a change

- **WHEN** the shopper attempts a cart change the server rejects
- **THEN** the displayed cart returns to matching what the server holds
- **AND** the shopper is told the change did not take effect

### Requirement: Guests have a cart, which follows them into their account

A shopper who is not signed in SHALL be able to build a cart. That cart SHALL persist across their visits without requiring an account.

When a shopper with a guest cart signs in, the contents of that cart SHALL be carried into their account's cart rather than discarded.

#### Scenario: Guest builds a cart

- **WHEN** a shopper who is not signed in adds an item
- **THEN** the item is added and remains in their cart on subsequent page loads

#### Scenario: Guest cart carries into the account on sign-in

- **WHEN** a shopper with items in a guest cart signs in
- **THEN** those items are present in their account's cart afterwards
- **AND** items already in the account's cart are not lost

#### Scenario: Signed-in cart follows the shopper

- **WHEN** a signed-in shopper adds an item and later signs in from a different browser
- **THEN** their cart contains that item

### Requirement: Shoppers can add, change, and remove cart lines

A shopper SHALL be able to add a product to the cart, change the quantity of a line, and remove a line entirely.

Adding a product already present in the cart, with the same variant selection, SHALL increase that line's quantity rather than create a second line for the same thing. Adding the same product with a *different* variant SHALL create a separate line.

Setting a line's quantity to zero, or removing it, SHALL take it out of the cart.

#### Scenario: Adding a new product creates a line

- **WHEN** a shopper adds a product not already in the cart
- **THEN** a new line for that product appears with the requested quantity

#### Scenario: Re-adding the same selection increments it

- **WHEN** a shopper adds a product and variant selection already present in the cart
- **THEN** that line's quantity increases
- **AND** no duplicate line is created

#### Scenario: Same product, different variant, is a separate line

- **WHEN** a shopper adds a product with a variant different from one already in the cart
- **THEN** a separate line is created for that variant

#### Scenario: Changing a quantity

- **WHEN** a shopper changes a line's quantity
- **THEN** the line reflects the new quantity and the cart totals update

#### Scenario: Removing a line

- **WHEN** a shopper removes a line
- **THEN** it no longer appears in the cart and the totals update

### Requirement: A line is priced by what the shopper actually chose

When a cart line has a variant selected, its price SHALL be the variant's price. Only when no variant is selected SHALL the product's base price be used.

The line total SHALL be the line's unit price multiplied by its quantity, and the cart subtotal SHALL be the sum of its line totals. Monetary amounts MUST NOT lose precision.

#### Scenario: Variant price is used

- **WHEN** a cart line has a variant whose price differs from the product's base price
- **THEN** the line is priced at the variant's price, not the base price

#### Scenario: Base price used when no variant

- **WHEN** a cart line has no variant selected
- **THEN** the line is priced at the product's base price

#### Scenario: Totals reflect quantities

- **WHEN** the cart holds lines with various quantities
- **THEN** each line total equals its unit price times its quantity
- **AND** the subtotal equals the sum of the line totals

### Requirement: The cart summary is visible to the shopper

The number of items in the cart SHALL be visible from anywhere on the storefront, and SHALL update after a cart change without the shopper reloading the page.

An empty cart SHALL be presented as such, with a way back to browsing, rather than as a blank or broken view.

#### Scenario: Item count is always visible

- **WHEN** a shopper has items in their cart
- **THEN** the item count is visible in the site header on any page

#### Scenario: Count updates after a change

- **WHEN** a shopper adds or removes an item
- **THEN** the visible item count updates without a page reload

#### Scenario: Empty cart

- **WHEN** a shopper views a cart with no items
- **THEN** they are shown an empty-cart state with a way to continue shopping

### Requirement: Shoppers can apply and remove a coupon

A shopper SHALL be able to apply a coupon code to their cart and remove a previously applied one. An applied coupon SHALL persist with the cart across page loads.

When a code is not valid — unrecognised, expired, or not applicable to the cart — the shopper SHALL be told, and the cart SHALL be left unchanged.

Where a coupon produces a discount, that discount SHALL be shown in the cart summary and reflected in the amount payable.

#### Scenario: Valid coupon is applied

- **WHEN** a shopper applies a valid coupon code
- **THEN** the resulting discount is shown in the cart summary
- **AND** the amount payable reflects the discount

#### Scenario: Applied coupon persists

- **WHEN** a shopper applies a coupon and later reloads the cart
- **THEN** the coupon is still applied

#### Scenario: Invalid coupon is rejected

- **WHEN** a shopper applies a code that is not valid for their cart
- **THEN** they are told the code was not accepted
- **AND** the cart contents and totals are unchanged

#### Scenario: Coupon is removed

- **WHEN** a shopper removes an applied coupon
- **THEN** the discount no longer applies and the totals return to their undiscounted values

### Requirement: Cart actions give clear feedback and degrade safely

A cart change SHALL give the shopper visible feedback that it is in progress and that it succeeded or failed. A control that triggers a cart change SHALL NOT be actionable twice while the first change is still in flight.

If a cart operation fails, the shopper SHALL be told, and the storefront MUST NOT display a cart that differs from what the server holds.

#### Scenario: Feedback while adding

- **WHEN** a shopper adds an item
- **THEN** the control indicates the action is in progress
- **AND** the shopper receives confirmation once it completes

#### Scenario: Double submission is prevented

- **WHEN** a shopper activates an add control twice in quick succession
- **THEN** only one add is performed

#### Scenario: Cart service unavailable

- **WHEN** the cart cannot be retrieved
- **THEN** the shopper is shown that the cart is unavailable rather than an empty cart
- **AND** the rest of the page remains usable
