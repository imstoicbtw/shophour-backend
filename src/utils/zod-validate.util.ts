import { ZodObject, ZodSafeParseResult } from "zod";
import { ZodValidationError } from "./zod-error.util.js";

export default function zodValidate(body: object, schema: ZodObject<any>) {
    const result: ZodSafeParseResult<Record<string, unknown>> = schema.safeParse(body);
    if (!result.success) {
        const error: [] = JSON.parse(result.error.message);
        throw new ZodValidationError(error);
    }
    return result.data;
}