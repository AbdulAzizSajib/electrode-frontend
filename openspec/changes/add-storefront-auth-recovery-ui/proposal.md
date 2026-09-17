## Why

The backend already exposes every endpoint a customer needs to recover or change a password and to sign in with Google (`/auth/forget-password`, `/auth/reset-password`, `/auth/change-password`, `/auth/login/google`), but the storefront wires up none of them. `LoginForm` links to `/account/forgot-password` and `proxy.ts` already treats that path as a guest-only route — yet the page does not exist, so the link 404s. A customer who forgets their password today has no way back into their account, and a customer who prefers Google has no way in at all.

## What Changes

- Add a **Continue with Google** button to the sign-in and registration screens, plus a storefront-owned OAuth callback route that converts the backend's session into this app's own httpOnly cookies. The backend redirects to `FRONTEND_URL` after setting cookies on *its* domain; without a callback that re-establishes the session locally, a split-domain deploy returns the user to a storefront that still renders them as signed out.
- Add `/account/forgot-password`: request a reset OTP by email, then enter the 4-digit code and a new password in a second step, with resend.
- Add `/account/password`: a signed-in change-password form (current password + new password) in the account area.
- Extract the existing OTP entry UI from `VerifyEmailForm` so the reset step and the email-verification step share one code input, resend timer and error surface.
- Surface OAuth failure codes (`oauth_failed`, `no_session_found`, `no_user_found`) as readable messages on the sign-in page instead of an unexplained bounce.
- Add the server actions these screens call (`forgetPasswordAction`, `resetPasswordAction`, `resendPasswordResetOtpAction`, `changePasswordAction`) to `src/services/auth.ts`, following the existing `ActionResult` convention.

No backend changes. Every endpoint, OTP lifetime and password rule already exists in `server/src/app/module/auth`; this change is the storefront half.

## Capabilities

### New Capabilities
- `storefront/password-recovery`: signed-out password reset by email OTP, and signed-in password change.
- `storefront/social-sign-in`: Google sign-in entry points, the storefront OAuth callback that establishes the local session, and OAuth error reporting.

### Modified Capabilities
<!-- None. No storefront auth capability has been specified yet, so both capabilities above are new. -->

## Impact

- **New routes**: `src/app/(shop)/account/forgot-password/page.tsx`, `src/app/(shop)/account/password/page.tsx`, `src/app/(shop)/account/oauth/callback/route.ts`.
- **New components**: `ForgotPasswordForm`, `ChangePasswordForm`, `GoogleSignInButton`, and an `OtpForm` extracted from `VerifyEmailForm`.
- **Modified**: `src/services/auth.ts` (four new actions), `src/types/auth.ts` (payload types), `src/components/account/LoginForm.tsx` and `RegisterForm.tsx` (Google button + OAuth error banner), `src/app/(shop)/account/page.tsx` (link to change password).
- **`src/proxy.ts`**: `/account/password` must join the protected-prefix list; `/account/oauth/callback` must be reachable while signed out and must not be bounced by the guest-only redirect that already covers `/account/login`.
- **Env**: the storefront needs the backend's public origin to build the Google sign-in URL as a top-level navigation (the OAuth handshake cannot go through the `proxyRequest` pass-throughs). `NEXT_PUBLIC_API_BASE_URL` already carries it.
- **Backend**: unchanged. Two existing backend defaults are storefront-visible and are handled on this side — `googleLogin` defaults its redirect to `/dashboard` (not a storefront route) and `handleOAuthError` redirects to `/login` (not `/account/login`), so the storefront always passes an explicit `redirect` and treats `/login` as an alias.
