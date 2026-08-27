## Purpose

Defines how gift cards are purchased, delivered to a recipient, checked for remaining balance, and redeemed against an order — including how a card's balance is protected from being spent twice.

## ADDED Requirements

### Requirement: A shopper can buy a gift card

A shopper SHALL be able to buy a gift card, choosing from the denominations the merchant offers.

The purchase SHALL capture the recipient's email address and MAY capture a message to the recipient and a date on which the card is to be delivered. A card MUST NOT be issued until its purchase has been paid for.

#### Scenario: Shopper buys a gift card

- **WHEN** a shopper buys a gift card of an offered denomination and the purchase is paid for
- **THEN** a gift card is issued with that value

#### Scenario: Denominations come from the merchant

- **WHEN** a shopper views the gift card options
- **THEN** the denominations offered are those the merchant has configured

#### Scenario: Unoffered denomination is refused

- **WHEN** a shopper attempts to buy a gift card of a value the merchant does not offer
- **THEN** the purchase is refused

#### Scenario: Unpaid purchase issues no card

- **WHEN** a gift card purchase is not paid for
- **THEN** no gift card is issued

### Requirement: A gift card is delivered to its recipient

An issued gift card SHALL be delivered to the recipient email address given at purchase, carrying its code, its value, and any message the purchaser wrote.

Where the purchaser chose a delivery date, the card MUST NOT be delivered before that date. A card that has not yet been delivered MUST NOT be redeemable.

#### Scenario: Card is delivered immediately

- **WHEN** a gift card is purchased with no delivery date chosen
- **THEN** it is delivered to the recipient address

#### Scenario: Scheduled card waits for its date

- **WHEN** a gift card is purchased with a future delivery date
- **THEN** it is not delivered before that date
- **AND** it is delivered on that date without further intervention

#### Scenario: Undelivered card cannot be redeemed

- **WHEN** a gift card's delivery date has not yet arrived
- **THEN** the card cannot be redeemed

#### Scenario: Purchaser's message is included

- **WHEN** a purchaser wrote a message for the recipient
- **THEN** the delivered card carries that message

### Requirement: A card's balance can be checked by its code

A holder SHALL be able to check a gift card's remaining balance by supplying its code, without signing in.

A code that does not correspond to an issued card MUST be refused without disclosing whether any similar code exists.

#### Scenario: Holder checks a balance

- **WHEN** a holder supplies a valid gift card code
- **THEN** the card's remaining balance is shown

#### Scenario: Unknown code

- **WHEN** a code that does not correspond to an issued card is supplied
- **THEN** the check fails
- **AND** no information about other cards is disclosed

#### Scenario: Repeated failed checks are limited

- **WHEN** codes are supplied repeatedly and fail
- **THEN** further attempts are limited

### Requirement: A gift card is redeemed against an order

A shopper SHALL be able to apply a gift card to their cart by supplying its code, reducing the amount payable by up to the card's remaining balance.

Where the card's balance exceeds the amount payable, only the amount payable SHALL be deducted and the remainder SHALL stay on the card. Where the amount payable exceeds the balance, the whole balance SHALL be applied and the shopper SHALL pay the difference.

A shopper SHALL be able to remove an applied gift card before placing the order.

#### Scenario: Card covers part of the order

- **WHEN** a shopper applies a gift card whose balance is less than the amount payable
- **THEN** the amount payable is reduced by the card's balance
- **AND** the shopper pays the difference

#### Scenario: Card exceeds the order total

- **WHEN** a shopper applies a gift card whose balance exceeds the amount payable
- **THEN** the amount payable is reduced to nothing
- **AND** the unused balance remains on the card

#### Scenario: Shopper removes an applied card

- **WHEN** a shopper removes a gift card applied to their cart before placing the order
- **THEN** the amount payable returns to what it was
- **AND** no balance has been deducted from the card

#### Scenario: Card with no balance

- **WHEN** a shopper applies a gift card with no remaining balance
- **THEN** the card is refused
- **AND** the shopper is told the card has no balance remaining

#### Scenario: Expired or cancelled card

- **WHEN** a shopper applies a gift card that has expired or been cancelled
- **THEN** the card is refused
- **AND** the shopper is told why

### Requirement: A balance cannot be spent twice

A gift card's balance SHALL be deducted only when an order is successfully placed, and the deduction MUST reflect exactly the amount applied to that order.

The same balance MUST NOT be consumed by two orders, including where the card is applied to two carts at once or where an order is submitted more than once. If an order fails after a card was applied, the balance MUST remain available.

#### Scenario: Balance is deducted on a placed order

- **WHEN** an order carrying an applied gift card is successfully placed
- **THEN** the card's balance is reduced by exactly the amount applied

#### Scenario: Failed order leaves the balance intact

- **WHEN** an order carrying an applied gift card fails to be placed
- **THEN** the card's balance is unchanged
- **AND** the card can be applied again

#### Scenario: Concurrent use cannot overspend

- **WHEN** the same gift card is applied to two orders that are placed at the same time
- **THEN** the total deducted does not exceed the card's balance
- **AND** the order that cannot be covered is refused with a clear message

#### Scenario: Resubmitted order does not deduct twice

- **WHEN** an order carrying an applied gift card is submitted more than once
- **THEN** the balance is deducted only once

### Requirement: Gift card purchase and redemption fail safely

When gift card options cannot be retrieved, the storefront SHALL say so rather than presenting invented denominations.

A gift card code MUST NOT be shown to anyone other than its purchaser or recipient, and MUST NOT appear in an address a shopper might share.

#### Scenario: Options cannot be retrieved

- **WHEN** the gift card denominations cannot be retrieved
- **THEN** the shopper is told the options could not be loaded
- **AND** no invented denominations are offered

#### Scenario: Code is not exposed in an address

- **WHEN** a shopper checks a balance or applies a card
- **THEN** the card's code does not appear in an address that could be shared or bookmarked
