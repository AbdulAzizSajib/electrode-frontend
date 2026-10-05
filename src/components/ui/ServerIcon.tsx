import type { IconProps } from "@iconify/react";
import MerchantIcon from "@/components/ui/MerchantIcon";
import { resolveIcon } from "@/lib/iconify";

/**
 * `MerchantIcon` for Server Components: resolves its own data, so the icon is
 * in the HTML. Client components cannot await, so they take the data as a prop
 * from a server parent instead (see the shop layout).
 */
export default async function ServerIcon({
  name,
  ...props
}: Omit<IconProps, "icon" | "ssr"> & { name: string }) {
  return <MerchantIcon name={name} data={await resolveIcon(name)} {...props} />;
}
