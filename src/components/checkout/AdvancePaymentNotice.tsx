import { BadgeCheck, CheckCircle2, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/types/order";

/**
 * What the confirmation tells a shopper who paid in advance.
 *
 * It exists because the surrounding page says the order "has been placed and is
 * now pending", which is true and, on its own, misleading: someone who has just
 * sent ৳130 by bKash reads "placed" as "on its way". It is not — it waits until
 * a person matches the reference against a statement, and that wait is what this
 * states. See server/openspec/changes/add-advance-payment-checkout.
 *
 * Shared by both confirmations rather than written into each. The signed-in page
 * renders on the server and the guest one in the browser, so the copy would
 * otherwise exist twice and drift — and this is the one message on the page that
 * must not be approximately right.
 *
 * Renders nothing on a cash-on-delivery order, which is every order on a store
 * with advance payment off.
 */
export default function AdvancePaymentNotice({ order }: { order: Order }) {
  const advance = order.advancePayment;
  if (!advance) return null;

  // A rejected claim. The shopper is out of pocket against an order that will
  // not ship, so the page points them at a person rather than at a status.
  if (advance.status === "FAILED") {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800">
        <XCircle size={18} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">We could not confirm your payment</p>
          <p className="mt-0.5">
            The {formatPrice(advance.amount)} you sent could not be matched to our
            records, so this order is on hold. Please get in touch with your
            transaction id and we will sort it out.
          </p>
        </div>
      </div>
    );
  }

  if (advance.status === "PAID") {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3.5 text-sm text-green-800">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">
            Payment of {formatPrice(advance.amount)} confirmed
          </p>
          {advance.balanceAmount > 0 && (
            <p className="mt-0.5">
              {formatPrice(advance.balanceAmount)} is due when your order arrives.
            </p>
          )}
        </div>
      </div>
    );
  }

  // PROCESSING — claimed and undecided, which is every order the moment it is
  // placed. The wait is stated as a fact about this order, not as a warning.
  return (
    <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-800">
      <BadgeCheck size={18} className="mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold">
          We are checking your payment of {formatPrice(advance.amount)}
        </p>
        <p className="mt-0.5">
          Your order is not confirmed yet — we match every payment against our own
          account first. You will see it move on once we have.
          {advance.balanceAmount > 0 && (
            <> {formatPrice(advance.balanceAmount)} will be due on delivery.</>
          )}
        </p>
      </div>
    </div>
  );
}
