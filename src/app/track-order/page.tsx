"use client";

export default function TrackOrderPage() {
  return (
    <div className="container-px mx-auto max-w-md py-20">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Track Your Order</h1>
      <p className="mb-8 text-sm text-gray-500">
        Order tracking isn&apos;t connected yet. Wire this form up to your backend order system.
      </p>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <input
          placeholder="Order number"
          className="w-full rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand"
        />
        <input
          placeholder="Email"
          type="email"
          className="w-full rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand"
        />
        <button className="w-full rounded bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark">
          Track Order
        </button>
      </form>
    </div>
  );
}
