import {Types} from "mongoose";

export interface jwtPayload {
    _id: Types.ObjectId;
    role: string;
}