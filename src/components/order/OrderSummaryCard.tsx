import { formatPrice } from "@/lib/format";
import { formatAddress, toAddress } from "@/types/address";
import type { Order } from "@/types/order";

/**
 * The recorded contents of an order — items, the amounts actually charged, and
 * where it is going.
 *
 * Shared by the signed-in confirmation (server-rendered), the guest
 * confirmation and order tracking (both client-rendered). One component so the
 * three cannot drift: a guest who cannot sign in to check later should see the
 * same details a signed-in shopper does, not a reduced version.
 *
 * Presentational only — it takes an already-loaded `Order` and never fetches,
 * which is what lets it render on either side of the boundary.
 */
export default function OrderSummaryCard({ order }: { order: Order }) {
  const address = order.shippingAddress ? toAddress(order.shippingAddress) : null;

  return (
    <>
      <div className="mt-10 rounded-xl border border-gray-200 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Items</h2>
        <ul className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {item.quantity} × {formatPrice(item.unitPrice)}
                  {item.sku ? ` · ${item.sku}` : ""}
                </p>
              </div>
              <span className="whitespace-nowrap text-sm font-semibold text-gray-900">
                {formatPrice(item.totalPrice)}
              </span>
            </li>
          ))}
        </ul>

        {/* The recorded amounts, not the pre-order estimate. */}
        <dl className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
          <div className="flex items-center justify-between text-gray-600">
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex items-center justify-between text-green-700">
              <dt>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</dt>
              <dd>-{formatPrice(order.discountAmount)}</dd>
            </div>
          )}
          <div className="flex items-center justify-between text-gray-600">
            <dt>Shipping</dt>
            <dd>{formatPrice(order.shippingAmount)}</dd>
          </div>
          <div className="flex items-center justify-between text-gray-600">
            <dt>Tax</dt>
            <dd>{formatPrice(order.taxAmount)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
            <dt>Total</dt>
            <dd className="text-sale">{formatPrice(order.totalAmount)}</dd>
          </div>
          {order.paymentMethod === "COD" && (
            <div className="flex items-center justify-between pt-1 text-gray-600">
              <dt>Payment</dt>
              <dd className="font-medium text-gray-900">Cash on delivery</dd>
            </div>
          )}
        </dl>
      </div>

      {address && (
        <div className="mt-6 rounded-xl border border-gray-200 p-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Delivering to</h2>
          <p className="text-sm font-medium text-gray-900">{address.fullName}</p>
          <p className="mt-0.5 text-sm text-gray-500">{address.phone}</p>
          <p className="mt-0.5 text-sm text-gray-600">{formatAddress(address)}</p>
          {order.notes && (
            <p className="mt-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">Note:</span> {order.notes}
            </p>
          )}
        </div>
      )}
    </>
  );
}
