"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";

/**
 * Lets a signed-in customer cancel their own order, behind a confirmation.
 *
 * ALWAYS MOUNTED by the order detail page, with `cancellable` deciding whether
 * the button shows. If it were mounted only while cancellable, a refusal — whose
 * refresh brings back a status that is no longer cancellable — would unmount it
 * and take the reason with it, leaving the customer with no explanation. The
 * BACKEND still decides; `cancellable` only hides the button.
 *
 * After the request — succeeded or refused — the page is refreshed so the status
 * shown is the one the server re-read, never one this component inferred. A
 * refusal also shows the backend's reason, because the usual cause is that staff
 * moved the order on while the page was open.
 *
 * A 504 from the proxy means the request timed out with the outcome unknown: the
 * cancel may have landed. That is reported as unknown and the page refreshed,
 * instead of inviting a second click.
 *
 * See server/openspec/changes/add-storefront-order-history, design.md Decision 5.
 */
export default function CancelOrderButton({
  orderId,
  orderNumber,
  cancellable,
}: {
  orderId: string;
  orderNumber: string;
  cancellable: boolean;
}) {
  const router = useRouter();
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [message, setMessage] = useState("");

  async function cancel() {
    setIsCancelling(true);
    setMessage("");

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/cancel`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        setMessage(
          response.status === 504
            ? "We couldn't confirm whether your order was cancelled. The page has been refreshed to show its current status."
            : body?.message || "Your order could not be cancelled. Please try again.",
        );
      }
    } catch {
      setMessage("Unable to reach the server. Please try again.");
    } finally {
      setIsCancelling(false);
      setIsOpen(false);
      router.refresh();
    }
  }

  if (!cancellable && !message) return null;

  return (
    <div>
      {cancellable && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          Cancel order
        </button>
      )}

      {message && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {message}
        </p>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (!isCancelling) setIsOpen(false);
        }}
        labelledById={titleId}
      >
        <div className="p-6">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900">
            Cancel order #{orderNumber}?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            This cannot be undone. If you still want these items, you will need to
            place a new order.
          </p>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isCancelling}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Keep order
            </button>
            <button
              type="button"
              onClick={cancel}
              disabled={isCancelling}
              className="inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-70"
            >
              {isCancelling && <Loader2 size={14} className="animate-spin" />}
              {isCancelling ? "Cancelling..." : "Yes, cancel order"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
