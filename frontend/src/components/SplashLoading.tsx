"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-br from-orange-50 via-white to-amber-50">
      {/* Logo */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-orange-200 blur-2xl opacity-50 animate-pulse" />

        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-xl ring-1 ring-orange-100">
          <Image
            src="/logo.png"
            alt="The Mummy Sweets"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Brand */}
      <h1 className="text-3xl font-bold tracking-tight text-orange-600">
        The Mummy Sweets
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Fresh • Pure • Homemade
      </p>

      {/* Loader */}
      <Loader2 className="mt-8 h-7 w-7 animate-spin text-orange-500" />

      <p className="mt-3 text-sm text-gray-400">
        Preparing your experience...
      </p>
    </div>
  );
}
