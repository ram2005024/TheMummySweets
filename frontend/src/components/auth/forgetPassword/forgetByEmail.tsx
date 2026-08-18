"use client";

import Link from "next/link";

import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { useForget } from "../../../hooks/auth/useForget";
import VerifyForget from "./verifyForget";

export default function ForgotByEmail() {
  const [open, setOpen] = useState<boolean>(false);
  const forgetByEmailMutation = useForget();
  const [userID, setUserID] = useState<string>("");
  const forget_schema_email = z.object({
    email: z.email("Invalid email"),
  });
  const form = useForm<{ email: string }>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forget_schema_email),
  });
  return (
    <div className="space-y-6 pt-5">
      {/* Forget success model */}
      {open && userID && (
        <VerifyForget
          open={open}
          onClose={() => setOpen(false)}
          data={{
            user_id: userID,
            field_name: "email",
            field_value: form.getValues("email"),
          }}
        />
      )}
      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Email Address
        </label>

        <div className="flex overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
          {/* Icon */}
          <div className="flex items-center justify-center border-r bg-gray-50 px-4">
            <Mail size={18} className="text-orange-500" />
          </div>

          {/* Input */}
          <Input
            type="email"
            placeholder="you@example.com"
            className="
              h-12
              border-0
              rounded-none
              shadow-none
              focus-visible:ring-0
              focus-visible:ring-offset-0
            "
            {...form.register("email")}
          />
        </div>

        <p className="mt-2.5 text-xs text-gray-500">
          Enter the email associated with your account.
        </p>
        {form.formState.errors?.email && (
          <p className="text-xs mt-2 text-red-600">
            {form.formState.errors?.email?.message}
          </p>
        )}
      </div>

      {/* Button */}
      <Button
        onClick={() =>
          forgetByEmailMutation.mutate(
            { email: form.getValues("email") },
            {
              onSuccess: (data) => {
                setUserID(data.user_id);
                setOpen(true);
              },
              onError: (err) => {
                const error = err as AxiosError<{ message?: string }>;
                toast.error(
                  error.response?.data?.message ||
                    error.message ||
                    "Something went wrong",
                );
              },
            },
          )
        }
        disabled={forgetByEmailMutation.isPending}
        className="h-12 w-full rounded-xl bg-orange-500 font-semibold transition hover:bg-orange-600"
      >
        {forgetByEmailMutation.isPending ? "Sending..." : "Send Reset OTP"}
      </Button>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-orange-500 transition hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
