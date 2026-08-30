## Purpose

Defines how a shopper previews and buys a product without leaving the listing they are browsing — when a card's actions become available, what the quick view presents, how a variant is chosen and added to the cart from it, and how the whole interaction stays reachable for shoppers who cannot hover.

## ADDED Requirements

### Requirement: Card actions are revealed on engagement

A product card's purchase actions SHALL be visually de-emphasised until the shopper engages with that card, so a dense listing does not present every card's actions at once.

Engagement means pointing at the card or moving keyboard focus into it. Both SHALL reveal the actions identically.

The reveal SHALL be animated rather than instantaneous, and the transition MUST be suppressed for shoppers who have asked their system to reduce motion.

Revealing or hiding an action MUST NOT change the card's size or the position of any other card. The space the action occupies SHALL be reserved whether or not it is currently revealed.

All of a card's actions SHALL follow this behaviour uniformly. A listing MUST NOT reveal one product's action while another product's action of the same kind is permanently shown, since that reads as a rendering fault rather than a deliberate state.

#### Scenario: Actions hidden at rest

- **WHEN** a listing is displayed and the shopper is not engaging with any card
- **THEN** no card's purchase action is visually presented
- **AND** the space each action will occupy is already reserved

#### Scenario: Pointing at a card reveals its action

- **WHEN** the shopper points at a product card
- **THEN** that card's purchase action becomes visible via an animated transition
- **AND** no other card's action becomes visible
- **AND** no card changes size or position

#### Scenario: Keyboard focus reveals the action

- **WHEN** the shopper moves keyboard focus into a product card
- **THEN** that card's purchase action becomes visible
- **AND** the action can be activated from the keyboard without pointing at the card

#### Scenario: Disengaging hides the action again

- **WHEN** the shopper stops pointing at a card and focus is not within it
- **THEN** the action returns to its hidden presentation
- **AND** the card's size and position are unchanged

#### Scenario: Reduced motion honoured

- **WHEN** the shopper has requested reduced motion and engages with a card
- **THEN** the action becomes visible without an animated transition

### Requirement: Card actions remain reachable without hover

On a device that cannot hover, every card's purchase action SHALL be permanently visible.

A shopper on such a device MUST NOT be required to perform any preliminary gesture to reach a card's action. Hiding an action behind an interaction the device cannot express would make purchasing unreachable, so the hidden presentation SHALL apply only where hovering is actually possible.

The action's behaviour when activated SHALL be identical regardless of how it was revealed.

#### Scenario: Touch device shows actions permanently

- **WHEN** a shopper on a device with no hover capability opens a listing
- **THEN** every card's purchase action is visible without any prior interaction
- **AND** activating it has the same effect as it does on a hovering device

#### Scenario: First tap acts rather than reveals

- **WHEN** a shopper on a device with no hover capability taps a card's action
- **THEN** the action is performed
- **AND** the tap is not consumed as a reveal gesture

### Requirement: A product can be previewed without leaving the listing

A shopper acting on a product that requires a variant choice SHALL be offered that product's details in place, layered over the listing, rather than being navigated away from it.

The preview SHALL present the product's images, name, current price, any comparison price and the corresponding discount, its brand where recorded, its short description where recorded, and the choices the merchant has made available.

Opening and closing the preview MUST leave the listing exactly as the shopper left it — same scroll position, same filters, same page of results.

Prices in the preview SHALL be presented on the same terms as everywhere else in the storefront: as currency amounts, with a comparison price shown only when it exceeds the current price.

#### Scenario: Preview opens over the listing

- **WHEN** the shopper activates the action on a product that requires a choice
- **THEN** that product's details are presented layered over the listing
- **AND** the shopper is not navigated to another page

#### Scenario: Preview shows the product's details

- **WHEN** the preview is open for a product
- **THEN** its images, name, and current price are shown
- **AND** its brand and short description are shown where the merchant has recorded them
- **AND** its comparison price and the corresponding discount are shown when it has one

#### Scenario: Closing restores the listing untouched

- **WHEN** the shopper closes the preview
- **THEN** the listing is shown at the same scroll position as before it opened
- **AND** the filters and page of results are unchanged

#### Scenario: Preview reflects the product acted on

- **WHEN** the shopper opens the preview from a specific card
- **THEN** the product presented is the one that card represents

### Requirement: The preview presents the merchant's available choices

Where a product has variants, the preview SHALL present each variant the merchant has made available as a selectable choice.

The price shown SHALL update to reflect the selected choice whenever that choice's price differs from the product's base price.

A choice the merchant has no stock for SHALL be presented as unavailable and MUST NOT be selectable for purchase.

The shopper SHALL be able to choose how many units to add, and MUST NOT be able to request a quantity the merchant does not have stock for.

#### Scenario: Choices are presented

- **WHEN** the preview is open for a product with variants
- **THEN** each variant the merchant has made available is presented as a choice

#### Scenario: Price follows the selected choice

- **WHEN** the shopper selects a choice whose price differs from the product's base price
- **THEN** the price shown updates to that choice's price
- **AND** any comparison price and discount shown update to match

#### Scenario: Unavailable choice cannot be bought

- **WHEN** a variant has no available stock
- **THEN** it is presented as unavailable
- **AND** it cannot be selected for purchase

#### Scenario: Quantity is bounded by stock

- **WHEN** the shopper raises the quantity to the available stock for the current selection
- **THEN** the quantity cannot be raised further

### Requirement: A product can be added to the cart from the preview

The shopper SHALL be able to add the product to the cart directly from the preview, without visiting the product's detail page.

Adding SHALL respect the shopper's selection: the variant chosen and the quantity chosen are what the cart receives. The storefront MUST NOT add a product that requires a choice before a choice has been made.

On a successful add the preview SHALL close and the shopper SHALL be shown the same cart confirmation they receive when adding from anywhere else in the storefront.

While an add is in progress the shopper SHALL be given a visible indication, and the add MUST NOT be submitted twice by repeated activation.

#### Scenario: Add with a chosen variant

- **WHEN** the shopper selects a variant and adds it to the cart from the preview
- **THEN** the cart receives that variant at the chosen quantity
- **AND** the preview closes
- **AND** the shopper is shown the cart confirmation

#### Scenario: Nothing added before a choice is made

- **WHEN** the preview is open for a product requiring a choice and no choice has been made
- **THEN** the product cannot be added to the cart

#### Scenario: Add in progress is indicated

- **WHEN** an add is in progress
- **THEN** the shopper is shown a visible indication
- **AND** activating the control again does not submit a second add

#### Scenario: Failed add keeps the preview open

- **WHEN** the add cannot be completed
- **THEN** the shopper is told it did not succeed
- **AND** the preview remains open with the shopper's selection intact
- **AND** the cart confirmation is not shown

### Requirement: The preview offers the full product details

The preview SHALL offer the shopper a way to reach that product's full detail page, for the reviews, specifications, and long description the preview does not carry.

Following it SHALL navigate to that product's detail page and SHALL dismiss the preview.

#### Scenario: Shopper opens the full details

- **WHEN** the shopper chooses to view the full product details from the preview
- **THEN** the shopper is taken to that product's detail page
- **AND** the preview is dismissed

### Requirement: The preview is operable by keyboard and screen reader

The preview SHALL be exposed to assistive technology as a dialog, with an accessible name identifying the product it presents.

While it is open, keyboard focus SHALL be confined to it, and content behind it SHALL NOT be scrollable or reachable by keyboard. On opening, focus SHALL move into the preview; on closing, focus SHALL return to the control that opened it.

The shopper SHALL be able to dismiss the preview with the Escape key and by activating an explicit close control. Dismissing it MUST NOT add anything to the cart.

#### Scenario: Dialog is announced

- **WHEN** the preview opens
- **THEN** assistive technology announces it as a dialog
- **AND** its accessible name identifies the product

#### Scenario: Focus is confined and restored

- **WHEN** the preview is open and the shopper cycles through focusable elements
- **THEN** focus stays within the preview
- **AND** on closing, focus returns to the control that opened it

#### Scenario: Escape dismisses

- **WHEN** the shopper presses Escape while the preview is open
- **THEN** the preview closes
- **AND** nothing is added to the cart

#### Scenario: Background is inert

- **WHEN** the preview is open
- **THEN** the listing behind it does not scroll
- **AND** its controls cannot be reached by keyboard

### Requirement: The preview degrades safely

The preview SHALL retrieve the product's full details when it opens, since a listing does not carry the choices a shopper needs to pick between.

While those details are loading the shopper SHALL be shown a visible loading indication rather than a blank or partially populated panel, and the product MUST NOT be addable to the cart until its real choices are known.

When the details cannot be retrieved, the shopper SHALL be told so and offered the product's detail page as an alternative route. The storefront MUST NOT present a preview that silently omits choices the product actually has.

Dismissing the preview before its details arrive MUST NOT leave the shopper with a stale panel or apply that response to a later preview.

#### Scenario: Loading is indicated

- **WHEN** the preview opens and the product's details are still loading
- **THEN** the shopper is shown a loading indication
- **AND** the product cannot yet be added to the cart

#### Scenario: Details cannot be retrieved

- **WHEN** the product's details cannot be retrieved
- **THEN** the shopper is told the preview could not be loaded
- **AND** is offered the product's detail page instead
- **AND** the listing behind remains usable

#### Scenario: Dismissed before details arrive

- **WHEN** the shopper closes the preview before its details arrive
- **THEN** the preview stays closed
- **AND** the arriving response is not applied to a subsequently opened preview

#### Scenario: Reopening the same product

- **WHEN** the shopper reopens the preview for a product whose details were already retrieved
- **THEN** the details are presented without retrieving them again
