import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getMyAddresses } from "@/services/address";
import { getCurrentUser } from "@/services/auth";
import { getServerCart } from "@/services/cart";
import { getShippingMethods } from "@/services/shipping";

export const metadata: Metadata = {
  title: "Checkout - Electrode",
};

export default async function CheckoutPage() {
  // Checkout no longer requires an account — the API accepts a guest order
  // carrying its own contact and delivery details. The session is still read,
  // but only to decide which form to show: saved addresses for a signed-in
  // shopper, inline fields for a guest.
  const user = await getCurrentUser();
  const isSignedIn = Boolean(user);

  const [shippingMethods, addresses, cart] = await Promise.all([
    getShippingMethods(),
    // Session-scoped endpoint — it rejects a guest, so it is not called for one.
    isSignedIn ? getMyAddresses() : Promise.resolve([]),
    getServerCart(),
  ]);

  return (
    <CheckoutForm
      isSignedIn={isSignedIn}
      shippingMethods={shippingMethods}
      initialAddresses={addresses}
      initialCart={cart}
    />
  );
}
