import api from "../../../lib/http";

//Lấy danh sách sách yêu thích của người dùng
export async function getFavoriteBooksByUser(idUser: number | undefined) {
    const endpoint = `/favorite-book/get-favorite-book/${idUser}`;
    const response = await api.get(endpoint);  
    return response;   
}

//Thêm sách vào danh sách yêu thích
export async function addFavoriteBook(idUser: number, idBook: number) {
    const endpoint = `/favorite-book/add-book`;
    
    const requestBody = {
        idUser: idUser,
        idBook: idBook
    };

    const response = await api.post(endpoint, requestBody);
    
    return response;
}

//Xóa sách khỏi danh sách yêu thích
export async function removeFavoriteBook(idUser: number, idBook: number) {
    const endpoint = `/favorite-book/remove-book`;
    
    const requestBody = {
        idUser: idUser,
        idBook: idBook
    };

    const response = await api.delete(endpoint, { data: requestBody });
    
    return response;
}