import { useQuery } from "@tanstack/react-query";

import { getHotBook } from "../api/bookApi";

export function useHotBooks(size = 4) {
  return useQuery({
    queryKey: ["books", "hot", size],
    queryFn: () => getHotBook(size),
  });
}
