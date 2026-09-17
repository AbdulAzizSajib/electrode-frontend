"use client";

import { useRouter } from "next/navigation";
import OtpForm from "@/components/account/OtpForm";
import { resendVerificationOtpAction, verifyEmailAction } from "@/services/auth";

/**
 * The email-verification step of registration, and of a sign-in that turned out
 * to be for an unverified account.
 *
 * Verifying also signs the customer in — the endpoint returns the token trio
 * and `verifyEmailAction` stores it — which is the one thing that distinguishes
 * this from the password-reset use of the same `OtpForm`.
 */
export default function VerifyEmailForm({
  email,
  redirectTo,
  heading = "Verify your email",
  description,
}: {
  email: string;
  redirectTo: string;
  heading?: string;
  description?: string;
}) {
  const router = useRouter();

  return (
    <OtpForm
      email={email}
      heading={heading}
      description={description}
      submitLabel="Verify & Continue"
      pendingLabel="Verifying..."
      onResend={() => resendVerificationOtpAction(email)}
      onSubmit={async (otp) => {
        const result = await verifyEmailAction({ email, otp });
        if (!result.ok) return result;

        // Verifying also signs the user in, so go straight to the destination.
        router.replace(redirectTo);
        // The header's signed-in state is server-rendered, so refresh to re-run it.
        router.refresh();

        return result;
      }}
    />
  );
}
