import { useQuery } from "@tanstack/react-query";
import { syncUser } from "../services/auth.service";

export const useGetUser = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: syncUser,
  });
