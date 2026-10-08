import { describe, expect, it } from "vitest";
import { themeStyle } from "@/lib/theme";
import type { Theme } from "@/types/store-settings";

/*
 * The card colour is the one theme colour written ONLY when set: every card
 * reads `var(--color-card, <its own default>)`, so emitting the property for an
 * unset or invalid value would repaint every unconfigured shop's cards. And
 * because the value lands in an inline style attribute, anything that is not a
 * plain hex must never be written at all.
 *
 * See server/openspec/changes/add-card-background-theme-color.
 */

const theme = (cardBackground: unknown) =>
  ({ cardBackground } as unknown as Theme);

const style = (cardBackground: unknown) =>
  themeStyle(theme(cardBackground)) as Record<string, string>;

describe("themeStyle — card colour", () => {
  it("writes --color-card for a valid hex", () => {
    expect(style("#fff9f2")["--color-card"]).toBe("#fff9f2");
    expect(style("#abc")["--color-card"]).toBe("#abc");
  });

  it("omits --color-card when unset", () => {
    expect("--color-card" in style(undefined)).toBe(false);
    expect("--color-card" in style(null)).toBe(false);
  });

  it("omits --color-card for a value that is not a plain hex", () => {
    expect("--color-card" in style("red; color: x")).toBe(false);
    expect("--color-card" in style("red")).toBe(false);
    expect("--color-card" in style("#fff9f2;background:url(x)")).toBe(false);
  });

  it("still writes the six required colours either way", () => {
    expect(style(undefined)["--color-brand"]).toBe("#0f63b3");
  });
});
