import OrderModel from "../model/OrderModel";
import api from "../../../lib/http";

// Helper function để lấy payment với xử lý lỗi
async function getPayment(idOrder: number): Promise<string> {
   try {
    const response = await api.get(`/orders/${idOrder}/payment`);
      return response.namePayment || "";
   } catch (error) {
      // Nếu endpoint không tồn tại (404), trả về giá trị mặc định
      console.warn(`Failed to fetch payment for order ${idOrder}:`, error);
      return "";
   }
}

// Helper function để lấy delivery với xử lý lỗi
async function getDelivery(idOrder: number): Promise<string> {
   try {
    const response = await api.get(`/orders/${idOrder}/delivery`);
      return response.nameDelivery || "";
   } catch (error) {
      // Nếu endpoint không tồn tại (404), trả về giá trị mặc định
      console.warn(`Failed to fetch delivery for order ${idOrder}:`, error);
      return "";
   }
}

// Lấy danh sách đơn hàng có phân trang từ Spring Data REST (/orders)
// Trả về mảng OrderModel cùng metadata phân trang
export async function getOrders(page = 0, size = 10, sort = "idOrder,desc") {
    const url = `/orders?page=${page}&size=${size}&sort=${encodeURIComponent(
      sort
   )}`;
    const data = await api.get(url);

   const items: OrderModel[] = await Promise.all(
      (data._embedded?.orders || []).map(async (o: any) => {
          // Backend trả về quan hệ payment dưới dạng object (Spring Data REST projecktion mặc định)
          // hoặc link; ở đây ưu tiên tên nếu có, fallback để trống
          const namePayment = await getPayment(o.idOrder);
          const nameDelivery = await getDelivery(o.idOrder);
          return new OrderModel(
              o.idOrder,
              o.deliveryAddress,
              o.totalPrice,
              o.totalPriceProduct,
              o.feeDelivery,
              o.feePayment,
              o.dateCreated,
              o.status,
              o.paymentStatus,
              o.user,
              o.fullName,
              o.phoneNumber,
              o.note,
              namePayment,
              nameDelivery
          );
      })
  );


   const pageInfo = data.page || { number: page, size, totalElements: items.length, totalPages: 1 };
   return { items, page: pageInfo };
}

// Lấy chi tiết 1 đơn hàng theo id
export async function getOrderById(idOrder: number): Promise<OrderModel> {
    const url = `/orders/${idOrder}`;
    const o = await api.get(url);
    const responsePayment = await api.get(`/orders/${o.idOrder}/payment`);
    const responseDelivery = await api.get(`/orders/${o.idOrder}/delivery`);
    return new OrderModel(
        o.idOrder,
        o.deliveryAddress,
        o.totalPrice,
        o.totalPriceProduct,
        o.feeDelivery,
        o.feePayment,
        o.dateCreated,
        o.status,
        o.paymentStatus,
        o.user,
        o.fullName,
        o.phoneNumber,
        o.note,
        responsePayment.namePayment,
        responseDelivery.nameDelivery
    );
}

// Cập nhật trạng thái đơn (PATCH chỉ gửi field cần cập nhật)
export async function updateOrderStatus(idOrder: number, status: string) {
    const url = `/orders/${idOrder}`;
    await api.patch(url, { status });
}

// Lấy tất cả đơn hàng của 1 user
export const getAllOrdersByIdUser = async (idUser: number) => {
   const endpoint = `/users/${idUser}/listOrders`;

   const response = await api.get(endpoint);
   const orders = await Promise.all(response._embedded.orders.map(async (order: any) => {
       const responsePayment = await api.get(`/orders/${order.idOrder}/payment`);
       const responseDelivery = await api.get(`/orders/${order.idOrder}/delivery`);
       return new OrderModel(
           order.idOrder,
           order.deliveryAddress,
           order.totalPrice,
           order.totalPriceProduct,
           order.feeDelivery,
           order.feePayment,
           order.dateCreated,
           order.status,
           order.paymentStatus,
           order.user,
           order.fullName,
           order.phoneNumber,
           order.note,
           responsePayment.namePayment,
           responseDelivery.nameDelivery
       );
   }));

   return orders;
};


// Lấy 1 đơn hàng
export const get1Order = async (idOrder: number) => {
    const endpoint = `/orders/${idOrder}`;

    const response = await api.get(endpoint);
    const responsePayment = await api.get(`/orders/${idOrder}/payment`);
    const responseDelivery = await api.get(`/orders/${idOrder}/delivery`);
   const order = new OrderModel(
       response.idOrder,
       response.deliveryAddress,
       response.totalPrice,
       response.totalPriceProduct,
       response.feeDelivery,
       response.feePayment,
       response.dateCreated,
       response.status,
       response.paymentStatus,
       response.user,
       response.fullName,
       response.phoneNumber,
       response.note,
       responsePayment.namePayment,
       responseDelivery.nameDelivery
   );

   console.log(order);

   return order;
};


// Hủy đơn hàng
export const cancel1Order = async (order: OrderModel) => {
    const endpoint = "/order/update-order";
    return api.put(endpoint, order);
};

// Lấy tất cả đơn hàng (không phân trang)
export async function getAllOrders(): Promise<OrderModel[]> {
    try {
        const result = await getOrders(0, 1000); // Lấy tối đa 1000 đơn hàng
        return result.items;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return [];
    }
}
