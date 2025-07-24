import { HydratedDocument, model, Model, Schema, Types } from "mongoose";

interface IOrderItemRawDoc {
    product: Types.ObjectId;
    price: number;
    savedAmount: number;
    quantity: number;
}

interface IOrderItemMethods {
}

interface IOrderItemVirtuals {
}

type TOrderItemModel = Model<IOrderItemRawDoc, {}, IOrderItemMethods, IOrderItemVirtuals>;
export type TOrderItem = HydratedDocument<IOrderItemRawDoc, IOrderItemMethods & IOrderItemVirtuals>;

export const orderItemSchema: Schema = new Schema<IOrderItemRawDoc, TOrderItemModel, IOrderItemMethods, {}, IOrderItemVirtuals>({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required."],
    },
    price: {
        type: Number,
        required: [true, "Price is required."],
    },
    savedAmount: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        required: [true, "Item quantity is required."],
    }
});

export const OrderItemModel: TOrderItemModel = model<
    IOrderItemRawDoc,
    TOrderItemModel,
    IOrderItemMethods
>("OrderItem", orderItemSchema);