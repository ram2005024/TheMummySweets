import { useQuery } from "@tanstack/react-query"
import { authStore } from "../../store/auth"
import { AuthService } from "../../services/auth.service"


export const useUser=()=>{
    const access=authStore(state=>state.access)
    return useQuery({
        queryKey:["me"],
        queryFn:AuthService.getUser,
        enabled: !!access
    })
}
