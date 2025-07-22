import { zod } from "../../exports.js";
import { zodMongooseObjectId, zodString } from "../utils.zod.js";


export const createCategoryReqBody = zod.object({
    name: zodString(),
    slug: zodString(),
    parent: zodMongooseObjectId().optional()
}, "This must be an object.");