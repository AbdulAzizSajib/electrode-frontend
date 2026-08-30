export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** A BD mobile number in canonical E.164 form. Operator prefixes 013-019. */
export const BD_PHONE_RE = /^\+8801[3-9]\d{8}$/;
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(input: string): string {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export function isEmail(v: string): boolean {
    return EMAIL_RE.test(v.trim());
}

/**
 * Reduces any of the ways a BD mobile number gets typed to E.164
 * (`+8801XXXXXXXXX`), or returns null when it is not one. Mirrors the backend's
 * own `normalizePhone` — the storefront must accept exactly what the API
 * accepts, or a shopper typing `+8801712345678` is rejected here for a number
 * the server would have taken.
 *
 * The canonical form matters beyond validation: the backend stores it, so a
 * tracking lookup has to send the same shape the order was recorded under.
 */
export function normalizeBdPhone(input: string): string | null {
    // Strip anything a human might type as a separator, keeping a leading +.
    const cleaned = input.trim().replace(/[\s\-().]/g, "");

    if (!/^\+?\d+$/.test(cleaned)) return null;

    const digits = cleaned.replace(/^\+/, "");

    // Longest prefix first: "00880" also starts with "0", and testing in any
    // other order strips the wrong number of digits and silently yields a
    // *different* number rather than failing.
    let national: string;
    if (digits.startsWith("00880")) national = digits.slice(5);
    else if (digits.startsWith("880")) national = digits.slice(3);
    else if (digits.startsWith("0")) national = digits.slice(1);
    else national = digits;

    const candidate = `+880${national}`;

    return BD_PHONE_RE.test(candidate) ? candidate : null;
}

export function isBdPhone(v: string): boolean {
    return normalizeBdPhone(v) !== null;
}

export function isSlug(v: string): boolean {
    return SLUG_RE.test(v.trim());
}

/**
 * Login identifier — accepts either an email address or a Bangladeshi phone number.
 * Matches the `identifier` field on the /auth/login endpoint.
 */
export function isLoginIdentifier(v: string): boolean {
    const trimmed = v.trim();
    return isEmail(trimmed) || isBdPhone(trimmed);
}
