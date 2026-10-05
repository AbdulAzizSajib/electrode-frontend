## Purpose

Ensures every Cloudinary-hosted image and video the storefront renders is requested at a size and format appropriate to where it is displayed, so no page downloads an original upload.

## ADDED Requirements

### Requirement: Every Cloudinary image is requested resized and auto-formatted
Every image the storefront renders from Cloudinary SHALL be requested with automatic format, automatic quality and a width bounded by its rendered size at up to 2x density. This covers product, category, banner and hero images, cart and checkout thumbnails, store logos, landing-page images, images embedded in rich-text content, and video posters. No storefront page SHALL request a Cloudinary image URL without a width transformation.

#### Scenario: Cart drawer thumbnail
- **WHEN** the cart drawer renders an 80 px product thumbnail on a desktop screen
- **THEN** the image requested is no wider than 160 px

#### Scenario: Header logo
- **WHEN** a page renders the store logo from a Cloudinary URL at 40 px tall
- **THEN** the logo URL carries `f_auto`, `q_auto` and a bounded width or height transformation

#### Scenario: Image inside a product description
- **WHEN** a product description contains an `<img>` whose `src` is a Cloudinary upload URL
- **THEN** the rendered `src` carries `f_auto`, `q_auto` and a width no greater than 1200 px, and the image loads lazily

#### Scenario: Video poster
- **WHEN** a product video renders with its Cloudinary-generated poster
- **THEN** the poster URL carries `f_auto`, `q_auto` and a bounded width

#### Scenario: Non-Cloudinary image is untouched
- **WHEN** an image `src` is not a Cloudinary upload URL
- **THEN** it is rendered unchanged

### Requirement: The first hero image loads immediately on every screen size
The first hero slide's image SHALL be requested eagerly with high fetch priority on both mobile and desktop, including when the merchant supplies separate mobile artwork. Only the artwork for the current screen size SHALL be downloaded.

#### Scenario: Mobile visitor with mobile artwork
- **WHEN** a visitor on a 390 px wide screen opens the home page and the first slide has mobile artwork
- **THEN** the mobile artwork is requested eagerly with high priority
- **AND** the desktop artwork for that slide is not downloaded

#### Scenario: Later slides stay lazy
- **WHEN** the home page loads
- **THEN** hero slides after the first are not requested until they approach the viewport

### Requirement: Product videos are delivered with automatic quality
A Cloudinary-hosted product or landing-page video SHALL be requested with automatic quality and codec selection rather than as the original upload.

#### Scenario: Product video playback
- **WHEN** a product page plays a video hosted on Cloudinary
- **THEN** the video URL carries `q_auto` and `vc_auto`
