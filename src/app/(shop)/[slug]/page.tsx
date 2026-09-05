import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RichText from "@/components/product/RichText";
import { excerptFromBody, getPageBySlug } from "@/services/page";

/*
 * Merchant-authored content pages — About, Terms & Conditions, Refund Policy —
 * served at the storefront root so their URLs read the way a shopper expects.
 *
 * No `generateStaticParams`: pre-rendering would mean a rebuild before a new
 * page went live, which defeats the point of authoring one in the admin panel.
 * The service's revalidate window keeps the cost near zero instead.
 *
 * This is the LAST route matched at the root. Next.js gives a static segment
 * precedence over a dynamic one, so /cart, /products and friends keep working
 * untouched — and the backend refuses those slugs on write so a merchant is
 * told, rather than left wondering why their page never appears. See the
 * server's `page.constant.ts`.
 */

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) return { title: "Page not found" };

  return {
    title: page.metaTitle || page.title,
    // Falls back to the start of the body so a page is never published without
    // a description search results can show.
    description: page.metaDescription || excerptFromBody(page.body),
  };
}

export default async function ContentPageRoute({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  // Unknown slug, draft page, and unreachable API all land here. A visitor
  // cannot tell an unpublished page from one that never existed, which is the
  // point — a draft's title should not leak through a 404 that looks different.
  if (!page) notFound();

  return (
    <article className="container-px mx-auto max-w-4xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">{page.title}</h1>
      <div className="mt-6 h-px w-full bg-gray-200" />
      {/*
        `page.body` is already sanitised by the service. RichText sanitises
        again — idempotent, and it keeps one component owning the prose styles
        rather than this route growing its own copy of them.
      */}
      <RichText html={page.body} className="mt-6 text-base [&_p]:my-4 [&_li]:my-1.5" />
    </article>
  );
}
