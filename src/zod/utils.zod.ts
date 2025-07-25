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
    }) {
    return zod.string("This must be a string.")
        .trim()
        .min(length ?? min as number, length ? `This must be ${length} character(s) long.` : `This must be ${min} character(s) or more.`)
        .max(length ?? max as number, length ? `This must be ${length} character(s) long.` : `This must be ${max} character(s) or less.`)
}


export function zodNumber({
    min,
    max
}: {
    min?: number;
    max?: number;
} = {}) {
    return zod.number("This must be a number.")
        .min(min ?? 0, `This cannot be less than ${min}.`)
        .max(max ?? Infinity, `This cannot be more than ${max}.`)
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
    lastName: zod.string("This must be a string.")
        .trim()
        .nonempty("This is required."),
}, "This must be an object.");


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
}, "This must be an object.");