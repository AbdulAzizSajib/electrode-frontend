import { cache } from "react";
import type { IconifyIcon } from "@iconify/react";

/**
 * Merchant-configured Iconify icons, resolved on the server.
 *
 * Header links, perks and landing-page items name their icons by Iconify name
 * (`lucide:truck`), and `@iconify/react` used to fetch each one from
 * api.iconify.design in the browser after hydration — so every icon popped in
 * after the page had painted. Resolving the data here and rendering it with
 * `ssr` puts the SVG in the HTML. The names come from store settings and
 * landing data, so they cannot be bundled at build time.
 *
 * Never throws: an unknown name or an unreachable API yields `null`, and the
 * caller renders `MerchantIcon`'s client-side fallback, which is exactly what
 * happened before this existed.
 */

const ICONIFY_API = "https://api.iconify.design";

/** Icon data is immutable per name, so a week is safe. */
const ICON_REVALIDATE_SECONDS = 60 * 60 * 24 * 7;

/** `prefix:name`, both parts in Iconify's character set. */
const ICON_NAME = /^([a-z0-9]+(?:-[a-z0-9]+)*):([a-z0-9]+(?:-[a-z0-9]+)*)$/;

type IconifyJSON = {
  prefix?: string;
  width?: number;
  height?: number;
  icons?: Record<string, Partial<IconifyIcon> & { body: string }>;
  aliases?: Record<string, Partial<IconifyIcon> & { parent: string }>;
};

/**
 * Builds one icon from an Iconify JSON response: the set's default size, the
 * icon's own overrides, and — for an alias — its parent's body with the
 * alias's transformations on top. One level of aliasing is all the API
 * returns for a single requested name.
 */
export function iconFromSet(set: IconifyJSON, name: string): IconifyIcon | null {
  const defaults = { width: set.width ?? 16, height: set.height ?? 16 };

  const icon = set.icons?.[name];
  if (icon) return { ...defaults, ...icon };

  const alias = set.aliases?.[name];
  const parent = alias ? set.icons?.[alias.parent] : undefined;
  if (!alias || !parent) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { parent: _parentName, ...transforms } = alias;
  return { ...defaults, ...parent, ...transforms };
}

/** One icon's data, fetched once per name and cached for a week. */
export const resolveIcon = cache(async (fullName: string | undefined): Promise<IconifyIcon | null> => {
  const match = fullName ? ICON_NAME.exec(fullName.trim()) : null;
  if (!match) return null;

  const [, prefix, name] = match;
  try {
    const response = await fetch(`${ICONIFY_API}/${prefix}.json?icons=${name}`, {
      next: { revalidate: ICON_REVALIDATE_SECONDS },
    });
    if (!response.ok) return null;
    return iconFromSet((await response.json()) as IconifyJSON, name);
  } catch {
    return null;
  }
});

/** Several icons at once, keyed by their full name; unresolved names are left out. */
export async function resolveIcons(
  names: Array<string | undefined>,
): Promise<Record<string, IconifyIcon>> {
  const unique = [...new Set(names.filter((name): name is string => Boolean(name)))];
  const resolved = await Promise.all(unique.map(async (name) => [name, await resolveIcon(name)] as const));
  return Object.fromEntries(resolved.filter((entry): entry is [string, IconifyIcon] => entry[1] !== null));
}
