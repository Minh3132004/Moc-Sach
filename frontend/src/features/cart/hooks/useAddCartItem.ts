import { useMutation } from "@tanstack/react-query";

import { addCartItem } from "../api/cartApi";

export type AddCartItemPayload = {
  idUser: number | undefined;
  idBook: number;
  quantity: number;
};

export function useAddCartItem() {
  return useMutation({
    mutationFn: (payload: AddCartItemPayload) => addCartItem(payload.idUser, payload.idBook, payload.quantity),
  });
}
