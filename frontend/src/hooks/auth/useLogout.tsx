import { useMutation } from "@tanstack/react-query";
import queryClient from "../../libs/queryClient";
import { AuthService } from "../../services/auth.service";
import { authStore } from "../../store/auth";

export const useLogout = () => {
  return useMutation({
    mutationFn: AuthService.logout,
    retry: 2,

    onSuccess: async (data) => {
      authStore.getState().clear();
      await queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ queryKey: ["me"] });
    },
  });
};
