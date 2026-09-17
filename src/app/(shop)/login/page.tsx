import { redirect } from "next/navigation";

/**
 * `/login` is not this storefront's sign-in URL — `/account/login` is. It
 * exists because the backend's `handleOAuthError` (and `googleLogin`'s own
 * failure path) redirect to `${FRONTEND_URL}/login?error=...`, a path inherited
 * from the template the auth module came from.
 *
 * A redirect rather than a second sign-in page, so there is exactly one
 * canonical sign-in URL and no chance of the two drifting. The query string is
 * carried over, which is the entire point: the `?error=` code is what the
 * sign-in page turns into a message the customer can act on.
 */
export default async function LegacyLoginRedirect({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
    else if (Array.isArray(value) && value.length > 0) query.set(key, value[0]);
  }

  const search = query.toString();
  redirect(`/account/login${search ? `?${search}` : ""}`);
}
