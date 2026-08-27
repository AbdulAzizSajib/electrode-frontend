"use client";

import { useState } from "react";
import { Field, FormAlert, SubmitButton } from "@/components/account/form-controls";
import {
  useCreateAddressMutation,
  useUpdateAddressMutation,
} from "@/store/addressApi";
import type { Address, CreateAddressPayload } from "@/types/address";

/** Reads the backend's message out of an RTK error, falling back to a generic one. */
function errorMessage(error: unknown): string {
  const data = (error as { data?: { message?: unknown } } | undefined)?.data;
  return typeof data?.message === "string"
    ? data.message
    : "Could not save this address. Please try again.";
}

interface Props {
  /** Present when editing; absent when adding. */
  address?: Address;
  onSaved?: (address: Address) => void;
  onCancel?: () => void;
  /** Marks a newly created address as the shopper's default. */
  defaultToDefault?: boolean;
  /**
   * Set `false` when this renders inside another `<form>` (checkout). HTML
   * forbids nested forms — the parser drops the inner `<form>` tag, which
   * would leave Save address submitting the *outer* form instead of this one.
   */
  asForm?: boolean;
}

export default function AddressForm({
  address,
  onSaved,
  onCancel,
  defaultToDefault = false,
  asForm = true,
}: Props) {
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  const isEditing = Boolean(address);
  const pending = isCreating || isUpdating;

  // Editing starts from the address's current values, not an empty form.
  const [values, setValues] = useState({
    fullName: address?.fullName ?? "",
    phone: address?.phone ?? "",
    addressLine1: address?.addressLine1 ?? "",
    addressLine2: address?.addressLine2 ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    postalCode: address?.postalCode ?? "",
    country: address?.country ?? "Bangladesh",
    isDefault: address?.isDefault ?? defaultToDefault,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  const update = (name: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  function validate() {
    const errors: Record<string, string> = {};

    if (!values.fullName.trim()) errors.fullName = "Recipient name is required.";
    else if (values.fullName.trim().length < 2) {
      errors.fullName = "Enter the recipient's full name.";
    }

    if (!values.phone.trim()) errors.phone = "Phone number is required.";
    else if (values.phone.trim().length < 6) {
      errors.phone = "Enter a valid phone number.";
    }

    if (!values.addressLine1.trim()) {
      errors.addressLine1 = "Street address is required.";
    }

    if (!values.city.trim()) errors.city = "City is required.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event?: React.FormEvent) {
    // Absent when invoked from the nested-mode button's onClick.
    event?.preventDefault();
    setFormError("");
    if (!validate()) return;

    // Optional fields are omitted rather than sent empty — the backend's
    // validators reject an empty string where they accept an absent field.
    const payload: CreateAddressPayload = {
      type: "SHIPPING",
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      addressLine1: values.addressLine1.trim(),
      addressLine2: values.addressLine2.trim() || undefined,
      city: values.city.trim(),
      state: values.state.trim() || undefined,
      postalCode: values.postalCode.trim() || undefined,
      country: values.country.trim() || undefined,
      isDefault: values.isDefault,
    };

    try {
      const result = address
        ? await updateAddress({ addressId: address.id, body: payload }).unwrap()
        : await createAddress(payload).unwrap();

      onSaved?.({
        ...payload,
        id: result?.data?.id ?? address?.id ?? "",
        type: "SHIPPING",
        isDefault: values.isDefault,
      } as Address);
    } catch (error) {
      // Values stay in state, so the shopper can correct and retry without
      // re-typing everything.
      setFormError(errorMessage(error));
    }
  }

  const Wrapper = asForm ? "form" : "div";
  const wrapperProps = asForm
    ? { onSubmit: handleSubmit, noValidate: true }
    : {};

  return (
    <Wrapper {...wrapperProps} className="space-y-4">
      {formError && <FormAlert tone="error">{formError}</FormAlert>}

      <Field
        label="Recipient name"
        name="fullName"
        autoComplete="name"
        placeholder="Karim Rahman"
        value={values.fullName}
        error={fieldErrors.fullName}
        onChange={(e) => update("fullName", e.target.value)}
      />

      <Field
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="01711000000"
        value={values.phone}
        error={fieldErrors.phone}
        onChange={(e) => update("phone", e.target.value)}
      />

      <Field
        label="Street address"
        name="addressLine1"
        autoComplete="address-line1"
        placeholder="House 12, Road 5, Banani"
        value={values.addressLine1}
        error={fieldErrors.addressLine1}
        onChange={(e) => update("addressLine1", e.target.value)}
      />

      <Field
        label="Apartment, suite (optional)"
        name="addressLine2"
        autoComplete="address-line2"
        value={values.addressLine2}
        onChange={(e) => update("addressLine2", e.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="City"
          name="city"
          autoComplete="address-level2"
          placeholder="Dhaka"
          value={values.city}
          error={fieldErrors.city}
          onChange={(e) => update("city", e.target.value)}
        />
        <Field
          label="State / region (optional)"
          name="state"
          autoComplete="address-level1"
          value={values.state}
          onChange={(e) => update("state", e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Postal code (optional)"
          name="postalCode"
          autoComplete="postal-code"
          value={values.postalCode}
          onChange={(e) => update("postalCode", e.target.value)}
        />
        <Field
          label="Country (optional)"
          name="country"
          autoComplete="country-name"
          value={values.country}
          onChange={(e) => update("country", e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={values.isDefault}
          onChange={(e) => update("isDefault", e.target.checked)}
          className="accent-brand"
        />
        Use as my default delivery address
      </label>

      <div className="flex gap-3">
        <SubmitButton
          pending={pending}
          pendingText="Saving..."
          type={asForm ? "submit" : "button"}
          onClick={asForm ? undefined : () => handleSubmit()}
        >
          {isEditing ? "Save changes" : "Save address"}
        </SubmitButton>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="rounded border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </Wrapper>
  );
}
