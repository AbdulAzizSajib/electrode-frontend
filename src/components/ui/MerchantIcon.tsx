"use client";

import { Icon, type IconProps } from "@iconify/react";
import type { IconifyIcon } from "@iconify/react";

/**
 * A merchant-configured Iconify icon.
 *
 * With `data` (resolved on the server by `@/lib/iconify`) it renders in the
 * server's HTML: `ssr` is what makes `@iconify/react` render on the first pass
 * instead of an empty span until mount. Without it — an unknown name, or the
 * icon API unreachable at render time — it falls back to the old behaviour of
 * loading the icon in the browser, which renders nothing for a name that does
 * not exist.
 */
export default function MerchantIcon({
  name,
  data,
  ...props
}: Omit<IconProps, "icon" | "ssr"> & { name: string; data?: IconifyIcon | null }) {
  return data ? <Icon icon={data} ssr {...props} /> : <Icon icon={name} {...props} />;
}
