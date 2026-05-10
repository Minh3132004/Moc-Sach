import { useQuery } from "@tanstack/react-query";

import { getFavoriteBooksByUser } from "../api/favoriteBookApi";

export function useFavoriteBooksByUser(idUser?: number) {
  return useQuery({
    queryKey: ["favorite-books", "by-user", idUser],
    queryFn: () => getFavoriteBooksByUser(idUser),
    enabled: typeof idUser === "number",
  });
}
