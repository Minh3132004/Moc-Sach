import { useQuery } from "@tanstack/react-query";

import { getNewBook } from "../api/bookApi";

export function useNewBooks(size = 4) {
  return useQuery({
    queryKey: ["books", "new", size],
    queryFn: () => getNewBook(size),
  });
}
