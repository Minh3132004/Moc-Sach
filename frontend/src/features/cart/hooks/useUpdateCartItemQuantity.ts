import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartItemQuantity } from "../api/cartApi";

export type UpdateCartItemQuantityPayload = {
  idCart: number;
  quantity: number;
  idBook: number;
  idUser: number;
};

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCartItemQuantityPayload) =>
      updateCartItemQuantity(payload.idCart, payload.quantity, payload.idBook, payload.idUser),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", "user", variables.idUser] });
    },
  });
}