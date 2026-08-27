## Purpose

Defines how merchant-owned presentation values — contact details, announcement text, currency, policy thresholds, and footer navigation — reach the storefront from a single authoritative source, so a merchant can change them without a developer editing code and redeploying.

## ADDED Requirements

### Requirement: Storefront presentation values come from the merchant, not from code

The storefront SHALL source its merchant-owned presentation values from a single authoritative settings source rather than from values embedded in the storefront's own code.

These values SHALL include, at minimum: the store name; the store's postal address, contact email address, and contact telephone number; the store's social media links; the announcement-bar message and whether it is displayed; the trading currency; the order value above which delivery is free; and the number of days within which an item may be returned.

A change a merchant makes to any of these values MUST become visible to shoppers without a code change or redeploy of the storefront.

#### Scenario: Merchant changes the contact telephone number

- **WHEN** the merchant changes the store's contact telephone number and a shopper next loads a page showing it
- **THEN** the shopper is shown the new number
- **AND** no redeploy of the storefront is required

#### Scenario: Contact details are consistent everywhere they appear

- **WHEN** the store's postal address, email address, or telephone number is displayed in more than one place in the storefront
- **THEN** every place shows the same value
- **AND** that value is the one the merchant has configured

#### Scenario: Announcement can be turned off

- **WHEN** the merchant marks the announcement as not displayed
- **THEN** the announcement bar is absent from the storefront
- **AND** the rest of the page renders normally

#### Scenario: Announcement message is merchant-authored

- **WHEN** the merchant changes the announcement message and a shopper next loads the storefront
- **THEN** the announcement bar shows the merchant's message

### Requirement: Policy thresholds are stated consistently wherever they appear

Where the storefront states the order value above which delivery is free, or the period within which an item may be returned, it SHALL state the value the merchant has configured.

The same threshold MUST NOT be stated with two different values in two different places in the storefront.

#### Scenario: Free-delivery threshold is stated consistently

- **WHEN** the free-delivery threshold is stated in more than one place
- **THEN** every statement of it uses the merchant's configured value

#### Scenario: Merchant raises the free-delivery threshold

- **WHEN** the merchant raises the free-delivery threshold and a shopper next loads a page stating it
- **THEN** the shopper is shown the new threshold everywhere it appears

#### Scenario: Return window is stated consistently

- **WHEN** the return period is stated to a shopper
- **THEN** it matches the merchant's configured return period

### Requirement: Footer navigation is merchant-managed and every link resolves

The storefront's footer link columns SHALL be sourced from the merchant's configuration, each link carrying both the text shown to the shopper and the destination it leads to.

Every link presented to a shopper MUST lead to a real destination. A link with no destination MUST NOT be displayed.

#### Scenario: Footer shows the merchant's configured columns

- **WHEN** a shopper views the footer
- **THEN** the link columns and their titles are those the merchant has configured

#### Scenario: Shoppers are never shown a dead footer link

- **WHEN** a footer link is displayed to a shopper
- **THEN** selecting it takes the shopper to a real destination
- **AND** no link leads nowhere

#### Scenario: Link without a destination is omitted

- **WHEN** the merchant has configured a link entry with no destination
- **THEN** that entry is not displayed to shoppers

### Requirement: Settings are public and available to every shopper

Retrieving the storefront's presentation settings MUST NOT require a shopper to be signed in or to hold any privilege. Settings SHALL contain only values intended for public display, and MUST NOT expose merchant credentials, internal identifiers, or any value not meant to be shown to a shopper.

#### Scenario: Guest receives settings

- **WHEN** a shopper who is not signed in loads the storefront
- **THEN** the announcement, contact details, currency, and footer navigation are populated

#### Scenario: Signed-in customer receives the same settings

- **WHEN** a signed-in customer loads the storefront
- **THEN** the settings shown are the same as those shown to a guest

#### Scenario: Settings carry no privileged values

- **WHEN** the storefront's settings are retrieved
- **THEN** they contain only values intended for public display

### Requirement: The storefront degrades safely when settings are unavailable

Because settings are read on every page, a failure to retrieve them MUST NOT block, delay, or break rendering of the rest of the page.

When settings cannot be retrieved, the storefront SHALL omit the surfaces that depend on them rather than displaying placeholder, invented, or stale merchant details. Contact details, in particular, MUST NOT be shown as a fabricated value.

#### Scenario: Settings request fails

- **WHEN** the settings cannot be retrieved
- **THEN** the rest of the page renders normally
- **AND** no invented contact details, threshold, or announcement is shown

#### Scenario: A single missing value does not remove the rest

- **WHEN** the merchant has not configured one particular value, such as a social media link
- **THEN** only the surface depending on that value is omitted
- **AND** the remaining settings are still applied

### Requirement: Settings changes propagate within a bounded time

The storefront MAY serve settings from a cache to avoid retrieving them afresh on every page view. Where it does, the cache SHALL have a bounded lifetime, and a merchant's change MUST become visible to shoppers within that bound without any manual intervention.

The bound MUST be documented so a merchant knows how long a change takes to appear.

#### Scenario: Merchant edit becomes visible within the bound

- **WHEN** the merchant changes a setting
- **THEN** shoppers see the new value no later than the documented bound after the change

#### Scenario: Stale settings are never served indefinitely

- **WHEN** settings have been cached
- **THEN** they are refreshed from the merchant's configuration within the documented bound
