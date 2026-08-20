import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  return (
    <div className="container-px mx-auto flex max-w-3xl flex-col items-center py-24 text-center">
      <Heart size={48} className="mb-4 text-gray-300" />
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Your Wishlist is Empty</h1>
      <p className="mb-8 text-gray-500">
        Save your favorite products here once wishlist syncing is connected to a backend.
      </p>
      <Link href="/products" className="rounded bg-brand px-6 py-3 text-sm font-semibold text-white">
        Browse Products
      </Link>
    </div>
  );
}
