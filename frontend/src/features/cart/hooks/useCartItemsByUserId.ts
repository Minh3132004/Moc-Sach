import { useQuery } from "@tanstack/react-query";
import { getCartItemsByUserId } from "../api/cartApi";
import CartItemModel from "../model/CartItemModel";

export function useCartItemsByUserId(idUser: number | undefined) {
  return useQuery<CartItemModel[]>({
    queryKey: ["cart", "user", idUser],
    queryFn: () => getCartItemsByUserId(idUser),
    enabled: idUser !== undefined,
  });
}
