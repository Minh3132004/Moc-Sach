import api from "../../../lib/http";
import { type ApiResponse, isApiSuccess } from "../../../lib/apiResponse";

export interface UserBasicResponse {
    idUser: number;
    firstName: string | null;
    lastName: string | null;
    username: string;
    email: string;
    phoneNumber: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    deliveryAddress: string | null;
    avatar: string | null;
    enabled: boolean;
}

export async function getUserBasicById(idUser: number): Promise<ApiResponse<UserBasicResponse>> {
    const endpoint = `/user/${idUser}`;
    const response = await api.get<any, ApiResponse<UserBasicResponse>>(endpoint);

    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Lấy thông tin người dùng thất bại");
    }

    return response;
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

 // Hàm kích hoạt tài khoản
 export async function activateAccount(email: string, activationCode: string): Promise<ApiResponse<null>> {
     const endpoint = `/user/active-account?email=${encodeURIComponent(email)}&activationCode=${encodeURIComponent(activationCode)}`;
     const response = await api.get<any, ApiResponse<null>>(endpoint);
     
     if (!isApiSuccess(response)) {
         throw new Error(response.message || "Kích hoạt tài khoản thất bại");
     }
     
     return response;
 }

 export interface JwtResponse {
     jwtToken: string;
 }

 // Hàm đăng nhập
 export async function loginUser(payload: any): Promise<ApiResponse<JwtResponse>> {
     const endpoint = `/user/authenticate`;
     const response = await api.post<any, ApiResponse<JwtResponse>>(endpoint, payload);
     
     if (!isApiSuccess(response)) {
         throw new Error(response.message || "Đăng nhập thất bại");
     }
     
     // Lưu token vào localStorage
     if (response.data?.jwtToken) {
         localStorage.setItem("token", response.data.jwtToken);
     }
     
     return response;
 }
