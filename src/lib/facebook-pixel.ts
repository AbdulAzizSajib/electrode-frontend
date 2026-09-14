/**
 * Which pixel fires on a given page, decided in ONE place.
 *
 * A shop can have two: the shop-wide one configured at admin UI → Integrations,
 * and a campaign landing page's own. Both exist for good reasons — a merchant
 * running paid traffic to one product often wants that campaign reported into a
 * separate pixel — and the question this file answers is which of them applies.
 *
 * THE LANDING PAGE'S OWN PIXEL WINS. A merchant who set one on a campaign page
 * chose it deliberately and for that page; falling back to the shop-wide id
 * there would silently move their campaign's conversions into the wrong pixel.
 * When the campaign sets none, the shop-wide one applies, so a landing page is
 * never LESS measured than the rest of the shop.
 *
 * The precedence is resolved where the id is CHOSEN, not by suppressing an event
 * after the fact. Two pixels both firing and one being told to ignore itself is
 * a race; picking one id and passing it down cannot double-report.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * `enabled` AND an id are both required. They are separate because a merchant
 * switching tracking off should not have to discard an id they would then have
 * to find again in Events Manager.
 */
import type { FacebookPixel } from "@/types/store-settings";

/**
 * The pixel id to use on a shop page, or null when none should fire.
 *
 * Null rather than `""` so that callers cannot accidentally treat "no pixel" as
 * a falsy-but-present value and render a bootstrap with an empty id.
 */
export function resolveShopPixelId(pixel: FacebookPixel | undefined | null): string | null {
  if (!pixel?.enabled) return null;

  const id = pixel.pixelId.trim();
  return id.length > 0 ? id : null;
}

/**
 * The pixel id to use on a landing page.
 *
 * The page's own id first, the shop-wide one second. `landingPixelId` is the raw
 * value off the landing page record, which is `""` or null when unset.
 */
export function resolveLandingPixelId(
  landingPixelId: string | null | undefined,
  shopPixel: FacebookPixel | undefined | null,
): string | null {
  const own = landingPixelId?.trim();
  if (own) return own;

  return resolveShopPixelId(shopPixel);
}
