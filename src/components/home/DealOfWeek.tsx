"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import ProductCard from "@/components/product/ProductCard";
import type { Campaign } from "@/types/campaign";

/**
 * The campaign occupying the DEAL_OF_WEEK slot.
 *
 * Renders the campaign's own name and description rather than hardcoded "DEAL
 * OF / THE WEEK!" copy, and its real deadline rather than a countdown invented
 * on mount. The page omits this section entirely when no campaign occupies the
 * slot — there is deliberately no fallback to "any product with a
 * compareAtPrice", which would put a countdown beside products that are not on
 * a deadline.
 *
 * A client component only so it can notice its own deadline passing: the
 * response is cached for five minutes, so it can outlive `endsAt` by up to that
 * long, and a visitor may sit on the page through the expiry.
 */
export default function DealOfWeek({ campaign }: { campaign: Campaign }) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (campaign.endsAt === null) return;

    const check = () => setExpired(Date.now() >= campaign.endsAt!);
    check();

    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [campaign.endsAt]);

  if (expired || campaign.products.length === 0) return null;

  return (
    <section className="container-px sm:container-px site-container py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
        <div className="flex flex-col justify-center rounded-xl bg-[#eef1fb] p-6 lg:col-span-1">
          <p className="mb-3 inline-block w-fit rounded bg-sale px-3 py-1 text-xs font-bold text-white">
            {campaign.name}
          </p>
          {campaign.description ? (
            <p className="mb-4 text-sm text-gray-600">{campaign.description}</p>
          ) : null}
          {/* No deadline means no countdown — never a computed one. */}
          {campaign.endsAt !== null ? (
            <>
              <CountdownTimer endsAt={campaign.endsAt} />
              <p className="mb-4 mt-2 text-xs text-gray-500">
                Remains until the end of the offer
              </p>
            </>
          ) : null}
          {/*
            Points at the catalog, not at the campaign: neither the products
            page nor the API has a campaign filter, so a `?campaign=` link would
            silently render the unfiltered catalog — worse than an honest one.
            Adding that filter is its own change.
          */}
          <Link
            href="/products"
            className="rounded bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Shop Now
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-5 lg:col-span-5">
          {campaign.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
