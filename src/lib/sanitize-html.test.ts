import { describe, expect, it } from "vitest";
import { isBlankHtml, sanitizeHtml } from "@/lib/sanitize-html";

/**
 * Task 9.13 — a description containing script markup renders inert.
 *
 * These are the cases that matter for admin-authored HTML reaching a shopper's
 * browser: the formatting must survive, and everything that can execute or
 * navigate somewhere unexpected must not.
 */
describe("sanitizeHtml", () => {
  it("keeps the formatting a description is written in", () => {
    const html =
      "<h2>About</h2><p>A <strong>bold</strong> claim and an <em>emphasis</em>.</p>" +
      "<ul><li>One</li><li>Two</li></ul>";
    expect(sanitizeHtml(html)).toBe(html);
  });

  it("keeps an ordinary link, with its rel and target", () => {
    const clean = sanitizeHtml(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Docs</a>',
    );
    expect(clean).toContain('href="https://example.com"');
    expect(clean).toContain("Docs");
  });

  it("removes a script tag entirely", () => {
    const clean = sanitizeHtml('<p>Hi</p><script>alert("xss")</script>');
    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("alert(");
    expect(clean).toContain("<p>Hi</p>");
  });

  it("removes an inline event handler but keeps the element's text", () => {
    const clean = sanitizeHtml('<p onclick="steal()">Read me</p>');
    expect(clean).not.toContain("onclick");
    expect(clean).not.toContain("steal");
    expect(clean).toContain("Read me");
  });

  it("removes an img onerror payload", () => {
    const clean = sanitizeHtml('<img src=x onerror="alert(1)">');
    expect(clean).not.toContain("onerror");
    expect(clean).not.toContain("alert");
  });

  it("strips a javascript: href", () => {
    const clean = sanitizeHtml('<a href="javascript:alert(1)">Click</a>');
    expect(clean).not.toContain("javascript:");
    // The wording the merchant wrote still reads.
    expect(clean).toContain("Click");
  });

  it("strips a data: href", () => {
    const clean = sanitizeHtml('<a href="data:text/html;base64,PHNjcmlwdD4=">Click</a>');
    expect(clean).not.toContain("data:");
  });

  it("removes iframes and styles, which are page takeovers rather than description", () => {
    const clean = sanitizeHtml(
      '<iframe src="https://evil.example"></iframe><style>body{display:none}</style><p>Real</p>',
    );
    expect(clean).not.toContain("<iframe");
    expect(clean).not.toContain("<style");
    expect(clean).toContain("<p>Real</p>");
  });

  it("drops class and style attributes, which could cover the page", () => {
    const clean = sanitizeHtml('<div class="fixed inset-0" style="position:fixed">x</div>');
    expect(clean).not.toContain("class=");
    expect(clean).not.toContain("style=");
  });

  it("survives a form-action style injection attempt", () => {
    const clean = sanitizeHtml('<form action="https://evil.example"><input name="card"></form>');
    expect(clean).not.toContain("<form");
    expect(clean).not.toContain("<input");
  });
});

describe("isBlankHtml", () => {
  it("treats an empty document as blank", () => {
    expect(isBlankHtml("")).toBe(true);
    expect(isBlankHtml(undefined)).toBe(true);
    expect(isBlankHtml("<p></p>")).toBe(true);
    expect(isBlankHtml("<p>&nbsp;</p>")).toBe(true);
  });

  it("treats markup with words in it as not blank", () => {
    expect(isBlankHtml("<p>Something</p>")).toBe(false);
  });

  it("treats a document whose only content was stripped as blank", () => {
    // Nothing a shopper would see survives, so the page should show its
    // "no description" copy rather than an empty box.
    expect(isBlankHtml("<script>alert(1)</script>")).toBe(true);
  });
});
