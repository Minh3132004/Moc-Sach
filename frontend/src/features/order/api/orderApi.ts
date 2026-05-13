import OrderModel from "../model/OrderModel";
import api from "../../../lib/http";
import { type ApiResponse, isApiSuccess } from "../../../lib/apiResponse";

// Cập nhật trạng thái đơn (PATCH chỉ gửi field cần cập nhật)
export async function updateOrderStatus(idOrder: number, status: string) {
    const url = `/orders/${idOrder}`;
    await api.patch(url, { status });
}

// Hủy đơn hàng
export const cancel1Order = async (order: OrderModel) => {
    const endpoint = "/order/update-order";
    return api.put(endpoint, order);
};

// Lấy danh sách sách theo id đơn hàng
export async function getBooksByOrderId(idOrder: number): Promise<any[]> {
    const response = await api.get<any, ApiResponse<any[]>>(`/order/${idOrder}/books`);
    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Không thể lấy danh sách sách theo đơn hàng");
    }
    return response.data || [];
}

