## Purpose

Governs collections and bundle deals — the merchandising groupings a product can belong to beyond its category, and the buy-and-get-free offer it can carry.

## ADDED Requirements

### Requirement: A collection groups products independently of the category tree

A merchant SHALL define collections, each with a name and an address the storefront can link to. A product SHALL belong to any number of collections, and a collection SHALL hold any number of products.

Collections SHALL be independent of a product's category: a product keeps its category regardless of which collections it joins.

A merchant SHALL be able to hide a collection from the storefront without deleting it or removing its products.

#### Scenario: A product in several collections

- **WHEN** a merchant puts a product in both "Top selling" and "Family offer"
- **THEN** it belongs to both, and its category is unchanged

#### Scenario: A collection spanning categories

- **WHEN** a collection holds products from different categories
- **THEN** all of them belong to it

#### Scenario: Hiding a collection

- **WHEN** a merchant hides a collection
- **THEN** the storefront does not present it, and its products remain in it

#### Scenario: Removing a product from a collection

- **WHEN** a merchant removes a product from a collection
- **THEN** the product is unaffected apart from no longer belonging to it

### Requirement: A bundle deal offers free units on a quantity bought

A merchant SHALL define bundle deals, each naming how many units must be bought and how many are then free. A product MAY be assigned one bundle deal, or none.

A bundle deal SHALL require both quantities to be at least one, since an offer giving nothing away or requiring nothing bought is not an offer.

#### Scenario: Assigning a deal

- **WHEN** a merchant assigns a "buy 2 get 1 free" deal to a product
- **THEN** the product carries that offer

#### Scenario: A product with no deal

- **WHEN** a product is assigned no bundle deal
- **THEN** it is sold without one, and nothing about an offer is presented

#### Scenario: An offer that gives nothing

- **WHEN** a merchant attempts to create a deal with a free quantity of zero
- **THEN** it is refused

### Requirement: Deleting a grouping does not damage its products

Deleting a collection SHALL remove the grouping without affecting the products that were in it.

Deleting a bundle deal that products are assigned to SHALL leave those products sold without an offer, rather than referencing one that no longer exists. The merchant SHALL be told how many products are affected before the deletion proceeds.

#### Scenario: Deleting a collection

- **WHEN** a merchant deletes a collection holding products
- **THEN** the collection is removed and every product it held is otherwise unchanged

#### Scenario: Deleting a bundle deal in use

- **WHEN** a merchant deletes a bundle deal assigned to products
- **THEN** they are told how many products carry it
- **AND** on confirmation those products are sold with no offer

#### Scenario: No product references a deleted deal

- **WHEN** a bundle deal is deleted
- **THEN** no product refers to it
