import { toast } from "react-toastify";
import { getIdUserByToken } from "../../auth/JwtService";
import CartItemModel from "../model/CartItemModel";
import { getBookByIdCartItem } from "../../book/api/bookApi";
import api from "../../../lib/http";

// Lấy giỏ hàng theo id user
export async function getCartAllByIdUser(): Promise<CartItemModel[]> {
   const idUser = Number(getIdUserByToken());
   const endpoint = `/users/${idUser}/listCartItems`;
   try {
      const response = await api.get(endpoint);
      const responseData = response._embedded.cartItems;
      const cartResponseList = await Promise.all(responseData.map(async (item: any) => {
         const book = await getBookByIdCartItem(item.idCart);
         return new CartItemModel(item.idCart, item.quantity, book || undefined, idUser);
      })
      );
      console.log(cartResponseList);
      return cartResponseList;
   } catch (error) {
      console.error('Error: ', error);
   }
   return [];
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
export async function updateQuantityCartItem(cartItem: CartItemModel) {
   const endpoint = `/cart-item/update-quantity/${cartItem.idCart}`;
   try {
      const response = await api.put(endpoint, {
         quantity: cartItem.quantity,
      });
      if (response) {
         toast.success("Đã cập nhật số lượng sản phẩm trong giỏ hàng");
      }
   } catch (error) {
      console.error('Error: ', error);
   }
}