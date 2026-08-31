"use client";

import { useLogout } from "@/hooks/auth/useLogout";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  name: string;
  role: string;
  initials: string;
};

export function SidebarUser({ name, role, initials }: Props) {
  const { mutate: logout } = useLogout();
  const router = useRouter();

  return (
    <div className="border-t border-stone-200 p-3">
      <div className="flex items-center gap-3 rounded-lg px-3 py-2">
        {/* Avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs font-bold">
          {initials}
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-800 truncate">
            {name}
          </p>
          <p className="text-[11px] text-stone-400 truncate">{role}</p>
        </div>

        {/* Logout button */}
        <button
          onClick={() =>
            logout(undefined, {
              onSuccess: () => {
                router.push("/");
              },
            })
          }
          title="Log out"
          className="flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
