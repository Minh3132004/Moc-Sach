import { useQuery } from "@tanstack/react-query";

import { getReviewByIdBook } from "../api/reviewApi";

export function useReviewsByBook(idBook?: number) {
  return useQuery({
    queryKey: ["reviews", "byBook", idBook],
    queryFn: () => getReviewByIdBook(idBook as number),
    enabled: typeof idBook === "number",
    staleTime: 60_000,
  });
}
