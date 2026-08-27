import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getMyAddresses } from "@/services/address";
import { getCurrentUser } from "@/services/auth";
import { getServerCart } from "@/services/cart";
import { getShippingMethods } from "@/services/shipping";

export const metadata: Metadata = {
  title: "Checkout - Electrode",
};

export default async function CheckoutPage() {
  // An order belongs to an account, and both the order and address endpoints
  // reject a guest — so sign-in is required before anything else is fetched.
  // Signing in merges the guest cart into the account, so nothing is lost.
  const user = await getCurrentUser();
  if (!user) {
    redirect("/account/login?redirect=/checkout");
  }

  const [shippingMethods, addresses, cart] = await Promise.all([
    getShippingMethods(),
    getMyAddresses(),
    getServerCart(),
  ]);

  return (
    <CheckoutForm
      shippingMethods={shippingMethods}
      initialAddresses={addresses}
      initialCart={cart}
    />
  );
}
