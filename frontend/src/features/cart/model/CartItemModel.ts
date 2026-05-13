import BookModel from "../../book/model/BookModel";
import ImageModel from "../../image/model/ImageModel";

class CartItemModel {
   idCart?: number;
   quantity?: number;
   book?: BookModel;
   idUser?: number;
   images?: ImageModel[];

   constructor(idCart?: number, quantity?: number, book?: BookModel, idUser?: number, images?: ImageModel[]) {
      this.idCart = idCart;
      this.quantity = quantity;
      this.book = book;
      this.idUser = idUser;
      this.images = images;
   }
}

export default CartItemModel;