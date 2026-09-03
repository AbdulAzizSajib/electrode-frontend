## Purpose

Governs how a merchant creates and edits a product: the shape of the form, what is required to bring a product into existence, what becomes available only after it exists, and the facts a product records about itself.

## ADDED Requirements

### Requirement: The product form is one page, not a gated sequence

The product form SHALL present its fields on a single page the merchant can read and fill in any order. It SHALL NOT require completing one group of fields before another becomes reachable.

A merchant SHALL be able to see what a product still needs without navigating between steps.

#### Scenario: Reaching any field directly

- **WHEN** a merchant opens the product form
- **THEN** every field is present on the page and can be filled in any order

#### Scenario: Seeing what is missing

- **WHEN** a merchant attempts to save with a required field empty
- **THEN** each missing field is identified where it sits on the page

### Requirement: A product is created from what identifies and prices it

Creating a product SHALL require only the facts that identify it, price it and place it in the catalogue. It SHALL NOT require variants, gallery images or stock.

When creation fails, the merchant's work SHALL be preserved on the page and the reason SHALL be shown against the field responsible.

#### Scenario: Creating with the minimum

- **WHEN** a merchant supplies the identifying and pricing fields and saves
- **THEN** the product is created

#### Scenario: Creation without variants or images

- **WHEN** a merchant creates a product having added no variants and no gallery images
- **THEN** the product is created

#### Scenario: Failed creation preserves the form

- **WHEN** a save is rejected
- **THEN** everything the merchant entered is still on the page
- **AND** the reason is shown against the field responsible

### Requirement: Variants, gallery and stock become available once the product exists

The sections for variants, gallery images and stock SHALL be presented only after the product exists, since each attaches to a product and cannot reference one that has not been created.

Before the product exists, the merchant SHALL be told these sections become available after saving, rather than being shown controls that cannot work.

After creating a product, the merchant SHALL be able to author those sections without navigating away and returning.

#### Scenario: Before the product exists

- **WHEN** a merchant is creating a product that has not yet been saved
- **THEN** the variants, gallery and stock sections are not offered
- **AND** the merchant is told they become available after saving

#### Scenario: Immediately after creating

- **WHEN** a merchant saves a new product
- **THEN** the variants, gallery and stock sections become available on the same page

#### Scenario: Editing an existing product

- **WHEN** a merchant opens an existing product
- **THEN** all sections are available immediately

### Requirement: Saving reports what happened and where the merchant lands

Saving SHALL offer both continuing to edit the product and returning to the product list, and SHALL make clear which happened.

A save SHALL NOT silently discard any part of what the merchant entered.

#### Scenario: Save and continue

- **WHEN** a merchant saves and chooses to keep editing
- **THEN** the product is saved and the form stays open on it

#### Scenario: Save and return

- **WHEN** a merchant saves and chooses to return to the list
- **THEN** the product is saved and the list is shown

### Requirement: A product records the facts a shopper needs

A product SHALL record, in addition to its name, description and price:

- the unit it is sold in, such as "1 kg" or "500 ml"
- an optional short badge, such as "New", for the storefront to display
- whether it is refundable
- whether it carries a warranty
- optional keywords for search and grouping
- an optional video with its own thumbnail

Each SHALL be optional except where the catalogue cannot be understood without it, and a product missing an optional fact SHALL display nothing for it rather than an empty label.

#### Scenario: Recording the facts

- **WHEN** a merchant sets the unit, badge, refundable and warranty fields
- **THEN** they are stored against the product and available to the storefront

#### Scenario: An omitted optional fact

- **WHEN** a product has no badge
- **THEN** no badge is shown for it, rather than an empty one

#### Scenario: A product with a video

- **WHEN** a merchant uploads a video for a product
- **THEN** it is stored with its thumbnail and presented alongside the product's images

### Requirement: Keywords are reused rather than reinvented

When a merchant types a keyword, the system SHALL suggest keywords already used elsewhere in the shop, so that a near-duplicate is not created beside an existing one.

A merchant SHALL be able to add a keyword that does not yet exist, and to remove any keyword from a product.

A keyword SHALL be recorded once per product regardless of how many times it is added.

#### Scenario: Suggesting an existing keyword

- **WHEN** a merchant begins typing a keyword that other products already use
- **THEN** the existing keyword is offered

#### Scenario: Adding a new keyword

- **WHEN** a merchant enters a keyword no product uses
- **THEN** it is added to this product and offered as a suggestion in future

#### Scenario: Adding the same keyword twice

- **WHEN** a merchant adds a keyword the product already has
- **THEN** the product carries it once

#### Scenario: Removing a keyword

- **WHEN** a merchant removes a keyword from a product
- **THEN** it is no longer on that product, and other products keep it

### Requirement: Descriptions are authored as formatted text

A product's overview and description SHALL be authored with formatting — at least headings, bold, italic, lists and links — rather than as plain text.

Formatted content SHALL be rendered to shoppers as formatting, not as visible markup.

Stored markup SHALL NOT be able to execute code or perform actions in a shopper's browser, regardless of what was authored or how it was stored.

#### Scenario: Authoring a formatted description

- **WHEN** a merchant writes a description containing a bulleted list and a bold phrase
- **THEN** the storefront displays a bulleted list and a bold phrase

#### Scenario: Markup is never shown raw

- **WHEN** a shopper views a product with a formatted description
- **THEN** they see formatted text, not markup

#### Scenario: Stored markup cannot execute

- **WHEN** a description contains markup that would execute code or perform an action
- **THEN** the storefront renders the description without that markup taking effect
