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
    const endpoint = `/user/detail/${idUser}`;
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

// Hàm quên mật khẩu
export async function forgotPassword(email: string): Promise<ApiResponse<null>> {
    const endpoint = `/user/forgot-password`;
    const response = await api.put<any, ApiResponse<null>>(endpoint, { email });

    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Gửi yêu cầu quên mật khẩu thất bại");
    }

    return response;
}

// Hàm lấy signature upload Cloudinary
export async function getCloudinarySignature(folder?: string): Promise<ApiResponse<any>> {
    const endpoint = `/api/cloudinary/signature${folder ? `?folder=${folder}` : ""}`;
    const response = await api.get<any, ApiResponse<any>>(endpoint);

    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Lấy signature Cloudinary thất bại");
    }

    return response;
}

// Hàm đổi avatar
export async function changeAvatar(idUser: number, avatarUrl: string): Promise<ApiResponse<JwtResponse>> {
    const endpoint = `/user/change-avatar`;
    const response = await api.put<any, ApiResponse<JwtResponse>>(endpoint, { idUser, avatarUrl });

    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Cập nhật ảnh đại diện thất bại");
    }

    return response;
}

// ================= ADMIN FUNCTIONS =================

// Lấy danh sách users (phân trang + sort) cho admin
export async function getUsersAdmin(page = 0, size = 10, keyword = "", sort = "idUser,desc"): Promise<{ items: UserResponse[], page: any }> {
    const endpoint = `/user/get-all?page=${page}&size=${size}&keyword=${encodeURIComponent(keyword)}&sort=${encodeURIComponent(sort)}`;
    const response = await api.get<any, ApiResponse<any>>(endpoint);
    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Lấy danh sách người dùng thất bại");
    }
    const data = response.data || {};
    const items = data.items || [];
    const pageInfo = {
        number: data.currentPage || 0,
        size,
        totalElements: data.totalElements || items.length,
        totalPages: data.totalPages || 1
    };
    return { items, page: pageInfo };
}

// Khóa/mở khóa tài khoản
export async function toggleUserStatus(idUser: number): Promise<ApiResponse<null>> {
    const endpoint = `/user/${idUser}/toggle-status`;
    const response = await api.patch<any, ApiResponse<null>>(endpoint);
    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Cập nhật trạng thái thất bại");
    }
    return response;
}

// Thêm người dùng mới (admin)
export async function addUserByAdmin(payload: any): Promise<ApiResponse<null>> {
    const endpoint = `/user/add-user`;
    const response = await api.post<any, ApiResponse<null>>(endpoint, payload);
    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Thêm người dùng thất bại");
    }
    return response;
}

// Cập nhật người dùng (admin)
export async function updateUserByAdmin(idUser: number, payload: any): Promise<ApiResponse<null>> {
    const endpoint = `/user/${idUser}/update-by-admin`;
    const response = await api.patch<any, ApiResponse<null>>(endpoint, payload);
    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Cập nhật người dùng thất bại");
    }
    return response;
}

