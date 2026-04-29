import DeliveryModel from "../model/DeliveryModel";
import api from "../../../lib/http";

export async function getDeliveryById(idDelivery: number) {
    const endPoint = `/deliveries/${idDelivery}`;

    const response = await api.get(endPoint);
    const delivery = new DeliveryModel(
        response.idDelivery,
        response.nameDelivery,
        response.description,
        response.feeDelivery
    );

    return delivery;
}
