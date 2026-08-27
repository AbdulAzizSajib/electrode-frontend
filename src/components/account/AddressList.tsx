"use client";

import { useState } from "react";
import { Loader2, MapPin, Plus, Star } from "lucide-react";
import AddressForm from "@/components/account/AddressForm";
import {
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useSetDefaultAddressMutation,
} from "@/store/addressApi";
import { formatAddress, type Address } from "@/types/address";

export default function AddressList() {
  const { data: addresses = [], isLoading, isError } = useGetAddressesQuery();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();
  const [setDefaultAddress, { isLoading: isSettingDefault }] =
    useSetDefaultAddressMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  // Deletion is irreversible, so it is confirmed in place before it runs.
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12 text-gray-400">
        <Loader2 size={22} className="animate-spin" />
      </div>
    );
  }

  // Distinct from "you have none saved" — a failure must not read as an empty list.
  if (isError) {
    return (
      <p className="py-12 text-center text-sm text-gray-500">
        We couldn&apos;t load your addresses right now. Please try again shortly.
      </p>
    );
  }

  if (isAdding || editing) {
    return (
      <div className="rounded-xl border border-gray-200 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {editing ? "Edit address" : "Add a delivery address"}
        </h2>
        <AddressForm
          address={editing ?? undefined}
          defaultToDefault={addresses.length === 0}
          onSaved={() => {
            setIsAdding(false);
            setEditing(null);
          }}
          onCancel={() => {
            setIsAdding(false);
            setEditing(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
          <MapPin size={28} className="mx-auto mb-3 text-gray-300" />
          <p className="mb-4 text-sm text-gray-500">
            You have no saved delivery addresses yet.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Add an address
          </button>
        </div>
      ) : (
        <>
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-xl border border-gray-200 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-medium text-gray-900">
                    {address.fullName}
                    {address.isDefault && (
                      <span className="flex items-center gap-1 rounded bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                        <Star size={11} /> Default
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{address.phone}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {formatAddress(address)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {!address.isDefault && (
                    <button
                      onClick={() => void setDefaultAddress(address.id)}
                      disabled={isSettingDefault}
                      className="font-medium text-brand hover:underline disabled:opacity-40"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    onClick={() => setEditing(address)}
                    className="font-medium text-gray-600 hover:text-brand"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmingDelete(address.id)}
                    className="font-medium text-gray-600 hover:text-sale"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {confirmingDelete === address.id && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700">
                    Delete this address? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await deleteAddress(address.id);
                        setConfirmingDelete(null);
                      }}
                      disabled={isDeleting}
                      className="rounded bg-sale px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                    <button
                      onClick={() => setConfirmingDelete(null)}
                      className="rounded border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700"
                    >
                      Keep
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 rounded border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand"
          >
            <Plus size={16} />
            Add another address
          </button>
        </>
      )}
    </div>
  );
}
