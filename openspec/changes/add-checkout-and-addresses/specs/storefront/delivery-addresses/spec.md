## Purpose

Defines how a shopper manages the delivery addresses saved to their account — creating, editing, choosing which is used by default, and removing them — and how those addresses are kept private to the shopper who owns them.

## ADDED Requirements

### Requirement: Addresses belong to their owner

Saved addresses SHALL be private to the shopper who created them. A shopper SHALL see only their own addresses, and MUST NOT be able to view, change, or delete an address belonging to anyone else.

Managing addresses SHALL require the shopper to be signed in. A shopper who is not signed in SHALL be asked to sign in rather than shown an error.

#### Scenario: Shopper sees only their own addresses

- **WHEN** a signed-in shopper views their saved addresses
- **THEN** only addresses they created are listed

#### Scenario: Not signed in

- **WHEN** a shopper who is not signed in tries to manage addresses
- **THEN** they are asked to sign in
- **AND** after signing in they arrive at the address management they were trying to reach

#### Scenario: Another shopper's address is unreachable

- **WHEN** a shopper attempts to open or modify an address that is not theirs
- **THEN** the request is refused and no details of that address are revealed

### Requirement: Shoppers can save a delivery address

A shopper SHALL be able to save a delivery address by providing at minimum a recipient name, a contact phone number, a street address, and a city. Remaining details — a second address line, state or region, postal code, and country — SHALL be optional.

Required fields SHALL be validated before submission, and the shopper SHALL be told which field needs attention rather than being shown a generic failure.

#### Scenario: Saving a complete address

- **WHEN** a shopper submits an address with recipient name, phone, street address, and city
- **THEN** the address is saved and appears in their list of addresses

#### Scenario: A required field is missing

- **WHEN** a shopper submits an address with a required field left blank
- **THEN** they are told which field needs attention
- **AND** nothing is saved

#### Scenario: The service rejects the address

- **WHEN** saving fails
- **THEN** the shopper is told it did not save
- **AND** the details they entered are preserved so they can retry without re-typing

### Requirement: Shoppers can edit and delete their addresses

A shopper SHALL be able to change any detail of a saved address and to delete an address they no longer use. Editing SHALL start from the address's current values rather than an empty form.

Deleting SHALL be confirmed before it takes effect, since it cannot be undone.

#### Scenario: Editing an address

- **WHEN** a shopper edits a saved address
- **THEN** the form opens pre-filled with its current details
- **AND** the saved address reflects their changes afterwards

#### Scenario: Deleting an address

- **WHEN** a shopper deletes an address and confirms
- **THEN** it no longer appears in their list

#### Scenario: Deletion is confirmed first

- **WHEN** a shopper triggers deletion but does not confirm
- **THEN** the address remains saved

### Requirement: One address is the default

A shopper SHALL be able to mark one of their addresses as the default. Marking an address as default SHALL clear that status from whichever address previously held it, so exactly one is default at a time.

The first address a shopper saves SHALL become their default. Where a default exists, it SHALL be the address pre-selected wherever a delivery address is needed.

#### Scenario: Setting a default

- **WHEN** a shopper marks an address as default
- **THEN** that address is shown as the default
- **AND** the previously default address is no longer marked as such

#### Scenario: First address becomes default

- **WHEN** a shopper saves their first address
- **THEN** it becomes their default

#### Scenario: Default is pre-selected

- **WHEN** a shopper reaches a point where a delivery address must be chosen
- **THEN** their default address is already selected

### Requirement: The address list communicates its state

Where a shopper has no saved addresses, they SHALL be shown that clearly along with a way to add one, rather than an empty region.

While addresses are loading, or while a change is being saved, the shopper SHALL be given visible feedback, and a control that triggers a change SHALL NOT be actionable twice while that change is in flight.

#### Scenario: No addresses yet

- **WHEN** a shopper with no saved addresses views their addresses
- **THEN** they are shown that none are saved and offered a way to add one

#### Scenario: Feedback while saving

- **WHEN** a shopper saves an address
- **THEN** the control indicates the save is in progress
- **AND** it cannot be triggered again until the save completes

#### Scenario: Addresses cannot be loaded

- **WHEN** the shopper's addresses cannot be retrieved
- **THEN** they are told so, distinctly from being told they have none saved
