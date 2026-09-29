import { describe, expect, it } from "vitest";
import { isBlankHtml, sanitizeHtml } from "@/lib/sanitize-html";

/**
 * A custom section's body is merchant-authored HTML on a public page.
 *
 * `LandingCustomSection` renders it through `RichText`, which runs the same
 * `sanitizeHtml` allowlist every other merchant-authored surface uses. These
 * pin that the allowlist actually removes what matters, so a future change that
 * routed a custom section around it would fail here rather than ship a campaign
 * page that executes whatever was typed into the admin.
 */

describe("a custom section's body is sanitised before it reaches a browser", () => {
  it("removes a script tag", () => {
    const clean = sanitizeHtml('<p>Guarantee</p><script>alert(1)</script>');

    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("alert(1)");
    expect(clean).toContain("Guarantee");
  });

  it("removes an inline event handler", () => {
    const clean = sanitizeHtml('<p onclick="steal()">Tap</p>');

    expect(clean).not.toContain("onclick");
    expect(clean).toContain("Tap");
  });

  it("removes a javascript: link", () => {
    const clean = sanitizeHtml('<a href="javascript:alert(1)">Buy</a>');

    expect(clean).not.toContain("javascript:");
  });

  it("removes an image error handler", () => {
    const clean = sanitizeHtml('<img src="x" onerror="alert(1)">');

    expect(clean).not.toContain("onerror");
  });

  it("keeps the ordinary prose a merchant actually writes", () => {
    const clean = sanitizeHtml("<p>১০০% <strong>অরিজিনাল</strong> পণ্য</p><ul><li>এক</li></ul>");

    expect(clean).toContain("<strong>");
    expect(clean).toContain("<li>");
    expect(clean).toContain("অরিজিনাল");
  });
});

describe("a body that is only markup counts as blank", () => {
  /*
   * The component's own guard. A body of `<p></p>` passes a truthiness test and
   * would render a band with a heading over nothing — which is the empty
   * section the spec says never to render.
   */
  it("treats empty markup as blank", () => {
    expect(isBlankHtml("<p></p>")).toBe(true);
    expect(isBlankHtml("<p><br></p>")).toBe(true);
    expect(isBlankHtml("   ")).toBe(true);
  });

  it("treats real content as not blank", () => {
    expect(isBlankHtml("<p>কিছু কথা</p>")).toBe(false);
  });

  it("treats a script-only body as blank rather than as content", () => {
    expect(isBlankHtml("<script>alert(1)</script>")).toBe(true);
  });
});
