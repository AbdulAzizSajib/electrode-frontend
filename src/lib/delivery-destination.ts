/**
 * Where an order is going, and which delivery option that makes it.
 *
 * Checkout used to ask two questions about one fact: a free-text city, and a
 * delivery area picked off a list of the merchant's prices. This turns the
 * first answer into the second — the shopper names their area, and the option
 * follows from it.
 *
 * THE RESOLUTION IS DELIBERATELY IN TWO HALVES:
 *
 *     area + district ──> zone ──> option key ──> the merchant's own option
 *                  (geography)  (per deployment)
 *
 * The first half is the same for every store that ever ships from this
 * codebase; the second is different in every one, because the option keys are
 * generated per store and a merchant renames and re-creates options at will.
 * Keeping them apart is what lets a clone for a new client change one small map
 * instead of re-authoring 1,343 areas. See
 * openspec/changes/add-district-area-picker/design.md, D3.
 *
 * NOTHING HERE PRICES ANYTHING. Resolution returns the merchant's option, and
 * the amount charged for it still comes from the server's quote — the same
 * quote a shopper-chosen option goes through. A second opinion about the price
 * on this side is how a shopper is shown ৳80, charged ৳120, and told the
 * difference at the door. See design.md, D8.
 */

import { BD_DISTRICTS } from "@/data/bd-districts";
import type { DeliveryOption } from "@/types/store-settings";

/**
 * A delivery zone: what the geography says, before any store's prices are
 * involved. Extending this is data plus one more line in `ZONE_OPTION_KEY` —
 * a separate sub-urban rate, which several couriers charge, would be a third
 * member here and a third option in Checkout Settings.
 */
export type DeliveryZone = "INSIDE_DHAKA" | "OUTSIDE_DHAKA";

/** One place, as the shopper chose it. Both halves or neither. */
export interface Destination {
  district: string;
  area: string;
}

/* -------------------------------------------------------------------------
 * The geography. Same for every store.
 * ---------------------------------------------------------------------- */

/**
 * Areas of DHAKA DISTRICT that are not inside Dhaka for pricing.
 *
 * Dhaka district holds 529 of the 1,343 areas, and the pricing boundary runs
 * straight through it: Savar, Dhamrai, Ashulia, Keraniganj, Dohar and Nawabganj
 * are Dhaka district but are not what a merchant means by "Inside Dhaka" — they
 * are a different trip and a different rate. A per-district zone alone would
 * quietly charge every one of them the metro price.
 *
 * "Nawabgonj Puran Dhaka" is NOT here on purpose: that is Nawabganj in old
 * Dhaka, inside the city, and the source lists it separately from the upazila
 * spelled "Nawabgonj (Dhaka)".
 *
 * Each string must match `BD_DISTRICTS` exactly — a typo here is not an error
 * anywhere, it is one area quietly priced as metro. `delivery-destination.test`
 * checks every entry against the data for that reason.
 *
 * CONFIRMED WITH THE MERCHANT, 2026-09-25. This is the store's answer to "what
 * do you mean by Inside Dhaka", not a guess at it — which matters because every
 * line here is ৳40 on somebody's order. Changing it is a merchant decision, so
 * ask before editing.
 */
const OUTSIDE_METRO_DHAKA_AREAS: ReadonlySet<string> = new Set([
  "Savar",
  "Savar Cantonment",
  "Ashulia",
  "Amin Bazar",
  "Birulia",
  "Dhamrai",
  "Keranigonj",
  "Kaliganj - Keraniganj",
  "Kodomtoli(Keraniganj)",
  "Dohar",
  "Nawabgonj (Dhaka)",
]);

/** The one district whose areas are inside Dhaka unless excepted above. */
const METRO_DISTRICT = "Dhaka";

/**
 * Districts this store does not deliver to at all.
 *
 * Empty, because the two options below between them cover the country: one
 * price inside Dhaka, one price everywhere else. It exists because that is a
 * property of THIS store's rate card and not of the code — a client who ships
 * only to a few districts fills this in, and every other district then falls
 * back to asking the shopper rather than silently charging them a rate that was
 * never meant for them.
 */
const UNSERVED_DISTRICTS: ReadonlySet<string> = new Set<string>();

/* -------------------------------------------------------------------------
 * The store's own half. Different in every deployment.
 * ---------------------------------------------------------------------- */

/**
 * Which of the merchant's delivery options each zone is charged at.
 *
 * PER-DEPLOYMENT DATA. The keys are not guessable and must be copied from the
 * store's own Checkout Settings — this one reads `option-2` for inside Dhaka
 * because that is the key that option was generated with, not because it means
 * anything. A key is generated once and never rewritten, so renaming the option
 * in the admin does NOT break this; deleting and re-creating it does.
 *
 * When a key here names an option the store no longer has, checkout falls back
 * to asking the shopper, so the store keeps taking orders — which also means
 * nothing will alert you. If the delivery-area cards reappear at checkout,
 * compare these keys against Checkout Settings first.
 */
const ZONE_OPTION_KEY: Record<DeliveryZone, string> = {
  INSIDE_DHAKA: "option-2",
  OUTSIDE_DHAKA: "outside-dhaka",
};

/* -------------------------------------------------------------------------
 * The flattened list the picker reads.
 * ---------------------------------------------------------------------- */

/** One selectable place. `label` is what the shopper reads and searches. */
export interface DestinationEntry extends Destination {
  /** `District - Area`, which is how the list reads and how it is searched. */
  label: string;
}

/** The label carries the district, always. */
function labelFor(district: string, area: string): string {
  return `${district} - ${area}`;
}

/**
 * Every district-and-area pair, flattened once, in the source's own order:
 * Dhaka first, then by division. That order is what the picker shows before
 * anything is typed, so the districts a Bangladeshi shop sells to most are
 * reachable without a search.
 *
 * The lowercase forms are computed here rather than per keystroke — 1,343
 * `toLowerCase()` calls on every letter typed is work nobody needs done twice.
 */
const ENTRIES: readonly (DestinationEntry & {
  districtLower: string;
  areaLower: string;
})[] = BD_DISTRICTS.flatMap((d) =>
  d.areas.map((area) => ({
    district: d.district,
    area,
    label: labelFor(d.district, area),
    districtLower: d.district.toLowerCase(),
    areaLower: area.toLowerCase(),
  })),
);

/** The list as the picker takes it, without the search's private fields. */
export const DESTINATION_ENTRIES: readonly DestinationEntry[] = ENTRIES;

/* -------------------------------------------------------------------------
 * Search
 * ---------------------------------------------------------------------- */

/**
 * How many rows the picker will ever render at once.
 *
 * 1,343 options must never all be in the DOM: an unfiltered list is what makes
 * a select like this scroll like treacle on the mid-range Android most of these
 * shoppers are on. Fifty is more than anyone reads before typing another letter.
 */
export const DESTINATION_RESULT_LIMIT = 50;

/** Collapses the whitespace and case a shopper actually types. */
function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * The places matching what the shopper typed, best first, capped.
 *
 * Matching is on EITHER half — a shopper types "Savar", not "Dhaka - Savar",
 * and someone ordering to a district they cannot spell the upazila of types
 * "Bagerhat". Ranking puts what someone is most likely to have meant first: a
 * name that starts with what they typed beats one that merely contains it, and
 * an area beats a district, because the area is the more specific answer.
 *
 * An empty query returns the head of the list rather than nothing, so opening
 * the picker shows something to scroll.
 */
export function searchDestinations(
  query: string,
  limit: number = DESTINATION_RESULT_LIMIT,
): DestinationEntry[] {
  const q = normalize(query);
  if (!q) return ENTRIES.slice(0, limit);

  const matches: { entry: DestinationEntry; score: number }[] = [];
  for (const entry of ENTRIES) {
    let score: number;
    if (entry.areaLower.startsWith(q)) score = 0;
    else if (entry.districtLower.startsWith(q)) score = 1;
    else if (entry.areaLower.includes(q)) score = 2;
    else if (entry.districtLower.includes(q)) score = 3;
    else continue;
    matches.push({ entry, score });
  }

  // Stable by construction: equal scores keep the source's order, so "Dhaka"
  // still lists Dhaka's own areas before Dhaka-matching ones elsewhere.
  matches.sort((a, b) => a.score - b.score);
  return matches.slice(0, limit).map((m) => m.entry);
}

/**
 * Every place by its label, for turning a picked row back into a destination.
 *
 * Labels are unique: an area is listed once per district, and the district is
 * part of the label, so no two rows can read the same. That is what lets the
 * picker speak in labels alone and stay a plain list of strings.
 */
const BY_LABEL: ReadonlyMap<string, DestinationEntry> = new Map(
  ENTRIES.map((e) => [e.label, e as DestinationEntry]),
);

/** The place a row of the picker stands for, or null if it names none. */
export function destinationFromLabel(
  label: string | null | undefined,
): DestinationEntry | null {
  if (!label) return null;
  return BY_LABEL.get(label) ?? null;
}

/**
 * The known place a stored district and area name, or null when they are not
 * both a real pair.
 *
 * Null is the honest answer for an address saved before this existed, whose
 * city is whatever the shopper typed. Nothing here guesses: "dhaka" could be
 * the district or the city, and "savar" is Dhaka district at the outside-Dhaka
 * rate — a guess that is usually right is a wrong delivery charge on the orders
 * where it is not. See design.md, D7.
 */
export function findDestination(
  district: string | null | undefined,
  area: string | null | undefined,
): DestinationEntry | null {
  if (!district || !area) return null;
  const d = normalize(district);
  const a = normalize(area);
  return (
    ENTRIES.find((e) => e.districtLower === d && e.areaLower === a) ?? null
  );
}

/* -------------------------------------------------------------------------
 * Resolution
 * ---------------------------------------------------------------------- */

/**
 * Why a destination could not decide the delivery option. Each one sends
 * checkout back to asking the shopper, and each one is a different sentence to
 * put above the question.
 */
export type DestinationRefusal =
  /** Nothing chosen yet. Not an error — the shopper has not answered. */
  | "NO_DESTINATION"
  /** A district and area that are not a pair in the list, e.g. an older saved address. */
  | "UNKNOWN_PLACE"
  /** A real place the store does not deliver to. */
  | "UNSERVED"
  /** The zone names an option this store has not configured. A misconfiguration. */
  | "OPTION_NOT_CONFIGURED";

export type DestinationResolution =
  | { readonly resolved: true; readonly zone: DeliveryZone; readonly option: DeliveryOption }
  | { readonly resolved: false; readonly reason: DestinationRefusal };

/**
 * The zone a place is in, or null when the store does not serve it.
 *
 * Only ever asked about a place that is in the list — an unknown place has no
 * zone to have, which is a different answer and a different message.
 */
export function zoneFor(destination: Destination): DeliveryZone | null {
  if (UNSERVED_DISTRICTS.has(destination.district)) return null;
  if (destination.district !== METRO_DISTRICT) return "OUTSIDE_DHAKA";
  return OUTSIDE_METRO_DHAKA_AREAS.has(destination.area)
    ? "OUTSIDE_DHAKA"
    : "INSIDE_DHAKA";
}

/**
 * The merchant's delivery option for a destination, or the reason there is
 * none.
 *
 * Deliberately total: every path out of here is either an option the store
 * currently has configured, or a stated reason to ask the shopper instead. It
 * never returns an option the store does not have, and never invents one — the
 * option list passed in is the live one from settings, so an option the
 * merchant deleted a minute ago is already gone from it.
 *
 * PICKUP OPTIONS ARE NOT ELIGIBLE. Collection in person is somewhere the
 * shopper goes, not somewhere an address resolves to, and it stays their own
 * choice.
 */
export function resolveDeliveryOption(
  destination: Destination | null,
  options: readonly DeliveryOption[],
): DestinationResolution {
  if (!destination) return { resolved: false, reason: "NO_DESTINATION" };

  const known = findDestination(destination.district, destination.area);
  if (!known) return { resolved: false, reason: "UNKNOWN_PLACE" };

  const zone = zoneFor(known);
  if (!zone) return { resolved: false, reason: "UNSERVED" };

  const key = ZONE_OPTION_KEY[zone];
  const option = options.find((o) => o.key === key && o.kind === "DELIVERY");
  if (!option) return { resolved: false, reason: "OPTION_NOT_CONFIGURED" };

  return { resolved: true, zone, option };
}

/**
 * What to tell the shopper when they are being asked to choose after all.
 *
 * `NO_DESTINATION` has no message: the shopper has not answered yet, and a
 * store with no destination picker at all is in this state permanently. Saying
 * "we could not work out your area" to someone who has not named one is an
 * error message for something nobody did wrong.
 */
export function refusalMessage(reason: DestinationRefusal): string | null {
  switch (reason) {
    case "NO_DESTINATION":
      return null;
    case "UNKNOWN_PLACE":
      return "We could not match this address to a delivery area. Please choose one below.";
    case "UNSERVED":
      return "We do not deliver to that district yet. Please choose one of the options below.";
    case "OPTION_NOT_CONFIGURED":
      return "The delivery charge for your area is not set up. Please choose an option below.";
  }
}
