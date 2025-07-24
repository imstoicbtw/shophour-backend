import { HydratedDocument, Model, model, Schema, Types } from "mongoose";
import { addressSchema, TAddress } from "./subdocs/address.model.js";
import { cartItemSchema } from "./subdocs/cart-item.model.js";
import { TOrderItem } from "./subdocs/order-item.model.js";


interface IOrderRawDoc {
    user: Types.ObjectId;
    products: Array<TOrderItem>;
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
export type TOrderLean = IOrderRawDoc & IOrderVirtuals;

const orderSchema: Schema = new Schema<IOrderRawDoc, TOrderModel, IOrderMethods, {}, IOrderVirtuals>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required."],
    },
    products: {
        type: [cartItemSchema],
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


export const OrderModel: TOrderModel = model<IOrderRawDoc, TOrderModel, IOrderMethods>("Order", orderSchema);