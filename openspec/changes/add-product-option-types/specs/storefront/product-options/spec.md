## Purpose

Governs how a product's named options and their values are presented to a shopper, how choices across those options resolve to a single purchasable variant, and how combinations that no variant provides are treated.

## ADDED Requirements

### Requirement: A product presents its options as named, ordered choices

A product SHALL present each of its options as a separately labelled control bearing the merchant's name for that option, such as Colour, Size or Weight. Values SHALL appear in the order the merchant authored them, not in alphabetical or arbitrary order, so that ordered sets such as S / M / XL or 1 pound / 2 pound read correctly.

The set of options and their values SHALL be defined per product as data. The storefront SHALL NOT restrict which option names a merchant may use, and SHALL NOT require code changes to support an option name it has not seen before.

#### Scenario: A product with one option

- **WHEN** a shopper opens a product whose only option is Colour
- **THEN** a single control labelled Colour is shown, listing its values in the authored order

#### Scenario: A product with several options

- **WHEN** a shopper opens a product with both Colour and Size
- **THEN** two separately labelled controls are shown, each listing only its own values

#### Scenario: Authored order is preserved

- **WHEN** a merchant authors a Size option with values S, M, then XL
- **THEN** the shopper sees them in that order

#### Scenario: An option name the storefront has never seen

- **WHEN** a merchant defines an option named Weight with values 1 pound and 2 pound
- **THEN** the option is presented like any other, with no change to the storefront

#### Scenario: A product with no options

- **WHEN** a shopper opens a product that has no options
- **THEN** no option controls are shown, and the product's own price, stock and product code are used

### Requirement: A choice across every option resolves to one variant

Selecting one value for each of a product's options SHALL identify at most one purchasable variant. Every detail describing what the shopper would buy — price, any compare-at price and resulting discount, stock and availability, and product code — SHALL describe the resolved variant.

Until a value has been chosen for every option, the product SHALL NOT be added to the cart, and the shopper SHALL be told which choice is outstanding rather than being presented with a control that silently does nothing.

#### Scenario: Completing a selection

- **WHEN** a shopper picks a value for every option on the product
- **THEN** the price, discount, availability and product code shown all describe the single variant those values identify

#### Scenario: Changing one choice

- **WHEN** a shopper who has completed a selection changes the value of one option
- **THEN** the details shown update to describe the variant identified by the new combination

#### Scenario: An incomplete selection

- **WHEN** a product has two options and the shopper has chosen a value for only one of them
- **THEN** the product cannot be added to the cart
- **AND** the shopper is told which option still needs a choice

#### Scenario: A single-option product resolves immediately

- **WHEN** a shopper picks a value on a product with exactly one option
- **THEN** the selection is complete and the product can be added to the cart

### Requirement: Values that no variant provides are shown as unavailable

A value that cannot be obtained given the shopper's other choices SHALL remain visible and SHALL be presented as unavailable rather than removed from the control. Removing it would silently change what the control offers and hide from the shopper that the combination was ever possible to ask for.

An unavailable value SHALL be distinguishable from a value that is merely not currently selected, and SHALL NOT be selectable.

This SHALL apply both to combinations for which no variant exists at all and to combinations whose variant is out of stock.

#### Scenario: A colour made in only one size

- **WHEN** a shopper selects a colour that is only manufactured in M
- **THEN** the sizes other than M remain visible and are shown as unavailable

#### Scenario: An out-of-stock combination

- **WHEN** the variant identified by a value combination has no stock
- **THEN** that value is shown as unavailable and cannot be selected

#### Scenario: Unavailability updates as choices change

- **WHEN** a shopper changes their choice on one option
- **THEN** the availability shown for the values of the other options updates to reflect what is obtainable given the new choice

#### Scenario: Nothing is hidden

- **WHEN** a shopper views any option control
- **THEN** every value the merchant authored for that option is present, whether or not it is currently obtainable

### Requirement: An option declares how its values are presented

Each option SHALL carry, as part of its definition, how its values are to be presented — for example as a colour swatch or as a labelled chip. The storefront SHALL present the values according to that declaration rather than inferring it from the option's name.

A value presented visually, such as a swatch, SHALL still convey its name to a shopper who cannot distinguish it visually.

#### Scenario: A colour option renders as swatches

- **WHEN** an option declares that its values are colours
- **THEN** each value is presented as a colour swatch

#### Scenario: A size option renders as labels

- **WHEN** an option declares that its values are plain labels
- **THEN** each value is presented as a labelled chip showing the value's name

#### Scenario: A swatch is still identifiable without seeing it

- **WHEN** a value is presented as a colour swatch
- **THEN** the value's name is available to a shopper using assistive technology or unable to distinguish the colour

### Requirement: Products authored before options existed keep working

A product whose variants carry no option values SHALL remain purchasable and SHALL present its variants as a single choice, exactly as it does today. Introducing options SHALL NOT make any existing product unbuyable or unrenderable.

#### Scenario: A legacy product with named variants only

- **WHEN** a shopper opens a product whose variants have names but no option values
- **THEN** the variants are presented as one control the shopper can choose from
- **AND** choosing one updates price, availability and product code as it does today

#### Scenario: No product becomes unpurchasable

- **WHEN** any product that could be added to the cart before this change is opened
- **THEN** it can still be added to the cart

### Requirement: Option behaviour is consistent wherever a product is chosen

The behaviour defined by this capability SHALL apply wherever a shopper chooses between a product's variants, including the product detail view and the in-listing preview. The two SHALL NOT diverge in how options are presented, how a selection resolves, or how unavailable values are treated.

#### Scenario: The in-listing preview matches the detail view

- **WHEN** a shopper chooses option values in the preview opened from a listing
- **THEN** the options are presented and resolved exactly as they are in the detail view

#### Scenario: Unavailability is treated the same in both

- **WHEN** a combination is unavailable
- **THEN** it is shown as unavailable in both the detail view and the in-listing preview
