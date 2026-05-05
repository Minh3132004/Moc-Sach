export interface BookGenreSummary {
   idGenre: number;
   nameGenre?: string;
}

class BookModel {
   id?: any;
   idBook: number;
   nameBook?: string;
   author?: string;
   description?: string;
   listPrice?: number;
   sellPrice?: number;
   quantity?: number;
   avgRating?: number;
   soldQuantity?: number;
   discountPercent?: number;
   genres?: BookGenreSummary[];

   constructor(
      idBook: number,
      nameBook?: string,
      author?: string,
      description?: string,
      listPrice?: number,
      sellPrice?: number,
      quantity?: number,
      avgRating?: number,
      soldQuantity?: number,
      discountPercent?: number,
      genres?: BookGenreSummary[],
   ) {
      this.idBook = idBook;
      this.nameBook = nameBook;
      this.author = author;
      this.description = description;
      this.listPrice = listPrice;
      this.sellPrice = sellPrice;
      this.quantity = quantity;
      this.avgRating = avgRating;
      this.soldQuantity = soldQuantity;
      this.discountPercent = discountPercent;
      this.genres = genres;
   }
}

export default BookModel;