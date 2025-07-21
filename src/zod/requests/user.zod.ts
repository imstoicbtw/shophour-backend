import { z as zod } from "zod";
import { PASSWORD_REGEX } from "../../constants.js";
import { zodAddress, zodEmail, zodName, zodPassword, zodString } from "../utils.zod.js";

// * updateCurrentUserDetails
export const updateCurrentUserDetailsReqBody = zod.object({
    name: zodName,
    email: zodEmail(),
});

export type updateCurrentUserDetailsReqBodyType = zod.infer<typeof updateCurrentUserDetailsReqBody>;


// * updatePassword
export const updatePasswordReqBody = zod.object({
    oldPassword: zodString(),
    newPassword: zodPassword(),
});

export type updatePasswordReqBodyType = zod.infer<typeof updatePasswordReqBody>;


// * addNewAddress
export const addNewAddressReqBody = zodAddress;

export type addNewAddressReqBodyType = zod.infer<typeof addNewAddressReqBody>;
