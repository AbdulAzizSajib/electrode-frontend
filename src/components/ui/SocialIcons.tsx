// lucide-react no longer ships brand/social logos, so these are small inline
// SVGs kept intentionally minimal.
type IconProps = { size?: number; className?: string };

export function FacebookIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.5-1.5H16.5V4.3c-.27-.04-1.2-.12-2.28-.12-2.25 0-3.79 1.37-3.79 3.9V10.5H8v3h2.43V21h3.07Z" />
    </svg>
  );
}

export function InstagramIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22 12s0-3.2-.4-4.7a2.6 2.6 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.5a2.6 2.6 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.7a2.6 2.6 0 0 0 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.5a2.6 2.6 0 0 0 1.8-1.8c.4-1.5.4-4.7.4-4.7ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  );
}

export function XIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.9 3H21l-6.8 7.8L22 21h-6.6l-5.2-6.6L4.3 21H2.1l7.3-8.3L2 3h6.7l4.7 6.1L18.9 3Zm-1.2 16h1.2L7.4 5H6.1l11.6 14Z" />
    </svg>
  );
}

export function PinterestIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.7.2-2.5l1.4-6s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.5-1 3.8-.2 1.1.6 2 1.7 2 2 0 3.5-2.1 3.5-5.2 0-2.7-2-4.6-4.7-4.6-3.2 0-5.1 2.4-5.1 4.9 0 1 .4 2 .9 2.6.1.1.1.2.1.3l-.3 1.3c0 .2-.2.3-.4.2-1.4-.6-2.3-2.6-2.3-4.2 0-3.4 2.5-6.6 7.1-6.6 3.7 0 6.6 2.7 6.6 6.2 0 3.7-2.3 6.7-5.6 6.7-1.1 0-2.1-.6-2.5-1.2l-.7 2.6c-.2 1-.9 2.2-1.3 3A10 10 0 1 0 12 2Z" />
    </svg>
  );
}
