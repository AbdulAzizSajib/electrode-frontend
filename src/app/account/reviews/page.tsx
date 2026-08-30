import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import MyReviewsView from "@/app/account/reviews/MyReviewsView";
import { getCurrentUser } from "@/services/auth";

export const metadata: Metadata = {
  title: "My Reviews – Electrode",
};

export default async function MyReviewsPage() {
  const user = await getCurrentUser();

  // The proxy gates /account optimistically by decoding the token; this is the
  // check that actually confirms the session, matching the other account pages.
  if (!user) {
    redirect("/account/login?redirect=/account/reviews");
  }

  return (
    <div className="container-px mx-auto max-w-3xl py-16">
      <Link
        href="/account"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand"
      >
        <ChevronLeft size={16} />
        Back to account
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-gray-900">My Reviews</h1>
      <p className="mb-8 text-sm text-gray-500">
        Reviews you have written, including any still awaiting approval.
      </p>

      <MyReviewsView />
    </div>
  );
}
