import { HydratedDocument, model, Model, Schema, Types } from "mongoose";

interface ICartItemRawDoc {
    product: Types.ObjectId;
    quantity: number;
}

interface ICartItemMethods {
}

interface ICartItemVirtuals {
}

type TCartItemModel = Model<ICartItemRawDoc, {}, ICartItemMethods, ICartItemVirtuals>;
export type TCartItem = HydratedDocument<ICartItemRawDoc, ICartItemMethods & ICartItemVirtuals>;
export type TCartItemLean = ICartItemRawDoc;

export const cartItemSchema: Schema = new Schema<ICartItemRawDoc, TCartItemModel, ICartItemMethods, {}, ICartItemVirtuals>({
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


export const CartItemModel: TCartItemModel = model<
    ICartItemRawDoc,
    TCartItemModel,
    ICartItemMethods
>("CartItem", cartItemSchema);