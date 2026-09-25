import { describe, expect, it } from "vitest";
import type { DeliveryOption } from "@/types/store-settings";
import {
  DESTINATION_ENTRIES,
  DESTINATION_RESULT_LIMIT,
  destinationFromLabel,
  findDestination,
  refusalMessage,
  resolveDeliveryOption,
  searchDestinations,
  zoneFor,
} from "@/lib/delivery-destination";

/** The live store's own two options, keys included — see the map's comment. */
const INSIDE: DeliveryOption = {
  key: "option-2",
  label: "Inside Dhaka ( ঢাকার ভিতরে )",
  kind: "DELIVERY",
  price: 80,
  days: 3,
};
const OUTSIDE: DeliveryOption = {
  key: "outside-dhaka",
  label: "Outside Dhaka ( ঢাকার বাহিরে )",
  kind: "DELIVERY",
  price: 120,
  days: 6,
};
const OPTIONS = [INSIDE, OUTSIDE];

describe("zoneFor", () => {
  it("puts a Dhaka metro area inside Dhaka", () => {
    expect(zoneFor({ district: "Dhaka", area: "Gulshan" })).toBe("INSIDE_DHAKA");
    expect(zoneFor({ district: "Dhaka", area: "Mohammadpur (Dhaka)" })).toBe(
      "INSIDE_DHAKA",
    );
  });

  it("puts any other district outside Dhaka", () => {
    expect(zoneFor({ district: "Bagerhat", area: "Bagerhat Sadar" })).toBe(
      "OUTSIDE_DHAKA",
    );
    expect(zoneFor({ district: "Chittagong", area: "Agrabad" })).toBe(
      "OUTSIDE_DHAKA",
    );
  });

  /*
   * The whole reason the zone is not simply the district. Each of these is
   * Dhaka district and none of them is the metro rate, so a typo in the
   * exception list is one area quietly charged ৳80 instead of ৳120 — which is
   * why every name is also checked to exist in the data below.
   */
  it.each([
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
  ])("charges %s at the outside-Dhaka rate", (area) => {
    expect(findDestination("Dhaka", area)).not.toBeNull();
    expect(zoneFor({ district: "Dhaka", area })).toBe("OUTSIDE_DHAKA");
  });

  it("keeps Nawabganj in old Dhaka inside the city", () => {
    // Spelled apart from the upazila in the source, and it is a different place.
    expect(findDestination("Dhaka", "Nawabgonj Puran Dhaka")).not.toBeNull();
    expect(zoneFor({ district: "Dhaka", area: "Nawabgonj Puran Dhaka" })).toBe(
      "INSIDE_DHAKA",
    );
  });
});

describe("resolveDeliveryOption", () => {
  it("resolves a metro area to the inside-Dhaka option", () => {
    const result = resolveDeliveryOption(
      { district: "Dhaka", area: "Gulshan" },
      OPTIONS,
    );
    expect(result).toEqual({ resolved: true, zone: "INSIDE_DHAKA", option: INSIDE });
  });

  it("resolves a Dhaka-district exception to the outside option", () => {
    const result = resolveDeliveryOption(
      { district: "Dhaka", area: "Savar" },
      OPTIONS,
    );
    expect(result).toEqual({
      resolved: true,
      zone: "OUTSIDE_DHAKA",
      option: OUTSIDE,
    });
  });

  it("resolves another district to the outside option", () => {
    const result = resolveDeliveryOption(
      { district: "Bagerhat", area: "Chitalmari" },
      OPTIONS,
    );
    expect(result).toEqual({
      resolved: true,
      zone: "OUTSIDE_DHAKA",
      option: OUTSIDE,
    });
  });

  it("refuses when nothing has been chosen", () => {
    expect(resolveDeliveryOption(null, OPTIONS)).toEqual({
      resolved: false,
      reason: "NO_DESTINATION",
    });
  });

  it("refuses a district and area that are not a real pair", () => {
    // What an address saved as free text before the picker existed looks like.
    expect(
      resolveDeliveryOption({ district: "Dhaka", area: "dhaka" }, OPTIONS),
    ).toEqual({ resolved: false, reason: "UNKNOWN_PLACE" });
    expect(
      resolveDeliveryOption({ district: "Gulshan", area: "Dhaka" }, OPTIONS),
    ).toEqual({ resolved: false, reason: "UNKNOWN_PLACE" });
  });

  it("refuses when the store no longer has the option the zone names", () => {
    // What a merchant deleting and re-creating an option looks like from here.
    expect(
      resolveDeliveryOption({ district: "Dhaka", area: "Gulshan" }, [OUTSIDE]),
    ).toEqual({ resolved: false, reason: "OPTION_NOT_CONFIGURED" });
    expect(resolveDeliveryOption({ district: "Dhaka", area: "Gulshan" }, [])).toEqual({
      resolved: false,
      reason: "OPTION_NOT_CONFIGURED",
    });
  });

  it("never resolves to a pickup point", () => {
    const pickup: DeliveryOption = { ...INSIDE, kind: "PICKUP" };
    expect(
      resolveDeliveryOption({ district: "Dhaka", area: "Gulshan" }, [pickup]),
    ).toEqual({ resolved: false, reason: "OPTION_NOT_CONFIGURED" });
  });
});

describe("refusalMessage", () => {
  it("says nothing when the shopper simply has not answered yet", () => {
    expect(refusalMessage("NO_DESTINATION")).toBeNull();
  });

  it("gives a reason for every refusal a shopper can be shown", () => {
    for (const reason of ["UNKNOWN_PLACE", "UNSERVED", "OPTION_NOT_CONFIGURED"] as const) {
      expect(refusalMessage(reason)).toMatch(/\S/);
    }
  });
});

describe("searchDestinations", () => {
  it("matches on the area, which is what a shopper types", () => {
    const results = searchDestinations("savar");
    expect(results[0]).toMatchObject({ district: "Dhaka", area: "Savar" });
    expect(results[0].label).toBe("Dhaka - Savar");
  });

  it("matches on the district too", () => {
    const results = searchDestinations("bagerhat");
    expect(results.every((r) => /bagerhat/i.test(r.label))).toBe(true);
    expect(results.some((r) => r.district === "Bagerhat")).toBe(true);
  });

  it("puts a name that starts with the query above one that contains it", () => {
    const results = searchDestinations("gulshan");
    expect(results[0].area.toLowerCase().startsWith("gulshan")).toBe(true);
  });

  it("ignores case and surrounding whitespace", () => {
    expect(searchDestinations("  GULSHAN ")[0]).toEqual(
      searchDestinations("gulshan")[0],
    );
  });

  it("returns the head of the list for an empty query rather than nothing", () => {
    const results = searchDestinations("");
    expect(results).toHaveLength(DESTINATION_RESULT_LIMIT);
    expect(results[0].district).toBe("Dhaka");
  });

  it("never returns more than the cap, whatever matches", () => {
    // 1,343 rows in the DOM is the thing this exists to prevent.
    expect(searchDestinations("a").length).toBeLessThanOrEqual(
      DESTINATION_RESULT_LIMIT,
    );
    expect(searchDestinations("a", 5)).toHaveLength(5);
  });

  it("returns nothing for a query that matches nothing", () => {
    expect(searchDestinations("zzzzzzzz")).toEqual([]);
  });
});

describe("findDestination", () => {
  it("finds a real pair whatever the case and spacing", () => {
    expect(findDestination(" dhaka ", "GULSHAN")).toMatchObject({
      district: "Dhaka",
      area: "Gulshan",
    });
  });

  it("returns null when either half is missing", () => {
    expect(findDestination(null, "Gulshan")).toBeNull();
    expect(findDestination("Dhaka", "")).toBeNull();
    expect(findDestination(undefined, undefined)).toBeNull();
  });

  it("returns null rather than guessing at free text", () => {
    expect(findDestination("Dhaka", "mirpur 10, block c")).toBeNull();
  });
});

describe("destinationFromLabel", () => {
  it("turns a picked row back into the place it stands for", () => {
    expect(destinationFromLabel("Dhaka - Gulshan")).toMatchObject({
      district: "Dhaka",
      area: "Gulshan",
    });
  });

  it("returns null for anything that is not a row", () => {
    expect(destinationFromLabel("Dhaka")).toBeNull();
    expect(destinationFromLabel("")).toBeNull();
    expect(destinationFromLabel(null)).toBeNull();
  });

  /*
   * The picker speaks in labels alone, so two rows reading the same would make
   * one of them unpickable. Unique today by construction; asserted because the
   * data is regenerated from outside this repository.
   */
  it("has a label for every row, and no two the same", () => {
    const labels = new Set(DESTINATION_ENTRIES.map((e) => e.label));
    expect(labels.size).toBe(DESTINATION_ENTRIES.length);
    for (const entry of DESTINATION_ENTRIES.slice(0, 200)) {
      expect(destinationFromLabel(entry.label)).toMatchObject({
        district: entry.district,
        area: entry.area,
      });
    }
  });
});
