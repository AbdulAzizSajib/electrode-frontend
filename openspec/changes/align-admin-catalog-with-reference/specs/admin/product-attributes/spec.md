## Purpose

Governs shop-wide product attributes — how a merchant defines them once and reuses them across products, how a product selects the values it sells, and how the resulting variants survive changes to that selection.

## ADDED Requirements

### Requirement: Attributes are defined once for the whole shop

A merchant SHALL define an attribute — a named axis of choice such as Colour, Size or Weight — once, and reuse it on any number of products. Defining an attribute SHALL NOT require opening a product.

Each attribute SHALL carry an ordered list of values in the order the merchant authored them, so an ordered set such as S, M, XL reads correctly wherever it appears rather than alphabetically.

The system SHALL NOT restrict which attribute names a merchant may use, and adding one SHALL NOT require a code change.

#### Scenario: Creating an attribute

- **WHEN** a merchant creates an attribute named Colour with the values Red, Green and Blue
- **THEN** it is available to every product in the shop

#### Scenario: Authored order is preserved

- **WHEN** a merchant authors a Size attribute with the values S, M, then XL
- **THEN** those values appear in that order everywhere they are presented

#### Scenario: An attribute name the system has never seen

- **WHEN** a merchant creates an attribute named Weight with the values 1 pound and 2 pound
- **THEN** it behaves like any other attribute

#### Scenario: Reuse across products

- **WHEN** a merchant applies the Size attribute to a second product
- **THEN** they choose from the values already defined, without retyping them

#### Scenario: Renaming a value

- **WHEN** a merchant renames an attribute value
- **THEN** every product using that value reflects the new name, and no product's variants are lost

### Requirement: A product's variants come from the attribute values it selects

A product SHALL select which attribute values it sells by choosing them from the shop's attributes. The purchasable combinations SHALL be every combination of one selected value per selected attribute.

Selecting all of an attribute's values SHALL be possible in a single action, since selling every colour is the common case.

A merchant SHALL be able to remove a combination they do not stock. Not every combination is a real product, and the system SHALL NOT require one to exist.

#### Scenario: Selecting values produces combinations

- **WHEN** a merchant selects Colour → Red, Green and Size → S, M
- **THEN** four combinations are offered: Red/S, Red/M, Green/S, Green/M

#### Scenario: Selecting a whole attribute

- **WHEN** a merchant selects the Colour attribute itself
- **THEN** every value of that attribute is selected

#### Scenario: Deselecting the last value of an attribute

- **WHEN** a merchant deselects the last selected value of an attribute
- **THEN** that attribute no longer contributes to the combinations, and the remaining attributes still do

#### Scenario: Removing a combination not stocked

- **WHEN** a merchant removes the Green/S combination
- **THEN** it is not purchasable, and the other three combinations are unaffected

#### Scenario: A product with no attributes selected

- **WHEN** a product selects no attribute values
- **THEN** it is sold as a single purchasable item with its own price and stock

### Requirement: An existing combination keeps its details when the selection changes

When a merchant changes which attribute values a product sells, every combination that still exists SHALL retain the price, stock, product code and images already recorded against it.

This SHALL hold whether the change adds a value, removes a value, or adds a whole attribute. Only combinations that no longer exist SHALL lose their details.

A combination that becomes newly possible SHALL start from the product's own price with no stock, so that stock is never invented for something never counted.

#### Scenario: Adding a value preserves existing rows

- **WHEN** a product sells Red and Green in sizes S and M with stock recorded against each, and the merchant adds the size XL
- **THEN** the four existing combinations keep their price, stock, product code and images
- **AND** the two new combinations start at the product's price with zero stock

#### Scenario: Removing a value leaves the others intact

- **WHEN** a merchant deselects Green
- **THEN** the Red combinations keep their price, stock, product code and images

#### Scenario: Adding a whole new attribute

- **WHEN** a product sells Red and Green, and the merchant adds a Size attribute with S and M
- **THEN** the merchant is told the existing combinations cannot be carried over unchanged, and must confirm before proceeding

#### Scenario: Stock is never silently reset

- **WHEN** any change to the selected values is applied
- **THEN** no combination that still exists has its stock changed without the merchant editing it

### Requirement: A variant that has been ordered cannot be removed

A combination referenced by an existing order SHALL NOT be removed, because doing so would detach that order from what was actually bought.

Attempting a change that would remove such a combination SHALL be refused with an explanation naming the combination, and SHALL leave the product unchanged.

#### Scenario: Deselecting a value that has been sold

- **WHEN** a merchant deselects a value whose combination appears on a past order
- **THEN** the change is refused, the reason names the combination, and nothing about the product is altered

#### Scenario: Deselecting a value never sold

- **WHEN** a merchant deselects a value whose combinations appear on no order
- **THEN** the change is applied

### Requirement: Deleting an attribute or value in use is prevented

An attribute or value that products still sell SHALL NOT be deleted silently. The merchant SHALL be told how many products would be affected, and SHALL either be prevented from deleting it or required to confirm explicitly.

A product SHALL NEVER be left with variants that reference an attribute value that no longer exists.

#### Scenario: Deleting a value products are selling

- **WHEN** a merchant deletes an attribute value that products still sell
- **THEN** they are told how many products use it, and the deletion does not proceed unconfirmed

#### Scenario: Deleting an unused attribute

- **WHEN** a merchant deletes an attribute no product has selected
- **THEN** it is removed without further prompting

#### Scenario: No orphaned variants

- **WHEN** any attribute or value is deleted
- **THEN** no product is left with a variant referencing it
