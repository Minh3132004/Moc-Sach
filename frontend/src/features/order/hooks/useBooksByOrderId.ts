import { useQuery } from "@tanstack/react-query";
import { getBooksByOrderId } from "../api/orderApi";

export function useBooksByOrderId(idOrder: number | undefined) {
  return useQuery({
    queryKey: ["order", "books", idOrder],
    queryFn: () => getBooksByOrderId(idOrder!),
    enabled: idOrder !== undefined,
  });
}
