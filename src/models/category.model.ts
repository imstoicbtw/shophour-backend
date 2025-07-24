import { HydratedDocument, Model, model, Schema, Types } from "mongoose";

interface ICategoryRawDoc {
    name: string;
    slug: string;
    parent?: Types.ObjectId;
}

interface ICategoryMethods {
}

interface ICategoryVirtuals {
}

type TCategoryModel = Model<ICategoryRawDoc, {}, ICategoryMethods, ICategoryVirtuals>;
export type TCategory = HydratedDocument<ICategoryRawDoc, ICategoryMethods & ICategoryVirtuals>;
export type TCategoryLean = ICategoryRawDoc & ICategoryVirtuals;

const categorySchema: Schema = new Schema<ICategoryRawDoc, TCategoryModel, ICategoryMethods, {}, ICategoryVirtuals>({
    name: {
        type: String,
        required: [true, "Category name is required."],
    },
    slug: {
        type: String,
        required: [true, "Category slug is required."],
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    }
}, { timestamps: true });


export const CategoryModel: TCategoryModel = model<ICategoryRawDoc, TCategoryModel, ICategoryMethods>("Category", categorySchema);