import { HydratedDocument, model, Model, Schema, Types } from "mongoose";

interface IOrderProductRawDoc {
    product: Types.ObjectId;
    price: number;
    savedAmount: number;
    quantity: number;
}

interface IOrderProductMethods {
}

interface IOrderProductVirtuals {
}

type TOrderProductModel = Model<IOrderProductRawDoc, {}, IOrderProductMethods, IOrderProductVirtuals>;
export type TOrderProduct = HydratedDocument<IOrderProductRawDoc, IOrderProductMethods & IOrderProductVirtuals>;

export const orderProductSchema: Schema = new Schema<IOrderProductRawDoc, TOrderProductModel, IOrderProductMethods, {}, IOrderProductVirtuals>({
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

export const OrderProductModel: TOrderProductModel = model<
    IOrderProductRawDoc,
    TOrderProductModel,
    IOrderProductMethods
>("OrderProduct", orderProductSchema);