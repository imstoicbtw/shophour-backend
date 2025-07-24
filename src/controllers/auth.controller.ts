import { Request, Response } from "express";
import { TUser, UserModel } from "../models/user.model.js";
import generateTokenUtil from "../utils/generate-token.util.js";
import { loginUserReqBodyType, registerUserReqBodyType } from "../zod/requests/auth.zod.js";


// TODO: Implement hybrid authentication for login, logout, and registration.


/**
 * Register a new customer.
 * @access OPEN
 * POST /auth/register/
 */
export async function registerUser(req: Request, res: Response): Promise<void> {
    const body: registerUserReqBodyType = { ...req.body, role: "customer" };
    const existingUser: TUser | null = await UserModel.findOne({ email: body.email });
    if (existingUser) {
        res.status(409);
        throw new Error("User with this email already exists!");
    }
    const user: TUser = await UserModel.create(body);
    if (!user) {
        res.status(500);
        throw new Error("Internal server error!");
    }
    res.cookie(
        "jwt",
        generateTokenUtil({ _id: user._id, role: user.role }),
        {
            httpOnly: true,
            maxAge: (1000 * 60 * 15),
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        }
    );
    res.status(201).json({
        success: true,
        message: "Registration successful!",
        user: { ...user.toObject({ virtuals: true }), password: "********" }
    });
}


/**
 * Login existing user.
 * @access OPEN
 * POST /auth/login/
 */
export async function loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as loginUserReqBodyType;
    const user: TUser | null = await UserModel.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("No user found with this email address!");
    }
    if (!(await user.comparePassword(password))) {
        res.status(401);
        throw new Error("Invalid password!");
    }
    res.cookie(
        "jwt",
        generateTokenUtil({ _id: user._id, role: user.role }),
        {
            httpOnly: true,
            maxAge: (1000 * 60 * 15),
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
    res.status(200).json({
        success: true,
        message: "Login successful!",
        user: { ...user.toObject({ virtuals: true }), password: "********" }
    });
}


/**
 * Logout user.
 * @access Any authenticated user.
 * POST /api/auth/logout/
 */
export async function logoutUser(req: Request, res: Response): Promise<void> {
    res.clearCookie("jwt");
    res.json({
        success: true,
        message: "Logged out successfully!",
    });
}