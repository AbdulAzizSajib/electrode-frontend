## ADDED Requirements

### Requirement: The browser-tab icon is merchant-owned

The icon a browser shows for the site — in a tab, a bookmark and a search result — SHALL come from the merchant's settings rather than from a file embedded in the storefront's code. A merchant who changes it MUST see the change reach shoppers without a code change or a redeploy.

The icon SHALL be declared on every page the storefront serves, both the shop and campaign landing pages, because a tab icon is a property of the site and not of one route.

Exactly ONE icon SHALL be declared. The storefront MUST NOT emit competing icon declarations and leave the browser to choose between them.

When the merchant has chosen no icon, the storefront SHALL fall back to the icon it ships with. A shop that has configured nothing MUST show that icon, not a blank one, and MUST NOT leave the browser's default request for the site's icon unanswered.

A configured icon that cannot be loaded — a wrong address, a removed image, an insecure address on a secure page — SHALL degrade to the browser's own behaviour and MUST NOT affect the rendering of the page it was declared on.

#### Scenario: Merchant sets a tab icon

- **WHEN** the merchant records a tab icon and a shopper next loads any storefront page
- **THEN** the browser shows that icon for the site
- **AND** no redeploy of the storefront is required

#### Scenario: The icon covers campaign landing pages too

- **WHEN** a shopper opens a campaign landing page
- **THEN** the same merchant-configured icon is declared, as on every shop page

#### Scenario: A shop that has chosen no icon

- **WHEN** a shopper loads a storefront page for a shop whose settings carry no tab icon
- **THEN** the icon the storefront ships with is shown
- **AND** a direct request for the site's default icon address is answered rather than returning not-found

#### Scenario: Only one icon is declared

- **WHEN** a shopper loads a storefront page for a shop that has configured an icon
- **THEN** the document declares that icon and no other

#### Scenario: A configured icon that fails to load

- **WHEN** the recorded icon address cannot be loaded by the browser
- **THEN** the page renders normally and the browser falls back to its own default icon
