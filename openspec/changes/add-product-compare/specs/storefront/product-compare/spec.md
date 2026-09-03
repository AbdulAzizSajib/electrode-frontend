## Purpose

Governs the shopper's compare list — how products are added to and removed from it, how long it survives, what happens when it is full — and how the resulting side-by-side comparison presents products whose specifications differ or do not correspond.

## ADDED Requirements

### Requirement: Compare is a toggle that reports its state

A compare control SHALL add its product to the compare list, and SHALL remove that product when the product is already in the list. The control SHALL show whether its product is currently in the list, so a shopper can tell what they have already added without opening the comparison.

Adding or removing a product SHALL take effect immediately and SHALL be acknowledged visibly, since a control that appears to do nothing reads as a broken page.

The control SHALL be available from product listings as well as from the product detail view, because a shopper assembles a comparison while browsing rather than after opening each product in turn.

#### Scenario: Adding a product

- **WHEN** a shopper activates the compare control on a product that is not in the compare list
- **THEN** the product is added to the list
- **AND** the control changes to show the product is in the list

#### Scenario: Removing a product

- **WHEN** a shopper activates the compare control on a product already in the compare list
- **THEN** the product is removed from the list
- **AND** the control changes to show the product is no longer in it

#### Scenario: State is visible on return

- **WHEN** a shopper returns to a product they previously added to the compare list
- **THEN** that product's compare control shows the product is in the list

#### Scenario: Comparing from a listing

- **WHEN** a shopper browsing a listing adds two products to the compare list without opening either
- **THEN** both products are in the list

#### Scenario: The same product added from two places

- **WHEN** a shopper adds a product from a listing and then opens that product's detail page
- **THEN** the detail page's control shows the product is already in the list, and the product appears once

### Requirement: The compare list belongs to the device and persists

The compare list SHALL be available to every shopper, whether or not they are signed in, and adding to it SHALL NOT require or prompt for an account.

The list SHALL survive navigation between pages and reloading the browser, so that a comparison assembled across a browsing session is still there when the shopper is ready to look at it.

The list SHALL be private to the device it was assembled on. It SHALL NOT be shared between shoppers, and a shopper SHALL NOT see products another shopper added.

#### Scenario: A signed-out shopper compares

- **WHEN** a shopper who is not signed in adds a product to the compare list
- **THEN** the product is added with no prompt to sign in or create an account

#### Scenario: The list survives a reload

- **WHEN** a shopper adds products to the compare list and reloads the page
- **THEN** the same products are still in the list

#### Scenario: The list survives navigation

- **WHEN** a shopper adds a product, browses to other pages, and returns
- **THEN** the product is still in the compare list

#### Scenario: Lists do not leak between shoppers

- **WHEN** two different shoppers each assemble a compare list
- **THEN** neither shopper sees any product the other added

#### Scenario: The page renders before the stored list is available

- **WHEN** a product page is first delivered, before any previously stored compare list has been read
- **THEN** the page renders without error and without flashing incorrect compare state

### Requirement: The compare list has a capacity that is enforced visibly

The compare list SHALL hold at most a fixed maximum number of products, because a side-by-side comparison stops being readable past a few columns.

When the list is full, attempting to add another product SHALL NOT silently discard either the new product or an existing one. The shopper SHALL be told the list is full and SHALL be able to remove a product to make room.

#### Scenario: Adding within capacity

- **WHEN** a shopper adds a product while the compare list is below its maximum
- **THEN** the product is added

#### Scenario: Adding beyond capacity

- **WHEN** a shopper attempts to add a product while the compare list is already at its maximum
- **THEN** the shopper is told the list is full
- **AND** the list is unchanged, with no product silently dropped

#### Scenario: Making room

- **WHEN** a shopper removes a product from a full compare list and then adds a different one
- **THEN** the new product is added

### Requirement: The shopper can see and manage what is being compared

While the compare list holds at least one product, the shopper SHALL be able to see what is in it from anywhere in the store, without navigating to the comparison itself, so that a product added earlier in a session cannot be silently forgotten.

The shopper SHALL be able to remove any individual product from the list, clear the list entirely, and open the full comparison.

When the list becomes empty, the indicator SHALL stop being shown rather than persisting as an empty element.

#### Scenario: The list is visible while browsing

- **WHEN** a shopper has products in the compare list and is browsing the store
- **THEN** the products currently being compared are visible to them, along with how many there are

#### Scenario: Removing from the indicator

- **WHEN** a shopper removes a product from the compare indicator
- **THEN** that product leaves the list, and its compare control on any product page reflects that

#### Scenario: Clearing the list

- **WHEN** a shopper clears the compare list
- **THEN** no products remain in it

#### Scenario: The indicator disappears when empty

- **WHEN** the last product is removed from the compare list
- **THEN** the compare indicator is no longer shown

### Requirement: The comparison presents products side by side on aligned rows

The comparison SHALL present each compared product as its own column showing at least its image, name, price and rating, and SHALL present specifications as rows aligned across every column, so that equivalent specifications are read across a single line.

A specification recorded for one compared product but not another SHALL still appear as a row, with the products that lack it explicitly marked as not having it. A missing specification SHALL NOT cause a column's rows to shift out of alignment with the others.

Each compared product SHALL be reachable from the comparison, and removable from within it.

The prices and availability shown SHALL reflect each product's current state rather than what it was when the product was added to the list.

#### Scenario: Comparing two products

- **WHEN** a shopper opens the comparison with two products in the list
- **THEN** each product appears as its own column with its image, name, price and rating
- **AND** their specifications are aligned so that equivalent ones share a row

#### Scenario: A specification one product does not have

- **WHEN** one compared product records a specification that another does not
- **THEN** the row appears for both, and the product lacking it is marked as not having it
- **AND** the remaining rows stay aligned across both columns

#### Scenario: Prices are current

- **WHEN** a product's price changes after the shopper added it to the compare list
- **THEN** the comparison shows the product's current price

#### Scenario: Removing from within the comparison

- **WHEN** a shopper removes a product from the comparison
- **THEN** that column is removed and the remaining products stay aligned

#### Scenario: Reaching a compared product

- **WHEN** a shopper selects a product from the comparison
- **THEN** they are taken to that product

#### Scenario: An empty comparison

- **WHEN** a shopper opens the comparison with no products in the list
- **THEN** they are told the list is empty and are offered a way to browse products

#### Scenario: A comparison of one

- **WHEN** a shopper opens the comparison with a single product in the list
- **THEN** the product is shown and the shopper is invited to add another to compare against

### Requirement: The comparison can hide rows on which the products agree

The shopper SHALL be able to restrict the comparison to the specifications on which the compared products differ, since rows where every product carries the same value carry no decision value.

This SHALL be the shopper's choice and SHALL be reversible; the full set of specifications SHALL remain available.

A row on which some products agree and others differ, including by not recording the specification at all, SHALL be treated as differing.

#### Scenario: Hiding identical rows

- **WHEN** a shopper chooses to see only the differences
- **THEN** rows where every compared product has the same value are hidden
- **AND** rows where the values differ remain shown

#### Scenario: Restoring the full comparison

- **WHEN** a shopper reverses that choice
- **THEN** all specification rows are shown again

#### Scenario: A partially recorded specification counts as a difference

- **WHEN** a specification is recorded for some compared products and not others
- **THEN** that row is treated as a difference and remains shown

#### Scenario: Products that agree on everything

- **WHEN** a shopper chooses to see only the differences and the compared products agree on every specification
- **THEN** the shopper is told there are no differing specifications rather than shown an empty table
