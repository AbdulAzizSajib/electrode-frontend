import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, MapPin, Package, ShoppingBag } from "lucide-react";
import LogoutButton from "@/components/account/LogoutButton";
import { getCurrentUser } from "@/services/auth";

export const metadata: Metadata = {
  title: "My Account - Electrode",
};

const shortcuts = [
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/track-order", label: "Track Order", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
];

export default async function AccountPage() {
  const user = await getCurrentUser();

  // The proxy already gates this route, but it only decodes the token
  // optimistically — this is the check that actually confirms the session.
  if (!user) {
    redirect("/account/login?redirect=/account");
  }

  return (
    <div className="container-px mx-auto max-w-3xl py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Signed in as{" "}
            <span className="font-medium text-gray-700">{user.email}</span>
          </p>
        </div>
        <LogoutButton />
      </div>

      <dl className="mt-8 grid gap-4 rounded border border-gray-200 p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-gray-400">Name</dt>
          <dd className="mt-1 text-sm font-medium text-gray-800">{user.name}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-gray-400">
            Contact number
          </dt>
          <dd className="mt-1 text-sm font-medium text-gray-800">
            {user.contactNumber ?? "Not added"}
          </dd>
        </div>
      </dl>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {shortcuts.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded border border-gray-200 px-4 py-4 text-sm font-medium text-gray-700 transition-colors hover:border-brand hover:text-brand"
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
