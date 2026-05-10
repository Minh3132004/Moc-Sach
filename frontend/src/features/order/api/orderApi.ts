import OrderModel from "../model/OrderModel";
import api from "../../../lib/http";

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

