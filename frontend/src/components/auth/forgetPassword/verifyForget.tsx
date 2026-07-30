"use client"

import React, { useState } from "react"
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
import { useForgetResend, useForgetVerify } from "../../../hooks/auth/useForget"
import { unAuthenticatedLogin } from "../../../type/auth.type"
import PasswordChange from "./passwordChange"
import { AxiosError } from "axios"
import { ErrorResponse } from "../../../type/common.type"

interface Props {
  open: boolean
  onClose: () => void
  data:unAuthenticatedLogin
}

const VerifyForget = ({ open, onClose,data }: Props) => {
  const [otp, setOtp] = React.useState("")
  const [pChange,setPChange]=useState<boolean>(false)
  const [userID,setUserID]=useState<string>("")
  const resendMutation=useForgetResend()
  const [timer, setTimer] = React.useState(60)

  React.useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
  }, [open])

  function handleResend() {
    setTimer(60)
    setOtp("")
    resendMutation.mutate(data.user_id)
  }
//   Mutation for verification
const mutation=useForgetVerify()
//   Handle verification
const handleVerification=(e?:React.FormEvent)=>{
    e?.preventDefault()
    e?.stopPropagation()
    mutation.mutate({otp:otp,user_id:data.user_id},{
    onSuccess:(data)=>{
        setPChange(true)
        setUserID(data.user_id)
    }
    })
}

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl p-8">
        <DialogHeader className="space-y-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border bg-orange-50 dark:bg-orange-950/20">
            <Mail className="h-7 w-7 text-orange-500" />
          </div>

          <div className="space-y-2">
            <DialogTitle className="text-2xl font-semibold">
              Verify your {data.field_name}
            </DialogTitle>

            <DialogDescription className="text-sm leading-6">
              Enter the verification code we sent to your {data.field_name}
            </DialogDescription>

            <p className="font-medium break-all">{data.field_value}</p>
          </div>
        </DialogHeader>

        <form onSubmit={(e)=>handleVerification(e)} className="mt-6 space-y-8">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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
            {mutation.isError && (
                <p className="mt-2 text-xs text-red-500">
                    {(mutation.error as AxiosError<ErrorResponse<null>>).response?.data?.message}
                </p>
            )}

          <Button
            type="submit"
            disabled={otp.length !== 6 || mutation.isPending}
            className="h-12 w-full rounded-xl bg-orange-500 text-base font-medium hover:bg-orange-600 cursor-pointer"
          >
            {mutation.isPending ? "Verifying....":"Verify OTP"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Button type="button" variant="ghost" onClick={onClose}>
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
              <Button type="button" variant="ghost" onClick={()=>handleResend()}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Resend Code
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
      {/* For password change dialog */}
      {pChange && userID && <PasswordChange user_id={userID} open={pChange} onClose={()=>setPChange(false)} redirect_url="/login"/> }
    </Dialog>
  )
}

export default VerifyForget
