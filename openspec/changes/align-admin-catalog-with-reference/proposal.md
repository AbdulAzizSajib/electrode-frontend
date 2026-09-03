## Why

Creating a product in the admin has become too complex to use. It is a six-step wizard that demands everything at once — basics, organization, pricing, variants, images, review — before anything can be saved. The variants step is the worst of it: a merchant selling dresses must retype "Size: S, M, XL" on every single product, because options are defined *inside* each product and cannot be reused.

That design has already produced a real failure. Authoring options on an existing product regenerated its variants and silently reset four of them to zero stock, because the generator matched rows by option-value combination and legacy variants had no combination to match on. The product went to "Sold out" on the storefront while the admin still showed stock. A merchant would have no way to understand what happened.

A working reference admin panel solves both problems with a shape we can adopt: attributes are defined **once for the whole shop** and ticked on individual products, and a product is saved **before** its variants and gallery are authored, so the variant editor always has a real product to attach to.

The catalog is also missing most of what that panel's Product menu offers. A merchant has no way to define tax rules, shipping rules, collections, or bundle deals, and sub-categories are only reachable by editing a category's parent field.

## What Changes

- **BREAKING: attributes become shop-wide.** A new global Attribute (Colour, Size, Weight) with ordered values, defined once and reused across products. The current per-product `ProductOption`/`ProductOptionValue` model is removed and its data migrated into the global one.
- **A product's variants are chosen by ticking attribute values.** Ticking Colour → Red, Green and Size → S, M generates the four combinations as rows. This replaces the "Generate variants" button, and — critically — an existing row keeps its price, stock, SKU and images when the selection changes, which is the defect that zeroed the stock.
- **BREAKING: the six-step wizard becomes one scrolling form.** Every field a product needs — title, slug, prices, category, brand, descriptions, SEO, rules, collections — sits on a single page the merchant scrolls through, with the main image, video and gallery in a sidebar beside it. The wizard's step-by-step gating is removed: it hid fields behind clicks without reducing what had to be filled in.
- **Variants and gallery are authored after the product exists.** The inventory section sits below the form and appears once the product has been saved, because a variant cannot reference a product that has no id. This is what removes the wizard's need to hold every variant in memory before the first save.
- **Variants keep their SKU, images, compare-at price and stock.** The reference panel's variant carries only price and quantity; ours carries more, and the storefront already depends on it — variant images drive the product gallery. Only the authoring interaction is adopted, not the reduced data model.
- **Sub-categories get their own list and form.** The hierarchy already exists on `Category.parentId`; only the admin surface is missing.
- **New: tax rules.** A named flat or percentage tax, selected per product. Replaces the single store-wide tax rate.
- **New: shipping rules.** A named rule holding a list of places, each with its own country/state, price, delivery days, and optional pickup point and pickup price. Selected per product. The current `ShippingMethod` is a flat price with no geography.
- **New: collections.** A named, slugged grouping a product can belong to many of — merchandising groups independent of the category tree.
- **New: bundle deals.** A "buy N, get M free" rule attached to a product.
- **Coupons are renamed Vouchers in the admin.** Our `Coupon` already carries every field the reference voucher has; this is a label and route change, not a new model.
- **The Product menu is regrouped** to match the reference: Categories, Sub categories, Brands, Attributes, Tax rules, Shipping rules, Collections, Bundle deals, Vouchers, Products.
- **New product fields: unit, badge, refundable, warranty.** Unit describes what is being sold ("1 kg", "500 ml"); badge is a short label the storefront shows on the card ("New", "Hot"); refundable and warranty are yes/no facts a shopper needs before buying.
- **New: product tags.** Free-form keywords with autocomplete over tags already used in the shop, so a merchant reuses "wireless" rather than inventing "Wireless" beside it.
- **New: product video.** An uploaded video with its own thumbnail, shown alongside the gallery.
- **Descriptions become rich text.** Overview and description are authored in a formatting editor rather than a plain textarea, since a product description that cannot carry a list or a bold line is not usable for real copy. The storefront must render the stored markup without becoming an injection route.

## Capabilities

### New Capabilities
- `admin/product-attributes`: What a shop-wide attribute is, how its values are ordered, how a product selects them, and how selecting or deselecting a value affects the variants that already exist — including the rule that an existing variant's price, stock, SKU and images survive a change to the selection.
- `admin/product-authoring`: The shape of the product form — a single scrolling page rather than a gated wizard, what a merchant must supply to create a product, which parts become available only once it exists, and what happens to work in progress if creation fails. Also covers the product facts a merchant records (unit, badge, refundable, warranty, tags) and the rich-text authoring of its descriptions.
- `admin/catalog-rules`: Tax rules and shipping rules — what each is, how a shipping rule's places are matched to an order's destination, what happens when several match or none do, and what happens to products still referencing a rule being deleted.
- `admin/product-grouping`: Collections and bundle deals — how a product joins a collection, what a bundle deal promises, and how each behaves when deleted while products reference it.

### Modified Capabilities
- `storefront/product-options`: The requirement that a product's options are defined per product is replaced by selection from shop-wide attributes. What the shopper sees — named, ordered controls resolving to one variant, unavailable values shown rather than hidden — is unchanged, so most requirements are restated only where they name the source of the options.

## Impact

**`electrode-server`**
- New models: `Attribute`, `AttributeValue`, `TaxRule`, `ShippingRule`, `ShippingPlace`, `Collection`, `ProductCollection`, `BundleDeal`, `Tag`, `ProductTag`. New product fields for the tax rule, shipping rule and bundle deal references, plus `unit`, `badge`, `isRefundable`, `hasWarranty`, `video` and `videoThumbnail`.
- A video upload endpoint alongside the existing image upload.
- Removed models: `ProductOption`, `ProductOptionValue` — replaced by `ProductVariantOptionValue` pointing at the global `AttributeValue`.
- **A data migration, not just a schema one.** Every existing per-product option must become a global attribute and its variants relinked, or products lose their variants. This is the highest-risk part of the change.
- Checkout changes: tax comes from the product's tax rule rather than the store setting, and shipping from a matched shipping place rather than a flat method.
- New CRUD modules for each new entity, following the existing five-file convention.

**`electrode-admin`**
- `product-form-page.tsx` is rewritten: the six-step wizard becomes one scrolling form with a media sidebar, and the variants step becomes an attribute-tick-plus-combination-table editor below it. This is the largest single file in the change.
- A rich-text editor component, which the panel does not currently have — a new dependency.
- A tag input with autocomplete.
- New list and form pages for attributes, sub-categories, tax rules, shipping rules, collections and bundle deals.
- Coupons renamed to Vouchers; sidebar regrouped.

**`electrode-nextjs`**
- `Product.options` is now derived from the attributes a product selects. The shopper-facing option controls and `product-options.ts` resolution keep working, but their input shape changes.
- Checkout reflects the new tax and shipping sources.
- The product page renders the new facts (unit, badge, refundable, warranty), the video, and rich-text descriptions — the last of which must be sanitised before rendering, since it is admin-authored markup reaching a shopper's browser.

**Not in scope**
- Flash sales, which the reference panel has as its own menu section.
- Voucher behaviour at checkout beyond the admin rename.
- Per-variant weight or barcode.
- Multi-language catalog fields, which the reference panel supports via `*_langs` tables.
- Storefront presentation of collections, tags and video beyond rendering what a product carries; new listing pages built on them are separate work.
