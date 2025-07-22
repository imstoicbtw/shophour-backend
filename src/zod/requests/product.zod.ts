import { zod } from "../../exports.js";
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
}, "This must be an object.");


export const submitReviewReqBody = zod.object({
    title: zodString({ min: 10 }),
    rating: zod.number("This must be a number.")
        .refine(rating => rating >= 1 && rating <= 5, "This must be a number between 1 and 5."),
    comment: zodString({ min: 20 }),
    user: zodMongooseObjectId(),
}, "This must be an object.");


export const editReviewReqBody = submitReviewReqBody.omit({ user: true });


export const updateProductPropertyReqBody = zod.object({
    key: zodString(),
    value: zod.any(),
}, "This must be an object.");