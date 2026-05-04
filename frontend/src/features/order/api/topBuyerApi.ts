import api from "../../../lib/http";
import { type ApiResponse, isApiSuccess } from "../../../lib/apiResponse";
import TopBuyerModel from "../model/TopBuyerModel";

function mapToTopBuyerModel(item: any): TopBuyerModel {
    return new TopBuyerModel(
        item.idUser,
        item.firstName || "",
        item.lastName || "",
        item.username || "",
        item.phoneNumber || "",
        item.avatar || "",
        item.totalOrderValue || 0
    );
}

export async function getTopBuyers(size = 100): Promise<TopBuyerModel[]> {
    const endpoint = `/order/top-buyers?size=${size}`;
    const response = await api.get<any, ApiResponse<any>>(endpoint);

    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Lỗi lấy danh sách người mua");
    }

    const payload = response.data || [];
    return payload.map(mapToTopBuyerModel);
}
