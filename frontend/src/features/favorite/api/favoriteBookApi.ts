import api from "../../../lib/http";
import { type ApiResponse, isApiSuccess } from "../../../lib/apiResponse";
import { toast } from "react-toastify";
import { type FavoriteBookResponse } from "../model/FavoriteBookModel";

//Lấy danh sách sách yêu thích của người dùng
export async function getFavoriteBooksByUser(idUser: number | undefined): Promise<FavoriteBookResponse[]> {
    if (idUser === undefined) {
        return [];
    }

    const endpoint = `/favorite-book/get-favorite-book/${idUser}`;
    const response = await api.get<any, ApiResponse<FavoriteBookResponse[]>>(endpoint);

    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Không thể lấy danh sách yêu thích");
    }

    return response.data ?? [];
}

//Thêm sách vào danh sách yêu thích
export async function addFavoriteBook(idUser: number | undefined, idBook: number): Promise<void> {
    if (idUser === undefined) {
        toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích");
        throw new Error("Chưa đăng nhập");
    }

    const endpoint = `/favorite-book/add-book`;
    const response = await api.post<any, ApiResponse<unknown>>(endpoint, { idUser, idBook });

    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Không thể thêm vào danh sách yêu thích");
    }
}

//Xóa sách khỏi danh sách yêu thích
export async function removeFavoriteBook(idUser: number | undefined, idBook: number): Promise<void> {
    if (idUser === undefined) {
        toast.error("Vui lòng đăng nhập để xóa khỏi danh sách yêu thích");
        throw new Error("Chưa đăng nhập");
    }

    const endpoint = `/favorite-book/remove-book`;
    const response = await api.delete<any, ApiResponse<unknown>>(endpoint, { data: { idUser, idBook } });

    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Không thể xóa khỏi danh sách yêu thích");
    }
}