## Purpose

Defines how a shopper saves products for later — as a guest or signed in — how the saved set is displayed and modified, and what happens to a guest's saved items when they sign in.

## ADDED Requirements

### Requirement: A shopper can save products for later

A shopper SHALL be able to save a product to their wishlist, remove a saved product, view everything they have saved, and clear the wishlist entirely.

The wishlist SHALL be owned by the shopper and MUST reflect only what that shopper has saved.

#### Scenario: Shopper saves a product

- **WHEN** a shopper saves a product
- **THEN** the product appears in their wishlist

#### Scenario: Shopper removes a saved product

- **WHEN** a shopper removes a product from their wishlist
- **THEN** the product no longer appears in their wishlist

#### Scenario: Shopper views their wishlist

- **WHEN** a shopper opens their wishlist
- **THEN** the products they have saved are shown
- **AND** no product they have not saved is shown

#### Scenario: Shopper clears the wishlist

- **WHEN** a shopper clears their wishlist
- **THEN** the wishlist becomes empty

#### Scenario: Saving the same product twice

- **WHEN** a shopper saves a product already in their wishlist
- **THEN** the wishlist still contains that product exactly once
- **AND** no error is shown to the shopper

### Requirement: The wishlist survives across visits

A shopper's saved products SHALL persist beyond the page they saved them on and beyond the end of their browsing session, so that returning later shows the same saved set.

Persistence MUST NOT depend on the shopper being signed in.

#### Scenario: Saved product persists across pages

- **WHEN** a shopper saves a product and then navigates to another page
- **THEN** the product remains in their wishlist

#### Scenario: Saved product persists across visits

- **WHEN** a shopper saves a product, leaves the storefront, and returns later on the same device
- **THEN** the product is still in their wishlist

### Requirement: Guests can use the wishlist and keep their items on sign-in

A shopper who is not signed in SHALL be able to save products, and those saved products MUST NOT be lost when the shopper subsequently signs in or registers.

On sign-in, the guest's saved products SHALL be combined with any products already saved to the account, without duplicating a product present in both.

#### Scenario: Guest saves a product

- **WHEN** a shopper who is not signed in saves a product
- **THEN** the product appears in their wishlist

#### Scenario: Guest's saved items survive sign-in

- **WHEN** a guest with saved products signs in to an existing account
- **THEN** those products are present in the signed-in account's wishlist

#### Scenario: Overlapping items are not duplicated

- **WHEN** a guest signs in and a product was saved both as a guest and on the account
- **THEN** the merged wishlist contains that product exactly once

#### Scenario: Wishlist follows the account across devices

- **WHEN** a signed-in customer saves a product and later signs in on another device
- **THEN** the saved product is present in their wishlist

### Requirement: The saved count is accurate wherever it is shown

Where the storefront displays a count of saved products, that count SHALL reflect the shopper's actual wishlist and SHALL update when the shopper saves or removes a product.

A fixed or placeholder count MUST NOT be displayed.

#### Scenario: Count reflects the wishlist

- **WHEN** a shopper's wishlist holds a number of products
- **THEN** the displayed count equals that number

#### Scenario: Count updates on saving

- **WHEN** a shopper saves a product
- **THEN** the displayed count increases accordingly without requiring a page reload

#### Scenario: Count updates on removal

- **WHEN** a shopper removes a product from their wishlist
- **THEN** the displayed count decreases accordingly

### Requirement: Wishlist controls reflect and change state

A control offered to a shopper for saving a product MUST perform that action when selected. A control that does nothing MUST NOT be presented.

Where a product is displayed alongside a save control, the control SHALL indicate whether that product is currently saved, and selecting it SHALL toggle that state.

#### Scenario: Save control works

- **WHEN** a shopper selects the save control on a product
- **THEN** the product is saved to their wishlist

#### Scenario: Control indicates saved state

- **WHEN** a product already in the shopper's wishlist is displayed with a save control
- **THEN** the control indicates that the product is saved

#### Scenario: Control toggles the product out

- **WHEN** a shopper selects the save control on a product that is already saved
- **THEN** the product is removed from their wishlist

### Requirement: The wishlist reflects the catalog honestly

Products shown in the wishlist SHALL display their current catalog details, including current price and availability, rather than the values recorded when they were saved.

A saved product that is no longer purchasable SHALL be shown as such rather than presented as available, and a saved product that has been removed from the catalog MUST NOT be presented as purchasable.

#### Scenario: Price change is reflected

- **WHEN** the price of a saved product changes and the shopper views their wishlist
- **THEN** the current price is shown

#### Scenario: Saved product is out of stock

- **WHEN** a saved product is not currently purchasable
- **THEN** the wishlist indicates that it cannot be purchased

#### Scenario: Saved product left the catalog

- **WHEN** a saved product is no longer in the catalog
- **THEN** it is not presented as purchasable
- **AND** the rest of the wishlist is still shown

### Requirement: Empty and failed states are distinguished

The wishlist SHALL show an empty state only when the shopper has genuinely saved nothing.

When the wishlist cannot be retrieved, the shopper SHALL be told that it could not be loaded rather than being shown an empty wishlist, so a shopper never believes their saved items were lost.

#### Scenario: Genuinely empty wishlist

- **WHEN** a shopper who has saved nothing opens their wishlist
- **THEN** an empty state is shown

#### Scenario: Wishlist cannot be retrieved

- **WHEN** the shopper's wishlist cannot be retrieved
- **THEN** the shopper is told it could not be loaded
- **AND** it is not presented as empty

#### Scenario: Save action fails

- **WHEN** a shopper attempts to save a product and the action fails
- **THEN** the shopper is told the product was not saved
- **AND** the displayed state does not claim it was saved
