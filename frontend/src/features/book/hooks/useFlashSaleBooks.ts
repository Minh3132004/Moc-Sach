import { useQuery } from "@tanstack/react-query";

import { getFlashSaleBook } from "../api/bookApi";

export function useFlashSaleBooks(size = 5, page = 0) {
  return useQuery({
    queryKey: ["books", "flashsale", size, page],
    queryFn: () => getFlashSaleBook(size, page),
  });
}
