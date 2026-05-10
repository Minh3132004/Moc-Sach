import { toast } from "react-toastify";
import CartItemModel from "../model/CartItemModel";
import { getBookByIdCartItem } from "../../book/api/bookApi";
import api from "../../../lib/http";
import { type ApiResponse, isApiSuccess } from "../../../lib/apiResponse";

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