import type { Metadata } from "next";
import AuthCard from "@/components/account/AuthCard";
import LoginForm from "@/components/account/LoginForm";
import { oauthErrorMessage } from "@/lib/oauth-errors";
import { safeRedirect } from "@/lib/redirect";
import { getStoreSettings } from "@/services/store-settings";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return resolveMetadata({
    settings,
    routeGroup: "account",
    fallbackTitle: "Sign In",
  });
}

export default async function LoginPage({
  searchParams,
}: PageProps<"/account/login">) {
  const { redirect, error, reset } = await searchParams;
  const redirectTo = safeRedirect(
    typeof redirect === "string" ? redirect : undefined,
  );

  // Mapped, never rendered raw — see lib/oauth-errors.ts.
  const oauthError = oauthErrorMessage(
    typeof error === "string" ? error : undefined,
  );

  // Set by the reset flow, which deliberately does not sign the customer in:
  // the backend ends every session on a successful reset.
  const notice =
    reset === "1"
      ? "Your password has been changed. Sign in with your new password."
      : undefined;

  return (
    <AuthCard
      title="Sign In"
      subtitle="Sign in to track orders, save your wishlist and check out faster."
    >
      <LoginForm
        redirectTo={redirectTo}
        notice={notice}
        oauthError={oauthError}
      />
    </AuthCard>
  );
}
