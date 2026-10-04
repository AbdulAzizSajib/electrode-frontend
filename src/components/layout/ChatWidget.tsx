import type { ChatWidget as ChatWidgetSettings } from "@/types/store-settings";

/**
 * The floating chat bubble: one tap from any shop page into a conversation with
 * the seller.
 *
 * A LINK, NOT AN EMBEDDED CHAT. There is no message thread here, no transcript
 * and no unread badge — the conversation lives in WhatsApp or Messenger, which
 * is where the merchant already answers. That also means no third-party chat
 * SDK: a Customer Chat plugin or a Tawk/Crisp embed ships a script tag that
 * reads the page and tracks the visitor, and a link needs neither. Being a
 * plain anchor, it costs nothing on first paint and works before hydration,
 * which is why this stays a server component.
 *
 * MOUNTED IN `(shop)` ONLY. `(landing)` is deliberately bare — one visitor, one
 * ad, one order form — and a floating bubble there is an exit from the only
 * funnel that page exists to serve. The route-group split already encodes that
 * decision, so mounting in the shop layout inherits it rather than restating it
 * as a condition here.
 *
 * ONE CHANNEL AT A TIME, never both: two bubbles is a decision pushed onto the
 * visitor, and the merchant already knows which app they actually read.
 *
 * See server/openspec/changes/add-footer-credit-and-chat-widget, design.md
 * Decisions 6 and 7.
 */

/** The wording when the merchant has set no greeting of their own. */
const DEFAULT_GREETING = "Chat With Us";

function WhatsAppSvg({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967s-.47-.148-.669.15c-.198.297-.767.966-.94 1.164c-.174.199-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.019-.458.13-.606c.134-.133.297-.347.446-.52s.198-.298.297-.497c.1-.198.05-.371-.025-.52c-.074-.149-.668-1.612-.916-2.207c-.241-.579-.486-.5-.668-.51c-.174-.008-.372-.01-.57-.01s-.52.074-.792.372c-.273.297-1.04 1.016-1.04 2.479c0 1.462 1.064 2.875 1.213 3.074s2.095 3.2 5.076 4.487c.71.306 1.263.489 1.694.625c.712.227 1.36.195 1.872.118c.57-.085 1.758-.719 2.006-1.413s.247-1.289.173-1.413s-.272-.198-.57-.347m-5.422 7.403h-.004a9.87 9.87 0 0 1-5.032-1.378l-.36-.214l-3.742.982l.999-3.648l-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.002-5.45 4.436-9.884 9.889-9.884a9.8 9.8 0 0 1 6.988 2.899a9.82 9.82 0 0 1 2.892 6.992c-.002 5.45-4.436 9.885-9.884 9.885m8.412-18.297A11.82 11.82 0 0 0 11.992 0C5.438 0 .102 5.335.1 11.892a11.86 11.86 0 0 0 1.587 5.945L0 24l6.304-1.654a11.9 11.9 0 0 0 5.684 1.448h.005c6.554 0 11.89-5.335 11.892-11.893a11.82 11.82 0 0 0-3.48-8.413"
            />
        </svg>
    );
}

function MessengerSvg({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17c.16.13.26.35.27.57l.05 1.78c.04.57.61.94 1.13.71l1.98-.87c.17-.08.36-.1.55-.06c.91.25 1.87.38 2.88.38c5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2m5.89 7.58l-2.93 4.67c-.47.73-1.47.92-2.17.4l-2.33-1.75a.6.6 0 0 0-.72 0l-3.15 2.4c-.42.32-.97-.18-.69-.63l2.93-4.67c.47-.73 1.47-.92 2.17-.4l2.33 1.75a.6.6 0 0 0 .72 0l3.15-2.4c.42-.32.97.18.69.63" />
        </svg>
    );
}

const CHANNEL_META = {
    whatsapp: {
        IconComponent: WhatsAppSvg,
        label: "WhatsApp",
        // WhatsApp's own green. The bubble is a recognised third-party affordance,
        // so it wears that service's colour rather than the store's brand token —
        // a shopper identifies it by colour before reading the label.
        className: "bg-[#25D366] hover:bg-[#1da851]",
        pulseClassName: "bg-[#25D366]",
    },
    messenger: {
        IconComponent: MessengerSvg,
        label: "Messenger",
        className: "bg-[#0084FF] hover:bg-[#0068cc]",
        pulseClassName: "bg-[#0084FF]",
    },
} as const;

export default function ChatWidget({ settings }: { settings: ChatWidgetSettings }) {
    const { enabled, channel, whatsappNumber, messengerUsername, greeting } = settings;

    /*
     * The backend already serves `enabled: false` when the destination does not
     * resolve, so this is the LAST of three layers rather than the only one —
     * but it is still checked, because a field can always arrive empty from an
     * older API, and half a `wa.me/` URL opens a conversation with nobody.
     */
    if (!enabled) return null;

    const meta = CHANNEL_META[channel];
    if (!meta) return null;

    const cleanMessenger = messengerUsername
        ?.trim()
        .replace(/^(?:https?:\/\/)?(?:www\.)?(?:m\.me|facebook\.com)\//i, "")
        .replace(/^@/, "")
        .replace(/\/+$/, "");

    /*
     * `wa.me` takes DIGITS ONLY as its path segment — no `+`, no separators —
     * and simply fails to open a chat when they are present, silently. The
     * backend normalises to E.164, so this strip is the belt to that braces:
     * the same `replace(/\D/g, "")` the mobile bottom nav already applies.
     */
    const href =
        channel === "whatsapp"
            ? whatsappNumber
                ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`
                : null
            : cleanMessenger
              ? `https://m.me/${cleanMessenger}`
              : null;

    if (!href) return null;

    const label = greeting?.trim() || DEFAULT_GREETING;
    const ChannelIcon = meta.IconComponent;

    return (
        /*
         * STACKED ABOVE THE BACK-TO-TOP BUTTON, which is `fixed bottom-6 right-4`
         * in `CartRail.tsx` — the same corner. At `md:bottom-6` the two occupied
         * one spot and overlapped. `md:bottom-20` clears that 40px circle plus a
         * gap, and both share `right-4` so they read as one column rather than
         * two things that missed each other.
         *
         * Below `md`, `bottom-20` clears the fixed `MobileBottomNav` (3.75rem
         * tall) plus `env(safe-area-inset-bottom)` without floating up into the
         * middle of page section headers.
         *
         * `z-30` sits under the cart drawer and the header's own overlays (z-40+)
         * so an open drawer is never competing with a floating button.
         */
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} on ${meta.label}`}
            className={`fixed bottom-20 right-4 z-30 flex size-12 items-center justify-center rounded-full text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)] ring-2 ring-white/90 transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:size-auto sm:gap-2.5 sm:py-3 sm:pl-3.5 sm:pr-4 md:bottom-20 md:right-4 ${meta.className}`}
            style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
            {/* Mobile-only slow pulse/ping aura so the icon-only bubble gently catches the eye */}
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 rounded-full opacity-50 animate-ping [animation-duration:2.8s] motion-reduce:animate-none sm:hidden ${meta.pulseClassName}`}
            />
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute -inset-1.5 rounded-full opacity-35 animate-pulse [animation-duration:3.2s] motion-reduce:animate-none sm:hidden ${meta.pulseClassName}`}
            />
            <ChannelIcon className="relative size-6 shrink-0" />
            {/*
              Hidden below `sm` rather than dropped: on a phone the bubble is a
              clean circular FAB, while on wider screens it expands into a pill
              with the greeting label beside the icon.
            */}
            <span className="relative hidden text-sm font-semibold tracking-tight whitespace-nowrap sm:inline">
                {label}
            </span>
        </a>
    );
}

