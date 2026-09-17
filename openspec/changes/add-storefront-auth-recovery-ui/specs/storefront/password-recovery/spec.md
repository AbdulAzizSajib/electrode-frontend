## Purpose

Lets a customer who has forgotten their password get back into their account by email OTP, and lets a signed-in customer change the password they already have, without contacting the merchant.

## ADDED Requirements

### Requirement: Request a password reset code
The storefront SHALL offer a password reset screen, reachable without signing in and linked from the sign-in screen, where a customer submits their email address to receive a reset code.

The screen SHALL reject an empty or malformed email address before contacting the backend, and SHALL surface the backend's rejection message when the address is refused (unknown account, unverified email, or deactivated account).

#### Scenario: Reset code requested for a valid account
- **WHEN** a customer submits a registered, verified email address on the reset screen
- **THEN** the storefront advances to the code-entry step for that address
- **AND** the address entered is carried into that step without the customer retyping it

#### Scenario: Email address is malformed
- **WHEN** a customer submits an address that is not a valid email
- **THEN** the storefront shows a field-level validation error
- **AND** no request is sent to the backend

#### Scenario: Account cannot be reset
- **WHEN** the backend refuses the request because the account does not exist, is unverified, or is deactivated
- **THEN** the storefront shows the backend's message on the request step
- **AND** the customer remains on the request step with their entry intact

### Requirement: Complete a password reset with the emailed code
From the code-entry step the storefront SHALL accept a fixed-length numeric code and a new password, and on success SHALL return the customer to the sign-in screen with a confirmation that the password was changed.

The storefront MUST NOT treat a completed reset as a sign-in. Completing a reset ends every existing session for that account, so the customer SHALL be asked to sign in with the new password.

The new password field SHALL enforce the same minimum and maximum length the backend enforces, and the storefront SHALL keep those bounds as local constants declared to mirror the backend's rule.

#### Scenario: Correct code and acceptable password
- **WHEN** a customer submits the emailed code together with a new password that satisfies the length rules
- **THEN** the storefront navigates to the sign-in screen
- **AND** a confirmation states the password was changed and the customer should sign in

#### Scenario: Code is wrong or expired
- **WHEN** the backend rejects the submitted code
- **THEN** the storefront shows the rejection on the code step
- **AND** the code field is left ready for another attempt without discarding the typed password

#### Scenario: New password fails the length rules
- **WHEN** a customer submits a new password shorter or longer than the allowed range
- **THEN** the storefront shows a field-level validation error naming the bound
- **AND** no request is sent to the backend

### Requirement: Resend a password reset code
The code-entry step SHALL offer a resend action that requests a fresh code for the same address, confirm when one was sent, and report any failure in the same place as other errors on that step.

#### Scenario: Customer requests another code
- **WHEN** a customer triggers resend on the code step
- **THEN** the storefront confirms that a new code was sent to their email
- **AND** the code step remains open for entry

#### Scenario: Resend is refused
- **WHEN** the backend refuses the resend
- **THEN** the storefront shows the failure message on the code step
- **AND** the customer can still submit a code they already received

### Requirement: Change password while signed in
The storefront SHALL provide a change-password screen inside the account area, requiring a signed-in customer, that takes the current password and a new password.

The screen SHALL require the new password to differ from the current one, and SHALL confirm success in place rather than signing the customer out, because the backend reissues the session on a successful change.

#### Scenario: Current password is correct
- **WHEN** a signed-in customer submits their correct current password and a valid new password
- **THEN** the storefront confirms the password was changed
- **AND** the customer remains signed in and on the account area

#### Scenario: Current password is wrong
- **WHEN** the backend rejects the current password
- **THEN** the storefront shows the rejection above the fields
- **AND** every value the customer entered is preserved

#### Scenario: New password repeats the current one
- **WHEN** a customer submits a new password identical to the current password
- **THEN** the storefront shows a validation error
- **AND** no request is sent to the backend

#### Scenario: Guest opens the change-password screen
- **WHEN** a visitor without a session requests the change-password screen
- **THEN** they are redirected to the sign-in screen
- **AND** after signing in they are returned to the change-password screen
