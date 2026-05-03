import BookModel from "../model/BookModel";
import api from "../../../lib/http";
import { type ApiResponse, isApiSuccess } from "../../../lib/apiResponse";

// Tạo ra các biến trả về
export interface BookListResult {
   bookList: BookModel[];
   totalElements: number;
   totalPages: number;
   size: number;
}

// Hàm map dữ liệu sang BookModel dùng chung
function mapToBookModel(book: any): BookModel {
   return new BookModel(
      book.idBook,
      book.nameBook,
      book.author,
      book.description,
      book.listPrice,
      book.sellPrice,
      book.quantity,
      book.avgRating,
      book.soldQuantity,
      book.discountPercent
   );
}

// Tạo phương thức lấy sách 
async function getBook(endpoint: string): Promise<BookListResult> {
   const response = await api.get<any, ApiResponse<any>>(endpoint);
   
   if (!isApiSuccess(response)) {
      throw new Error(response.message || "Lỗi lấy danh sách sách");
   }

   const payload = response.data;

   const responseData = payload?.bookList ?? [];
   const totalPages: number = payload?.totalPages ?? 0;
   const totalElements: number = payload?.totalElements ?? 0;
   const size = payload?.size ?? 0;

   const bookList: BookModel[] = responseData.map(mapToBookModel);

   return { bookList, totalPages, size, totalElements };
}

// Tạo phương thức lấy sách bán chạy
export async function getHotBook(size = 5, page = 0): Promise<BookListResult> {
   // Xác định endpoint
   const endpoint: string = `/books/hot?size=${size}&page=${page}`;

   return getBook(endpoint);
}

// Tạo phương thức lấy sách hot theo thể loại
export async function getHotBooksByGenre(idGenre: number, size = 10, page = 0): Promise<BookListResult> {
   const endpoint: string = `/books/hot-by-genre?idGenre=${idGenre}&size=${size}&page=${page}`;

   return getBook(endpoint);
}

//Tạo phương thức lấy sách mới
export async function getNewBook(size = 4): Promise<BookListResult> {
   // Xác định endpoint
   const endpoint: string = `/books/new?size=${size}`;

   return getBook(endpoint);
}

// Tạo phương thức lấy sách Flash Sale
export async function getFlashSaleBook(size = 5, page = 0): Promise<BookListResult> {
   const endpoint: string = `/books/flashsale?size=${size}&page=${page}`;

   return getBook(endpoint);
}

//Tạo phương thức lấy tất cả các sách 
export async function getAllBook(size?: number, page?: number): Promise<BookListResult> {
   // Nếu không truyền size thì mặc định là 8
   if (!size) {
      size = 8;
   }

   if (page === undefined) {
      page = 0;
   }

   // Xác định endpoint
   const endpoint: string = `/books/get-all?size=${size}&page=${page}`;

   return getBook(endpoint);
}

//Tạo phương thức tìm kiếm sách .
export async function searchBook(idGenre?: number, keySearch?: string, size?: number, page?: number): Promise<BookListResult> {

   // Nếu không truyền size thì mặc định là 8
   if (!size) {
      size = 8;
   }

   // Nếu không truyền page thì mặc định là 0
   if (page === undefined) {
      page = 0;
   }

   // Xác định endpoint

   let endpoint: string;

   //Tìm bởi thể loại
   if (keySearch === "" && idGenre !== undefined) {
      endpoint = `/books/search/findByListGenres_idGenre?sort=idBook,desc&size=${size}&page=${page}&idGenre=${idGenre}`;
   }

   //Tìm bởi tên sách
   else if (keySearch !== "" && idGenre === undefined) {
      endpoint = `/books/search/findByNameBookContaining?sort=idBook,desc&size=${size}&page=${page}&nameBook=${keySearch}`;
   }

   //Tìm bởi cả tên sách và thể loại
   else if (keySearch != "" && idGenre !== undefined) {
      endpoint = `/books/search/findByNameBookContainingAndListGenres_idGenre?sort=idBook,desc&size=${size}&page=${page}&nameBook=${keySearch}&idGenre=${idGenre}`;
   }

   //Nếu không thuộc trường hợp nào thì sẽ lấy tất cả sách
   else {
      endpoint = `/books?sort=idBook,desc&size=${size}&page=${page}`;
   }

   return getBook(endpoint);
}

// Tạo phương thức lấy sách theo mã sách
export async function getBookById(idBook: number): Promise<BookModel> {
   const endpoint: string = `/books/detail/${idBook}`;
   const response = await api.get<any, ApiResponse<any>>(endpoint);
   
   if (!isApiSuccess(response)) {
      throw new Error(response.message || "Không tìm thấy sách");
   }
   
   const payload = response.data;
   return mapToBookModel(payload);
}

// Tạo phương thức lấy sách theo mã sách trong giỏ hàng
export async function getBookByIdCartItem(idCart: number): Promise<BookModel | null> {
   const endpoint = `/cart-items/${idCart}/book`;
   try {
      const response = await api.get<any, ApiResponse<any>>(endpoint);
      if (!isApiSuccess(response)) return null;
      return response.data ? mapToBookModel(response.data) : null;
   } catch (error) {
      console.error('Error: ', error);
      return null;
   }
}

// Cập nhật thông tin sách
export async function updateBook(book: BookModel): Promise<ApiResponse<any>> {
   const endpoint = `/books/update`;
   return api.put<any, ApiResponse<any>>(endpoint, book);
}

//Lấy sách theo mã chi tiết đơn hàng
export async function getBookByIdOrderDetail(idOrderDetail: number): Promise<BookModel> {
   const endpoint = `/order-detail/${idOrderDetail}/book`;
   const response = await api.get<any, ApiResponse<any>>(endpoint);
   if (!isApiSuccess(response)) {
      throw new Error(response.message || "Không tìm thấy sách cho chi tiết đơn hàng");
   }
   return mapToBookModel(response.data);
}

// Hàm lấy tổng số sách
export async function getTotalNumberOfBooks(): Promise<number> {
   try {
      const endPoint = "/books/get-all?size=1&page=0";
      const response = await api.get<any, ApiResponse<any>>(endPoint);
      if (!isApiSuccess(response)) return 0;
      return response.data?.totalElements || 0;
   } catch (error) {
      console.error("Error fetching total number of books:", error);
      return 0;
   }
}

// Hàm lấy số lượng sách theo genre ID
export async function getBookCountByGenreId(genreId: number): Promise<number> {
   try {
      const endpoint = `/genre/${genreId}/listBooks`;
      const response = await api.get<any, ApiResponse<any>>(endpoint);
      if (!isApiSuccess(response)) return 0;
      
      const responseData: BookModel[] = await Promise.all((response.data?.bookList ?? []).map(async (book: any) =>
         new BookModel(
            book.idBook,
            book.nameBook,
            book.author,
            book.description,
            book.listPrice,
            book.sellPrice,
            book.quantity,
            book.avgRating,
            book.soldQuantity,
            book.discountPercent
         )
      ));
      return responseData.length;
   } catch (error) {
      console.error("Error fetching book count by genre:", error);
      return 0;
   }
}

