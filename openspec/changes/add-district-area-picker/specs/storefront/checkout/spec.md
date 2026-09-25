## Purpose

How the checkout page establishes where an order is going, and how that destination decides which of the merchant's delivery options is charged for it — including when the destination cannot decide, and the shopper is asked directly instead.

## ADDED Requirements

### Requirement: Checkout collects the destination as a district and an area

Checkout SHALL collect the shopper's destination as a district and an area chosen from a known list of Bangladeshi districts and their areas, rather than as free text. The list SHALL be searchable by typing any part of either name, and each entry SHALL identify its district and its area together, so that two areas of the same name in different districts are distinguishable.

The destination SHALL be treated as one answer: an area cannot be chosen without its district, and neither half can be entered by hand.

#### Scenario: Shopper picks their area

- **WHEN** a shopper opens the destination picker and types part of an area or district name
- **THEN** the matching entries are shown naming both district and area, and choosing one sets the destination

#### Scenario: Two areas share a name

- **WHEN** an area name occurs in more than one district
- **THEN** each is offered separately with its own district shown, and the one chosen is the one recorded

#### Scenario: Nothing typed

- **WHEN** a shopper opens the picker without typing
- **THEN** the full list is available to scroll, ordered so the districts a merchant sells to most are reachable first

#### Scenario: Merchant does not collect a city

- **WHEN** the merchant has configured checkout not to ask for a city
- **THEN** no destination picker is shown, and checkout asks for the delivery option directly instead

### Requirement: The delivery option follows from the chosen destination

When the chosen destination resolves to one of the merchant's configured delivery options, checkout SHALL charge that option and SHALL NOT ask the shopper to choose a delivery area. The resolved option SHALL be named and priced in the order summary, so the shopper can see which one they are being charged for before confirming.

#### Scenario: Destination resolves

- **WHEN** a shopper chooses an area that the store delivers to under a configured option
- **THEN** that option is applied to the order, no delivery-area question is shown, and the order summary shows the option's name and charge

#### Scenario: Shopper changes their area

- **WHEN** a shopper who has already chosen an area picks a different one that resolves to a different option
- **THEN** the applied option, the delivery charge and the order total all change to match the new area

#### Scenario: Destination cleared

- **WHEN** a shopper clears their chosen area
- **THEN** the delivery charge returns to being unknown, the order cannot be placed, and checkout says a destination is needed

#### Scenario: Shopper is told which option applies

- **WHEN** an option has been derived from the destination
- **THEN** the shopper is shown the option's own name and price rather than an unexplained delivery charge

### Requirement: The delivery charge is the server's figure, not the storefront's

The storefront SHALL derive only which delivery option applies. The amount charged for delivery, the order total, and any advance-payment amounts SHALL continue to come from the server's quote for that option. The storefront SHALL NOT compute, adjust or round a delivery charge of its own.

#### Scenario: Charge comes from the quote

- **WHEN** an option has been derived and a total is shown to the shopper
- **THEN** the delivery amount shown is the amount the server quoted for that option, and it is the amount the placed order is charged

#### Scenario: Waived delivery still shows as waived

- **WHEN** the server waives the delivery charge for the derived option, for example against a free-delivery threshold
- **THEN** the order summary shows the waiver exactly as it does for a shopper-chosen option

#### Scenario: Advance amounts follow the destination

- **WHEN** a shopper paying the delivery charge in advance changes their area to one with a different charge
- **THEN** the amount they are asked to send is re-quoted for the new option before they can submit a payment reference

### Requirement: Checkout falls back to asking when the destination cannot decide

Checkout SHALL fall back to asking the shopper to choose a delivery option, exactly as it does today, whenever the destination cannot decide for them. A store SHALL remain able to take orders in every such case.

The fallback SHALL apply when: no destination has been chosen yet; the chosen area is not covered by any delivery zone the store serves; the option a zone names is not in the merchant's configured list, including after the merchant renames or deletes it; the merchant does not collect a city; or the shopper is collecting in person.

#### Scenario: Area is not covered

- **WHEN** a shopper chooses an area that no delivery zone covers
- **THEN** the delivery options are shown for them to choose from, with the reason stated, and the order can still be placed

#### Scenario: Merchant renamed the option a zone names

- **WHEN** the option a destination resolves to is no longer among the merchant's configured options
- **THEN** checkout shows the configured options for the shopper to choose from rather than submitting an option the store no longer has

#### Scenario: Store has no delivery options at all

- **WHEN** the merchant has configured no delivery options
- **THEN** checkout says so and refuses the order, unchanged by this capability

#### Scenario: Fallback choice is what is charged

- **WHEN** a shopper picks an option from the fallback list
- **THEN** that option is applied and charged, exactly as a shopper-chosen option is today

### Requirement: Collection in person is still the shopper's choice

Where the merchant offers collection in person, the shopper SHALL continue to choose between delivery and collection, and SHALL continue to choose a pickup point themselves. A destination SHALL NOT be required to collect in person, and choosing to collect SHALL NOT be overridden by a destination already chosen.

#### Scenario: Shopper collects in person

- **WHEN** a shopper chooses to collect in person
- **THEN** the pickup points are listed for them to choose from, and no destination is required to place the order

#### Scenario: Shopper switches back to delivery

- **WHEN** a shopper who chose collection switches back to delivery and has a destination already chosen
- **THEN** the option derived from that destination applies again, without them re-entering it

### Requirement: The order records the district and the area it is going to

An order placed with a chosen destination SHALL record the district and the area as distinct parts of its delivery address, so that an order can afterwards be found, grouped and dispatched by where it is going. The recorded destination SHALL be the one shown when the order was confirmed.

#### Scenario: Order carries its destination

- **WHEN** an order is placed with a destination chosen
- **THEN** the order's delivery address carries that district and that area as recorded values, not as free text the shopper typed

#### Scenario: Confirmation shows what was recorded

- **WHEN** a shopper reaches the order confirmation
- **THEN** the destination shown there is the one the order was charged and recorded against
