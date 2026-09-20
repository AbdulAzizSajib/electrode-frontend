import type { HomeConfig, HomeSectionKey, NavItem } from "@/types/store-settings";

/**
 * Hides a merchant's navigation link when the homepage section that fills its destination is
 * switched off.
 *
 * A merchant who disables "Recent blog posts" on Home Sections is telling us they do not want
 * that content promoted — but their header keeps a "Blog" link, because `mainNav` and
 * `homeConfig` are two independent settings and nothing reconciled them. The merchant sees the
 * link still there and concludes the switch did not work. Worse, when the section was the only
 * thing populating the destination, the header advertises a page with nothing on it: a shop that
 * turns off "Deal of the week" because it is running no deals still links to "Today's Offers".
 *
 * SEPARATE FROM `catalog-features.ts` ON PURPOSE, even though that module does the visibly
 * similar job of dropping a `/wishlist` link when the wishlist is off. Two reasons, and the
 * second is the one that would bite:
 *
 *  - `catalogConfig` is read through MODULE SCOPE there because its consumers include client
 *    components and server route files that can share neither a context nor an `await`. This
 *    rule has exactly one consumer — `Header`, which already holds `homeConfig` as a prop. Using
 *    module scope here would take on that module's multi-tenancy caveat to solve a problem this
 *    rule does not have.
 *  - `isHrefOffered` STRIPS the query string before comparing, so `/wishlist?from=menu` is still
 *    the wishlist. This rule must do the opposite: `/products?sort=new` and `/products?sort=best`
 *    differ ONLY by query string and name different sections, while `/products` alone names none.
 *    Sharing one matcher would force one of those two behaviours onto the case where it is wrong.
 *
 * The two are composed in `Header`, which is the right place for it — both are pure filters over
 * the same list, so order does not matter.
 *
 * See openspec/changes/align-nav-links-with-home-sections, design.md Decisions 1 and 2.
 */

/**
 * Which navigation targets are governed by which homepage section.
 *
 * EXACT, WHOLE-STRING KEYS. Deliberately stricter than the path-normalising match next door in
 * `catalog-features.ts`, because here the query string carries the meaning — normalising
 * `/products?sort=new` down to `/products` would collapse New Arrivals, Best Selling and a plain
 * shop link into one indistinguishable target.
 *
 * The cost is that `/blogs/` and `/products?sort=new&page=1` are not governed and keep rendering.
 * That is the correct direction to fail in: failing to hide a link leaves the merchant exactly
 * where they were before this existed, while hiding a link they wrote deliberately destroys work
 * they can neither see nor undo. Every ambiguous case resolves toward rendering.
 *
 * ONLY TARGETS THE ADMIN ITSELF SUGGESTS. Each key is one of the `STOREFRONT_ROUTES` entries in
 * `admin/src/features/ui/components/link-target-input.tsx`, so a merchant reaches a governed
 * state by picking a suggested destination, never by typing a path we silently reinterpret.
 * ADDING A ROUTE TO THAT PICKER DOES NOT GOVERN IT — governing a new target means adding it here
 * and to the admin's mirror deliberately, which is the intended friction.
 *
 * MIRRORED IN THE ADMIN (`admin/src/lib/api/store-settings.ts`, `SECTION_LINKED_ROUTES`) and kept
 * in step by hand, like the section registry it is keyed on. Drift here is far less dangerous
 * than drift in that registry: a mismatched route map only makes an admin notice appear where no
 * link is hidden, or fail to appear where one is — wrong and visible, never destructive.
 */
export const SECTION_LINKED_ROUTES: Readonly<Record<string, HomeSectionKey>> = {
  "/blogs": "BLOG",
  "/deals": "DEAL_OF_WEEK",
  "/products?sort=new": "NEW_ARRIVALS",
  "/products?sort=best": "BEST_SELLING",
};

/**
 * The section governing this target, or `null` when nothing does.
 *
 * A custom path, a CMS page, a category or an external URL is ungoverned and always renders.
 */
export function governingSection(href: string): HomeSectionKey | null {
  return SECTION_LINKED_ROUTES[href] ?? null;
}

/**
 * Whether a link's destination is one the homepage still promotes.
 *
 * True for every ungoverned target, and for a governed one whose section is enabled. A section
 * missing from `homeConfig` counts as enabled: the backend reconciles the stored list against its
 * registry before serving it, and a failed settings read falls back to a complete all-enabled
 * list, so a gap here is not a state the storefront should read as "off".
 */
export function isNavHrefVisible(href: string, homeConfig: HomeConfig): boolean {
  const key = governingSection(href);
  if (!key) return true;

  const section = homeConfig.find((entry) => entry.key === key);
  return section ? section.enabled : true;
}

/**
 * Drops navigation entries whose destination a disabled homepage section has emptied.
 *
 * RENDER-TIME ONLY. Nothing stored changes — the merchant's link keeps its label, its target and
 * its position, and renders again unchanged the moment the section is switched back on. The
 * destination itself stays reachable too: `/blogs` still serves when `BLOG` is off, it simply is
 * not linked from the header.
 *
 * A PARENT OUTLIVES ITS CHILDREN when it has a destination of its own. `filterNavForFeatures`
 * takes the same view, on the grounds that the parent's own link still leads somewhere — but that
 * reasoning stops holding when the parent's own target is itself governed and disabled, which is
 * a case that filter never has to consider. So a parent is dropped only when nothing is left to
 * show: no surviving children AND its own target either governed-and-disabled or absent. An item
 * with no target and no children would otherwise render as a dropdown trigger that opens nothing.
 */
export function filterNavForSections(items: NavItem[], homeConfig: HomeConfig): NavItem[] {
  return items.reduce<NavItem[]>((kept, item) => {
    const children = item.children?.filter((child) => isNavHrefVisible(child.href, homeConfig));
    const hasOwnTarget = Boolean(item.href.trim()) && isNavHrefVisible(item.href, homeConfig);

    if (!hasOwnTarget && !children?.length) return kept;

    kept.push(children ? { ...item, children } : item);
    return kept;
  }, []);
}
