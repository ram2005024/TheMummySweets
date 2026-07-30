"use client"

import React from "react"
import { Lock } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import z from "zod"
import { useForm } from "react-hook-form"
import { forget_password_change_schema } from "../../../type/auth.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePassowordChange } from "../../../hooks/auth/useForget"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { AxiosError } from "axios"

interface Props {
  user_id: string
  open: boolean
  onClose: () => void
  redirect_url?: string
}

const PasswordChange = ({ user_id, open, onClose, redirect_url = "/" }: Props) => {
    const router=useRouter()
    const mutation=usePassowordChange()
    const schema=z.object({
        password_1:z.string().min(8,"Password must have atleast 8 characters"),
        password_2:z.string(),
    }).refine((val)=>val.password_1===val.password_2,{
        message:"Password don't match",
path:["password_2"]
    })
    const form=useForm<forget_password_change_schema>({
        defaultValues:{
            password_1:"",
            password_2:""
        },
        resolver:zodResolver(schema)
    })
    const handleChangePassword=(data:forget_password_change_schema)=>{
        mutation.mutate({...data,user_id:user_id},{
            onSuccess:(data)=>{
                toast.success(data.message)
                router.push(redirect_url)
            },
            onError:(err)=>{
                const error = err as AxiosError<{ message?: string }>;
                toast.error(
                  error.response?.data?.message ||
                    error.message ||
                    "Something went wrong"
                );
            }
        })
    }
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl p-8">
        <DialogHeader className="space-y-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border bg-orange-50 dark:bg-orange-950/20">
            <Lock className="h-7 w-7 text-orange-500" />
          </div>

          <div className="space-y-2">
            <DialogTitle className="text-2xl font-semibold">
              Change Password
            </DialogTitle>

            <DialogDescription className="text-sm leading-6">
              Enter your new password below to secure your account.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleChangePassword)} className="mt-6 space-y-6">
          {/* New Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              {...form.register("password_1")}
              className="h-12 rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-200"
            />
             {form.formState.errors?.password_1 && (
            <p className="text-xs mt-2 text-red-600">{form.formState.errors?.password_1?.message}</p>
        )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <Input
            {...form.register("password_2")}
              type="password"
              placeholder="••••••••"
              className="h-12 rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-200"
            />
             {form.formState.errors?.password_2 && (
            <p className="text-xs mt-2 text-red-600">{form.formState.errors?.password_2?.message}</p>
        )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-orange-500 text-base font-medium hover:bg-orange-600"
          >
            Update Password
          </Button>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PasswordChange
