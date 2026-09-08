import type { Metadata } from "next";
import AuthCard from "@/components/account/AuthCard";
import LoginForm from "@/components/account/LoginForm";
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
  const { redirect } = await searchParams;
  const redirectTo = safeRedirect(
    typeof redirect === "string" ? redirect : undefined,
  );

  return (
    <AuthCard
      title="Sign In"
      subtitle="Sign in to track orders, save your wishlist and check out faster."
    >
      <LoginForm redirectTo={redirectTo} />
    </AuthCard>
  );
}
