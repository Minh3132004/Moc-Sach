import { toast } from "react-toastify";
import Coupon from "../model/Coupon";
import api from "../../../lib/http";

// Lấy danh sách coupon với phân trang
export async function getCoupon(page: number = 0, size: number = 10): Promise<{ coupons: Coupon[], totalPages: number, totalElements: number, currentPage: number }> {
    try {
        const endpoint = `/coupons?page=${page}&size=${size}&sort=discountPercent,desc&expiryDate,desc`;
        const responseData = await api.get(endpoint);
        const couponList = await Promise.all(responseData._embedded.coupons.map(async (item: any) => {
            const coupon = new Coupon(item.idCoupon, item.code, item.discountPercent, item.expiryDate, item.isUsed ,item.isActive);
            return coupon;
        })
        );
        console.log(couponList);
        return {
            coupons: couponList,
            totalPages: responseData.page.totalPages,
            totalElements: responseData.page.totalElements,
            currentPage: page
        };
    } catch (error) {
        console.error('Error: ', error);
    }
    return { coupons: [], totalPages: 0, totalElements: 0, currentPage: 0 };
}

// Tạo coupon
export async function createCoupon(quantity: number, discountPercent: number, expiryDate: Date) {
    try {
        const endpoint = `/coupon/create/${quantity}`;
        const response = await api.post(endpoint, { discountPercent, expiryDate });
        toast.success(response.message || "Tạo mã giảm giá thành công");
    } catch (error) {
        toast.error("Xảy ra lỗi khi tạo mã giảm giá");
    }
}

// Xóa coupon
export async function deleteCoupon(id: number) {
    try {
        const endpoint = `/coupon/delete/${id}`;
        const response = await api.delete(endpoint);
        toast.success(response.message || "Xóa mã giảm giá thành công");
    } catch (error) {
        toast.error("Xảy ra lỗi khi xóa mã giảm giá");
    }
}

// Cập nhật mã giảm giá (admin)
export async function updateActiveCoupon(id: number, isActive: boolean) {
    const endpoint = `/coupon/update/active/${id}`;
    try {
        const response = await api.put(endpoint, { isActive: isActive });
        toast.success(response.message || "Cập nhật mã giảm giá thành công");
    } catch (error) {
        toast.error("Xảy ra lỗi khi cập nhật mã giảm giá");
    }
}

// Lấy tất cả coupon (không phân trang)
export async function getAllCoupons(): Promise<Coupon[]> {
    try {
        const endpoint = "/coupons?sort=discountPercent,desc&expiryDate,desc";
        const responseData = await api.get(endpoint);
        const couponList = await Promise.all(responseData._embedded.coupons.map(async (item: any) => {
            const coupon = new Coupon(item.idCoupon, item.code, item.discountPercent, item.expiryDate, item.isUsed ,item.isActive);
            return coupon;
        })
        );
        return couponList;
    } catch (error) {
        console.error('Error: ', error);
    }
    return [];
}

// Áp dụng mã giảm giá
export async function updateUsedCoupon(code: string) {
    const endpoint = `/coupon/update/used?code=${code}`;
    try {
        const response = await api.put(endpoint);
        if (response?.message) {
            console.log(response.message);
        }
    } catch (error) {
        console.log("Xảy ra lỗi khi cập nhật mã giảm giá");
    }
}
