import { HydratedDocument, Model, model, Schema, Types } from "mongoose";
import { addressSchema, TAddress } from "./subdocs/address.model.js";
import { cartProductSchema } from "./subdocs/cart-product.model.js";
import { TOrderProduct } from "./subdocs/order-product.model.js";


interface IOrderRawDoc {
    user: Types.ObjectId;
    products: Array<TOrderProduct>;
    totalAmount: number;
    savedAmount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus: "pending" | "paid" | "failed";
    paymentMethod: string;
    shippingAddress: TAddress;
}

interface IOrderMethods {
}

interface IOrderVirtuals {
}

type TOrderModel = Model<IOrderRawDoc, {}, IOrderMethods, IOrderVirtuals>;
export type TOrder = HydratedDocument<IOrderRawDoc, IOrderMethods & IOrderVirtuals>;

const orderSchema: Schema = new Schema<IOrderRawDoc, TOrderModel, IOrderMethods, {}, IOrderVirtuals>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required."],
    },
    products: {
        type: [cartProductSchema],
        required: [true, "Ordered product is required."],
    },
    totalAmount: {
        type: Number,
        required: [true, "Total order amount is required."],
    },
    savedAmount: {
        type: Number,
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "processing", "shipped", "delivered", "cancelled"],
            message: "{VALUE} is not a valid status.",
        },
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: {
            values: ["pending", "paid", "failed"],
            message: "{VALUE} is not a valid payment status.",
        },
        default: "pending",
    },
    paymentMethod: {
        type: String,
    },
    shippingAddress: {
        type: addressSchema,
        required: [true, "Shipping address is required."],
    }
}, { timestamps: true });


export default model<IOrderRawDoc, TOrderModel, IOrderMethods>("Order", orderSchema);