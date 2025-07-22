import { zod } from "../../exports.js";
import { zodAddress, zodMongooseObjectId, zodNumber, zodString } from "../utils.zod.js";


export const createOrderReqBody = zod.object({
    user: zodMongooseObjectId(),
    products: zod.array(zod.object({
        product: zodMongooseObjectId(),
        price: zodNumber(),
        savedAmount: zodNumber(),
        quantity: zodNumber(),
    })).nonempty("At least one product is required to place an order."),
    totalAmount: zodNumber(),
    savedAmount: zodNumber(),
    status: zod.enum(["pending", "processing", "shipped", "delivered", "cancelled"], "This is not valid."),
    paymentStatus: zod.enum(["pending", "completed", "failed"], "This is not valid."),
    paymentMethod: zodString(),
    shippingAddress: zodAddress,
}, "This must be an object.");


export const updateOrderReqBody = zod.object({
    status: zod.enum(["pending", "processing", "shipped", "delivered", "cancelled"], "This is not valid."),
}, "This must be an object.");