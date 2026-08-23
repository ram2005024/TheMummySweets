"use client";

import { useUser } from "@/hooks/auth/useUser";
import Link from "next/link";
import { useState } from "react";
import {
  LuBell,
  LuChevronDown,
  LuHeart,
  LuLocateFixed,
  LuMapPin,
  LuSearch,
  LuShoppingBag,
} from "react-icons/lu";

interface ReverseGeocodeResponse {
  address?: {
    suburb?: string;
    neighbourhood?: string;
    town?: string;
    city?: string;
    municipality?: string;
    village?: string;
  };
}

const NavBarUpperSection = () => {
  const { data: user } = useUser();

  const [location, setLocation] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const fullName = user?.profile?.full_name?.trim() || "User";
  const firstLetter = fullName.charAt(0).toUpperCase();

  const handleLocation = () => {
    if (!navigator.geolocation || isLocating) return;

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const params = new URLSearchParams({
            lat: coords.latitude.toString(),
            lon: coords.longitude.toString(),
            format: "json",
          });

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
          );

          if (!response.ok) {
            throw new Error("Failed to detect location");
          }

          const data = (await response.json()) as ReverseGeocodeResponse;

          const address = data.address;

          const detectedLocation =
            address?.suburb ||
            address?.neighbourhood ||
            address?.town ||
            address?.city ||
            address?.municipality ||
            address?.village ||
            "Current location";

          setLocation(detectedLocation);
        } catch {
          setLocation("Current location");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  return (
    <header className="w-full pt-1">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-8 px-7">
        <Link
          href="/"
          className="flex shrink-0 cursor-pointer items-center gap-3"
        >
          <div className="flex h-12 w-10 items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f47b20] text-white">
              <span className="font-serif text-xl font-bold">M</span>
            </div>
          </div>

          <div className="leading-none">
            <h1 className="font-serif text-[21px] font-bold tracking-[-0.02em] text-[#2d211b]">
              The Mummy
            </h1>

            <p className="mt-1.5 text-[10px] font-medium tracking-[0.08em] text-[#9a8d84]">
              Fresh. Local. Yours.
            </p>
          </div>
        </Link>

        <div className="h-8 w-px bg-[#e9e1d9]" />

        <div className="flex h-12 min-w-0 flex-1 items-center rounded-full border border-[#ddd3ca] bg-white px-5 transition-all duration-200 focus-within:border-[#e8a66e] focus-within:shadow-[0_0_0_4px_rgba(244,123,32,0.07)]">
          <LuSearch
            size={19}
            strokeWidth={1.8}
            className="mr-3 shrink-0 text-[#887970]"
          />

          <input
            type="text"
            placeholder="Search sweets, snacks, drinks..."
            className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-[#3c3029] outline-none placeholder:text-[#a89c94]"
          />

          <span className="ml-3 hidden items-center gap-1 rounded-full border border-[#e6ddd5] bg-[#faf7f3] px-2.5 py-1 text-[10px] font-medium text-[#9b8d83] sm:flex">
            <span>⌘</span>
            <span>K</span>
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#61c174] opacity-30" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[#48b95d]" />
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-[#30251f]">
                Open
              </span>

              <span className="h-1 w-1 rounded-full bg-[#c9bdb4]" />

              <span className="text-[12px] text-[#8d8077]">25–35 min</span>
            </div>
          </div>

          <div className="h-7 w-px bg-[#e8e0d8]" />

          <button
            type="button"
            onClick={handleLocation}
            disabled={isLocating}
            className="group flex cursor-pointer items-center gap-2 disabled:cursor-wait"
          >
            <div className="flex h-8 w-8 items-center justify-center">
              {isLocating ? (
                <LuLocateFixed
                  size={18}
                  strokeWidth={1.8}
                  className="animate-pulse text-[#f47b20]"
                />
              ) : (
                <LuMapPin
                  size={18}
                  strokeWidth={1.8}
                  className="text-[#f47b20] transition-transform group-hover:-translate-y-0.5"
                />
              )}
            </div>

            <div className="hidden leading-none text-left md:block">
              <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-[#a0938a]">
                {location ? "Deliver to" : "Your location"}
              </p>

              <div className="mt-1 flex items-center gap-1">
                <span
                  className={`max-w-[110px] truncate text-[12px] font-semibold ${
                    location ? "text-[#44372f]" : "text-[#f47b20]"
                  }`}
                >
                  {isLocating
                    ? "Finding location..."
                    : location || "Enable location"}
                </span>

                <LuChevronDown size={11} className="text-[#9c8f86]" />
              </div>
            </div>
          </button>

          <div className="h-7 w-px bg-[#e8e0d8]" />

          <button
            type="button"
            aria-label="Wishlist"
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center text-[#554941] transition-all hover:text-[#e95d48]"
          >
            <LuHeart size={20} strokeWidth={1.7} />

            <span className="absolute right-[1px] top-0 flex h-[13px] min-w-[13px] items-center justify-center rounded-full bg-[#e95d48] px-1 text-[7px] font-bold text-white">
              2
            </span>
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center text-[#554941] transition-all hover:text-[#f47b20]"
          >
            <LuBell size={20} strokeWidth={1.7} />

            <span className="absolute right-[5px] top-[3px] h-[6px] w-[6px] rounded-full bg-[#f47b20] ring-2 ring-white" />
          </button>

          <button
            type="button"
            className="flex cursor-pointer items-center gap-2.5 border-l border-[#e8e0d8] pl-5"
          >
            {user?.profile?.image ? (
              <div
                role="img"
                aria-label={fullName}
                className="h-9 w-9 rounded-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url("${user.profile.image}")`,
                }}
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f47b20] text-[13px] font-semibold text-white">
                {firstLetter}
              </div>
            )}

            <div className="hidden text-left leading-none lg:block">
              <p className="max-w-[110px] truncate text-[12px] font-semibold text-[#382c25]">
                {fullName}
              </p>

              <p className="mt-1 text-[9px] text-[#a0938a]">My account</p>
            </div>

            <LuChevronDown size={12} className="text-[#968980]" />
          </button>

          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#f47b20] text-white shadow-sm transition-all duration-200 hover:bg-[#df6812] hover:shadow-md"
          >
            <LuShoppingBag size={19} strokeWidth={1.8} />

            <span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#30251f] px-1 text-[7px] font-bold text-white">
              3
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBarUpperSection;
