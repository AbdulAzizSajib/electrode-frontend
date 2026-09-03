<!-- `storefront/product-options` was introduced by the change
     `add-product-option-types`, which has not been archived, so
     `openspec/specs/storefront/product-options/spec.md` does not exist yet.
     The requirements restated below are quoted from that change's delta, which
     is the only place they currently live.

     No `## Purpose` section appears here: the capability is not new, and its
     Purpose still describes it accurately — only where the options come from
     changes, not what the shopper sees. The four requirements not listed below
     are unaffected and are deliberately left alone. -->

## MODIFIED Requirements

### Requirement: A product presents its options as named, ordered choices

A product SHALL present each of its options as a separately labelled control bearing the merchant's name for that option, such as Colour, Size or Weight. Values SHALL appear in the order the merchant authored them, not in alphabetical or arbitrary order, so that ordered sets such as S / M / XL or 1 pound / 2 pound read correctly.

A product's options SHALL be the shop-wide attributes it sells values from, rather than a set defined for that product alone. Two products selling the same attribute SHALL present the same option name and the same value order, so a shopper moving between them is not shown "Colour" on one and "Color" on the other.

The storefront SHALL NOT restrict which option names a merchant may use, and SHALL NOT require code changes to support an option name it has not seen before.

#### Scenario: A product with one option

- **WHEN** a shopper opens a product whose only option is Colour
- **THEN** a single control labelled Colour is shown, listing its values in the authored order

#### Scenario: A product with several options

- **WHEN** a shopper opens a product with both Colour and Size
- **THEN** two separately labelled controls are shown, each listing only its own values

#### Scenario: Authored order is preserved

- **WHEN** a merchant authors a Size attribute with values S, M, then XL
- **THEN** the shopper sees them in that order on every product selling them

#### Scenario: Two products sharing an attribute agree

- **WHEN** a shopper views two products that both sell values of the Colour attribute
- **THEN** both present the option under the same name, with shared values in the same order

#### Scenario: A product sells only some of an attribute's values

- **WHEN** a product sells only Red and Green from a Colour attribute that also defines Blue
- **THEN** the shopper is offered Red and Green, and Blue is not presented for that product

#### Scenario: An option name the storefront has never seen

- **WHEN** a merchant defines an attribute named Weight with values 1 pound and 2 pound
- **THEN** the option is presented like any other, with no change to the storefront

#### Scenario: A product with no options

- **WHEN** a shopper opens a product that sells no attribute values
- **THEN** no option controls are shown, and the product's own price, stock and product code are used

### Requirement: An option declares how its values are presented

Each attribute SHALL carry, as part of its definition, how its values are to be presented — for example as a colour swatch or as a labelled chip. The storefront SHALL present the values according to that declaration rather than inferring it from the attribute's name.

Because the declaration belongs to the shop-wide attribute, every product selling it SHALL present its values the same way.

A value presented visually, such as a swatch, SHALL still convey its name to a shopper who cannot distinguish it visually.

#### Scenario: A colour option renders as swatches

- **WHEN** an attribute declares that its values are colours
- **THEN** each value is presented as a colour swatch

#### Scenario: A size option renders as labels

- **WHEN** an attribute declares that its values are plain labels
- **THEN** each value is presented as a labelled chip showing the value's name

#### Scenario: Presentation is consistent across products

- **WHEN** two products sell values of the same attribute
- **THEN** both present those values the same way

#### Scenario: A swatch is still identifiable without seeing it

- **WHEN** a value is presented as a colour swatch
- **THEN** the value's name is available to a shopper using assistive technology or unable to distinguish the colour

### Requirement: Products authored before options existed keep working

A product whose variants carry no option values SHALL remain purchasable and SHALL present its variants as a single choice, exactly as it does today. Neither introducing options nor moving them to shop-wide attributes SHALL make any existing product unbuyable or unrenderable.

A product whose variants were defined against per-product options before this change SHALL keep those variants, presenting them through the shop-wide attributes its options became.

#### Scenario: A legacy product with named variants only

- **WHEN** a shopper opens a product whose variants have names but no option values
- **THEN** the variants are presented as one control the shopper can choose from
- **AND** choosing one updates price, availability and product code as it does today

#### Scenario: A product migrated from per-product options

- **WHEN** a shopper opens a product whose options were defined before attributes became shop-wide
- **THEN** the same options and values are presented, and the same variants remain purchasable

#### Scenario: No product becomes unpurchasable

- **WHEN** any product that could be added to the cart before this change is opened
- **THEN** it can still be added to the cart
