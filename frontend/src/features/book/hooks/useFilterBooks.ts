import { useQuery } from "@tanstack/react-query";
import { filterBooks } from "../api/bookApi";

export function useFilterBooks(
  author?: string,
  genreIds?: number[],
  minPrice?: number,
  maxPrice?: number,
  sort?: string,
  size = 8,
  page = 0
) {
  return useQuery({
    queryKey: ["books", "filter", author, genreIds, minPrice, maxPrice, sort, size, page],
    queryFn: () => filterBooks(author, genreIds, minPrice, maxPrice, sort, size, page),
  });
}
