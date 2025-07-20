import { NextFunction, Request, Response } from "express";
import { ZodValidationError } from "../utils/error.util.js";

interface GlobalError extends Error, ZodValidationError {
    kind: string;
}

export default function (error: GlobalError, _req: Request, res: Response, _next: NextFunction): void {
    let { message, name, kind, errors } = error;

    let statusCode: number = res.statusCode === 200 ? 500 : res.statusCode;
    message = message || "Internal server error!";

    if (name === "CastError") {
        statusCode = 400;
        message = `${name}: Invalid '${kind}' received!`;
    } else if (name === "ValidationError") {
        statusCode = 400;
        message = "One or more required field is is missing or invalid!";
    } else if (name === "ZodValidationError") {
        statusCode = 400;
        message = errors as unknown as string;
    }

    if (statusCode >= 500) {
        console.error(error);
    }

    res.status(statusCode).json({ success: false, message });
}