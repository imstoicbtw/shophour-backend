import { HydratedDocument, Model, model, Schema, Types } from "mongoose";


interface IPaymentRawDoc {
    order: Types.ObjectId;
    user: Types.ObjectId;
    amount: number;
    paymentMethod: string;
    status: "pending" | "completed" | "failed";
    transactionId: string;
    paymentGateway: "razorpay" | "cod";
}

interface IPaymentMethods {
}

interface IPaymentVirtuals {
}

type TPaymentModel = Model<IPaymentRawDoc, {}, IPaymentMethods, IPaymentVirtuals>;
export type TPayment = HydratedDocument<IPaymentRawDoc, IPaymentMethods & IPaymentVirtuals>;

const paymentSchema: Schema = new Schema<IPaymentRawDoc, TPaymentModel, IPaymentMethods, {}, IPaymentVirtuals>({
    order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: [true, "Order is required."],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required."],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required."],
    },
    paymentMethod: {
        type: String,
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "completed", "failed"],
            message: "{VALUE} is not a valid payment status.",
        },
        default: "pending",
    },
    transactionId: {
        type: String,
        required: [true, "Transaction ID is required."],
    },
    paymentGateway: {
        type: String,
        required: [true, "Payment Gateway is required."],
        enum: {
            values: ["razorpay", "cod"],
            message: "{VALUE} is not a valid payment gateway.",
        }
    }
}, { timestamps: true });


export default model<IPaymentRawDoc, TPaymentModel, IPaymentMethods>("Payment", paymentSchema);