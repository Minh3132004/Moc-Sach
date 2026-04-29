import { useQuery } from "@tanstack/react-query";

import { get3BestSellerBooks } from "../api/bookApi";

export function useBestSellerBooks() {
  return useQuery({
    queryKey: ["books", "best-seller", 3],
    queryFn: () => get3BestSellerBooks(),
  });
}
