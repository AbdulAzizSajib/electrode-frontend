import { Icon } from "@iconify/react";
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

const CHANNEL_META = {
    whatsapp: {
        icon: "akar-icons:whatsapp-fill",
        label: "WhatsApp",
        // WhatsApp's own green. The bubble is a recognised third-party affordance,
        // so it wears that service's colour rather than the store's brand token —
        // a shopper identifies it by colour before reading the label.
        className: "bg-[#25D366] hover:bg-[#1da851]",
    },
    messenger: {
        icon: "akar-icons:messenger-fill",
        label: "Messenger",
        className: "bg-[#0084FF] hover:bg-[#0068cc]",
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
            : messengerUsername
              ? `https://m.me/${messengerUsername}`
              : null;

    if (!href) return null;

    const label = greeting?.trim() || DEFAULT_GREETING;

    return (
        /*
         * STACKED ABOVE THE BACK-TO-TOP BUTTON, which is `fixed bottom-6 right-4`
         * in `CartRail.tsx` — the same corner. At `md:bottom-6` the two occupied
         * one spot and overlapped. `md:bottom-20` clears that 40px circle plus a
         * gap, and both share `right-4` so they read as one column rather than
         * two things that missed each other.
         *
         * Below `md` the offset is larger again (`bottom-32`): `MobileBottomNav`
         * is `fixed` on that breakpoint and reserves the iOS home indicator with
         * `env(safe-area-inset-bottom)` on top of its own height, so the bubble
         * has to clear the nav rather than sit on a nav item.
         *
         * Any change to the back-to-top button's position has to be mirrored
         * here — nothing computes this, and an overlap is only visible once both
         * happen to be on screen at the same moment.
         *
         * `z-30` sits under the cart drawer and the header's own overlays (z-40+)
         * so an open drawer is never competing with a floating button.
         */
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} on ${meta.label}`}
            className={`fixed bottom-32 right-4 z-30 flex items-center gap-2 rounded-full py-3 pl-3 pr-4 text-white shadow-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:bottom-20 md:right-4 ${meta.className}`}
            style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
            <Icon icon={meta.icon} width={24} height={24} aria-hidden />
            {/*
              Hidden below `sm` rather than dropped: on a phone the bubble shares
              its row with nothing, but the label pushes a wide greeting across
              the thumb zone. The accessible name carries it either way, so a
              screen reader still announces the full greeting.
            */}
            <span className="hidden text-sm font-medium sm:inline">{label}</span>
        </a>
    );
}
