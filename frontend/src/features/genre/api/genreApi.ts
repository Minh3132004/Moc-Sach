import GenreModel from "../model/GenreModel";
import api from "../../../lib/http";


//Tạo phương thức lấy thể loại theo yêu cầu 
async function getGenre(endpoint: string): Promise<GenreModel[]> {
   // Gọi api
   const response = await api.get(endpoint);

   const responeData = response._embedded.genres;

   //Gắn dữ liệu vào mảng
   const genreList = responeData.map((genre: GenreModel) =>
      new GenreModel(
         genre.idGenre,
         genre.nameGenre
      )
   )

   return genreList;
}

//Tạo phương thức lấy tất cả thể loại
export async function getAllGenres(): Promise<GenreModel[]> {
   const endpoint = "/genre?sort=idGenre";

   return getGenre(endpoint);
}

//Tạo phương thức lấy thể loại theo id
export async function get1Genre(idGenre: number): Promise<GenreModel> {
   const endpoint = `/genre/${idGenre}`;

   const response = await api.get(endpoint);

   //Gắn dữ liệu vào genre
   const genre = new GenreModel(
      response.idGenre,
      response.nameGenre
   );

   return genre;
}

//Tạo phương thức lấy thể loại theo id sách
export async function getGenreByIdBook(idBook: number): Promise<GenreModel[]> {
   const endpoint = `/books/${idBook}/listGenres`;

   return getGenre(endpoint);
}