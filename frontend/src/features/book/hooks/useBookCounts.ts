import { useQuery } from "@tanstack/react-query";

import { getTotalNumberOfBooks } from "../api/bookApi";

export function useTotalBookCount() {
  return useQuery({
    queryKey: ["books", "count", "total"],
    queryFn: () => getTotalNumberOfBooks(),
  });
}
