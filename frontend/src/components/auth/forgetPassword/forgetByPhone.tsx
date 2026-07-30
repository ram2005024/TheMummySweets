"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotByPhone() {
  return (
    <div className="space-y-6 pt-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Phone Number
        </label>

        <div className="flex overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
          {/* Country Code */}
          <div className="flex items-center gap-2 border-r bg-gray-50 px-4">
            <Phone size={18} className="text-orange-500" />

            <span className="font-semibold text-gray-700">
              +977
            </span>
          </div>

          {/* Number */}
          <Input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="98XXXXXXXX"
            className="
              h-12
              border-0
              rounded-none
              shadow-none
              focus-visible:ring-0
              focus-visible:ring-offset-0
            "
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(
                /\D/g,
                ""
              );
            }}
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Enter your registered 10-digit mobile number.
        </p>
      </div>

      <Button className="h-12 w-full rounded-xl bg-orange-500 font-semibold hover:bg-orange-600">
        Send OTP
      </Button>

      <p className="text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-orange-500 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
