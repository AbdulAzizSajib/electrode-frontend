import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import { getCurrentUser } from "@/lib/current-user";
import { getStoreSettings } from "@/services/store-settings";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return resolveMetadata({
    settings,
    routeGroup: "account",
    fallbackTitle: "Change Password",
  });
}

export default async function ChangePasswordPage() {
  const user = await getCurrentUser();

  // The proxy already gates everything under /account, but it only decodes the
  // token optimistically — this is the check that actually confirms the session.
  if (!user) {
    redirect("/account/login?redirect=/account/password");
  }

  return (
    <div className="container-px mx-auto flex max-w-md flex-col py-16">
      <Link
        href="/account"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-brand"
      >
        <ChevronLeft size={16} />
        Back to account
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-gray-900">Change Password</h1>
      <p className="mb-8 text-sm text-gray-500">
        Signed in as{" "}
        <span className="font-medium text-gray-700">{user.email}</span>.
      </p>

      <ChangePasswordForm />
    </div>
  );
}
