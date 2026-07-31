"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForget } from "../../../hooks/auth/useForget";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import VerifyForget from "./verifyForget";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function ForgotByPhone() {
      const [open,setOpen]=useState<boolean>(false)
      const forgetByPhoneMutation=useForget()
      const [userID,setUserID]=useState<string>("")
      const forget_schema_phone=z.object({
          phone_no:z.string().regex(/^9[78]\d{8}$/,"Enter a valid phone number")
      })
      const form=useForm<{phone_no:string}>({
          defaultValues:{
              phone_no:"",
          },
          resolver:zodResolver(forget_schema_phone)
      })
  return (
    <div className="space-y-6 pt-5">
       {/* Forget success model */}
        {open &&
        userID && <VerifyForget open={open} onClose={()=>setOpen(false)} data={{user_id:userID,field_name:"phone number",field_value:form.getValues("phone_no")}}/>
        }
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
               {...form.register("phone_no")}
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
        {form.formState.errors?.phone_no && (
            <p className="text-xs mt-2 text-red-600">{form.formState.errors?.phone_no?.message}</p>
        )}
      </div>

      <Button onClick={()=>forgetByPhoneMutation.mutate({mobile_number:form.getValues("phone_no")},{
        onSuccess:(data)=>{
            setUserID(data.user_id)
            setOpen(true)
        },
        onError:(err)=>{
            const error = err as AxiosError<{ message?: string }>;
            toast.error(
              error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
        }
      })} disabled={forgetByPhoneMutation.isPending} className="h-12 w-full rounded-xl bg-orange-500 font-semibold transition hover:bg-orange-600">
       {forgetByPhoneMutation.isPending ? "Sending...":"Send Reset OTP"}
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
