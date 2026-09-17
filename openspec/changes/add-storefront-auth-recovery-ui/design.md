# Design — storefront auth recovery and Google sign-in

## Context

See `proposal.md — Why`. The backend half is complete and unchanged by this
change; what follows is only how the storefront reaches it.

Three existing facts shape every decision below:

1. **The storefront owns its own session cookies.** `src/services/auth.ts`
   POSTs to the backend from the server, reads `accessToken` / `refreshToken` /
   `token` out of the *response body*, and writes them as httpOnly cookies on
   the storefront's own domain via `setAuthCookies`. It never relies on the
   backend's `Set-Cookie`, because the backend sets cookies on its own origin.
2. **The Google handshake is a browser redirect chain, and it returns no body.**
   `GET /auth/login/google` → Google → `GET /auth/google/success`, which sets
   the backend's cookies and then issues a 302 to `FRONTEND_URL`. Nothing in
   that chain hands the storefront a token it can read.
3. **`POST /auth/refresh-token` returns the token trio in its body.** It reads
   `refreshToken` + `better-auth.session_token` from the request cookies and
   responds with `{ accessToken, refreshToken, sessionToken }` in `data`. That
   is the one endpoint that converts "the browser holds backend cookies" into
   "the storefront can read tokens", and it is what makes a callback route
   possible without touching `server/`.

Two backend defaults are visible from here and must be absorbed, not fixed:
`googleLogin` defaults `?redirect` to `/dashboard`, and `handleOAuthError`
redirects to `/login` — neither is a storefront route.

## Goals / Non-Goals

**Goals:**

- A Google sign-in that leaves the *storefront's* cookies set, so the first
  server render after the handshake already shows the signed-in header.
- Password reset and change built out of the pieces already here —
  `apiFetch`, the `ActionResult` convention, `form-controls`, `safeRedirect` —
  rather than a parallel set.
- One OTP entry component, shared by email verification and password reset.

**Non-Goals:**

- Any change to `server/`. The backend contract is taken as given, including
  its two unhelpful redirect defaults.
- Additional social providers. `ICourierProvider`-style pluggability is
  deliberately not introduced for a single provider.
- Password strength rules beyond the backend's length bounds. Adding a rule the
  backend does not enforce would reject passwords the API accepts.
- Account linking (a Google sign-in landing on an email account that already
  exists). better-auth decides that server-side; the storefront renders whatever
  it decides.

## Decisions

### Decision 1 — The OAuth callback is a storefront Route Handler that trades backend cookies for a token body

`GET /account/oauth/callback` is a Route Handler, not a page. It is the
destination the storefront asks the backend to return to, passed as
`?redirect=/account/oauth/callback?next=<real destination>`.

It does exactly one thing: forward the browser's *backend* cookies to
`POST /auth/refresh-token`, read the trio out of the response body, write them
with `setAuthCookies`, and 302 to `safeRedirect(next)`.

Alternatives considered:

- **Return the customer straight to the destination page.** Works only when the
  storefront and the API are same-site so the backend's cookies come along and
  `getCurrentUser` succeeds. In a split-domain deploy — the case
  `auth-cookies.ts` already hardens for with `SameSite=None` — the customer
  lands signed out while holding a perfectly valid backend session. Rejected as
  a deploy-shaped failure that passes on localhost.
- **Have the backend redirect with tokens in the query string.** Puts a bearer
  credential in a URL, which is logged by proxies, kept in history, and leaks in
  `Referer`. Also requires a `server/` change. Rejected.
- **A one-time exchange code minted by the backend.** Correct, and what a
  larger system would do, but it needs a new backend endpoint and a store for
  the codes. Rejected as out of proportion; the refresh endpoint already does
  the job.

A Route Handler rather than a page because there is nothing to render: it must
write cookies and redirect, and a page that redirects during render cannot
also set cookies.

### Decision 2 — The handshake is a top-level navigation, never `proxyRequest`

The Google button is a plain link to
`${NEXT_PUBLIC_API_BASE_URL}/auth/login/google?redirect=...`, not a `fetch`.

The backend's own comment on `googleLogin` records why it starts the flow
server-side: a client-side fetch sets better-auth's state cookie in an XHR
context, and browsers may not send it back on the callback navigation, which
produces `please_restart_the_process` → `oauth_failed`. Routing the handshake
through `src/lib/api-proxy.ts` would reintroduce exactly that, and would also
have the proxy — which builds its header set from scratch — swallow the 302 to
Google. The proxy's own docstring already scopes it to browser-initiated API
calls, not redirect chains.

### Decision 3 — `next` carries the real destination; `redirect` carries the callback

The backend appends its `?redirect` value to `FRONTEND_URL` verbatim, so the
storefront passes `/account/oauth/callback?next=<destination>` and keeps the
true destination in `next`. That absorbs the `/dashboard` default: the
storefront always sends an explicit `redirect`, so the default is never used,
and the callback validates `next` through `safeRedirect` before honouring it —
the value survives a round trip through two redirects and a third-party site,
so it is treated as untrusted on return exactly as it is on the login page.

`safeRedirect`'s default fallback is `/`; the callback passes `/account` as the
fallback instead, since a customer who just signed in is heading somewhere
account-shaped.

### Decision 4 — Reset completes at the sign-in screen, not signed in

`AuthService.resetPassword` ends with
`prisma.session.deleteMany({ where: { userId } })` — every session for that
account is destroyed, deliberately, because a password reset is what someone
does when they suspect their account is compromised. The endpoint returns no
tokens.

So the reset flow must not pretend to sign the customer in. It redirects to
`/account/login` with a confirmation banner. This is the one place where reset
and email-verification diverge: `verifyEmailAction` *does* receive tokens and
signs the customer straight in.

### Decision 5 — One OTP component, two callers

`VerifyEmailForm` already owns code entry, length validation against
`OTP_LENGTH = 4`, resend, and the notice/error surface. The reset flow needs all
of it plus a password field. Rather than a second near-copy that will drift,
extract the shared part into an `OtpForm` that takes the submit action, the
resend action, and optional extra fields as children.

The alternative — parameterising `VerifyEmailForm` with a `mode` prop — was
rejected because the two modes differ in their *outcome* (one signs in, one
redirects to sign-in), and a component whose success path is decided by a prop
is harder to read than two callers of a shared input.

`OTP_LENGTH` stays a local constant mirroring `auth.validation.ts`, per the
repo's standing rule that both frontends mirror backend limits and carry the
obligation to keep them in step. Password bounds (6–50) get the same treatment.

### Decision 6 — `proxy.ts` gets the callback on neither list

`/account/oauth/callback` sits under `/account`, which is in
`PROTECTED_ROUTES`, and the whole point is that it is reached by someone who is
*not yet* signed in on this domain. It therefore needs an explicit exemption
checked before the protected-prefix match, or the proxy bounces the customer to
`/account/login` at the exact moment the handshake was about to succeed — a
redirect loop that looks like Google rejecting the sign-in.

It must equally not join `AUTH_ROUTES`: a customer who already has a storefront
session but is re-authenticating with Google would be bounced to `/account`
before the callback could write the new cookies.

`/account/password` joins nothing — it is under `/account` and is correctly
protected by the existing prefix.

### Decision 7 — OAuth error codes are mapped, never rendered raw

The sign-in page reads `?error=` and maps the three codes the backend emits
(`oauth_failed`, `no_session_found`, `no_user_found`) to customer-readable
sentences, with a generic fallback for anything unrecognised. Rendering the raw
value would put backend vocabulary in front of a shopper and would echo an
attacker-supplied query string into the page.

Because `handleOAuthError` redirects to `/login` rather than `/account/login`,
the storefront adds a redirect from `/login` to `/account/login` that preserves
the query string. A redirect rather than a second sign-in page, so there is one
canonical sign-in URL.

## Risks / Trade-offs

- **The callback depends on the browser sending the backend's cookies to
  `/auth/refresh-token`.** → It does: the callback forwards the incoming request's
  `Cookie` header, and the handshake has just set those cookies on the backend's
  origin via a top-level navigation. If they are missing, the callback redirects
  to sign-in with a failure reason rather than writing a partial session.
- **`refresh-token` rotates the refresh token.** Calling it as the handshake's
  final step invalidates nothing the customer still holds locally — they have no
  storefront session yet — but it does mean a *replayed* callback URL fails on
  the second use. That is the desired behaviour, and it is stated here so nobody
  "fixes" it later.
- **Password bounds are duplicated in three places** (backend Zod, storefront
  constant, and the field's copy). → Same trade-off the repo already accepts for
  `SETTINGS_LIMITS` and `FALLBACK_SETTINGS`; the constant carries a comment
  naming `auth.validation.ts` as its source of truth.
- **A reset signs the customer out of every device.** → Intended, and the
  confirmation copy says so, so it does not read as a bug.
- **Google sign-in cannot merge a guest cart the way email login does** — the
  backend's `googleLoginSuccess` calls `mergeGuestCartIfPresent` with the
  request's own cookies, which are present during the handshake, so this
  actually works. Noted because it is the kind of thing a callback-based flow
  usually breaks: the merge happens on the backend before the redirect, not in
  the storefront callback.

## Migration Plan

Additive. Every route, component and action is new except the edits to
`LoginForm`, `RegisterForm`, `proxy.ts` and `services/auth.ts`. No data
migration, no backend deploy. Rolling back is removing the new routes and
reverting those four files; nothing persists state that would outlive it.

`/account/forgot-password` is already referenced by `LoginForm` and already
listed in `AUTH_ROUTES`, so shipping it turns an existing 404 into a working
page rather than changing any behaviour that currently works.

## Open Questions

- Whether the Google button should also appear on the checkout sign-in prompt.
  Deferred: it does not change any requirement here, and the checkout flow is
  deliberately guest-friendly.
