## 1. Types and server actions

- [x] 1.1 Add `ForgetPasswordPayload`, `ResetPasswordPayload` and `ChangePasswordPayload` to `src/types/auth.ts`, mirroring `server/src/app/module/auth/auth.validation.ts`; verify `npm run build --workspace nextjs` type-checks them against the action signatures added below.
- [x] 1.2 Add `PASSWORD_MIN_LENGTH = 6` / `PASSWORD_MAX_LENGTH = 50` and `OTP_LENGTH = 4` as shared constants with a comment naming `auth.validation.ts` as their source of truth; verify the existing `VerifyEmailForm` consumes `OTP_LENGTH` from there instead of its own local copy.
- [x] 1.3 Add `forgetPasswordAction(email)` to `src/services/auth.ts` returning `ActionResult`, following the existing try/`ApiError`/fallback-message shape; verify a request for an unregistered address returns `{ ok: false }` with the backend's message rather than throwing.
- [x] 1.4 Add `resendPasswordResetOtpAction(email)` hitting `POST /auth/resend-password-reset-otp`; verify it mirrors `resendVerificationOtpAction` exactly apart from the path.
- [x] 1.5 Add `resetPasswordAction({ email, otp, newPassword })` hitting `POST /auth/reset-password`; verify it does NOT call `setAuthCookies` — per design Decision 4 the endpoint returns no tokens and destroys every session.
- [x] 1.6 Add `changePasswordAction({ currentPassword, newPassword })` hitting `POST /auth/change-password` with the forwarded auth cookie header, storing the reissued trio via `setAuthCookies` and calling `revalidatePath("/", "layout")`; verify a successful change leaves the customer signed in on the next render.

## 2. Shared OTP component

- [x] 2.1 Extract the code input, length validation, resend button and notice/error surface from `src/components/account/VerifyEmailForm.tsx` into `src/components/account/OtpForm.tsx`, taking submit and resend actions as props and accepting extra fields as children; verify the component renders with no caller-specific logic left inside it.
- [x] 2.2 Rewrite `VerifyEmailForm` to use `OtpForm`, keeping its sign-in-on-success behaviour; verify the existing login → unverified-email → OTP path still signs the customer in and redirects to `redirectTo`.

## 3. Forgot-password flow

- [x] 3.1 Create `src/components/account/ForgotPasswordForm.tsx` as a two-step client component: email entry, then `OtpForm` with a new-password field; verify the email entered in step one is carried into step two without retyping.
- [x] 3.2 Validate the email client-side before calling the action and the new password against the length constants; verify a malformed email and an out-of-range password each produce a field error with no network request.
- [x] 3.3 On successful reset, navigate to `/account/login` with a confirmation banner telling the customer to sign in with the new password; verify no session cookie is written and the customer is not treated as signed in.
- [x] 3.4 Create `src/app/(shop)/account/forgot-password/page.tsx` using `AuthCard` plus `generateMetadata` via `resolveMetadata` with `routeGroup: "account"`, matching the login page; verify the "Forgot password?" link on the sign-in form now resolves instead of 404ing.

## 4. Change-password flow

- [x] 4.1 Create `src/components/account/ChangePasswordForm.tsx` with current-password and new-password fields, rejecting a new password equal to the current one before submitting; verify the equality check fires with no network request.
- [x] 4.2 Preserve every entered value when the backend rejects the current password, showing the message above the fields; verify a wrong current password leaves both fields populated.
- [x] 4.3 Create `src/app/(shop)/account/password/page.tsx` guarded by `getCurrentUser()`, confirming success in place rather than signing out; verify a signed-out visitor is redirected to `/account/login?redirect=/account/password` and returned there after signing in.
- [x] 4.4 Link the change-password page from `src/app/(shop)/account/page.tsx`; verify the link appears for a signed-in customer.

## 5. Google sign-in

- [x] 5.1 Create `src/components/account/GoogleSignInButton.tsx` rendering a plain anchor to `${NEXT_PUBLIC_API_BASE_URL}/auth/login/google?redirect=/account/oauth/callback?next=<destination>` (properly encoded), with a comment recording why it must be a top-level navigation and not `proxyRequest`; verify clicking it performs a full-page navigation, not a `fetch`.
- [x] 5.2 Add the button plus a visual divider to `LoginForm` and `RegisterForm`, passing the same `redirectTo` the email form uses; verify a customer sent to sign-in from a protected page has that page carried through as `next`.
- [x] 5.3 Create `src/app/(shop)/account/oauth/callback/route.ts`: forward the incoming `Cookie` header to `POST /auth/refresh-token`, write the returned trio with `setAuthCookies`, and redirect to `safeRedirect(next, "/account")`; verify the first page after the handshake server-renders the signed-in header.
- [x] 5.4 On a missing or rejected backend session in the callback, redirect to `/account/login?error=oauth_failed` and write no cookies; verify no partial session is left behind when the refresh call fails.
- [x] 5.5 Document in the route file why the exchange goes through `refresh-token` (design Decision 1) and that a replayed callback URL is expected to fail; verify the comment names the alternatives that were rejected.

## 6. Routing and error surfacing

- [x] 6.1 Exempt `/account/oauth/callback` from `PROTECTED_ROUTES` in `src/proxy.ts`, checked before the protected-prefix match, and keep it out of `AUTH_ROUTES`; verify both a signed-out and an already-signed-in visitor reach the callback without being redirected.
- [x] 6.2 Add an OAuth error map to the sign-in page covering `oauth_failed`, `no_session_found` and `no_user_found` with a generic fallback; verify an unrecognised `?error=` value renders the generic message and is never echoed verbatim.
- [x] 6.3 Add a `/login` → `/account/login` redirect preserving the query string, since the backend's `handleOAuthError` targets `/login`; verify `/login?error=oauth_failed` lands on the sign-in page with the mapped message shown.

## 7. Verification

- [x] 7.1 Run `npm run lint --workspace nextjs` and `npm run test --workspace nextjs`; verify both pass with no new warnings in the touched files.
- [ ] 7.2 Walk the reset flow end to end against a running backend — request code, enter code plus new password, sign in with it; verify the old password is refused afterwards.
- [ ] 7.3 Walk the Google flow end to end from a protected page; verify the customer lands back on that page signed in, and that the header renders signed-in on the first load without a manual refresh.
- [x] 7.4 Confirm every constant mirroring the backend (`OTP_LENGTH`, password bounds) matches `server/src/app/module/auth/auth.validation.ts`; verify by reading both files side by side.
