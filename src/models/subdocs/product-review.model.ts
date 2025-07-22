import { HydratedDocument, model, Model, Schema, Types } from "mongoose";

export interface IProductReviewRawDoc {
    title: string;
    rating: 1 | 2 | 3 | 4 | 5;
    comment: string;
    user: Types.ObjectId;
}

interface IProductReviewMethods {
}

interface IProductReviewVirtuals {
}

type TProductReviewModel = Model<IProductReviewRawDoc, {}, IProductReviewMethods, IProductReviewVirtuals>;
export type TProductReview = HydratedDocument<IProductReviewRawDoc, IProductReviewMethods & IProductReviewVirtuals>;

export const productReviewSchema: Schema = new Schema<IProductReviewRawDoc, TProductReviewModel, IProductReviewMethods, {}, IProductReviewVirtuals>({
    title: {
        type: String,
        required: [true, "Review title is required"],
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
    },
    comment: {
        type: String,
        required: [true, "Comment is required"],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
}, { timestamps: true });

export const ProductReviewModel: TProductReviewModel = model<
    IProductReviewRawDoc,
    TProductReviewModel,
    IProductReviewMethods
>("ProductReview", productReviewSchema);