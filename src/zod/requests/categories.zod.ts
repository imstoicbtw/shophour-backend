import { z as zod } from "zod";
import { zodMongooseObjectId, zodString } from "../utils.zod.js";


export const createCategoryReqBody = zod.object({
    name: zodString(),
    slug: zodString(),
    parent: zodMongooseObjectId().optional()
});
export type createCategoryReqBodyType = zod.infer<typeof createCategoryReqBody>;

