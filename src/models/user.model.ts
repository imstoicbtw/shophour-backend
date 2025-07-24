import bcrypt from "bcryptjs";

import { HydratedDocument, Model, model, Schema, Types } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { ROLES } from "../constants.js";
import { addressSchema, TAddress } from "./subdocs/address.model.js";
import { cartItemSchema, TCartItem } from "./subdocs/cart-item.model.js";
import { nameSchema, TName } from "./subdocs/name.model.js";


export interface IUserRawDoc {
    name: TName;
    email: string;
    password: string;
    role: string;
    addresses: Array<TAddress>;
    avatar: Types.ObjectId;
    cartItems: Array<TCartItem>;
}

interface IUserMethods {
    comparePassword: (enteredPassword: string) => Promise<boolean>;
}

export interface IUserVirtuals {
}

type TUserModel = Model<IUserRawDoc, {}, IUserMethods, IUserVirtuals>;
export type TUser = HydratedDocument<IUserRawDoc, IUserMethods & IUserVirtuals>;
export type TUserLean = Omit<IUserRawDoc & IUserVirtuals, "password">;


const userSchema: Schema = new Schema<IUserRawDoc, TUserModel, IUserMethods, {}, IUserVirtuals>({
    name: {
        type: nameSchema,
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: [true, "Email already exists."],
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    role: {
        type: String,
        enum: {
            values: Object.values(ROLES),
            message: "{VALUE} is not a valid role.",
        },
        default: "customer",
    },
    avatar: {
        type: Schema.Types.ObjectId,
        ref: "Media",
    },
    addresses: {
        type: [addressSchema],
        default: [],
    },
    cartItems: {
        type: [cartItemSchema],
        default: []
    }
}, { timestamps: true });

// Plugins
userSchema.plugin(mongooseLeanVirtuals);


// Instance methods
userSchema.method({
    comparePassword: async function (this: TUser, enteredPassword: string): Promise<boolean> {
        return await bcrypt.compare(enteredPassword, this.password);
    }
});


// Pre
userSchema.pre("save", async function (this: TUser, next: Function): Promise<void> {
    if (!this.isModified("password")) {
        next();
    }
    const salt: string = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

export const UserModel: TUserModel = model<IUserRawDoc, TUserModel>("User", userSchema);