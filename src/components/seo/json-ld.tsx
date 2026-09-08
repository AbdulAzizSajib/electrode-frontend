/**
 * Renders a JSON-LD block, or nothing at all.
 *
 * `null` in, nothing out — so the "this schema type is switched off" case is one
 * early return here rather than a conditional at every call site. The builders
 * in `@/lib/seo/schema-builders` each return null when their toggle is off, so a
 * page can mount `<JsonLd data={buildProductSchema(...)} />` unconditionally.
 */
export default function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;

  /*
   * `<` and `&` escaped before injection. The payload carries merchant-authored
   * free text — product names, descriptions, an organisation's legal name — and
   * a literal `</script>` inside a JSON string would otherwise close this tag
   * early and let the rest of the value parse as markup.
   *
   * Unicode escapes rather than entities: this sits inside a script element, not
   * in HTML text, so `&lt;` would be read literally and corrupt the JSON. `<`
   * is valid JSON that parses back to the original character.
   */
  const json = JSON.stringify(data)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");

  return (
    <script
      type="application/ld+json"
      // The value is JSON we just serialised and escaped ourselves, never raw
      // markup from the API.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
