"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/services/auth";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await logoutAction();
          router.replace("/account/login");
          router.refresh();
        })
      }
      className="flex items-center gap-2 rounded border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:opacity-60"
    >
      <LogOut size={16} />
      {pending ? "Signing out..." : "Sign Out"}
    </button>
  );
}
