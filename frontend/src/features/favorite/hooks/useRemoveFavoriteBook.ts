import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeFavoriteBook } from "../api/favoriteBookApi";

export type RemoveFavoriteBookPayload = {
  idUser: number | undefined;
  idBook: number;
};

export function useRemoveFavoriteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RemoveFavoriteBookPayload) => removeFavoriteBook(payload.idUser, payload.idBook),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorite-books", "by-user", variables.idUser] });
    },
  });
}
