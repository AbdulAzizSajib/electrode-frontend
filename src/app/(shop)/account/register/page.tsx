import type { Metadata } from "next";
import AuthCard from "@/components/account/AuthCard";
import RegisterForm from "@/components/account/RegisterForm";
import { safeRedirect } from "@/lib/redirect";
import { getStoreSettings } from "@/services/store-settings";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return resolveMetadata({
    settings,
    routeGroup: "account",
    fallbackTitle: "Create Account",
  });
}

export default async function RegisterPage({
  searchParams,
}: PageProps<"/account/register">) {
  const { redirect } = await searchParams;
  const redirectTo = safeRedirect(
    typeof redirect === "string" ? redirect : undefined,
  );

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join Electrode to check out faster and keep track of your orders."
    >
      <RegisterForm redirectTo={redirectTo} />
    </AuthCard>
  );
}
