import { toast } from "react-toastify";
import CartItemModel from "../model/CartItemModel";
import BookModel from "../../book/model/BookModel";
import ImageModel from "../../image/model/ImageModel";
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

/** Lấy danh sách sản phẩm trong giỏ hàng theo id người dùng */
export async function getCartItemsByUserId(idUser: number | undefined): Promise<CartItemModel[]> {
   if (idUser === undefined) {
      throw new Error("Chưa đăng nhập");
   }
   const response = await api.get<any, ApiResponse<any[]>>(`/cart-item/user/${idUser}`);
   if (!isApiSuccess(response)) {
      throw new Error(response.message || "Không thể lấy danh sách giỏ hàng");
   }
   
   const data = response.data || [];
   return data.map((item: any) => {
      const book = item.book ? new BookModel(
         item.book.idBook,
         item.book.nameBook,
         item.book.author,
         item.book.description,
         item.book.listPrice,
         item.book.sellPrice,
         item.book.quantity,
         item.book.avgRating,
         item.book.soldQuantity,
         item.book.discountPercent,
         item.book.genres
      ) : undefined;
      
      const images = item.images ? item.images.map((img: any) => new ImageModel(
         img.idImage,
         img.nameImage,
         img.thumbnail,
         img.urlImage
      )) : [];
      
      return new CartItemModel(
         item.idCart,
         item.quantity,
         book,
         item.idUser,
         images
      );
   });
}

/** Cập nhật số lượng sản phẩm trong giỏ */
export async function updateCartItemQuantity(idCart: number, quantity: number, idBook: number, idUser: number): Promise<void> {
   const response = await api.put<any, ApiResponse<unknown>>(`/cart-item/update-quantity/${idCart}`, {
      idBook,
      idUser,
      quantity,
   });
   if (!isApiSuccess(response)) {
      throw new Error(response.message || "Không thể cập nhật số lượng");
   }
}

/** Xóa sản phẩm khỏi giỏ hàng */
export async function removeCartItem(idCart: number): Promise<void> {
   const response = await api.delete<any, ApiResponse<unknown>>(`/cart-items/${idCart}`);
   if (!isApiSuccess(response)) {
      throw new Error(response.message || "Không thể xóa sản phẩm khỏi giỏ hàng");
   }
}