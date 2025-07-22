import { HydratedDocument, model, Model, Schema, Types } from "mongoose";

interface ICartProductRawDoc {
    product: Types.ObjectId;
    quantity: number;
}

interface ICartProductMethods {
}

interface ICartProductVirtuals {
}

type TCartProductModel = Model<ICartProductRawDoc, {}, ICartProductMethods, ICartProductVirtuals>;
export type TCartProduct = HydratedDocument<ICartProductRawDoc, ICartProductMethods & ICartProductVirtuals>;

export const cartProductSchema: Schema = new Schema<ICartProductRawDoc, TCartProductModel, ICartProductMethods, {}, ICartProductVirtuals>({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required."],
    },
    quantity: {
        type: Number,
        required: [true, "Item quantity is required."],
    }
});


export const CartProductModel: TCartProductModel = model<
    ICartProductRawDoc,
    TCartProductModel,
    ICartProductMethods
>("CartProduct", cartProductSchema);