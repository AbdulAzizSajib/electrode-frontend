import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { excerptFromBody } from "@/services/page";

/**
 * Pins the admin's page editor to the storefront's allow-list.
 *
 * These two halves are a single switch: the editor can emit a tag the sanitiser
 * strips, and the merchant would only find out by noticing their formatting had
 * silently vanished on the live site. Adding a Tiptap extension without adding
 * its tag here is meant to turn that into a failing test rather than a support
 * ticket.
 *
 * The list below mirrors exactly what `RichTextEditor` is configured with in the
 * admin panel: StarterKit's headings, emphasis, lists and blockquote, the Link
 * extension, and — for content pages only — Image.
 */
describe("page body survives sanitisation", () => {
  const editorOutputs: Record<string, string> = {
    heading: "<h2>Refunds</h2>",
    subheading: "<h3>Eligibility</h3>",
    paragraph: "<p>Returns are accepted within 30 days.</p>",
    bold: "<p><strong>Important</strong></p>",
    italic: "<p><em>within 30 days</em></p>",
    strike: "<p><s>60 days</s></p>",
    bulletList: "<ul><li>Unused</li><li>Original packaging</li></ul>",
    orderedList: "<ol><li>Contact us</li><li>Ship it back</li></ol>",
    blockquote: "<blockquote><p>No questions asked.</p></blockquote>",
  };

  for (const [name, html] of Object.entries(editorOutputs)) {
    it(`keeps ${name} exactly as authored`, () => {
      expect(sanitizeHtml(html)).toBe(html);
    });
  }

  it("keeps a link's destination and text", () => {
    const clean = sanitizeHtml(
      '<p><a href="/contact" rel="noopener noreferrer">Contact us</a></p>',
    );
    expect(clean).toContain('href="/contact"');
    expect(clean).toContain("Contact us");
  });

  it("drops target and rel from anchors, so links stay same-tab", () => {
    // Not a configuration slip: DOMPurify removes both regardless of the
    // allow-list. Asserted rather than worked around because it is the
    // storefront's actual behaviour — and a same-tab link cannot be a reverse
    // tabnabbing vector, so there is nothing to fix.
    const clean = sanitizeHtml(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Docs</a>',
    );
    expect(clean).not.toContain("target=");
    expect(clean).toContain('href="https://example.com"');
  });

  it("keeps an image, which content pages may contain but product descriptions never did", () => {
    const clean = sanitizeHtml(
      '<img src="https://cdn.example.com/policy.png" alt="Returns flow">',
    );
    expect(clean).toContain('src="https://cdn.example.com/policy.png"');
    expect(clean).toContain('alt="Returns flow"');
  });

  it("still refuses an image with a javascript: source", () => {
    const clean = sanitizeHtml('<img src="javascript:alert(1)" alt="x">');
    expect(clean).not.toContain("javascript:");
  });

  it("still refuses a data: image payload", () => {
    const clean = sanitizeHtml(
      '<img src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==" alt="x">',
    );
    expect(clean).not.toContain("data:text/html");
  });

  it("strips a script tag smuggled into a page body", () => {
    const clean = sanitizeHtml('<p>Policy</p><script>fetch("/steal")</script>');
    expect(clean).not.toContain("<script");
    expect(clean).toContain("<p>Policy</p>");
  });
});

describe("excerptFromBody", () => {
  it("strips markup down to readable text", () => {
    expect(excerptFromBody("<h2>About</h2><p>We sell <strong>gadgets</strong>.</p>")).toBe(
      "About We sell gadgets .",
    );
  });

  it("returns short text unchanged and untruncated", () => {
    expect(excerptFromBody("<p>Short and sweet.</p>")).toBe("Short and sweet.");
  });

  it("truncates on a word boundary rather than mid-word", () => {
    const body = `<p>${"alpha bravo ".repeat(30)}</p>`;
    const excerpt = excerptFromBody(body, 40);

    expect(excerpt.length).toBeLessThanOrEqual(41); // 40 plus the ellipsis
    expect(excerpt.endsWith("…")).toBe(true);
    // A boundary cut never leaves a half-word before the ellipsis.
    expect(excerpt.replace("…", "").trimEnd()).toMatch(/(alpha|bravo)$/);
  });

  it("handles an empty body without throwing", () => {
    expect(excerptFromBody("")).toBe("");
  });
});
