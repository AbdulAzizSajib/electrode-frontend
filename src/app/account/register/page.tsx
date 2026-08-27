import type { Metadata } from "next";
import AuthCard from "@/components/account/AuthCard";
import RegisterForm from "@/components/account/RegisterForm";
import { safeRedirect } from "@/lib/redirect";

export const metadata: Metadata = {
  title: "Create Account - Electrode",
};

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
