import { useQuery } from "@tanstack/react-query";
import { filterBooks } from "../api/bookApi";

export function useFilterBooks(
  bookName?: string,
  author?: string,
  genreIds?: number[],
  minPrice?: number,
  maxPrice?: number,
  sort?: string,
  size = 8,
  page = 0
) {
  return useQuery({
    queryKey: ["books", "filter", bookName, author, genreIds, minPrice, maxPrice, sort, size, page],
    queryFn: () => filterBooks(bookName, author, genreIds, minPrice, maxPrice, sort, size, page),
  });
}
