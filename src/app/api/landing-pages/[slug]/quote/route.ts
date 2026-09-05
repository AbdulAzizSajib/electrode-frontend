import { proxyRequest } from "@/lib/api-proxy";

/**
 * Body: `{ quantity, zoneKey }`.
 *
 * Prices the campaign order as the shopper changes quantity or delivery area,
 * so the totals beside the order button are the server's own. The alternative —
 * multiplying the price in the browser — would be a second implementation of
 * what the order costs, and tax comes from the product's own rule, which the
 * browser has no way to know.
 *
 * A read in every sense that matters: it commits nothing, so it takes the
 * default timeout rather than the order route's longer one.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return proxyRequest(
    request,
    `/landing-pages/by-slug/${encodeURIComponent(slug)}/quote`,
    "POST",
  );
}
