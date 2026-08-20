import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="container-px mx-auto flex max-w-2xl flex-col items-center py-24 text-center">
      <CheckCircle2 size={56} className="mb-4 text-green-500" />
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Order placed!</h1>
      <p className="mb-8 text-gray-500">
        This is a UI-only confirmation — no order was actually processed. Connect a backend and
        payment provider to make this checkout flow real.
      </p>
      <Link href="/products" className="rounded bg-brand px-6 py-3 text-sm font-semibold text-white">
        Continue Shopping
      </Link>
    </div>
  );
}
