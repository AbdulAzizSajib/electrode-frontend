## ADDED Requirements

### Requirement: The newsletter signup is a home-page section, not site chrome

The newsletter signup SHALL be one of the home page's sections, shown, hidden and ordered by the merchant's home-page section configuration exactly as every other section is. It MUST NOT be part of the site chrome, and therefore MUST NOT appear on any route other than the home page.

Whether it is shown SHALL be decided by that configuration and by nothing else. In particular, its visibility MUST NOT depend on whether its heading has been filled in — a merchant who wants it gone switches it off, and a merchant who leaves a wording field blank gets a block without that line rather than no block at all.

The section SHALL present the merchant's own wording: its heading, its supporting text, its input placeholder and its button label. Wording the merchant has not filled in SHALL simply be absent.

The section SHALL be legible on the home page's own background, and MUST NOT depend on the footer's background for its contrast.

Submitting the form SHALL NOT navigate away from the page or discard what the shopper is doing. The storefront does not yet accept subscriptions, and the form MUST NOT imply that it does by appearing to succeed.

#### Scenario: Merchant switches the newsletter off

- **WHEN** the merchant switches the newsletter section off and a shopper next loads the home page
- **THEN** the signup block is absent from the home page
- **AND** the merchant's wording is still on file, so switching it back on restores it unchanged

#### Scenario: Merchant moves the newsletter up the page

- **WHEN** the merchant places the newsletter above another section and a shopper next loads the home page
- **THEN** the signup block appears in that position

#### Scenario: The newsletter is gone from every other page

- **WHEN** a shopper opens a product page, a category page, the cart or the checkout
- **THEN** no newsletter signup block appears anywhere on it, including in the footer

#### Scenario: A blank heading

- **WHEN** the section is switched on for a shop whose newsletter heading is empty
- **THEN** the signup form is still shown, without a heading line

#### Scenario: Settings cannot be read

- **WHEN** the storefront cannot read the merchant's settings and a shopper loads the home page
- **THEN** the newsletter section is shown, as part of the complete default page the storefront falls back to

#### Scenario: Shopper submits the form

- **WHEN** a shopper enters an address and submits the signup form
- **THEN** the page does not navigate away and nothing the shopper had entered or scrolled to is lost
