import { useQuery } from "@tanstack/react-query";

import { getBookById } from "../api/bookApi";

export function useBookById(idBook?: number) {
  return useQuery({
    queryKey: ["books", "detail", idBook],
    queryFn: () => getBookById(idBook as number),
    enabled: typeof idBook === "number",
  });
}
