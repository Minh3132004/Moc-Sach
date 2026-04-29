import { useQuery } from "@tanstack/react-query";

import { getBookCountByGenreId } from "../api/bookApi";

export function useBookCountByGenre(genreId?: number) {
  return useQuery({
    queryKey: ["books", "count", "genre", genreId],
    queryFn: () => getBookCountByGenreId(genreId as number),
    enabled: typeof genreId === "number",
  });
}
