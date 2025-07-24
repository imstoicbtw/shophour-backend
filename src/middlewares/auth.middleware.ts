import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { TUser, UserModel } from "../models/user.model.js";
import { jwtPayload } from "../types/jwt.types.js";


export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { jwt: token } = req.cookies;
    if (!token) {
        res.status(401);
        throw new Error("You are currently not logged in!");
    }
    const { _id } = Jwt.verify(token, process.env.JWT_SECRET!) as jwtPayload;
    const user: Omit<TUser, "password"> | null = await UserModel.findById(_id, ["-password"]);
    if (!user) {
        res.status(404);
        throw new Error("User not found!");
    }
    req.user = user;
    next();
}


export function authorize(...allowedRoles: Array<string>) {
    return function (req: Request, res: Response, next: NextFunction): void {
        if (!req.user) {
            res.status(401);
            throw new Error("You are currently not logged in!");
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403);
            throw new Error("You are not allowed to access this resource!");
        }
        next();
    }
}