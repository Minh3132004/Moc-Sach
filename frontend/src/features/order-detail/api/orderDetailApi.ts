import OrderDetail from "../model/OrderDetail";
import api from "../../../lib/http";

// Lấy 1 đơn hàng chi tiết bởi mã đơn hàng
export const get1OrderDetail = async (idOrder: number) => {
    const endpoint = `/orders/${idOrder}/listOrderDetails`;
    const response = await api.get(endpoint);
    const responseData = response._embedded.orderDetails;
    const orderDetail: OrderDetail[] = await Promise.all(responseData.map((orderDetail: OrderDetail) => 
        new OrderDetail(
            orderDetail.idOrderDetail,
            orderDetail.quantity,
            orderDetail.price,
            orderDetail.review,
        )
    ));

    console.log(orderDetail);
    
    return orderDetail;
}