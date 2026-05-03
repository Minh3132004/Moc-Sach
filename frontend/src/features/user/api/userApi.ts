import UserModel from "../model/UserModel";
import api from "../../../lib/http";
import { type ApiResponse, isApiSuccess } from "../../../lib/apiResponse";

async function getUser(endPoint : string) : Promise<UserModel[]> {
    const response = await api.get(endPoint);
    const responseData = response._embedded.users;
    const userList = responseData.map((user : UserModel) => {
        return new UserModel(
            user.idUser,
            user.dateOfBirth,
            user.deliveryAddress,
            user.email,
            user.firstName,
            user.lastName,
            user.gender,
            user.password,
            user.phoneNumber,
            user.username,
            user.avatar,
            user.enabled
        );
    });
    return userList;
}
    
// Hàm lấy user theo id review
export async function getUserByIdReview(idReview : number) : Promise<UserModel> {

    const endPoint = `/reviews/${idReview}/user`;

    const response = await api.get(endPoint);

    const user = new UserModel(
        response.idUser,
        response.dateOfBirth,
        response.deliveryAddress,
        response.email,
        response.firstName,
        response.lastName,
        response.gender,
        response.password,
        response.phoneNumber,
        response.username,
        response.avatar,
        response.enabled
    );
    return user;
}

// Hàm lấy 1 user theo id
export async function get1User(idUser: number): Promise<UserModel> {
    const endPoint = `/users/${idUser}`;
    const response = await api.get(endPoint);

    const user = new UserModel(
        response.idUser,
        response.dateOfBirth,
        response.deliveryAddress,
        response.email,
        response.firstName,
        response.lastName,
        response.gender,
        response.password,
        response.phoneNumber,
        response.username,
        response.avatar,
        response.enabled
    );
    return user;
}

// Hàm lấy tất cả user theo role
export async function getAllUserRole(): Promise<UserModel[]> {
    try {
        const endPoint = "/users?size=1000"; // Lấy tối đa 1000 users
        return getUser(endPoint);
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

// Hàm upload avatar
export async function changeAvatar(idUser: number, avatarBase64: string): Promise<string> {
    const endpoint = `/user/change-avatar`;
    
    try {
        const data = await api.put(endpoint, {
            idUser: idUser,
            avatar: avatarBase64,
        });
        
        // Lưu token mới vào localStorage
        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        
        return data.token || "";
    } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error;
    }
}

 // Hàm đăng ký user
 export async function registerUser(payload: any): Promise<ApiResponse<null>> {
     const endpoint = `/user/register`;
     const response = await api.post<any, ApiResponse<null>>(endpoint, payload);
     
     if (!isApiSuccess(response)) {
         throw new Error(response.message || "Đăng ký thất bại");
     }
     
     return response;
 }
