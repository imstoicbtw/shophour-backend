import Jwt from "jsonwebtoken";
import {jwtPayload} from "../types/jwt.types";

export default function (payload: jwtPayload, expiry: number = (15 * 60 * 1000)): string {
    return Jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: expiry,
    });
};