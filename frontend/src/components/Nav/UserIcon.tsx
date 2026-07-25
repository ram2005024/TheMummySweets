"use client";

import Image from "next/image";

import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useUser } from "@/hooks/auth/useUser";

import UserDropdown from "./UserDropdown";

export default function UserIcon() {
  const { data: user } = useUser();

  if (!user) return null;

  const profile = user.profile;

  const avatarLetter =
    profile.full_name.trim().charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          aria-label="User menu"
          className="
            relative
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            transition-all
            duration-200
            focus:outline-none
            focus:ring-2
            focus:ring-orange-400
          "
        >
          {profile.image ? (
            <Image
              src={profile.image}
              alt={profile.full_name}
              width={44}
              height={44}
              className="
                h-11
                w-11
                cursor-pointer
                max-sm:size-10
                rounded-full
                object-cover
                border
                border-gray-200
                shadow-sm
                transition-all
                duration-200
                hover:border-orange-400
                hover:shadow-md
              "
            />
          ) : (
            <div
              className="
                flex
                h-11
                w-11
                cursor-pointer
                items-center
                justify-center
                rounded-full
                bg-linear-to-br
                from-orange-500
                via-red-500
                to-pink-500
                text-base
                font-bold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:shadow-md
              "
            >
              {avatarLetter}
            </div>
          )}

          {/* Online indicator */}
          <span
            className="
              absolute
              bottom-0
              right-0
              h-3
              w-3
              rounded-full
              border-2
              border-white
              bg-green-500
            "
          />
        </button>
      </DropdownMenuTrigger>

      <UserDropdown user={user} />
    </DropdownMenu>
  );
}
