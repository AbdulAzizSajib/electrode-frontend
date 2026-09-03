<!-- `storefront/product-gallery` was introduced by the change
     `sync-product-gallery-with-variant`, which has never been archived, so
     `openspec/specs/storefront/product-gallery/spec.md` does not exist yet.
     The requirements this delta removes and replaces are therefore stated
     against that change's delta, which is the only place they currently live.
     No `## Purpose` section appears here: the capability is not new, and its
     Purpose — how a product's images relate to the option a shopper has
     selected — still describes it accurately after this change. -->

## REMOVED Requirements

### Requirement: The gallery shows the images relevant to the selected option

**Reason**: Filtering the gallery to the selected variant's images deletes the rest of the product's photography from the page. On the common authoring shape — one photo per variant and no shared photos — the filtered list holds exactly one image, which also collapses the thumbnail strip, leaving the shopper with a single photo and no route to the others. The intent behind the requirement, that the image on screen depicts what is selected, is preserved by the replacement requirement below without hiding anything.

**Migration**: Replaced by "The gallery shows the product's whole image set" and "Selecting an option leads with that option's image". No data changes: images continue to carry the variant they depict, and that information now drives ordering and lead-image selection instead of visibility.

### Requirement: The gallery is never empty because of how images were assigned

**Reason**: The fallback ladder existed only to rescue the filtering rule from producing an empty gallery. With filtering removed, the visible set is always the product's full image set, so a selection can no longer empty it and the ladder has nothing left to guard against.

**Migration**: Replaced by "The gallery shows the product's whole image set", which guarantees the same outcome directly. The behaviour for a product with genuinely no images is unchanged and is restated there.

### Requirement: Products without per-option images behave as an unfiltered gallery

**Reason**: This requirement carved out an exception for products whose images carry no variant information, guaranteeing them an unfiltered gallery. Every product now gets an unfiltered gallery, so the exception describes the general rule and no longer distinguishes anything.

**Migration**: Subsumed by "The gallery shows the product's whole image set". Products with no per-option images continue to behave exactly as they do today.

## ADDED Requirements

### Requirement: The gallery shows the product's whole image set

The gallery SHALL show every image belonging to a product, regardless of which option is selected. Selecting an option SHALL NOT remove any image from the gallery, and no image SHALL be unreachable to a shopper because of the option they currently have selected.

A product with more than one image SHALL present a thumbnail for each of them. A product with exactly one image SHALL present no thumbnail strip, since there is nothing to choose between.

A product with no images SHALL show a placeholder, and selecting an option SHALL NOT change that.

#### Scenario: Every photo stays reachable

- **WHEN** a shopper views a product with one photo per option and no shared photos
- **THEN** the gallery shows a thumbnail for every one of those photos
- **AND** selecting any option leaves all of them shown

#### Scenario: The thumbnail strip survives a selection

- **WHEN** a shopper selects an option on a product with four images
- **THEN** the thumbnail strip is still shown with all four thumbnails

#### Scenario: A genuinely single-image product

- **WHEN** a shopper views a product that has only one image
- **THEN** no thumbnail strip is shown

#### Scenario: A product with no images

- **WHEN** a shopper views a product that has no images
- **THEN** a placeholder is shown, and selecting an option does not change it

#### Scenario: The same photo used for two options

- **WHEN** a product uses the same image file for more than one option
- **THEN** the gallery renders without error

### Requirement: Selecting an option leads with that option's image

Selecting an option SHALL move the displayed image to an image depicting that option, so that what is on screen depicts what is selected. The thumbnail strip SHALL be ordered so that the selected option's images come first, keeping the image the shopper just selected adjacent to the option control rather than buried among the others.

When the selected option has no image of its own, the displayed image SHALL remain unchanged rather than jumping to an unrelated photo.

#### Scenario: The displayed image follows the selection

- **WHEN** a shopper selects an option while viewing an image that depicts a different one
- **THEN** the displayed image becomes an image depicting the newly-selected option

#### Scenario: The selected option's images lead the strip

- **WHEN** a shopper selects an option that has images of its own
- **THEN** that option's images appear first in the thumbnail strip
- **AND** the product's remaining images follow them

#### Scenario: An option with no image of its own

- **WHEN** a shopper selects an option that has no image depicting it
- **THEN** the displayed image does not change
- **AND** every image remains shown in the strip

#### Scenario: A product whose images depict no option

- **WHEN** a shopper selects an option on a product whose images carry no option information
- **THEN** the displayed image does not change and the strip order is unchanged
- **AND** the price, availability and product code update for the selected option

### Requirement: Selecting an image selects the option it depicts

Selecting an image that depicts a specific option SHALL select that option, and every detail presented for the shopper's selection — price, any compare-at price and resulting discount, stock and availability, and product code — SHALL update to describe the option now selected. Selecting an image that depicts no particular option SHALL change only the image displayed, leaving the current selection intact.

This is the mechanism by which a shopper browses a product's options by eye, and it SHALL work from any thumbnail in the strip, including one depicting an option other than the currently selected one.

#### Scenario: Choosing a photo of another option switches to it

- **WHEN** a shopper viewing one option selects a thumbnail depicting a different option
- **THEN** that option becomes the selected one
- **AND** the price, discount, availability, and product code shown all describe the newly-selected option

#### Scenario: Browsing options through the thumbnails

- **WHEN** a shopper selects each thumbnail of a product in turn
- **THEN** each selection that depicts an option selects it, and the details shown follow

#### Scenario: Choosing a shared photo does not change the selection

- **WHEN** a shopper selects a thumbnail that depicts no particular option
- **THEN** the image displayed changes and the selected option is unchanged

#### Scenario: The two controls never disagree

- **WHEN** the shopper has selected an option by any means, whether through the option control or by selecting an image
- **THEN** the option control and the displayed image describe the same option

### Requirement: The gallery behaves consistently wherever it appears

The behaviour defined by this capability SHALL apply wherever a shopper chooses an option alongside a gallery, including the product detail view and the in-listing preview. An action that carries a chosen product forward, such as proceeding directly to checkout, SHALL carry the image the shopper is currently viewing rather than a fixed first image.

#### Scenario: The in-listing preview matches the detail view

- **WHEN** a shopper selects an option in the preview shown from a listing
- **THEN** the preview's gallery responds exactly as the detail view's gallery does

#### Scenario: Proceeding to checkout carries the viewed image

- **WHEN** a shopper selects an option, views one of its images, and proceeds directly to checkout for that product
- **THEN** the image carried forward is the one being viewed, not a fixed first image of the product
