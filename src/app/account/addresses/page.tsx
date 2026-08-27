import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AddressList from "@/components/account/AddressList";
import { getCurrentUser } from "@/services/auth";

export const metadata: Metadata = {
  title: "Delivery Addresses - Electrode",
};

export default async function AddressesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/account/login?redirect=/account/addresses");
  }

  return (
    <div className="container-px mx-auto max-w-3xl py-16">
      <Link
        href="/account"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand"
      >
        <ChevronLeft size={16} /> Back to account
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-gray-900">Delivery Addresses</h1>
      <p className="mb-8 text-sm text-gray-500">
        Manage where your orders are delivered. Your default address is selected
        automatically at checkout.
      </p>

      <AddressList />
    </div>
  );
}
