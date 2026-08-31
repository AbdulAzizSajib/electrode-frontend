/**
 * Campaign types mirroring the backend's public `GET /campaigns/active`.
 */
import type { ApiProduct, Product } from "./product";

/**
 * A storefront slot a campaign can occupy.
 *
 * Closed union, not `(string & {})` like `BannerPlacement`: the backend
 * validates this against a Prisma enum and answers 400 for anything else, so a
 * value outside this list is a bug to catch at compile time rather than a
 * string to pass through.
 */
export type CampaignPlacement = "DEAL_OF_WEEK" | "FLASH_SALE";

/**
 * A campaign exactly as `GET /campaigns/active?placement=` returns it.
 *
 * Deliberately narrow on the backend's side too: it carries the campaign's
 * descriptive fields, its window, and its priced products — but not
 * `discountType`/`discountValue`, which are stripped server-side. The price the
 * shopper pays arrives as each product's `campaignPrice`.
 */
export interface ApiCampaign {
  id: string;
  name: string;
  description: string | null;
  placement: CampaignPlacement;
  startsAt: string | null;
  /**
   * ISO timestamp, or null when the campaign has no deadline.
   *
   * Null means "no deadline" and must render as no countdown — never as a
   * computed one. A fabricated deadline is precisely the fiction this endpoint
   * exists to remove.
   */
  endsAt: string | null;
  products: ApiProduct[];
}

/** The trimmed shape the deal section renders. */
export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  /** Epoch milliseconds, or null when the campaign has no deadline. */
  endsAt: number | null;
  products: Product[];
}
