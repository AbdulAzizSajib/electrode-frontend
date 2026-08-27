/**
 * Delivery address types mirroring the backend's `/customers/me/addresses`
 * endpoints (electrode-server: src/app/module/customer).
 */

export type AddressType = "SHIPPING" | "BILLING" | "BOTH";

/** An address exactly as the API returns it. */
export interface ApiCustomerAddress {
  id: string;
  customerId: string;
  type: AddressType;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * The shape the UI renders. Nullable optional fields collapse to `undefined`
 * so a form can bind them without null-checking every field.
 */
export interface Address {
  id: string;
  type: AddressType;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault: boolean;
}

/** Body for creating an address. Backend requires name, phone, line 1 and city. */
export interface CreateAddressPayload {
  type?: AddressType;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

/** Every field optional — the backend patches only what is sent. */
export type UpdateAddressPayload = Partial<CreateAddressPayload>;

export function toAddress(address: ApiCustomerAddress): Address {
  return {
    id: address.id,
    type: address.type,
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 ?? undefined,
    city: address.city,
    state: address.state ?? undefined,
    postalCode: address.postalCode ?? undefined,
    country: address.country ?? undefined,
    isDefault: address.isDefault,
  };
}

/** Single-line rendering for a selector or summary. */
export function formatAddress(address: Address): string {
  return [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}
