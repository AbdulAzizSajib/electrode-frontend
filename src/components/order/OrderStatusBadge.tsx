import clsx from "clsx";
import type { OrderStatus } from "@/types/order";

/**
 * An order's status as a coloured pill, for the signed-in order history.
 *
 * An unlisted status still renders — in neutral grey, as its lowercased name —
 * because the backend can gain a status before this storefront does, and
 * `types/order.ts` promises that every render site survives that.
 */
const TONE: Partial<Record<OrderStatus, string>> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-blue-50 text-blue-700",
  PACKED: "bg-indigo-50 text-indigo-700",
  SHIPPED: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-green-50 text-green-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        TONE[status] ?? "bg-gray-100 text-gray-600",
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}
