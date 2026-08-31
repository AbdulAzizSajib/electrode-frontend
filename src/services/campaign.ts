import { apiFetch } from "@/lib/api-client";
import { toProduct } from "@/services/product";
import type { ApiCampaign, Campaign, CampaignPlacement } from "@/types/campaign";

/**
 * A campaign is merchandising, not catalog: a merchant sets one up and it runs
 * for days. Matches the banner window for the same reason.
 *
 * This bounds how long an expired deal can linger in cache — up to five minutes
 * after `endsAt`, this returns a campaign the backend would already refuse to
 * serve. That is why `DealOfWeek` re-checks the deadline on the client rather
 * than trusting the response to be live.
 */
const CAMPAIGN_REVALIDATE_SECONDS = 300;

/**
 * The campaign occupying a storefront slot, or null when none does.
 *
 * Returns null rather than throwing on failure, like `getProducts` — the
 * homepage renders this section alongside three others, and a campaign outage
 * should cost the section, not the page.
 *
 * An empty slot is a 200 with `data: null` from the backend, so "no deal
 * running" and "request failed" both arrive here as null. The caller omits the
 * section either way, which is the correct response to both.
 */
export async function getCampaignByPlacement(
  placement: CampaignPlacement,
): Promise<Campaign | null> {
  try {
    const { data } = await apiFetch<ApiCampaign | null>(
      `/campaigns/active?placement=${placement}`,
      { revalidate: CAMPAIGN_REVALIDATE_SECONDS },
    );

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      // Parsed to epoch ms here so the countdown never does date arithmetic on
      // a string. Null stays null: a campaign with no deadline must render no
      // countdown, never a computed one.
      endsAt: data.endsAt ? Date.parse(data.endsAt) : null,
      // The same mapper the rest of the catalog uses, so campaign products get
      // the same treatment — `campaignPrice` becomes the displayed price with
      // the base price struck through, which is the discount badge and cut
      // price the deal row renders.
      products: (data.products ?? []).map(toProduct),
    };
  } catch {
    return null;
  }
}
