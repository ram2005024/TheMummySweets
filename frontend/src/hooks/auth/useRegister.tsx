import { useMutation } from "@tanstack/react-query"
import { RegisterService } from "../../services/auth.service"


export const useRegisterPhone=()=>{
    return (
        useMutation({
            mutationFn:RegisterService.registerWithPhone,
            retry:false,
        })
    )
}
export const useRegisterEmail=()=>{
    return (
        useMutation({
            mutationFn:RegisterService.registerWithEmail,
            retry:false,
        })
    )
}
