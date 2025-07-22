import { HydratedDocument, model, Model, Schema } from "mongoose";

interface INameRawDoc {
    firstName: string;
    lastName: string;
}

interface INameMethods {
}

interface INameVirtuals {
    fullName: string;
}

type TNameModel = Model<INameRawDoc, {}, INameMethods, INameVirtuals>;
export type TName = HydratedDocument<INameRawDoc, INameMethods & INameVirtuals>;

export const nameSchema: Schema = new Schema<INameRawDoc, TNameModel, INameMethods, {}, INameVirtuals>({
    firstName: {
        type: String,
        required: [true, "First name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
    },
});

nameSchema.virtual("fullName")
    .get(function (this: TName): string {
        return `${this.firstName} ${this.lastName}`
    });


export const NameModel: TNameModel = model<
    INameRawDoc,
    TNameModel,
    INameMethods
>("Name", nameSchema);