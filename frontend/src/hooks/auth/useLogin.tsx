import { useMutation } from "@tanstack/react-query"
import { LoginService } from "../../services/auth.service"

export const useLoginWithEmail= ()=>{
    return useMutation({
        mutationFn:LoginService.loginWithEmail,
        retry:false
    })
}
export const useLoginWithPhone= ()=>{
    return useMutation({
        mutationFn:LoginService.loginWithPhone,
        retry:false
    })
}
export const useVerifyOtp=()=>{
    return useMutation({
        mutationFn:LoginService.verifyOtp,
        retry:false
    })
}
