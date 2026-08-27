import type { Metadata } from "next";
import AuthCard from "@/components/account/AuthCard";
import LoginForm from "@/components/account/LoginForm";
import { safeRedirect } from "@/lib/redirect";

export const metadata: Metadata = {
  title: "Sign In - Electrode",
};

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
