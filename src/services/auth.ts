"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch } from "@/lib/api-client";
import { isTokenExpired } from "@/lib/jwt";
import {
  buildAuthCookieHeader,
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/session";
import type {
  ActionResult,
  AuthData,
  AuthUser,
  LoginPayload,
  RegisterPayload,
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
 * Exchanges the refresh token for a new token trio. Returns false when the
 * refresh token is missing or itself rejected, i.e. the user must sign in again.
 */
export async function refreshSession(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken || isTokenExpired(refreshToken)) return false;

  try {
    const cookie = await buildAuthCookieHeader();
    const { data } = await apiFetch<{
      accessToken: string;
      refreshToken: string;
      sessionToken: string;
    }>("/auth/refresh-token", { method: "POST", cookie });

    await setAuthCookies({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      token: data.sessionToken,
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Current signed-in customer, or null. Call from Server Components to render
 * account-aware UI; it transparently refreshes an expired access token once.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  if (isTokenExpired(accessToken) && !(await refreshSession())) {
    return null;
  }

  try {
    const cookie = await buildAuthCookieHeader();
    if (!cookie) return null;

    const { data } = await apiFetch<AuthUser>("/auth/me", { cookie });
    return data;
  } catch {
    return null;
  }
}
