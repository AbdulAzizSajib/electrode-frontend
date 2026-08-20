export function placeholderImage(seed: string, opts: { w?: number; h?: number; label?: string } = {}) {
  const { w = 800, h = 800, label } = opts;
  const params = new URLSearchParams({ seed, w: String(w), h: String(h) });
  if (label) params.set("label", label);
  return `/api/placeholder?${params.toString()}`;
}
