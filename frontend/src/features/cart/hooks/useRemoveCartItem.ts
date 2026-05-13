import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeCartItem } from "../api/cartApi";

export type RemoveCartItemPayload = {
  idCart: number;
  idUser: number;
};

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RemoveCartItemPayload) => removeCartItem(payload.idCart),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", "user", variables.idUser] });
    },
  });
}