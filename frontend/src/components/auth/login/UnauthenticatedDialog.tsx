/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import React from "react"
import { Mail, RotateCcw } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useVerifyOtp } from "../../../hooks/auth/useLogin"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import { ErrorResponse } from "../../../type/common.type"
import { unAuthenticatedLogin } from "../../../type/auth.type"
import { useRouter } from "next/navigation"


interface Props {
  open: boolean
  onClose: () => void
  data:unAuthenticatedLogin
  onSuccessURL?:string
}

export function UnauthenticatedDialog({
  open,
  onClose,
  data,
  onSuccessURL=""
}: Props) {
  const [otp, setOtp] = React.useState("")
  const [timer, setTimer] = React.useState(60)
  const router=useRouter()
  const verifyMutation=useVerifyOtp()
  React.useEffect(() => {
    if (!open) return
    console.log(data)
    setTimer(60)
    setOtp("")

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [open,data])

  async function handleVerify(e?: React.FormEvent) {
    e?.preventDefault()
    e?.stopPropagation()
    if (otp.length !== 6 || verifyMutation.isPending) return
    verifyMutation.mutate({user_id:data.user_id,otp:otp},{
        onSuccess:(data)=>{
            toast.success(data.message)
            onClose()
            if(onSuccessURL)router.push(onSuccessURL)
        }
    })
  }

  function handleResend() {
    console.log("Resend OTP")
    setTimer(60)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => !value && onClose()}
    >
      <DialogContent className="sm:max-w-md rounded-3xl p-8">
        <DialogHeader className="space-y-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border bg-orange-50 dark:bg-orange-950/20">
            <Mail className="h-7 w-7 text-orange-500" />
          </div>

          <div className="space-y-2">
            <DialogTitle className="text-2xl font-semibold">
              Verify your email
            </DialogTitle>

            <DialogDescription className="text-sm leading-6">
              Enter the verification code we sent to your <strong>{data.field_name}</strong>
            </DialogDescription>

            <p className="font-medium break-all">
           {data.field_value}
            </p>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleVerify}
          className="mt-6 space-y-8"
        >
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup className="gap-3 border-0">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-14 w-14 rounded-xl border text-lg font-semibold shadow-sm transition-all focus:ring-2 focus:ring-orange-500"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

          </div>
           {verifyMutation.isError && (
                <p className="text-xs mt-2 text-red-600">
                    {(verifyMutation.error as AxiosError<ErrorResponse<null>>).response?.data?.message || "Something went wrong"}
                </p>
            )}

          <Button
            type="submit"
            disabled={otp.length !== 6 && verifyMutation.isPending}
            className="h-12 w-full rounded-xl bg-orange-500 text-base font-medium hover:bg-orange-600"
          >
         {verifyMutation.isPending ? "Verifying...":"Verify otp"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>

            {timer > 0 ? (
              <span className="text-muted-foreground">
                Resend in{" "}
                <span className="font-medium">
                  00:{timer.toString().padStart(2, "0")}
                </span>
              </span>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Resend Code
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
