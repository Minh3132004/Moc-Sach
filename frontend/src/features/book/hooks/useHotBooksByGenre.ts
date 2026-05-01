import { useQuery } from "@tanstack/react-query";
import { getHotBooksByGenre } from "../api/bookApi";

export function useHotBooksByGenre(idGenre: number | null, size = 10, page = 0) {
  return useQuery({
    queryKey: ["books", "hot-by-genre", idGenre, size, page],
    queryFn: () => (idGenre !== null ? getHotBooksByGenre(idGenre, size, page) : Promise.resolve(null)),
    enabled: idGenre !== null,
  });
}

