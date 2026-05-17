import { useQuery } from "@tanstack/react-query";
import { getUsersAdmin } from "../api/userApi";

export function useUsersAdmin(page = 0, size = 10, keyword = "", sort = "idUser,desc") {
  return useQuery({
    queryKey: ["admin-users", page, size, keyword, sort],
    queryFn: () => getUsersAdmin(page, size, keyword, sort),
    retry: 1,
  });
}
