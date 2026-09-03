## Purpose

Governs the named tax and shipping rules a merchant defines once and assigns to products — how each is applied to an order, and what happens when a rule products still reference is deleted.

## ADDED Requirements

### Requirement: A tax rule is a named charge assigned to products

A merchant SHALL define tax rules, each with a name and either a fixed amount or a percentage. A product SHALL be assigned one tax rule, and the tax charged on that product SHALL be determined by it rather than by a single shop-wide rate.

A percentage rule SHALL be applied to the price actually being charged, so that a discounted product is taxed on the discounted amount.

#### Scenario: A percentage rule

- **WHEN** a product is assigned a 5% tax rule and is bought at 1000
- **THEN** 50 is charged as tax on that product

#### Scenario: A fixed rule

- **WHEN** a product is assigned a fixed 20 tax rule
- **THEN** 20 is charged as tax on that product regardless of its price

#### Scenario: Tax follows the price actually charged

- **WHEN** a product with a percentage tax rule is sold at a discounted price
- **THEN** the tax is calculated on the discounted price, not the original

#### Scenario: Products with different rules in one order

- **WHEN** an order contains products assigned different tax rules
- **THEN** each product is taxed by its own rule, and the order's tax is their total

### Requirement: A shipping rule is a named set of places

A merchant SHALL define shipping rules, each holding one or more places. Each place SHALL carry the destination it covers, the price to ship there, and how many days delivery takes. A place MAY additionally offer collection in person at its own price.

A product SHALL be assigned one shipping rule, and what a shopper is offered and charged for delivery SHALL be determined by matching their destination against that rule's places.

Every rule SHALL keep at least one place, since a rule matching nowhere can charge nothing.

#### Scenario: Matching a destination

- **WHEN** a shopper's destination matches one of the rule's places
- **THEN** that place's price and delivery time are offered

#### Scenario: A place covering everywhere

- **WHEN** a rule has a place covering all destinations
- **THEN** it applies to any shopper whose destination no other place covers

#### Scenario: Offering collection in person

- **WHEN** a matched place offers collection in person
- **THEN** the shopper may choose it, and is charged that place's collection price instead of its delivery price

#### Scenario: Removing the last place

- **WHEN** a merchant attempts to remove a rule's only place
- **THEN** the removal is refused and the rule keeps that place

### Requirement: The most specific matching place wins

When more than one place in a rule covers a shopper's destination, the most specific SHALL be used — a place naming a region takes precedence over one covering a whole country, which takes precedence over one covering all destinations.

When no place covers the destination, the shopper SHALL be told the product cannot be delivered there rather than being charged an arbitrary amount or nothing.

#### Scenario: A specific place beats a general one

- **WHEN** a rule has a place for one region and another covering the whole country, and the shopper is in that region
- **THEN** the region's price and delivery time are used

#### Scenario: Falling back to the general place

- **WHEN** the shopper's region has no place of its own but their country does
- **THEN** the country's place is used

#### Scenario: No place matches

- **WHEN** no place in the rule covers the shopper's destination
- **THEN** the shopper is told the product cannot be delivered to that destination

### Requirement: A rule products still use cannot be deleted silently

Deleting a tax rule or a shipping rule that products are assigned to SHALL NOT leave those products without one, because a product with no tax rule cannot be taxed and a product with no shipping rule cannot be delivered.

The merchant SHALL be told how many products are affected and SHALL choose which rule those products move to before the deletion proceeds.

#### Scenario: Deleting a rule in use

- **WHEN** a merchant deletes a tax rule assigned to products
- **THEN** they are told how many products use it and asked which rule those products should move to
- **AND** the deletion proceeds only once that is chosen

#### Scenario: Products are reassigned, not orphaned

- **WHEN** a rule in use is deleted after the merchant chooses a replacement
- **THEN** every product that used it is assigned the replacement

#### Scenario: Deleting an unused rule

- **WHEN** a merchant deletes a rule no product is assigned to
- **THEN** it is removed without further prompting
