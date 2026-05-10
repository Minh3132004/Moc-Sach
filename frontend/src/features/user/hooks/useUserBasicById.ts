import { useQuery } from "@tanstack/react-query";
import { getUserBasicById } from "../api/userApi";

export function useUserBasicById(idUser?: number) {
  return useQuery({
    queryKey: ["user-basic", idUser],
    queryFn: () => getUserBasicById(idUser!),
    enabled: !!idUser,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
