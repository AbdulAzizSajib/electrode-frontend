/**
 * The "Design & Developed by" credit in the footer's bottom bar.
 *
 * THIS IS DELIBERATELY NOT A SETTING, and that is the whole decision. It is the
 * builder's credit, not the merchant's content — the one line on the page that
 * is not theirs to edit. Putting it on `StoreSetting` would hand every merchant
 * an editor for it, and the first thing anyone does with an editable credit is
 * empty it. A column would also hold the same string in every row, which is the
 * honest sign that the value does not vary per store.
 *
 * Not an env var either. An env var is the right shape for something that
 * varies per deployment, and this does not; it would also mean the credit
 * silently vanishes from any environment that forgot to set it.
 *
 * THE COST, STATED RATHER THAN HIDDEN: changing the agency credit is a code
 * change and a redeploy. That is intended. A white-label deployment that needs
 * a different credit edits this file and swaps the asset beside it.
 *
 * See server/openspec/changes/add-footer-credit-and-chat-widget, design.md
 * Decision 1.
 */

export interface AgencyCredit {
    /** The lead-in text, rendered before the mark. */
    prefix: string;
    /**
     * The agency's name.
     *
     * Not rendered as a string in the footer — the mark carries the wordmark — but it IS the
     * lockup's accessible name, so a screen reader announces the credit as this rather than as
     * an unlabelled graphic. Keep it the agency's name as it is spoken.
     */
    name: string;
    /** Where the credit links. Opens in a new tab — it leaves the merchant's shop. */
    href: string;
}

/**
 * THE MARK ITSELF IS A COMPONENT, not a file path. See `components/ui/AgencyLogo`.
 *
 * It began as a `logoSrc` pointing at `public/`, which is the right shape for artwork a
 * deployment swaps. It is the wrong shape for this one: the lockup is two traced paths whose
 * letterforms take `currentColor`, so the mark inverts correctly against the brand-coloured
 * footer without a second asset — something no `<img>` can do. A raster file would also need a
 * light and a dark cut, and the footer would load whichever the last person remembered.
 *
 * A white-label deployment therefore edits two things rather than one: the values below, and the
 * paths in `AgencyLogo`. That is the stated cost of an inline mark.
 */
export const AGENCY_CREDIT: AgencyCredit = {
    prefix: "Design & Developed by",
    name: "TOP IT SOLUTION",
    href: "https://www.topitsolution.com",
};
