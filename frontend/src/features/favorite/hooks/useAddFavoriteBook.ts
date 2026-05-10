import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addFavoriteBook } from "../api/favoriteBookApi";

export type AddFavoriteBookPayload = {
  idUser: number | undefined;
  idBook: number;
};

export function useAddFavoriteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddFavoriteBookPayload) => addFavoriteBook(payload.idUser, payload.idBook),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorite-books", "by-user", variables.idUser] });
    },
  });
}
