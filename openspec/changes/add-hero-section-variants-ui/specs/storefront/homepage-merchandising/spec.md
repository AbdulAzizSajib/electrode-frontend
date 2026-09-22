## ADDED Requirements

### Requirement: The hero renders the layout the merchant has chosen

The homepage hero SHALL be arranged according to the layout recorded in the store's home page section configuration, and SHALL offer four arrangements of the same hero artwork:

- a rotating panel beside two square tiles and one wide tile — **the default**, and what the storefront rendered before layouts existed;
- a rotating panel beside a single large square tile;
- a single wide rotating panel with no tiles;
- a full-width rotating panel above a row of three tiles.

The artwork SHALL be shared: all four arrangements draw on the same three hero image slots, and switching between them MUST NOT require a merchant to upload anything again.

A layout the storefront does not recognise SHALL render as the **default** arrangement. A shopper MUST NOT be shown an empty band above the fold because the storefront and the settings it was served disagree about which layouts exist.

#### Scenario: A store that has never chosen a layout

- **WHEN** a shopper loads the home page of a store whose hero layout is the default
- **THEN** the hero renders a rotating panel beside two square tiles and one wide tile

#### Scenario: A chosen layout is rendered

- **WHEN** a shopper loads the home page of a store whose hero layout is the full-width panel above a row of three tiles
- **THEN** the hero renders that arrangement

#### Scenario: An unrecognised layout falls back rather than blanking

- **WHEN** the settings report a hero layout this storefront has no arrangement for
- **THEN** the hero renders the default arrangement

#### Scenario: Switching layout reuses the artwork already uploaded

- **WHEN** a store's hero layout changes and no artwork is re-uploaded
- **THEN** the images the new arrangement renders are the ones already on file for those slots

### Requirement: The hero's placeholder matches the layout it is a placeholder for

While the hero's artwork is still loading, the storefront SHALL show a placeholder whose boxes have the same shapes and positions as the layout that is about to render. A placeholder shaped like a different layout MUST NOT be shown, because the page would visibly re-flow the moment the artwork arrived — which is what the hero's proportional sizing exists to prevent.

#### Scenario: Placeholder for a non-default layout

- **WHEN** the home page of a store using the full-width-panel-above-three-tiles layout is still loading its hero artwork
- **THEN** the placeholder shows one full-width box above a row of three
- **AND** the layout does not shift when the artwork replaces it

### Requirement: Each layout keeps the hero's existing sizing and loading behaviour

Every arrangement SHALL size its boxes as **ratios of the store's content width**, never as fixed pixel dimensions, so that a merchant who changes their content width sees every box scale and none change shape.

Each arrangement SHALL declare, per image, the share of the viewport that image will actually occupy in **that** arrangement, so a shopper never downloads artwork materially larger or smaller than what is painted. An arrangement MUST NOT inherit another arrangement's figures.

Only the first panel of a rotating slider SHALL be treated as priority artwork; the remaining panels MUST NOT compete with it for bandwidth.

Where an arrangement paints an image far wider than it is tall, it SHALL use the merchant's mobile artwork for that slot on small screens when one is on file, and the main artwork otherwise.

#### Scenario: Content width changes

- **WHEN** a merchant changes the store's content width
- **THEN** every box in the current hero arrangement keeps its shape and only changes size

#### Scenario: A wide panel on a phone

- **WHEN** a shopper on a phone loads a hero arrangement whose panel is much wider than it is tall, and mobile artwork is on file for it
- **THEN** the mobile artwork is rendered rather than the wide desktop artwork

### Requirement: An arrangement renders only the slots it uses, and collapses the rest

Each arrangement SHALL read only the artwork slots it renders. A slot an arrangement does not use SHALL be left unread, and the artwork in it MUST remain on file, unmodified, and MUST render again unchanged if the store returns to an arrangement that uses it.

Within an arrangement, a slot with no artwork SHALL collapse rather than render an empty box. When an arrangement has no artwork in any slot it uses, the hero SHALL render nothing at all rather than an empty band — **even if other slots, which this arrangement does not render, do contain artwork**.

#### Scenario: Unused slots are hidden, not emptied

- **WHEN** a store using the single-wide-panel arrangement has tile artwork on file
- **THEN** the hero renders the panel alone
- **AND** the tile artwork is still on file and unchanged

#### Scenario: A partially configured arrangement

- **WHEN** a store's arrangement uses a panel and three tiles, and only the panel has artwork
- **THEN** the panel renders and the tile row is omitted

#### Scenario: An arrangement with nothing to show

- **WHEN** a store's arrangement uses only the rotating panel, that panel has no artwork, and tile artwork exists in slots this arrangement does not render
- **THEN** the hero renders nothing

### Requirement: The storefront renders the layout it is served and defaults it only when unreachable

The storefront SHALL treat the layout in the settings payload as authoritative and MUST NOT re-derive it. The server resolves a store's layout on every read, and a second resolution here would be a divergent copy of that rule.

When the settings cannot be read at all, the storefront SHALL fall back to the **default** arrangement as part of the configuration it substitutes, so an outage serves the hero the store has always had rather than no hero.

#### Scenario: Settings unreachable

- **WHEN** the storefront cannot read the store's settings
- **THEN** the home page renders the default hero arrangement
