import { useQuery } from "@tanstack/react-query";

import { getHotBook } from "../api/bookApi";

export function useHotBooks(size = 5, page = 0, enabled = true) {
  return useQuery({
    queryKey: ["books", "hot", size, page],
    queryFn: () => getHotBook(size, page),
    enabled,
  });
}
