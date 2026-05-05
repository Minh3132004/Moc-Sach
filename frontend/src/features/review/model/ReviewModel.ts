import UserModel from "../../user/model/UserModel";

class ReviewModel {
   idReview: number;
   content: string;
   ratingPoint: number;
   timestamp: Date;
   user?: UserModel;

   constructor(
      idReview: number,
      content: string,
      ratingPoint: number,
      timestamp: Date,
      user?: UserModel
   ) {
      this.idReview = idReview;
      this.content = content;
      this.ratingPoint = ratingPoint;
      this.timestamp = timestamp;
      this.user = user;
   }
}

export default ReviewModel;