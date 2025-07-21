import { z as zod } from "zod";
import { zodEmail, zodName, zodPassword, zodString } from "../utils.zod.js";


export const registerUserReqBody = zod.object({
    name: zodName,
    email: zodEmail(),
});
export type registerUserReqBodyType = zod.infer<typeof registerUserReqBody>;


export const loginUserReqBody = zod.object({
    email: zodEmail(),
    password: zodString(),
});
export type loginUserReqBodyType = zod.infer<typeof loginUserReqBody>;