import type { Product, ProductOption, ProductVariant } from "@/types/product";

/**
 * Resolving a shopper's option choices to a variant.
 *
 * Pure and shared, because the product page and the in-listing quick view must
 * behave identically — the spec requires it, and the two components already
 * carried near-duplicate copies of the old flat-variant logic.
 *
 * The central idea: selection state is a value per option, and the variant is
 * *derived*. Storing a variant id instead cannot express a partial choice — on
 * a two-option product "Black" is not a variant, and there is no id to hold
 * until both options are answered.
 */

/** A value the shopper can pick, and whether picking it leads anywhere. */
export interface ResolvedOptionValue {
  id: string;
  label: string;
  swatch?: string;
  isSelected: boolean;
  /**
   * Whether some in-stock variant provides this value given the shopper's other
   * current choices. Unavailable values are rendered disabled, never removed —
   * see `resolveOptions`.
   */
  isAvailable: boolean;
}

export interface ResolvedOption {
  id: string;
  name: string;
  presentation: ProductOption["presentation"];
  values: ResolvedOptionValue[];
  /** True when the shopper has not yet picked a value for this option. */
  isUnanswered: boolean;
}

export interface OptionSelection {
  options: ResolvedOption[];
  /** The variant the current choices identify, or `null` while incomplete. */
  variant: ProductVariant | null;
  /** Options still awaiting a choice, so the page can name them. */
  unansweredNames: string[];
  isComplete: boolean;
}

/** A shopper's choices: option id -> chosen value id. */
export type OptionChoices = Record<string, string>;

/**
 * The options to present for a product.
 *
 * A product whose variants carry no option values — every product authored
 * before options existed — is presented as one synthetic option whose values
 * are the variant names. That is what lets both components render and resolve
 * through a single path with no "has options?" branch, and it is computed at
 * read time so nothing was ever written into the database on a guess.
 *
 * The synthetic option's value ids are the variant ids, which makes resolution
 * fall out unchanged: selecting the value *is* selecting the variant.
 */
export function presentedOptions(product: Product): ProductOption[] {
  if (product.options.length > 0) return product.options;
  if (product.variants.length === 0) return [];

  return [
    {
      id: SYNTHETIC_OPTION_ID,
      name: "Option",
      presentation: "LABEL",
      values: product.variants.map((variant) => ({
        id: variant.id,
        label: variant.name,
      })),
    },
  ];
}

/** Marks the option `presentedOptions` invents for a product that defines none. */
export const SYNTHETIC_OPTION_ID = "__synthetic__";

/**
 * The variant identified by a complete set of choices, or `null`.
 *
 * A variant matches when its value ids are exactly the chosen ones. For the
 * synthetic option the chosen "value id" is the variant id itself.
 *
 * Returns `null` rather than throwing when no variant matches — a product whose
 * data violates the one-value-per-option invariant renders degraded, never
 * blank.
 */
export function resolveVariant(
  product: Product,
  choices: OptionChoices,
): ProductVariant | null {
  const options = presentedOptions(product);
  if (options.length === 0) return null;

  const chosen = options.map((option) => choices[option.id]);
  if (chosen.some((valueId) => !valueId)) return null;

  if (options[0]?.id === SYNTHETIC_OPTION_ID) {
    return product.variants.find((v) => v.id === chosen[0]) ?? null;
  }

  return (
    product.variants.find((variant) => {
      if (variant.optionValueIds.length !== chosen.length) return false;
      return chosen.every((valueId) => variant.optionValueIds.includes(valueId));
    }) ?? null
  );
}

/**
 * Everything a component needs to render the option controls and act on them.
 *
 * Availability is computed per value against the shopper's *other* current
 * choices, so picking a colour that only exists in M immediately shows the
 * other sizes as unavailable.
 *
 * Every authored value is returned, each carrying its own availability. The
 * list is deliberately never pre-filtered: a caller cannot then accidentally
 * implement "hide unavailable" by mapping over it, which the spec forbids —
 * removing a value silently changes what the control offers.
 */
export function resolveOptions(
  product: Product,
  choices: OptionChoices,
): OptionSelection {
  const options = presentedOptions(product);
  const isSynthetic = options[0]?.id === SYNTHETIC_OPTION_ID;

  const resolved: ResolvedOption[] = options.map((option) => {
    const chosenValueId = choices[option.id];

    return {
      id: option.id,
      name: option.name,
      presentation: option.presentation,
      isUnanswered: !chosenValueId,
      values: option.values.map((value) => ({
        id: value.id,
        label: value.label,
        swatch: value.swatch,
        isSelected: chosenValueId === value.id,
        isAvailable: isSynthetic
          ? (product.variants.find((v) => v.id === value.id)?.inStock ?? false)
          : isValueObtainable(product, options, choices, option.id, value.id),
      })),
    };
  });

  const unanswered = resolved.filter((option) => option.isUnanswered);

  return {
    options: resolved,
    variant: resolveVariant(product, choices),
    unansweredNames: unanswered.map((option) => option.name),
    isComplete: options.length > 0 && unanswered.length === 0,
  };
}

/**
 * Whether an in-stock variant exists that provides `valueId` while honouring
 * the shopper's choices on the *other* options.
 *
 * The option being tested is excluded from the constraint on purpose: asking
 * "is Red available given that Red is selected" answers nothing. Options the
 * shopper has not answered yet are unconstrained, so before any choice a value
 * is available if any in-stock variant carries it at all.
 */
function isValueObtainable(
  product: Product,
  options: ProductOption[],
  choices: OptionChoices,
  optionId: string,
  valueId: string,
): boolean {
  const otherChoices = options
    .filter((option) => option.id !== optionId)
    .map((option) => choices[option.id])
    .filter((chosen): chosen is string => Boolean(chosen));

  return product.variants.some(
    (variant) =>
      variant.inStock &&
      variant.optionValueIds.includes(valueId) &&
      otherChoices.every((chosen) => variant.optionValueIds.includes(chosen)),
  );
}

/**
 * The choices that select `variant`, for seeding state from a default.
 *
 * Used to open a product on a sensible variant without the page having to know
 * how choices map to values.
 */
export function choicesForVariant(
  product: Product,
  variant: ProductVariant | null,
): OptionChoices {
  if (!variant) return {};

  const options = presentedOptions(product);
  if (options[0]?.id === SYNTHETIC_OPTION_ID) {
    return { [SYNTHETIC_OPTION_ID]: variant.id };
  }

  const choices: OptionChoices = {};
  for (const option of options) {
    const match = option.values.find((value) =>
      variant.optionValueIds.includes(value.id),
    );
    if (match) choices[option.id] = match.id;
  }
  return choices;
}

/**
 * The variant a product should open on: the first in stock, else the first at
 * all, so a fully sold-out product still shows a price rather than nothing.
 */
export function defaultVariant(product: Product): ProductVariant | null {
  return product.variants.find((v) => v.inStock) ?? product.variants[0] ?? null;
}
