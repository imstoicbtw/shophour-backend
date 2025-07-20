import { z as zod } from "zod";
import { zodMongooseObjectId, zodNumber, zodString } from "../utils.zod.js";


export const createNewPaymentReqBody = zod.object({
    order: zodMongooseObjectId(),
    user: zodMongooseObjectId(),
    amount: zodNumber(),
    paymentMethod: zodString(),
    status: zod.enum(["pending", "completed", "failed"], "This is not valid."),
    transactionId: zodString(),
    paymentGateway: zod.enum(["razorpay", "cod"], "This is not valid."),
});
export type createNewPaymentReqBodyType = zod.infer<typeof createNewPaymentReqBody>;


export const updatePaymentReqBody = zod.object({
    status: zod.enum(["pending", "completed", "failed"], "This is not valid."),
});
export type updatePaymentReqBodyType = zod.infer<typeof updatePaymentReqBody>;