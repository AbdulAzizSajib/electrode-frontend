import type { Metadata } from "next";
import AuthCard from "@/components/account/AuthCard";
import ForgotPasswordForm from "@/components/account/ForgotPasswordForm";
import { getStoreSettings } from "@/services/store-settings";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return resolveMetadata({
    settings,
    routeGroup: "account",
    fallbackTitle: "Reset Password",
  });
}

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your email and we'll send you a code to set a new password."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
