import api from "../../../lib/http";
import { type ApiResponse, isApiSuccess } from "../../../lib/apiResponse";

export interface UserResponse {
    idUser: number;
    firstName: string | null;
    lastName: string | null;
    username?: string;
    email: string;
    phoneNumber: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    deliveryAddress: string | null;
    avatar?: string | null;
    enabled?: boolean;
}

export interface ChangePasswordRequest {
    idUser: number;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface JwtResponse {
    jwtToken: string;
}

export async function getUserBasicById(idUser: number): Promise<ApiResponse<UserResponse>> {
    const endpoint = `/user/${idUser}`;
    const response = await api.get<any, ApiResponse<UserResponse>>(endpoint);

    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Lấy thông tin người dùng thất bại");
    }

    return response;
}

// Hàm cập nhật hồ sơ
export async function updateProfile(payload: UserResponse): Promise<ApiResponse<null>> {
    const endpoint = `/user/update-profile`;
    const response = await api.put<any, ApiResponse<null>>(endpoint, payload);

    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Cập nhật hồ sơ thất bại");
    }

    return response;
}

// Hàm đổi mật khẩu
export async function changePassword(payload: ChangePasswordRequest): Promise<ApiResponse<null>> {
    const endpoint = `/user/change-password`;
    const response = await api.put<any, ApiResponse<null>>(endpoint, payload);

    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Đổi mật khẩu thất bại");
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

 // Hàm đăng nhập
 export async function loginUser(payload: any): Promise<ApiResponse<JwtResponse>> {
     const endpoint = `/user/authenticate`;
     const response = await api.post<any, ApiResponse<JwtResponse>>(endpoint, payload);
     
     if (!isApiSuccess(response)) {
         throw new Error(response.message || "Đăng nhập thất bại");
     }
     
     return response;
 }
