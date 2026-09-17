## Purpose

Lets a customer sign in or sign up with their Google account, and establishes that account's session in the storefront's own cookies so the server-rendered signed-in chrome is correct on the very first page after the handshake.

## ADDED Requirements

### Requirement: Google sign-in entry point
The sign-in and registration screens SHALL each offer a Google sign-in action alongside the email form, visually separated from it so neither path looks like a step of the other.

Choosing it SHALL begin the handshake as a top-level browser navigation to the backend's Google entry endpoint, not as a background request, because the provider's redirect chain and the state cookie it depends on cannot complete inside one.

The storefront SHALL always pass the destination it wants the customer returned to, and that destination SHALL be the same one the email sign-in form would have used for that visit.

#### Scenario: Customer starts Google sign-in
- **WHEN** a customer activates the Google action on the sign-in screen
- **THEN** the browser navigates to the backend's Google entry endpoint
- **AND** the request carries the storefront destination for this visit

#### Scenario: Sign-in was reached with a redirect target
- **WHEN** a customer was sent to the sign-in screen from a protected page and then chooses Google
- **THEN** the destination passed to the backend is that protected page
- **AND** the customer lands on it once the handshake completes

### Requirement: Storefront session established after the handshake
The storefront SHALL expose a callback route that the Google handshake returns to, which SHALL establish the customer's session in the storefront's own cookies before any page renders for them.

This is required rather than incidental: the backend sets its session cookies on its own origin, so in any deployment where the storefront and the backend are not same-site, a customer returned straight to a storefront page would be rendered as signed out despite holding a valid backend session.

The callback SHALL be reachable by a visitor who has no storefront session, and SHALL NOT be treated as a guest-only screen that redirects an already-signed-in visitor away.

#### Scenario: Handshake succeeds
- **WHEN** the callback is reached with a valid backend session
- **THEN** the storefront writes its own session cookies for that customer
- **AND** the customer is redirected to the destination they started from
- **AND** the first rendered page shows them as signed in

#### Scenario: Callback reached without a usable backend session
- **WHEN** the callback cannot establish a session from what the backend returned
- **THEN** the customer is redirected to the sign-in screen carrying a failure reason
- **AND** no storefront session cookie is written

#### Scenario: Destination is off-site or malformed
- **WHEN** the callback is asked to return the customer to a destination that is not a path within this storefront
- **THEN** the customer is sent to the account area instead
- **AND** no off-site redirect is issued

### Requirement: OAuth failures are explained on the sign-in screen
The sign-in screen SHALL recognise the failure reasons the backend reports after an abandoned or failed Google handshake and render each as a message a customer can act on, never as a bare code and never as a silent return to an empty form.

An unrecognised reason SHALL still produce a generic sign-in failure message rather than nothing.

#### Scenario: Backend reports a known failure
- **WHEN** the customer arrives at the sign-in screen carrying a failure reason the storefront recognises
- **THEN** a message explaining that failure is shown above the sign-in form
- **AND** the email sign-in form remains usable

#### Scenario: Backend reports an unrecognised failure
- **WHEN** the failure reason is one the storefront does not recognise
- **THEN** a generic sign-in failure message is shown
- **AND** the reason is not rendered verbatim to the customer

#### Scenario: Customer abandons the Google screen
- **WHEN** a customer cancels at the provider and is returned with a failure reason
- **THEN** the sign-in screen explains the sign-in did not complete
- **AND** no session cookie is written
