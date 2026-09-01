"use client";

import { useLogout } from "@/hooks/auth/useLogout";
import { useUser } from "@/hooks/auth/useUser";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SidebarUser() {
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const { data: userData } = useUser();
  console.log(userData);
  return (
    <div className="border-t border-stone-200 p-3">
      <div className="flex items-center gap-3 rounded-lg px-3 py-2">
        {/* Avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs font-bold">
          {userData?.profile.full_name.split(" ")[0].slice(0, 1)}
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-stone-800 truncate">
            {userData?.profile.full_name}
          </p>
          <p className="text-[11px] font-bold text-stone-400 truncate">
            {userData?.role.toLocaleUpperCase()}
          </p>
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
