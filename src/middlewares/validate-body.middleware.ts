import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { zod } from "../exports";
import zodValidate from "../utils/zod-validate.util.js";

export function validateBody(schema: ZodObject<any>) {
    return function (req: Request, _res: Response, next: NextFunction) {
        req.body = zodValidate(req.body, schema);
        next();
    }
}