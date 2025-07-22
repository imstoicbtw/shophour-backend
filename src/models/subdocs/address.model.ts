import { HydratedDocument, model, Model, Schema } from "mongoose";
import { nameSchema, TName } from "./name.model.js";

interface IAddressRawDoc {
    name: TName;
    phoneNumber: string;
    countryCode: string;
    building: string;
    street: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
}

interface IAddressMethods {
}

interface IAddressVirtuals {
    fullAddress: string;
}

type TAddressModel = Model<IAddressRawDoc, {}, IAddressMethods, IAddressVirtuals>;
export type TAddress = HydratedDocument<IAddressRawDoc, IAddressMethods & IAddressVirtuals>;
export type TAddressLean = IAddressRawDoc & IAddressVirtuals;


export const addressSchema: Schema = new Schema<IAddressRawDoc, TAddressModel, IAddressMethods, {}, IAddressVirtuals>({
    name: {
        type: nameSchema,
        required: [true, "Name is required"],
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
    },
    countryCode: {
        type: String,
        required: [true, "Country code is required"],
    },
    building: {
        type: String,
        required: [true, "Building name is required"],
    },
    street: {
        type: String,
        required: [true, "Street address is required"],
    },
    city: {
        type: String,
        required: [true, "City is required"],
    },
    state: {
        type: String,
        required: [true, "State is required"],
    },
    pinCode: {
        type: String,
        required: [true, "Pin Code is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    },
});

addressSchema.virtual("fullAddress")
    .get(function (this: TAddress): string {
        return `${this.building}, ${this.street}, ${this.city}, ${this.state}, ${this.country} - ${this.pinCode}`;
    });

export default model<IAddressRawDoc, TAddressModel, IAddressMethods>("Address", addressSchema);