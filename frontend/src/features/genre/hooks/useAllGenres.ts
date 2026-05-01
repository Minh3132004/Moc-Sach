import { useQuery } from "@tanstack/react-query";
import { getAllGenres } from "../api/genreApi";

export function useAllGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: getAllGenres,
  });
}
