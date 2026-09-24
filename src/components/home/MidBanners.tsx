import Image from "next/image";
import Link from "next/link";
import { getBannersByPlacement } from "@/services/banner";
import { PROMO_LAYOUTS, resolvePromoLayout } from "@/components/home/promo/layouts";
import type { PromoBannerLayout } from "@/types/store-settings";

/**
 * One promotional strip — the tiles of a single promo banner group.
 *
 * ── One component, MANY instances ────────────────────────────────────────
 *
 * This used to be THE promo strip: it read every `MID` banner and drew them
 * three across, because there was only ever one strip and it was always three
 * wide. A merchant can now create as many strips as they like, each with its
 * own artwork and its own tile count, so this renders ONE of them and the
 * homepage renders it once per group.
 *
 * `groupId` is therefore required. A strip that does not know which group it is
 * would have to guess, and guessing means showing every merchant's every promo
 * banner in one band.
 *
 * ── Why it filters rather than fetching ──────────────────────────────────
 *
 * `getBannersByPlacement` is request-cached and the homepage already calls it
 * for the hero, so the whole banner list is in hand by the time any strip
 * renders. Filtering that list costs nothing; a fetch per strip would put three
 * sequential requests on the critical path of the homepage to retrieve data one
 * response already carried.
 *
 * ── The grid comes from the GROUP, the ratio comes with it ───────────────
 *
 * Both are looked up in `promo/layouts.ts`, never built by interpolation — see
 * that file for why an interpolated Tailwind class silently does not exist. The
 * skeleton reads the same table, so a strip cannot render in a shape its
 * placeholder did not reserve.
 *
 * See server/openspec/changes/add-promo-banner-groups, design.md Decision 5.
 */
export default async function MidBanners({
  groupId,
  layout,
}: {
  groupId: string;
  layout: PromoBannerLayout;
}) {
  const banners = await getBannersByPlacement();

  /*
   * This group's tiles only. A `MID` banner with no group belongs to no strip
   * and is deliberately not rendered here — it is artwork the merchant has kept
   * but not placed, which the admin shows as unassigned.
   */
  const tiles = (banners.MID ?? []).filter(
    (banner) => banner.promoBannerGroupId === groupId,
  );

  /*
   * Nothing configured: no section, rather than an empty padded band where the
   * skeleton just stood. A group with no banners is an ordinary state — a
   * merchant who created the strip before uploading its artwork — so this is
   * the common path, not an error one.
   */
  if (tiles.length === 0) return null;

  const { grid, tile, sizes } = PROMO_LAYOUTS[resolvePromoLayout(layout)];

  return (
    <section className="container-px site-container py-8">
      <div className={`grid gap-4 ${grid}`}>
        {tiles.map((banner) => (
          <Link
            key={banner.id}
            href={banner.href}
            className={`relative overflow-hidden rounded-xl bg-gray-100 ${tile}`}
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              sizes={sizes}
              className="object-cover"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
