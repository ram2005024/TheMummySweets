import { useQuery } from "@tanstack/react-query";
import { AuthService } from "../../services/auth.service";
import { authStore } from "../../store/auth";

export const useUser = () => {
  const access = authStore((state) => state.access);
  return useQuery({
    queryKey: ["me"],
    queryFn: AuthService.getUser,
    enabled: !!access,
  });
};
