import { useQuery } from "@tanstack/react-query";

import { getAllBook } from "../api/bookApi";

export function useAllBooks(size = 8, page = 0) {
  return useQuery({
    queryKey: ["books", "all", size, page],
    queryFn: () => getAllBook(size, page),
  });
}
