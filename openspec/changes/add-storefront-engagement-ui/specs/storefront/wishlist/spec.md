## Purpose

Defines how a signed-in shopper saves products for later, how the saved set is displayed and changed from anywhere in the storefront, and how a saved product is moved into the cart.

## ADDED Requirements

### Requirement: A signed-in shopper can save and unsave products

A signed-in shopper SHALL be able to save a product for later, remove a saved product, and view everything they have saved. The saved set SHALL belong to that shopper and MUST reflect only what they have saved.

Saving a product already saved MUST NOT create a duplicate entry and MUST NOT be presented to the shopper as an error.

Saving requires a signed-in shopper. A shopper who is not signed in SHALL be prompted to sign in rather than shown a control that silently fails.

#### Scenario: Shopper saves a product
- **WHEN** a signed-in shopper saves a product
- **THEN** the product appears in their saved list

#### Scenario: Shopper removes a saved product
- **WHEN** a signed-in shopper removes a product from their saved list
- **THEN** the product no longer appears there

#### Scenario: Saving the same product twice
- **WHEN** a shopper saves a product that is already saved
- **THEN** the saved list still contains it exactly once
- **AND** no error is shown

#### Scenario: Signed-out shopper attempts to save
- **WHEN** a shopper who is not signed in attempts to save a product
- **THEN** they are prompted to sign in
- **AND** nothing is claimed to have been saved

#### Scenario: Saved set follows the account
- **WHEN** a signed-in shopper saves a product and later signs in on another device
- **THEN** the product is in their saved list

### Requirement: The save control reflects and toggles saved state

Wherever a product is displayed with a save control, that control SHALL indicate whether the product is currently saved, and selecting it SHALL toggle that state.

A control that performs no action MUST NOT be presented.

#### Scenario: Control shows saved state
- **WHEN** a product that the shopper has saved is displayed with a save control
- **THEN** the control indicates that it is saved

#### Scenario: Control shows unsaved state
- **WHEN** a product the shopper has not saved is displayed with a save control
- **THEN** the control indicates that it is not saved

#### Scenario: Control toggles a product in
- **WHEN** a shopper selects the save control on an unsaved product
- **THEN** the product becomes saved
- **AND** the control updates without a page reload

#### Scenario: Control toggles a product out
- **WHEN** a shopper selects the save control on a saved product
- **THEN** the product is removed from the saved list
- **AND** the control updates without a page reload

#### Scenario: Toggle fails
- **WHEN** a shopper toggles the save control and the action fails
- **THEN** the shopper is told it did not take effect
- **AND** the control does not continue to show the state that was not achieved

### Requirement: The saved count shown is accurate

Where the storefront displays a count of saved products, that count SHALL equal the shopper's actual saved total and SHALL update when the shopper saves or removes a product, without requiring a page reload.

A fixed or placeholder count MUST NOT be displayed.

#### Scenario: Count matches the saved list
- **WHEN** a signed-in shopper has saved products
- **THEN** the displayed count equals the number of products in their saved list

#### Scenario: Count updates on saving
- **WHEN** a shopper saves a product
- **THEN** the displayed count increases accordingly without a page reload

#### Scenario: Count updates on removal
- **WHEN** a shopper removes a saved product
- **THEN** the displayed count decreases accordingly without a page reload

#### Scenario: No saved products
- **WHEN** a shopper has saved nothing
- **THEN** no count is displayed, or the count is shown as zero
- **AND** no placeholder figure is shown in its place

### Requirement: The saved list reflects the catalog honestly

Products in the saved list SHALL be shown with their current catalog details, including current price and availability, rather than the values recorded when they were saved.

A saved product that is not currently purchasable SHALL be shown as such rather than presented as available.

Where more saved products exist than are shown at once, the shopper SHALL be able to reach the remainder.

#### Scenario: Price change is reflected
- **WHEN** the price of a saved product changes and the shopper opens their saved list
- **THEN** the current price is shown

#### Scenario: Saved product is not purchasable
- **WHEN** a saved product cannot currently be purchased
- **THEN** it is shown as unavailable rather than as ready to buy

#### Scenario: More saved products than fit at once
- **WHEN** a shopper has more saved products than are shown at once
- **THEN** the shopper can reach the remainder

### Requirement: A shopper can move a saved product into the cart

A shopper SHALL be able to move a saved product into their cart in one action. On success the product SHALL be in the cart and no longer in the saved list, and the cart shown to the shopper SHALL reflect the addition immediately.

If the product cannot be added, it SHALL remain in the saved list and the shopper SHALL be told why.

#### Scenario: Saved product moved to the cart
- **WHEN** a shopper moves a saved product into their cart
- **THEN** the product is in the cart
- **AND** it is no longer in the saved list
- **AND** the cart total shown to the shopper reflects it without a page reload

#### Scenario: Product cannot be added to the cart
- **WHEN** a shopper moves a saved product into the cart and it cannot be added
- **THEN** the shopper is told why
- **AND** the product remains in their saved list

### Requirement: Empty and failed states are distinguished

The saved list SHALL show an empty state only when the shopper has genuinely saved nothing.

When the saved list cannot be retrieved, the shopper SHALL be told it could not be loaded rather than being shown an empty list, so a shopper never believes their saved products were lost.

#### Scenario: Genuinely empty saved list
- **WHEN** a shopper who has saved nothing opens their saved list
- **THEN** an empty state is shown

#### Scenario: Saved list cannot be retrieved
- **WHEN** a shopper's saved list cannot be retrieved
- **THEN** they are told it could not be loaded
- **AND** it is not presented as empty
