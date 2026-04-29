import { useQuery } from "@tanstack/react-query";

import { searchBook } from "../api/bookApi";

export function useSearchBooks(params: {
  idGenre?: number;
  keySearch?: string;
  size?: number;
  page?: number;
}) {
  const { idGenre, keySearch, size, page } = params;

  return useQuery({
    queryKey: ["books", "search", idGenre, keySearch, size, page],
    queryFn: () => searchBook(idGenre, keySearch, size, page),
  });
}
