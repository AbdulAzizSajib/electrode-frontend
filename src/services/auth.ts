"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api-client";
import { isTokenExpired } from "@/lib/jwt";
import {
  buildAuthCookieHeader,
  clearAuthCookies,
  getAccessToken,
  setAuthCookies,
} from "@/lib/session";
import type {
  ActionResult,
  AuthData,
  AuthUser,
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from "@/types/auth";

/**
 * Auth server actions.
 *
 * Why server-side rather than calling the API from the browser: the backend
 * sets its auth cookies on its *own* domain, so in any deployment where the API
 * isn't same-site with this app the browser would either drop them or make them
 * unreadable to our Server Components. Instead we POST from the server, read
 * the tokens out of the response *body* (the backend returns them there too),
 * and set httpOnly cookies on our own domain.
 */

/**
 * Detects the "account exists but was never verified" rejection
 * (better-auth's `requireEmailVerification`) so we can send the user to the OTP
 * screen instead of showing a dead-end error. Prefers the stable error code and
 * falls back to the message, since the code isn't guaranteed on every path.
 */
function isEmailNotVerified(error: ApiError): boolean {
  return (
    error.code === "EMAIL_NOT_VERIFIED" ||
    /not verified|verify your email/i.test(error.message)
  );
}

export async function loginAction(
  payload: LoginPayload,
): Promise<ActionResult<{ needsVerification?: boolean; email?: string }>> {
  const email = payload.email.trim().toLowerCase();

  try {
    const { data } = await apiFetch<AuthData>("/auth/login", {
      method: "POST",
      body: { email, password: payload.password },
    });

    await setAuthCookies(data);

    // The header renders the signed-in state from the cookie, so any cached
    // render of it is now stale.
    revalidatePath("/", "layout");

    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError && isEmailNotVerified(error)) {
      return { ok: true, needsVerification: true, email };
    }

    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : "Sign in failed. Please try again.",
    };
  }
}

export async function registerAction(
  payload: RegisterPayload,
): Promise<ActionResult<{ email: string }>> {
  const email = payload.email.trim().toLowerCase();

  try {
    // Registration returns the user but no tokens — the account isn't usable
    // until the emailed OTP is verified, which is what issues the session.
    await apiFetch<{ user: AuthUser }>("/auth/register", {
      method: "POST",
      body: {
        name: payload.name.trim(),
        email,
        password: payload.password,
        contactNumber: payload.contactNumber.trim(),
      },
    });

    return { ok: true, email };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : "Registration failed. Please try again.",
    };
  }
}

/** Verifying the OTP both confirms the email and logs the user in. */
export async function verifyEmailAction(
  payload: VerifyEmailPayload,
): Promise<ActionResult> {
  try {
    const { data } = await apiFetch<AuthData>("/auth/verify-email", {
      method: "POST",
      body: {
        email: payload.email.trim().toLowerCase(),
        otp: payload.otp.trim(),
      },
    });

    await setAuthCookies(data);
    revalidatePath("/", "layout");

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : "Verification failed. Please try again.",
    };
  }
}

export async function resendVerificationOtpAction(
  email: string,
): Promise<ActionResult> {
  try {
    await apiFetch("/auth/resend-verification-otp", {
      method: "POST",
      body: { email: email.trim().toLowerCase() },
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : "Could not resend the code. Please try again.",
    };
  }
}

/**
 * Asks the backend to email a password reset code.
 *
 * The backend refuses an unknown, unverified or deactivated account with a
 * message naming the reason, and that message is passed through rather than
 * flattened into a generic "check your email" — this storefront is not trying
 * to hide whether an address is registered, and the backend already does not.
 */
export async function forgetPasswordAction(
  email: string,
): Promise<ActionResult> {
  try {
    await apiFetch("/auth/forget-password", {
      method: "POST",
      body: { email: email.trim().toLowerCase() },
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : "Could not send the reset code. Please try again.",
    };
  }
}

export async function resendPasswordResetOtpAction(
  email: string,
): Promise<ActionResult> {
  try {
    await apiFetch("/auth/resend-password-reset-otp", {
      method: "POST",
      body: { email: email.trim().toLowerCase() },
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : "Could not resend the code. Please try again.",
    };
  }
}

/**
 * Completes a reset with the emailed code.
 *
 * It deliberately does NOT sign the customer in, and must not be "improved" to.
 * The endpoint returns no tokens, and `AuthService.resetPassword` ends by
 * deleting every session for the account — a reset is what someone does when
 * they think their account is compromised, so signing every device back out is
 * the point. The caller sends them to sign in with the new password.
 */
export async function resetPasswordAction(
  payload: ResetPasswordPayload,
): Promise<ActionResult> {
  try {
    await apiFetch("/auth/reset-password", {
      method: "POST",
      body: {
        email: payload.email.trim().toLowerCase(),
        otp: payload.otp.trim(),
        newPassword: payload.newPassword,
      },
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : "Could not reset your password. Please try again.",
    };
  }
}

/**
 * Changes the password of the signed-in customer.
 *
 * Unlike a reset, this one keeps them signed in: the backend reissues the token
 * trio in the response body, so the new cookies are stored here. Without that,
 * the session cookie the backend just rotated would no longer match the one we
 * hold and the very next request would be signed out.
 */
export async function changePasswordAction(
  payload: ChangePasswordPayload,
): Promise<ActionResult> {
  try {
    const cookie = await buildAuthCookieHeader();
    if (!cookie) {
      return { ok: false, message: "Your session has expired. Please sign in again." };
    }

    const { data } = await apiFetch<Partial<AuthData>>("/auth/change-password", {
      method: "POST",
      cookie,
      body: {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      },
    });

    await setAuthCookies(data ?? {});
    revalidatePath("/", "layout");

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof ApiError
          ? error.message
          : "Could not change your password. Please try again.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  try {
    const cookie = await buildAuthCookieHeader();
    if (cookie) {
      await apiFetch("/auth/logout", { method: "POST", cookie });
    }
  } catch {
    // A failed server-side logout must not strand the user in a signed-in UI —
    // clearing our own cookies below is what actually ends the session here.
  }

  await clearAuthCookies();
  revalidatePath("/", "layout");
}

/**
 * Current signed-in customer, or null. Call from Server Components to render
 * account-aware UI.
 *
 * It does NOT renew an expired session, and must not try. It used to: it asked
 * the backend for new tokens and then wrote them with `cookies().set()`, which
 * throws during a Server Component render. The throw was swallowed, so the
 * backend kept issuing tokens nobody could store and the page rendered signed
 * out. `proxy.ts` renews the session before the render starts and hands the
 * fresh cookies to it, so a token read here has already been renewed if it
 * could be — still expired means renewal was refused or unavailable, and this
 * request is signed out.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const accessToken = await getAccessToken();
  if (!accessToken || isTokenExpired(accessToken)) return null;

  try {
    const cookie = await buildAuthCookieHeader();
    if (!cookie) return null;

    const { data } = await apiFetch<AuthUser>("/auth/me", { cookie });
    return data;
  } catch {
    return null;
  }
}
