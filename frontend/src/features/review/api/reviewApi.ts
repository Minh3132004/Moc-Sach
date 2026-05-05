import ReviewModel from "../model/ReviewModel";
import UserModel from "../../user/model/UserModel";
import api from "../../../lib/http";
import { type ApiResponse, isApiSuccess } from "../../../lib/apiResponse";

// Hàm lấy danh sách review theo chuẩn ApiResponse từ backend
async function getReview(endPoint: string): Promise<ReviewModel[]> {
    const response = await api.get<any, ApiResponse<any[]>>(endPoint);
    if (!isApiSuccess(response)) {
        throw new Error(response.message || "Lỗi lấy danh sách review");
    }

    const responseData = response.data ?? [];

    return responseData.map((review: any) => {
        let userModel: UserModel | undefined = undefined;
        if (review.user) {
            userModel = new UserModel();
            userModel.idUser = review.user.idUser;
            userModel.firstName = review.user.firstName;
            userModel.lastName = review.user.lastName;
            userModel.avatar = review.user.avatar;
        }

        return new ReviewModel(
            review.idReview,
            review.content,
            review.ratingPoint,
            new Date(review.timestamp),
            userModel
        );
    });
}

// Hàm lấy danh sách review theo id sách
export function getReviewByIdBook(idBook: number) : Promise<ReviewModel[]>  {
    const endPoint = `/review/book/${idBook}`;
    return getReview(endPoint);
}

/*
// Hàm lấy tổng số review
export async function getTotalNumberOfReviews(): Promise<number> {
    try {
        const endPoint = "/review/count";
        const response = await api.get<any, ApiResponse<number>>(endPoint);
        if (!isApiSuccess(response)) return 0;
        return response.data ?? 0;
    } catch (error) {
        console.error("Error fetching total number of reviews:", error);
        return 0;
    }
}
*/
