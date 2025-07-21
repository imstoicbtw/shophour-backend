import { z as zod } from "zod";
import { PASSWORD_REGEX } from "../constants.js";


export function zodEmail() {
    return zod.email("This is not valid.");
};


export function zodPassword() {
    return zod.string("This must be a string.").trim().regex(PASSWORD_REGEX, "Invalid password.");
}


export function zodString({
    min,
    max,
    length
}: {
    min?: number;
    max?: number;
    length?: number;
} = {
        min: 1,
        max: Infinity,
        length: Infinity,
    }) {
    return zod.string("This must be a string.")
        .trim()
        .min(min as number, `This must be at least ${min} character(s) or more.`)
        .max(max as number, `This must be ${max} character(s) or less.`)
        .length(length as number, `This must be ${length} characters long.`)
}


export function zodNumber({
    min,
    max,
}: {
    min?: number;
    max?: number;
} = {
        min: 0,
        max: Infinity,
    }) {
    return zod.number("This must be a number.")
        .min(min as number, `This cannot be less than ${min}.`)
        .max(max as number, `This cannot be more than ${max}.`)
}


export function zodMongooseObjectId() {
    return zod.string("This must be a 24 characters long hexadecimal string.")
        .trim()
        .regex(/^([a-f0-9]){24}$/, "This must be a 24 characters long hexadecimal string.")
}


export const zodName = zod.object({
    firstName: zod.string("This must be a string.")
        .trim()
        .nonempty("This is required."),
    lastName: zod.string("`lastName` must be a string.")
        .trim()
        .nonempty("This is required."),
});


export const zodAddress = zod.object({
    name: zodName,
    phoneNumber: zodString({ length: 10 }),
    countryCode: zodString(),
    building: zodString({ min: 10 }),
    street: zodString({ min: 10 }),
    city: zodString({ min: 3 }),
    state: zodString({ min: 3 }),
    pinCode: zodString({ min: 6 }),
    country: zodString({ min: 3 }),
});