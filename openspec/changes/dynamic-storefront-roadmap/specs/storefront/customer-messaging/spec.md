## Purpose

Defines how messages a shopper sends the merchant through the contact form, and requests to join the newsletter, are captured, acknowledged, and protected from abuse — so that a shopper who submits either is never silently ignored.

## ADDED Requirements

### Requirement: A contact message reaches the merchant and is acknowledged

A shopper SHALL be able to send the merchant a message consisting of their name, an email address to reply to, a subject, and the message body.

An accepted message MUST be recorded for the merchant to read; a submission that appears to succeed but is discarded MUST NOT occur. The shopper SHALL be told clearly whether the message was sent.

#### Scenario: Message is sent successfully

- **WHEN** a shopper submits a complete contact message
- **THEN** the message is recorded for the merchant
- **AND** the shopper is told it was sent

#### Scenario: A submission is never silently discarded

- **WHEN** a shopper submits a contact message
- **THEN** either the message is recorded and the shopper is told it was sent, or the shopper is told it failed
- **AND** no submission results in a success indication without being recorded

#### Scenario: Sending fails

- **WHEN** a shopper submits a contact message and it cannot be recorded
- **THEN** the shopper is told it was not sent
- **AND** the shopper's entered content is preserved so they can retry

#### Scenario: Guest can send a message

- **WHEN** a shopper who is not signed in submits a contact message
- **THEN** the message is accepted

### Requirement: Submitted values are validated before acceptance

A contact message MUST be refused if a required value is missing or if the reply address is not a well-formed email address.

The shopper SHALL be told which value is at fault. A refused submission MUST NOT be recorded.

#### Scenario: Required value missing

- **WHEN** a shopper submits a contact message without a required value
- **THEN** the submission is refused
- **AND** the shopper is told which value is missing

#### Scenario: Malformed reply address

- **WHEN** a shopper submits a contact message with an address that is not a well-formed email address
- **THEN** the submission is refused
- **AND** the shopper is told the address is not valid

#### Scenario: Refused submission is not recorded

- **WHEN** a submission is refused for a validation fault
- **THEN** no message is recorded for the merchant

### Requirement: A shopper can subscribe to and leave the newsletter

A shopper SHALL be able to subscribe to the newsletter by supplying an email address, and SHALL be able to unsubscribe.

Subscribing an address that is already subscribed MUST NOT create a duplicate subscription and MUST NOT be reported to the shopper as an error.

#### Scenario: Shopper subscribes

- **WHEN** a shopper submits a well-formed email address to the newsletter form
- **THEN** the address is recorded as subscribed
- **AND** the shopper is told they are subscribed

#### Scenario: Already-subscribed address

- **WHEN** a shopper subscribes an address that is already subscribed
- **THEN** no duplicate subscription is created
- **AND** the shopper is not shown an error

#### Scenario: Shopper unsubscribes

- **WHEN** a subscribed shopper unsubscribes
- **THEN** the address is no longer subscribed

#### Scenario: Malformed subscription address

- **WHEN** a shopper submits an address that is not a well-formed email address
- **THEN** the subscription is refused
- **AND** the shopper is told the address is not valid

### Requirement: Subscription status is not disclosed to strangers

A response to a subscription attempt MUST NOT reveal whether a given email address was already subscribed, so that the form cannot be used to test whether a particular person is a subscriber.

#### Scenario: Response does not distinguish new from existing

- **WHEN** an address is submitted to the newsletter form
- **THEN** the shopper is shown the same acknowledgement whether or not the address was already subscribed

### Requirement: Both forms are protected against abuse

Submissions to the contact form and the newsletter form SHALL be rate-limited, so that repeated automated submissions from the same origin are refused rather than recorded.

At least one further measure SHALL be applied to reject automated submissions. A submission identified as automated MUST NOT be recorded, and MUST NOT be reported to the submitter in a way that reveals how it was identified.

#### Scenario: Repeated submissions are limited

- **WHEN** submissions arrive repeatedly from the same origin beyond the permitted rate
- **THEN** further submissions are refused
- **AND** they are not recorded

#### Scenario: Automated submission is rejected

- **WHEN** a submission is identified as automated
- **THEN** it is not recorded
- **AND** the response does not reveal how it was identified

#### Scenario: A genuine shopper is not blocked

- **WHEN** a shopper submits a single contact message and later submits another
- **THEN** both are accepted
