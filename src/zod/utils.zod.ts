import { z as zod } from "zod";
import { PASSWORD_REGEX } from "../constants.js";


export function zodEmail(name: string = "email") {
    return zod.email(`'${name}' is not valid.`);
};


export function zodPassword(name: string = "password") {
    return zod.string(`'${name}' must be a string.`).trim().regex(PASSWORD_REGEX, `'${name}' is not valid.`);
}


export function zodString({ min, max }: { min?: number, max?: number } = { min: 1, max: Infinity }) {
    return zod.string("This must be a string.")
        .trim()
        .min(min as number, `This must be at least ${min} character(s) or more.`)
        .max(max as number, `This must be ${max} character(s) or less.`);
}


export function zodNumber({ min, max }: { min?: number, max?: number } = { min: 0, max: Infinity }) {
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
    name: zod.object({
        firstName: zod.string("This must be a string.")
            .trim()
            .nonempty("This is required."),
        lastName: zod.string("This must be a string.")
            .trim()
            .nonempty("This is required."),
    }),
    phoneNumber: zod.string("This must be s a string.")
        .trim()
        .length(10, "This must be 10 digits long."),
    countryCode: zod.string("This must be a string.")
        .trim()
        .nonempty("This is required."),
    building: zod.string("This must be a string.")
        .trim()
        .min(10, "This must be at least 10 characters long."),
    street: zod.string("This must be a string.")
        .trim()
        .min(10, "This must be at least 10 characters long."),
    city: zod.string("This must be a string.")
        .trim()
        .min(3, "This must be at least 3 characters long."),
    state: zod.string("This must be a string.")
        .trim()
        .min(3, "This must be at least 3 characters long."),
    pinCode: zod.string("This must be string.")
        .trim()
        .length(6, "This must be 6 digits long."),
    country: zod.string("This must be a string.")
        .trim()
        .min(3, "This must be at least 3 characters long."),
});