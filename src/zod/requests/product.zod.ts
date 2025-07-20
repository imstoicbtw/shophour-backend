import { z as zod } from "zod";
import { zodMongooseObjectId, zodNumber, zodString } from "../utils.zod.js";


export const createProductReqBody = zod.object({
    name: zodString(),
    description: zodString(),
    price: zodNumber(),
    onSale: zod.boolean("This must be a boolean.").default(false),
    salePrice: zodNumber().optional(),
    stock: zodNumber().default(0),
    isActive: zod.boolean("This must be a boolean.").default(true),
    category: zodMongooseObjectId(),
    thumbnail: zodMongooseObjectId(),
    gallery: zod.array(zodMongooseObjectId()).optional(),
});
export type createProductReqBodyType = zod.infer<typeof createProductReqBody>;


export const submitReviewReqBody = zod.object({
    title: zodString({ min: 10 }),
    rating: zod.number("This must be a number.")
        .refine(rating => rating >= 1 && rating <= 5, "This must be a number between 1 and 5."),
    comment: zodString({ min: 20 }),
    user: zodMongooseObjectId(),
});
export type submitReviewReqBodyType = zod.infer<typeof submitReviewReqBody>;


export const editReviewReqBody = submitReviewReqBody.omit({ user: true });
export type editReviewReqBodyType = zod.infer<typeof editReviewReqBody>;