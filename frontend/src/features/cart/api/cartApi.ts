import { toast } from "react-toastify";
import CartItemModel from "../model/CartItemModel";
import { getBookByIdCartItem } from "../../book/api/bookApi";
import api from "../../../lib/http";
import { type ApiResponse, isApiSuccess } from "../../../lib/apiResponse";

/*
// Lấy giỏ hàng theo id user
export async function getCartAllByIdUser(idUser: number): Promise<CartItemModel[]> {
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
*/

/** Thêm sách vào giỏ (cần đăng nhập — JWT). */
export async function addCartItem(idUser: number | undefined, idBook: number, quantity: number): Promise<void> {
   if (idUser === undefined) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      throw new Error("Chưa đăng nhập");
   }
   const response = await api.post<any, ApiResponse<unknown>>("/cart-item/add-item", {
      idBook,
      quantity,
      idUser,
   });
   if (!isApiSuccess(response)) {
      throw new Error(response.message || "Không thể thêm vào giỏ hàng");
   }
   toast.success("Đã thêm sản phẩm vào giỏ hàng");
}

/*
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
*/