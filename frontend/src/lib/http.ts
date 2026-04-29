import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import ApiError from "./ApiError";

const IS_DEV = import.meta.env.DEV;
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const LOGIN_PATH = '/login';

// Tạo instance Axios với cấu hình cơ bản
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Interceptor để tự động thêm token vào header và xử lý lỗi
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (IS_DEV) {
            console.log('Request:', config.method?.toUpperCase(), config.url);
        }

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Interceptor để xử lý response và lỗi
api.interceptors.response.use(
    (response: AxiosResponse) => {
        if (IS_DEV) {
            console.log('Response:', response.status, response.config.url);
        }

        return response.data;
    },
    (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data as any;

            console.error('Response Error:', status, error.config?.url);

            switch (status) {
                case 401:
                    console.error('Unauthorized: Vui lòng đăng nhập lại');
                    localStorage.removeItem('token');
                    if (window.location.pathname !== LOGIN_PATH) {
                        window.location.replace(LOGIN_PATH);
                    }
                    break;
                case 403:
                    console.error('Forbidden: Bạn không có quyền truy cập');
                    break;
                case 404:
                    console.error('Not Found: API endpoint không tồn tại');
                    break;
                case 500:
                    console.error('Server Error: Lỗi server');
                    break;
            }

            throw new ApiError(data?.message || 'Request lỗi', status, data?.timestamp);
        }

        if (error.request) {
            console.error('Network Error: Không thể kết nối tới server');
            throw new ApiError('Không thể kết nối tới server. Vui lòng kiểm tra internet.', 0);
        }

        console.error('Error:', error.message);
        throw new ApiError(error.message || 'Unknown error', 0);
    }
);

export default api;

