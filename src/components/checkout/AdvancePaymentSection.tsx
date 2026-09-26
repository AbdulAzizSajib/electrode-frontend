"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { Building2, Check, Copy, Smartphone } from "lucide-react";
import clsx from "clsx";
import { Field } from "@/components/account/form-controls";
import { FOCUS_RING } from "@/lib/focus-ring";
import { formatPrice } from "@/lib/format";
import type { AdvanceSplit } from "@/types/order";
import type {
  AdvancePaymentChoice,
  AdvancePaymentConfig,
  BankAccount,
  MobileBankingAccount,
  MobileBankingProvider,
} from "@/types/store-settings";

/**
 * Where a shopper chooses to pay before the order ships, and says what they
 * sent.
 *
 * Rendered only when the merchant has advance payment on. With it off, checkout
 * shows the unchanged cash-on-delivery panel and this file is never mounted —
 * which is the property the whole feature rests on: a store that predates it
 * runs the same path it always did.
 *
 * NO SECTION, NO HEADING, NO BOX OF ITS OWN. This renders bare content because
 * it opens inside the frame of whatever holds it — today the order summary card,
 * under the Total it is asking the shopper to pay part of. It used to be a
 * `<section>` with its own "Payment" heading, and that is exactly what made the
 * page read as two separate decisions to make rather than one to finish. The
 * caller owns the frame; see the note at the mount point in CheckoutForm.tsx.
 *
 * ONE FILLED SURFACE, AND NOTHING FILLED INSIDE IT. Everything that opens once
 * a choice is made sits on a single grey plate, so the step reads as one place
 * to finish rather than a stack of loose blocks — and every white thing on it
 * (the account cards, the details panel, the two fields) is a thing to touch.
 * That is why the instruction no longer carries a grey box of its own: a grey
 * card on a grey plate is two borders drawn around one sentence, and it takes
 * the white surfaces' only job away from them.
 *
 * The two choice cards stay OUTSIDE the plate, on the card's own white, because
 * they are the question being asked rather than the work of answering it — and
 * they are built to the delivery cards' metrics so that the two reads as one
 * pattern even now that they sit in different columns.
 *
 * The amounts are NOT computed here. They arrive from the server's quote, which
 * placement recomputes from the same function — a storefront that multiplied or
 * rounded for itself would show ৳130, take ৳130, and have the claim refused for
 * not being ৳130.4. See
 * server/openspec/changes/add-advance-payment-checkout, design.md Decision 7.
 */

/** The label a shopper reads for each mobile-money service. */
const PROVIDER_LABEL: Record<MobileBankingProvider, string> = {
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
};

/**
 * The same services as the Bangla field copy says them, so a hint written in
 * Bangla can name the chosen one without switching script mid-sentence.
 */
const PROVIDER_LABEL_BN: Record<MobileBankingProvider, string> = {
  BKASH: "বিকাশ",
  NAGAD: "নগদ",
  ROCKET: "রকেট",
};

/**
 * The marks this app SHIPS, for a merchant who has uploaded none.
 *
 * The uploaded icon on the account wins wherever there is one — these exist so
 * that a store which has never opened Checkout Settings still shows a shopper
 * something to recognise, rather than paying for the feature with a worse card
 * than it had before. Partial on purpose: only the two a shop here actually
 * configures ship a file, and `ProviderMark` handles the rest.
 */
const BUNDLED_PROVIDER_ICON: Partial<Record<MobileBankingProvider, string>> = {
  BKASH: "/mobileBankingIcon/bkash.png",
  NAGAD: "/mobileBankingIcon/nagat.png",
};

/** Which channel's accounts are on show. A merchant may have configured either. */
type Channel = "MOBILE" | "BANK";

export interface AdvanceClaimDraft {
  choice: AdvancePaymentChoice | null;
  accountId: string | null;
  senderIdentifier: string;
  transactionId: string;
}

export const EMPTY_ADVANCE_CLAIM: AdvanceClaimDraft = {
  choice: null,
  accountId: null,
  senderIdentifier: "",
  transactionId: "",
};

/**
 * The claim a shopper starts with when the merchant takes money up front.
 *
 * PRESELECTED, and that is a deliberate reversal. Both choices used to start
 * blank so that neither was made for the shopper. In a shop that takes the
 * delivery charge in advance to stop fake orders, though, "send the delivery
 * charge" is not one of two equal options — it is how the shop works, and an
 * unanswered pair only left people wondering which one they were supposed to
 * tick. The cheaper of the two is the one selected, never full payment: a
 * default that asks for the whole total from someone who came for cash on
 * delivery would be taking a decision about their money, which is the part of
 * the old reasoning that still holds.
 *
 * THE CONSEQUENCE IS THAT AN ADVANCE IS NOW REQUIRED. With a choice always set,
 * there is no longer a path through this form that sends nothing up front —
 * every order carries a reference someone has to verify. A merchant who wants
 * the old "pay everything at the door" path back turns advance payment off in
 * Checkout Settings, which is the switch that was always meant to decide it.
 *
 * The first mobile account is preselected with it — bKash in a typical setup,
 * since that is the one a Bangladeshi shop configures first — so the number to
 * send to is on screen without a second click. Falls back to a bank account for
 * a merchant who configured only those.
 */
export function defaultAdvanceClaim(
  config: AdvancePaymentConfig,
): AdvanceClaimDraft {
  return {
    ...EMPTY_ADVANCE_CLAIM,
    choice: "DELIVERY_CHARGE",
    accountId: config.mobileAccounts[0]?.id ?? config.bankAccounts[0]?.id ?? null,
  };
}

export interface AdvanceClaimErrors {
  choice?: string;
  accountId?: string;
  senderIdentifier?: string;
  transactionId?: string;
}

/** One selectable account, reduced to what the cards need to tell apart. */
interface AccountChoice {
  id: string;
  title: string;
  /** The merchant's own wording for this account. Shown only to disambiguate. */
  note: string;
  /** The service's or bank's mark. Always set for a card that is rendered. */
  icon?: ReactNode;
}

/**
 * A value the shopper has to retype into another app, with one tap to take it.
 *
 * Copying is the difference between reading an eleven-digit number off one
 * screen into another and mistyping it — and a mistyped account number is money
 * sent to a stranger, which nothing downstream can undo. The confirmation is
 * shown rather than assumed because the clipboard API can and does fail
 * silently; a button that reports success it did not have is worse than none.
 *
 * NOTHING HERE TRUNCATES. An account number with an ellipsis through it is worse
 * than no account number: it looks complete enough to type. Long values wrap,
 * and digits are set in tabular figures so a wrapped number still reads as one.
 */
function CopyableValue({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  /*
   * Held so the confirmation can be cancelled. Selecting a different account
   * unmounts this panel mid-countdown, and a second tap used to leave two
   * timers racing to clear one flag — the second landing early and dropping
   * "Copied" while the shopper was still looking at it.
   */
  const resetTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard permission, or an insecure origin. The value is on screen
      // either way, so the shopper can still read it — nothing is lost but the
      // convenience, and claiming otherwise would be the failure.
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold break-words text-gray-900 tabular-nums">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={() => void copy()}
        className={clsx(
          "flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 px-3 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 motion-reduce:transition-none",
          FOCUS_RING,
        )}
        aria-label={`Copy ${label}`}
      >
        {copied ? (
          <>
            <Check size={14} className="text-green-600" /> Copied
          </>
        ) : (
          <>
            <Copy size={14} /> Copy
          </>
        )}
      </button>
      {/* The swap from "Copy" to "Copied" is the whole feedback, and it is
          invisible to anyone who is not watching the button. Said once, quietly,
          where a screen reader will pick it up. */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </div>
  );
}

/**
 * The mark on one account card, at the size the cards use.
 *
 * NEVER NOTHING, which is the property the whole thing rests on: a row where
 * one card opens with a mark and the next opens with its title reads as two
 * different kinds of thing, and the shopper is choosing between them. Every
 * caller therefore supplies a `fallback` glyph, and a missing or unreachable
 * upload costs the artwork rather than the alignment.
 *
 * DECORATIVE, hence `alt=""` — the card's title says "bKash" or the bank's name
 * in words directly beside it, and a screen reader that announced the image too
 * would say it twice.
 *
 * ONE COMPONENT FOR BOTH CHANNELS, with the ORDER OF SOURCES decided by the
 * caller, because the two channels genuinely differ in what they can fall back
 * to. A mobile account has a service behind it that this app ships artwork for;
 * a bank has forty-odd possible logos and none of them are here.
 */
function AccountMark({ src, fallback }: { src?: string; fallback: ReactNode }) {
  if (!src) {
    return (
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-500">
        {fallback}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={28}
      height={28}
      className="size-7 shrink-0 rounded-md object-contain"
    />
  );
}

/**
 * The mark for a mobile-money account.
 *
 * THREE SOURCES, IN ORDER, and every one is a real state rather than defensive
 * padding: the merchant's own upload from Checkout Settings, then the file this
 * app ships for that service, then the generic handset. A merchant who uploads
 * nothing still gets a bKash bird; one who uploads better artwork gets theirs;
 * a shop configured with Rocket, which ships no file, gets a glyph instead of a
 * broken image.
 *
 * Trimmed before it is believed — the admin clears an icon by writing "", and
 * an empty string is a URL as far as `??` is concerned, which is why this is
 * `||` and not `??`.
 */
function MobileAccountMark({ account }: { account: MobileBankingAccount }) {
  return (
    <AccountMark
      src={account.iconUrl?.trim() || BUNDLED_PROVIDER_ICON[account.provider]}
      fallback={<Smartphone size={15} />}
    />
  );
}

/**
 * The mark for a bank account: the merchant's upload, or the generic building.
 *
 * TWO SOURCES, not three. Nothing ships a bank's logo, so an account without an
 * upload gets the same glyph the Bank tab above it carries — which is at least
 * the right category of thing, and is what these cards showed before uploads
 * existed.
 */
function BankAccountMark({ account }: { account: BankAccount }) {
  return (
    <AccountMark
      src={account.iconUrl?.trim() || undefined}
      fallback={<Building2 size={15} />}
    />
  );
}

/**
 * One selectable merchant account, as a card rather than a radio in a list.
 *
 * DELIBERATELY LIGHTER THAN THE TWO CHOICE CARDS ABOVE IT — smaller radius,
 * less padding, no price. Giving it the same weight made the step read as four
 * equal decisions when it is one decision and a follow-up.
 *
 * The mark is sized to that same restraint: 28px, beside the title rather than
 * above it, so the card stays one line tall on the usual setup. It is the
 * fastest thing on this step to recognise — a shopper scanning for where to send
 * money finds the pink bird before they read anything — which is what makes it
 * worth the width, and also why it must not grow into a logo the card is
 * arranged around.
 *
 * Both channels carry one. What differs is what a card falls back to when the
 * merchant has uploaded nothing — the service's own artwork on the mobile tab,
 * a generic building on the bank tab — and the two never appear together, so
 * the tabs are free to differ in that without any row going ragged.
 *
 * The account number is NOT on the card; it appears once, in the details panel,
 * for the account actually chosen. See the note above that panel.
 */
function AccountCard({
  selected,
  onSelect,
  title,
  note,
  icon,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  /** Empty unless another account in the same list carries the same title. */
  note: string;
  /** The service's or bank's mark. See `AccountMark`, which is never empty. */
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={clsx(
        "flex min-h-11 w-full items-center gap-2.5 rounded-lg border p-3 text-left transition-colors motion-reduce:transition-none",
        selected
          ? "border-brand bg-brand/10 ring-1 ring-brand"
          : "border-gray-200 bg-white hover:border-gray-300",
        FOCUS_RING,
      )}
    >
      {icon}
      {/* `min-w-0` so a long bank name wraps inside the card instead of pushing
          the card wider than the grid column it sits in. */}
      <span className="flex min-w-0 flex-col items-start gap-0.5">
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        {note && <span className="text-xs text-gray-500">{note}</span>}
      </span>
    </button>
  );
}

export default function AdvancePaymentSection({
  config,
  splits,
  claim,
  errors,
  onChange,
  quoting,
}: {
  /** The merchant's configured accounts. Only reached with `enabled` true. */
  config: AdvancePaymentConfig;
  /**
   * What each choice costs, from the server's quote. Null until a delivery
   * option is chosen — there is no delivery charge to send before then.
   */
  splits: Record<AdvancePaymentChoice, AdvanceSplit> | null;
  claim: AdvanceClaimDraft;
  errors: AdvanceClaimErrors;
  onChange: (patch: Partial<AdvanceClaimDraft>) => void;
  /** A re-quote is in flight, so the figures on screen are about to move. */
  quoting: boolean;
}) {
  const { mobileAccounts, bankAccounts } = config;

  /*
   * Which channel's accounts are shown. Seeded to whichever the merchant
   * actually configured — a store with bank accounts only must not open on an
   * empty mobile tab — and only switchable when both exist.
   */
  const [channel, setChannel] = useState<Channel>(
    mobileAccounts.length > 0 ? "MOBILE" : "BANK",
  );
  const offersBoth = mobileAccounts.length > 0 && bankAccounts.length > 0;

  const selectedMobile: MobileBankingAccount | undefined = mobileAccounts.find(
    (a) => a.id === claim.accountId,
  );
  const selectedBank: BankAccount | undefined = bankAccounts.find(
    (a) => a.id === claim.accountId,
  );

  /*
   * Switching channel clears the selection. The two lists are disjoint, so a
   * selection made on one tab is invisible on the other — leaving it set would
   * mean a shopper on the Bank tab sending money to a bKash number their claim
   * still names.
   */
  const switchChannel = (next: Channel) => {
    if (next === channel) return;
    setChannel(next);
    onChange({ accountId: null });
  };

  const split = claim.choice && splits ? splits[claim.choice] : null;

  /** The sender field asks for different things on the two channels. */
  const senderLabel =
    channel === "BANK"
      ? "প্রেরকের নাম বা অ্যাকাউন্ট নম্বর"
      : "প্রেরক নাম্বার";

  /*
   * The hint names the service actually chosen above it. A card reading "Nagad"
   * over a field asking for a বিকাশ number is the one mismatch on this step
   * that can send real money to the wrong wallet. Until an account is picked
   * there is no service to name, so it stays generic rather than guessing at
   * the first one in the list.
   */
  const senderPlaceholder =
    channel === "BANK"
      ? "e.g. Rahim Uddin"
      : `আপনার ${
          selectedMobile
            ? PROVIDER_LABEL_BN[selectedMobile.provider]
            : "মোবাইল ব্যাংকিং"
        } নম্বর লিখুন (01XXXXXXXXX)`;

  /*
   * The cards for the channel on show, and the disambiguation they may need.
   *
   * A shop with a Personal and a Merchant bKash number has two accounts that
   * both read "bKash": two identical cards, one of which is the wrong place to
   * send money. The number stays off the cards on purpose, so what separates
   * them is the merchant's own label for each — and only when it has to, because
   * a second line under every card is noise on the usual setup of one.
   */
  const accountChoices: AccountChoice[] =
    channel === "MOBILE"
      ? mobileAccounts.map((account) => ({
          id: account.id,
          title: PROVIDER_LABEL[account.provider],
          note: account.accountType,
          icon: <MobileAccountMark account={account} />,
        }))
      : bankAccounts.map((account) => ({
          id: account.id,
          title: account.bankName,
          note: account.accountName,
          icon: <BankAccountMark account={account} />,
        }));
  const sharedTitles = new Set(
    accountChoices
      .filter((card, index) =>
        accountChoices.some(
          (other, otherIndex) =>
            otherIndex !== index && other.title === card.title,
        ),
      )
      .map((card) => card.title),
  );

  return (
    <div className="space-y-4">
      {/*
          The two choices, STACKED, one per row at every width.

          They were side by side, and the reasoning was sound where it was
          written: two alternatives on one line are one question answered at a
          glance, and this pair in particular is a comparison — ৳80 now against
          ৳1,480 now — which a shopper can only make with both in view. Both are
          still true stacked; what changed is the room. This step moved into the
          order summary column, which is two fifths of the grid, and half of two
          fifths is not enough for "Cash on delivery (advance delivery charge)"
          and a price: the label broke to three lines and the two cards ended up
          different heights, so the comparison the row existed for was the thing
          it was hardest to make.

          Full width each, the label sits on one line and the two prices line up
          down the left edge, which is the comparison — just read down instead of
          across.

          The advance charge comes preselected — see `defaultAdvanceClaim`.

          NO HEADING OVER THEM. "How would you like to pay?" sat above two cards
          that each say what they are and what they cost, under a "Payment"
          heading, in a section whose every other step had been answered
          already. A question nobody has to read is a line of furniture, and the
          form reads faster without it. The group keeps its name for a screen
          reader, which has no heading above it to go on.
        */}
      <fieldset className="min-w-0" aria-label="How you would like to pay">
        <div className="grid grid-cols-1 gap-3">
          <ChoiceRow
            selected={claim.choice === "DELIVERY_CHARGE"}
            onSelect={() => onChange({ choice: "DELIVERY_CHARGE" })}
            title="Cash on delivery (advance delivery charge)"
            amount={splits?.DELIVERY_CHARGE.advanceAmount ?? null}
            quoting={quoting}
          />
          <ChoiceRow
            selected={claim.choice === "FULL"}
            onSelect={() => onChange({ choice: "FULL" })}
            title="Full payment"
            amount={splits?.FULL.advanceAmount ?? null}
            quoting={quoting}
          />
        </div>

        {errors.choice && (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {errors.choice}
          </p>
        )}
      </fieldset>

      {claim.choice && (
        <div className="space-y-5 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
          {/*
              WHAT TO DO, IN THE ORDER OF DOING IT — not two figures in a table.

              This was "Send now ৳80" over "Due on delivery ৳5,200", which are
              the right two numbers and no instruction at all: a shopper who has
              never paid a shop this way reads an amount and still does not know
              that they leave, send it in another app, come back, and type what
              they sent. Said as a sentence, in the language the rest of the
              form's placeholders are written in, it is one instruction they can
              follow without being told twice.

              BOTH COMMITMENTS STAY, and stay apart — but TOGETHER, as one pair
              of statements about money before anything is asked of the shopper.
              The balance used to sit four blocks further down, below the account
              cards, where it read as a footnote to choosing a bKash number
              rather than as the other half of what this order costs.

              ৳80 and ৳5,200 read as one another the moment they are put in one
              sentence, which is how somebody is surprised at their own door —
              so the balance keeps its own line and its own colour.
            */}
          <div className="space-y-3">
            <div>
              <p className="text-center text-sm font-bold text-gray-900">
                কিভাবে অর্ডার কনফার্ম করবেন?
              </p>

              {/* A waived delivery charge leaves nothing to send in advance, and
                  the delivery-charge choice becomes unplaceable — the server
                  refuses a ৳0 advance because there is no transaction to check
                  against. Said here rather than left as "অগ্রিম 0.00 Tk পাঠান". */}
              {!quoting && split !== null && split.advanceAmount <= 0 ? (
                <p className="mt-1.5 text-center text-sm leading-relaxed text-gray-700">
                  এই অর্ডারে ডেলিভারি চার্জ ফ্রি, তাই অগ্রিম পাঠানোর কিছু নেই।
                  উপরে <span className="font-semibold">Full payment</span> বেছে
                  নিন।
                </p>
              ) : (
                <p className="mt-1.5 text-center text-sm leading-relaxed text-gray-700">
                  {claim.choice === "FULL" ? "সম্পূর্ণ " : "অগ্রিম "}
                  <span className="text-base font-bold text-sale tabular-nums">
                    {quoting || !split ? "…" : formatPrice(split.advanceAmount)}
                  </span>{" "}
                  {channel === "BANK" ? "ট্রান্সফার করুন" : "সেন্ড মানি করুন"}।
                  সম্পন্ন হলে{" "}
                  {channel === "BANK"
                    ? "প্রেরকের নাম বা অ্যাকাউন্ট নম্বর ও রেফারেন্স নম্বর"
                    : "প্রেরক নাম্বার ও ট্রানজেকশন আইডি"}{" "}
                  নিচের বক্সে লিখুন।
                </p>
              )}
            </div>

            <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-center text-sm leading-relaxed text-green-800">
              {quoting || !split ? (
                "ডেলিভারির সময় কত দিতে হবে, হিসাব করা হচ্ছে…"
              ) : split.balanceAmount > 0 ? (
                <>
                  বাকি{" "}
                  <span className="font-bold tabular-nums">
                    {formatPrice(split.balanceAmount)}
                  </span>{" "}
                  ডেলিভারির সময় ডেলিভারি ম্যানকে পরিশোধ করবেন।
                </>
              ) : (
                "ডেলিভারির সময় আর কিছু দিতে হবে না, পুরো টাকা আগেই পরিশোধ হয়ে যাচ্ছে।"
              )}
            </p>
          </div>

          {/* WHERE THE MONEY GOES: the channel, the account, and that account's
              numbers — one group, tightly spaced, because they are three parts
              of one answer. */}
          <div className="space-y-3">
            {offersBoth && (
              /*
                  A SEGMENTED CONTROL, NOT TABS. It carried `role="tablist"` and
                  two `role="tab"` buttons over markup that has no tabpanel and
                  no arrow-key navigation, which promises a screen-reader user a
                  widget that is not there. What it actually does is switch which
                  accounts are listed, so it is two pressed-state buttons with a
                  name on the group — the same pattern the storefront's other
                  pickers use.
                */
              <div
                className="grid grid-cols-2 gap-2 rounded-lg bg-gray-200 p-1"
                role="group"
                aria-label="How you are paying"
              >
                {/* NO GLYPHS ON THESE TWO. A handset and a bank building beside
                    words that already say মোবাইল ব্যাংকিং and ব্যাংক ট্রান্সফার
                    illustrate the label rather than shorten it — and in this
                    column they cost what the label needs, breaking it to two
                    lines and making the track taller than the pair of words in
                    it. The marks that earn their place are the ones on the
                    account cards below, which tell bKash from Nagad faster than
                    reading does. */}
                <ChannelTab
                  active={channel === "MOBILE"}
                  onClick={() => switchChannel("MOBILE")}
                  label="মোবাইল ব্যাংকিং"
                />
                <ChannelTab
                  active={channel === "BANK"}
                  onClick={() => switchChannel("BANK")}
                  label="ব্যাংক ট্রান্সফার"
                />
              </div>
            )}

            {/* The visible label came off these cards on purpose — the
                instruction above already says what to do, and a question over
                two cards that name themselves is furniture. The group keeps the
                wording for a screen reader, which has nothing else to go on. */}
            <fieldset
              className="@container min-w-0"
              aria-label={
                channel === "BANK"
                  ? "Which account did you deposit into?"
                  : "Which number did you send to?"
              }
            >
              {/* TWO UP WHEN THE LIST ITSELF IS WIDE ENOUGH, MEASURED ON THE
                  LIST AND NOT ON THE WINDOW.

                  This was `sm:grid-cols-2`, and `sm` is a VIEWPORT breakpoint
                  while this list sits in a column two fifths of the grid wide,
                  inside a card's padding and a plate's padding again. A desktop
                  window is past `sm` long before this column is, so the cards
                  went two-up in a space that fits one and a card ended up beside
                  an empty half.

                  `@container` on the fieldset makes `@sm` ask the list's own
                  width instead: 24rem, which is about where two cards with a
                  mark and a name stop being cramped. In the summary column that
                  is true and bKash sits beside Nagad; on a phone it is not, and
                  they stack. */}
              <div className="grid grid-cols-1 gap-2 @sm:grid-cols-2">
                {accountChoices.map((account) => (
                  <AccountCard
                    key={account.id}
                    selected={claim.accountId === account.id}
                    onSelect={() => onChange({ accountId: account.id })}
                    title={account.title}
                    note={sharedTitles.has(account.title) ? account.note : ""}
                    icon={account.icon}
                  />
                ))}
              </div>

              {errors.accountId && (
                <p role="alert" className="mt-2 text-xs text-red-600">
                  {errors.accountId}
                </p>
              )}
            </fieldset>

            {/*
                The selected account's details, each copyable. Shown only once an
                account is chosen: every number on screen at once is a number the
                shopper might send to by mistake.
              */}
            {selectedMobile && (
              <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
                <CopyableValue
                  label={`${PROVIDER_LABEL[selectedMobile.provider]} number (${selectedMobile.accountType})`}
                  value={selectedMobile.number}
                />
                {/* {selectedMobile.accountType && (
                  <p className="text-xs text-gray-500">
                    Account type: {selectedMobile.accountType}
                  </p>
                )} */}
                {split && (
                  <CopyableValue
                    label="Amount to send"
                    value={String(split.advanceAmount)}
                  />
                )}
              </div>
            )}

            {selectedBank && (
              <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
                <CopyableValue label="Bank" value={selectedBank.bankName} />
                <CopyableValue
                  label="Account name"
                  value={selectedBank.accountName}
                />
                <CopyableValue
                  label="Account number"
                  value={selectedBank.accountNumber}
                />
                {selectedBank.branch && (
                  <p className="text-xs text-gray-500">
                    Branch: {selectedBank.branch}
                  </p>
                )}
                {selectedBank.routingNumber && (
                  <CopyableValue
                    label="Routing number"
                    value={selectedBank.routingNumber}
                  />
                )}
              </div>
            )}
          </div>

          {/*
              Asked for AFTER the account details, in the order the shopper acts:
              read the number, go and send the money, come back and type what
              they sent. Both required — a claim missing either is one nobody can
              check against a statement.
            */}
          {/* The inputs are painted white rather than left transparent: `Field`
              draws no background of its own, which is right everywhere else on
              this form and wrong on the grey plate, where a field a shopper has
              to type into would be the same colour as the panel around it.
              Reached from here because `Field` spreads its props onto the input
              AFTER its own class string, so a `className` passed in replaces the
              control instead of adding to it. */}
          <div className="space-y-4 [&_input]:bg-white">
            <Field
              label={senderLabel}
              name="advanceSender"
              value={claim.senderIdentifier}
              onChange={(e) => onChange({ senderIdentifier: e.target.value })}
              error={errors.senderIdentifier}
              placeholder={senderPlaceholder}
              inputMode={channel === "BANK" ? "text" : "tel"}
              maxLength={120}
            />
            <Field
              label={
                channel === "BANK"
                  ? "Deposit slip / reference number"
                  : "ট্রানজেকশন আইডি"
              }
              name="advanceTransactionId"
              value={claim.transactionId}
              onChange={(e) => onChange({ transactionId: e.target.value })}
              error={errors.transactionId}
              placeholder={
                channel === "BANK" ? "e.g. 884512309" : "ট্রানজেকশন আইডি লিখুন"
              }
              maxLength={150}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * One of the two payment choices, with what it would cost stated on it.
 *
 * Built to the delivery cards' metrics — `rounded-xl`, `p-4`, a `gap-3` grid —
 * because the claim that the two steps read as one sequence is only true if they
 * are actually drawn the same.
 *
 * It no longer copies their LAYOUT, only their frame. Those cards run two to a
 * row and stack their name, estimate and price down the card because that is all
 * half a row will hold; this one is full width in a narrow column, so the price
 * goes on the label's line. See the note at that row.
 */
function ChoiceRow({
  selected,
  onSelect,
  title,
  description,
  amount,
  quoting,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  /** Optional, exactly as the delivery cards' estimate line is. */
  description?: string;
  amount: number | null;
  quoting: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={clsx(
        "flex h-full w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors motion-reduce:transition-none",
        selected
          ? "border-brand bg-brand/5 ring-1 ring-brand"
          : "border-gray-200 hover:border-gray-300",
        FOCUS_RING,
      )}
    >
      {/* A drawn radio rather than an <input>: the whole row is the target, and
          a real radio inside a button is a nested interactive control. The
          `aria-pressed` on the button is what carries the state. */}
      <span
        className={clsx(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-brand" : "border-gray-300",
        )}
        aria-hidden
      >
        {selected && <span className="size-2 rounded-full bg-brand" />}
      </span>
      {/* WHAT IT IS ON THE LEFT, WHAT IT COSTS ON THE RIGHT, on one line.

          The price used to sit under the label, a third line down the card, so
          that the card matched the delivery options above it. Those cards were
          half a row wide and had no room to do anything else; these are full
          width now and the label ends less than halfway across, which left a
          bold figure under a short line of text with empty space beside both.

          On its own line at the end, the two prices align down the right edge —
          which is the comparison this pair exists to offer — and the row reads
          the way every other row in the card it now lives in reads: Subtotal,
          Delivery, Total, each a name on the left and a figure on the right.

          `items-baseline` on the row rather than `items-center`, so the figure
          sits on the label's baseline instead of floating against the middle of
          a block that grows a second line when a description is passed. */}
      <span className="flex min-w-0 flex-1 items-baseline gap-3">
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-gray-900">{title}</span>
          {description && (
            <span className="mt-0.5 block text-xs text-gray-500">
              {description}
            </span>
          )}
        </span>
        <span className="shrink-0 text-base font-bold text-gray-900 tabular-nums">
          {/* Dashed rather than blank before a delivery option is chosen: there
              is genuinely no figure yet, and showing ৳0 would read as "this is
              free". */}
          {quoting ? "…" : amount === null ? "—" : formatPrice(amount)}
        </span>
      </span>
    </button>
  );
}

/**
 * One half of the channel switch.
 *
 * `text-gray-600` and not `gray-500` on the inactive half: on the track, 500
 * lands at 4.4:1, which is a fail on 14px text and reads as disabled rather than
 * unselected.
 *
 * The track is `gray-200` rather than `gray-100` because it now sits on the
 * step's `gray-50` plate — one step of grey apart is a tint nobody sees, and a
 * switch nobody sees is a switch nobody presses.
 */
function ChannelTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "flex min-h-11 items-center justify-center rounded-md px-3 text-sm font-semibold transition-colors motion-reduce:transition-none",
        active
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900",
        FOCUS_RING,
      )}
    >
      {label}
    </button>
  );
}
