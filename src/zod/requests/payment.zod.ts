import { zod } from "../../exports.js";
import { zodMongooseObjectId, zodNumber, zodString } from "../utils.zod.js";


export const createNewPaymentReqBody = zod.object({
    order: zodMongooseObjectId(),
    user: zodMongooseObjectId(),
    amount: zodNumber(),
    paymentMethod: zodString(),
    status: zod.enum(["pending", "completed", "failed"], "This is not valid."),
    transactionId: zodString(),
    paymentGateway: zod.enum(["razorpay", "cod"], "This is not valid."),
}, "This must be an object.");


export const updatePaymentReqBody = zod.object({
    status: zod.enum(["pending", "completed", "failed"], "This is not valid."),
}, "This must be an object.");