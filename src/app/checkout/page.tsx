import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getMyAddresses } from "@/services/address";
import { getCurrentUser } from "@/services/auth";
import { getServerCart } from "@/services/cart";
import { getStoreSettings } from "@/services/store-settings";

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

  const [addresses, cart, settings] = await Promise.all([
    // Session-scoped endpoint — it rejects a guest, so it is not called for one.
    isSignedIn ? getMyAddresses() : Promise.resolve([]),
    getServerCart(),
    getStoreSettings(),
  ]);

  const checkout = settings.checkoutConfig;

  /*
   * When the merchant requires sign-in, send a guest there before rendering a
   * form they cannot submit. The cart is untouched by this and the redirect
   * carries them back here afterwards.
   *
   * This is a courtesy, not the enforcement: the API refuses a guest order with
   * a 401 on its own, so a request that never loads this page is refused all
   * the same.
   */
  if (!isSignedIn && !checkout.allowGuestCheckout) {
    redirect("/account/login?redirect=/checkout");
  }

  return (
    <CheckoutForm
      isSignedIn={isSignedIn}
      initialAddresses={addresses}
      initialCart={cart}
      checkout={checkout}
    />
  );
}
