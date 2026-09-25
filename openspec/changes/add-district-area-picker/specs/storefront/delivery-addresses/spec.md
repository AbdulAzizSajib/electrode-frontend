## Purpose

How a signed-in shopper's saved delivery addresses capture where they are, now that a destination is a district and an area chosen from a known list rather than a line of free text — and how addresses saved before that keep working.

## ADDED Requirements

### Requirement: A saved address captures a district and an area

The saved-address form SHALL collect the destination as a district and an area chosen from the same known list the checkout uses, and SHALL NOT ask for them as free text. The chosen destination SHALL be required, on the same terms the address's other required fields are.

#### Scenario: Shopper saves a new address

- **WHEN** a shopper fills in a new address and chooses a district and area
- **THEN** the address saves with both recorded, and shows them wherever the address is displayed

#### Scenario: Shopper saves without choosing

- **WHEN** a shopper submits the address form without choosing a district and area
- **THEN** the address is not saved and the form says a district and area are needed

#### Scenario: Shopper edits an address that already has one

- **WHEN** a shopper edits an address whose recorded district and area are both in the known list
- **THEN** the form opens with that destination already selected, and leaving it untouched saves it unchanged

### Requirement: An address saved before this change still works

An address recorded before destinations were chosen from a list SHALL remain usable: it SHALL display as saved, SHALL remain selectable at checkout, and SHALL NOT block an order. Its stored text SHALL NOT be reinterpreted, guessed at, or rewritten to a district and area on the shopper's behalf.

#### Scenario: Ordering to an older address

- **WHEN** a shopper selects a saved address whose destination is not a district and area from the list
- **THEN** checkout asks them to choose a delivery option instead of deriving one, and the order can be placed

#### Scenario: Older address is displayed

- **WHEN** an address saved before this change is shown in the address list
- **THEN** it reads as it was saved, with nothing invented to fill the district

#### Scenario: Editing an older address

- **WHEN** a shopper edits an address saved before this change
- **THEN** they are asked to choose a district and area before it can be saved again, and the rest of the address is preserved as entered

### Requirement: Choosing a saved address sets the checkout's destination

At checkout, selecting one of several saved addresses SHALL set the destination to that address's district and area, and switching between addresses SHALL move the destination — and therefore the delivery charge — with them.

#### Scenario: Switching between two saved addresses

- **WHEN** a shopper switches from an address in one delivery zone to an address in another
- **THEN** the delivery option and charge change to match the newly selected address, before the order is placed

#### Scenario: Adding an address during checkout

- **WHEN** a shopper adds a new address without leaving checkout and it becomes the selected one
- **THEN** its district and area become the destination and the delivery charge follows from them

#### Scenario: Selected address is the one charged

- **WHEN** an order is placed against a selected saved address
- **THEN** the delivery option charged is the one derived from that address, not from an address selected earlier in the same visit
