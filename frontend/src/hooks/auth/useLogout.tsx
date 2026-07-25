    import { useMutation } from "@tanstack/react-query"
    import { AuthService } from "../../services/auth.service"
    import queryClient from "../../libs/queryClient"
    import toast from "react-hot-toast"
    import { authStore } from "../../store/auth"


    export const useLogout=()=>{
        return useMutation({
            mutationFn:AuthService.logout,
            retry:2,

            onSuccess:async (data)=>{
                authStore.getState().clear()
                await queryClient.cancelQueries({queryKey:["me"]})
                queryClient.setQueryData(["me"],null)
                queryClient.removeQueries({queryKey:["me"]})
                toast.success(data.message)
            }
        })
    }
