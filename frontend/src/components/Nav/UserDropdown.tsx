"use client";

import Link from "next/link";

import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Award,
} from "lucide-react";



import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserBasic } from "../../type/user.type";
import Image from "next/image";
import { useLogout } from "../../hooks/auth/useLogout";

type Props = {
  user: UserBasic;
};

const rankStyles = {
  bronze: {
    label: "🥉 Bronze Member",
    className:
      "bg-orange-100 text-orange-700 border border-orange-200",
  },
  silver: {
    label: "🥈 Silver Member",
    className:
      "bg-slate-100 text-slate-700 border border-slate-200",
  },
  gold: {
    label: "🥇 Gold Member",
    className:
      "bg-yellow-100 text-yellow-700 border border-yellow-200",
  },
  diamond: {
    label: "💎 Diamond Member",
    className:
      "bg-violet-100 text-violet-700 border border-violet-200",
  },
} as const;

export default function UserDropdown({ user }: Props) {
  const profile = user.profile;
  const logoutMutation=useLogout()
  const rank =
    rankStyles[
      (profile.rank?.toLowerCase() as keyof typeof rankStyles) ??
        "bronze"
    ];

  const avatarLetter =
    profile.full_name.charAt(0).toUpperCase();

  return (
    <DropdownMenuContent
      align="end"
      sideOffset={10}
      className="w-90 rounded-2xl mt-4 border border-gray-200 p-2 shadow-2xl"
    >
      {/* ================= HEADER ================= */}

      <div className="rounded-xl bg-linear-to-r from-orange-500 via-red-500 to-pink-500 p-5 text-white">
        <div className="flex items-center gap-4">
          {profile.image ? (
            <Image
            width={40}
            height={40}
              src={profile.image}
              alt={profile.full_name}
              className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-bold text-orange-600">
              {avatarLetter}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold">
              {profile.full_name}
            </h2>

            <p className="truncate text-sm text-orange-100">
              {user.email ?? user.phone_no}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <Award size={15} />

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${rank.className}`}
              >
                {rank.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MENU ================= */}

      <div className="mt-2 space-y-1">

        <DropdownMenuItem>
          <Link
            href="/profile"
            className="flex items-center justify-between rounded-xl p-3"
          >
            <div className="flex items-center gap-3">
              <User size={18} />
              <span>My Profile</span>
            </div>

            <ChevronRight size={18} />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            href="/orders"
            className="flex items-center justify-between rounded-xl p-3"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} />
              <span>My Orders</span>
            </div>

            <ChevronRight size={18} />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem >
          <Link
            href="/wishlist"
            className="flex items-center justify-between rounded-xl p-3"
          >
            <div className="flex items-center gap-3">
              <Heart size={18} />
              <span>Wishlist</span>
            </div>

            <ChevronRight size={18} />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem >
          <Link
            href="/addresses"
            className="flex items-center justify-between rounded-xl p-3"
          >
            <div className="flex items-center gap-3">
              <MapPin size={18} />
              <span>Addresses</span>
            </div>

            <ChevronRight size={18} />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem >
          <Link
            href="/settings"
            className="flex items-center justify-between rounded-xl p-3"
          >
            <div className="flex items-center gap-3">
              <Settings size={18} />
              <span>Settings</span>
            </div>

            <ChevronRight size={18} />
          </Link>
        </DropdownMenuItem>
      </div>

      <DropdownMenuSeparator className="my-2" />

      {/* ================= LOGOUT ================= */}

      <DropdownMenuItem
        className="rounded-xl p-3 text-red-600 focus:bg-red-50 focus:text-red-600"
        disabled={logoutMutation.isPending}
        onClick={() => {
          logoutMutation.mutate()
        }}
      >
        <LogOut size={18} className="mr-3" />
        {logoutMutation.isPending? "Logging out...":"Logout"}
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
