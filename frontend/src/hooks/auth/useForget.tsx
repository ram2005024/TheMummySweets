import { useMutation } from "@tanstack/react-query"
import { AuthService } from "../../services/auth.service"


// For forget password request
export const useForget=()=>{
    return (
        useMutation({
            mutationFn:AuthService.forget,
            retry:false
        })
    )
}
// For forget password resend
export const useForgetResend=()=>{
    return (
        useMutation({
            mutationFn:AuthService.forget_resend,
            retry:false
        })
    )
}
// For forget password verification
export const useForgetVerify=()=>{
    return (
        useMutation({
            mutationFn:AuthService.forget_verify,
            retry:false
        })
    )
}
// For password change after verification
export const usePassowordChange=()=>{
    return (
        useMutation({
            mutationFn:AuthService.password_change_after_forget,
            retry:false
        })
    )
}
