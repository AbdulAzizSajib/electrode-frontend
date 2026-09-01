## Purpose

Governs how a product's images relate to the option a shopper has selected — which images are shown for a given selection, what selecting an image does to that selection, and how the gallery behaves when a product's images carry no option information.

## ADDED Requirements

### Requirement: The gallery shows the images relevant to the selected option
When a shopper selects one of a product's options, the gallery SHALL show the images depicting that option together with the images that belong to the product as a whole, and SHALL NOT show images depicting a different option. The image displayed SHALL move to the first image of the newly-selected option, so what is on screen always depicts what is selected.

#### Scenario: Choosing an option changes the images shown
- **WHEN** a shopper on a product with per-option photography selects a different option
- **THEN** the gallery shows that option's images alongside the images shared by the whole product
- **AND** images depicting other options are no longer shown

#### Scenario: The displayed image follows the selection
- **WHEN** the shopper selects an option while viewing an image that does not depict it
- **THEN** the displayed image becomes the first image of the newly-selected option

#### Scenario: Shared images remain available for every option
- **WHEN** a product has images that depict no particular option, such as packaging or a size chart
- **THEN** those images appear in the gallery for every option the shopper selects

### Requirement: Selecting an image selects the option it depicts
Selecting an image that depicts a specific option SHALL select that option, and every detail presented for the shopper's selection — price, any compare-at price and resulting discount, stock and availability, and product code — SHALL update to describe the option now selected. Selecting an image that depicts no particular option SHALL change only the image displayed, leaving the current selection intact.

#### Scenario: Choosing a photo of another option switches to it
- **WHEN** a shopper viewing one option selects a thumbnail depicting a different option
- **THEN** that option becomes the selected one
- **AND** the price, discount, availability, and product code shown all describe the newly-selected option

#### Scenario: Choosing a shared photo does not change the selection
- **WHEN** a shopper selects a thumbnail that depicts no particular option
- **THEN** the image displayed changes and the selected option is unchanged

#### Scenario: The two controls never disagree
- **WHEN** the shopper has selected an option by any means, whether through the option control or by selecting an image
- **THEN** the option control and the displayed image describe the same option

### Requirement: The gallery is never empty because of how images were assigned
A product SHALL always present at least one image. When the selected option has neither images of its own nor any shared images to fall back on, the gallery SHALL show the product's full image set rather than nothing.

#### Scenario: An option with no images of its own
- **WHEN** a shopper selects an option that has no images assigned to it, on a product that has shared images
- **THEN** the gallery shows the shared images

#### Scenario: An option with nothing to fall back on
- **WHEN** a shopper selects an option that has no images assigned to it, on a product where every image is assigned to some other option
- **THEN** the gallery shows the product's full image set rather than an empty gallery

#### Scenario: A product with no images at all
- **WHEN** a shopper views a product that has no images
- **THEN** the gallery shows a placeholder, as it does today, and selecting an option does not change that

### Requirement: Products without per-option images behave as an unfiltered gallery
When none of a product's images depict a particular option — which is the case for every product until its images are assigned — the gallery SHALL present the full image set unfiltered, and selecting an option SHALL leave the displayed image unchanged. Adding option-aware behaviour SHALL NOT alter the experience of products that carry no option information.

#### Scenario: An unassigned product is unaffected
- **WHEN** a shopper views a product whose images depict no particular option and selects a different option
- **THEN** the same full set of images remains shown in the same order, and the displayed image does not change
- **AND** the price, availability and product code update for the selected option as they do today

#### Scenario: A product without options
- **WHEN** a shopper views a product that has no options to choose between
- **THEN** the gallery shows every image and behaves exactly as it does today

### Requirement: The gallery behaves consistently wherever it appears
The behaviour defined by this capability SHALL apply wherever a shopper chooses an option alongside a gallery, including the product detail view and the in-listing preview. An action that carries a chosen product forward, such as proceeding directly to checkout, SHALL carry the image the shopper is currently viewing rather than a fixed first image.

#### Scenario: The in-listing preview matches the detail view
- **WHEN** a shopper selects an option in the preview shown from a listing
- **THEN** the preview's gallery responds exactly as the detail view's gallery does

#### Scenario: Proceeding to checkout carries the viewed image
- **WHEN** a shopper selects an option, views one of its images, and proceeds directly to checkout for that product
- **THEN** the image carried forward is the one being viewed, not a fixed first image of the product
